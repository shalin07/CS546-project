let validate = require("./objectValidation");
const mongoCollections = require("../config/collections");
let venues = mongoCollections.venues;
let users = require("./users");

let exportedMethods = {

 getAllVenues() {
    return venues()
    .then((venueCollection) => {
        return venueCollection.find({}).toArray()
        .then((allVenues) => {
            if(allVenues===undefined) throw "No Venues Found";
            return allVenues;
        })
    })
},

getVenueById(id) {   
    try {
        return validate.validateAndConvertId(id)
            .then((objectId) => {
                return venues()
                .then(venueCollection => {
                    return venueCollection.findOne({"_id": objectId })
                    .then(venue => {
                    if (!venue) throw "WARN: " + "Could not find venue with id " + id;
                    return venue;
                    });
                });
            }).catch((error) => {
                console.log(error)
        });
    }
    catch(error) {
        console.log(error);
    }
},

getVenueByName(name) {   
    try {
        return validate.verifyString(name)
            .then(() => {
                return venues()
                .then(venueCollection => {
                    return venueCollection.find({"name": name}).toArray()
                    .then(venue => {
                    if (!venue) throw "WARN: " + "Could not find venue with name " + name;
                    return venue;
                    });
                });
            }).catch((error) => {
            console.log("ERROR: " + error);
        });
    }
    catch(error) {
        console.log(error);
    }
},

getVenuesBySearchString(searchString) { 
    try {  
        let rx = new RegExp(searchString)
        return validate.verifyString(searchString)
            .then(() => {
                return venues()
                .then(venueCollection => {
                    return venueCollection.find({ "name": { $regex: rx }}).toArray()
                    .then(venueMatches => {
                        console.log("\n\n\n Here are the venues: \n" + venueMatches);
                    if (!venueMatches) throw "WARN: " + "Could not find venue with search string " + searchString;
                    return venueMatches;
                    });
                })
            }).catch((error) => {
            console.log("ERROR: " + error);
        });
    }
    catch(error) {
        console.log(error);
    }
},

getVenueByLocation(location) { 
    try {  
        let rx = new RegExp(location)
        return validate.verifyString(location)
            .then(() => {
                return venues()
                .then(venueCollection => {
                    return venueCollection.find({ "location": { $regex: rx }}).toArray()
                    .then(venue => {
                    if (!venue) throw "WARN: " + "Could not find venue with location " + location;
                    return venue;
                    });
                });
            }).catch((error) => {
            console.log("ERROR: " + error);
        });
    }
    catch(error) {
        console.log(error);
    }
},

getVenueByRating(rating) {  
    try {         
    rating.forEach(function(x) {
        validate.verifyNum(x);
    });

    return venues()
    .then(venueCollection => {
        return venueCollection      
            .find({ rating: { $in: rating } })
            .toArray();
        })
        .then((venue) => {
        if (!venue) throw "WARN: " + "Could not find venue with ratings in " + rating;
        return venue;
        })
        .catch((error) => {
            console.log("ERROR: " + error);
        });
    }
    catch(error) {
        console.log(error)
    }
},

getVenueByRatingGT(rating) {  
    try {         
        validate.verifyNum(rating);

        return venues()
        .then(venueCollection => {
            return venueCollection      
                .find({ rating: { $gt: rating-1 } })
                .toArray();
            })
            .then((venue) => {
            if (!venue) throw "WARN: " + "Could not find venue with ratings in " + rating;
            return venue;
            })
            .catch((error) => {
                console.log("ERROR: " + error);
        });
    }
    catch(error) {
        console.log(error)
    }
},

createVenue(name, location, style, description, rating) {
    try {
        return validate.verifyString(name, "name").then(() => {
            return validate.verifyString(location)}).then(() => {
                return venues}).then((venues) => {
                    return venues().then((venueCollection) => {
                        let newVenue = {
                            //_id: "",
                            name: name,
                            location: location,
                            locationLatLong: {},
                            hours: "",
                            style: style, 
                            description: description,
                            rating: rating,
                            reviews: []
                        }            
                        return venueCollection.insertOne(newVenue)
                        .then((insertInfo) => {
                            if(insertInfo.insertedCount === 0) throw "Could not add venue with name " + name + " and location; " + location;
                            return this.getVenueById(insertInfo.insertedId)
                    });
                });
            }).catch((error) => {
                throw error;
        });
    }
    catch(error) {
        console.log(error);
    }
},


async addVenueReview(venueId, userId, review, rating) {
    try {
        await validate.verifyString(review);
        let venueObjectId = await validate.validateAndConvertId(venueId)
        let userObjectId = await validate.validateAndConvertId(userId)
        await validate.verifyNum(rating)

        let venueCollection = await venues();

        let insertInfo = await venueCollection.updateOne(
                { _id: venueObjectId }, 
                { $push: {reviews: {
                    userID: userObjectId, 
                    review: review,
                    rating: rating
                }}})

        let venue = await this.getVenueById(venueObjectId)
        
        if (!venue) throw "WARN: " + "Could not find venue with id " + id;

        users.addRatedVenue(userObjectId, venueObjectId, venue.name)
        
        let updatedVenue = await  this.updateVenueAggregateRating(venueObjectId)

        if(!updatedVenue) {throw "Venue aggregate rating not updated"}
        
        return updatedVenue;
    }
    catch(error) {
        console.log(error);
    }
},

updateVenueAggregateRating(venueId) {
        try {
        return validate.validateAndConvertId(venueId).then((venueObjectId)=> {
            return this.getVenueById(venueObjectId).then((venue) => {
                return ratingReducer(venue).then(aggRating => {            
                    return venues().then(venuesCollection => {
                        return venuesCollection.updateOne(
                            { _id: venueObjectId }, 
                            { $set: { "rating": aggRating } 
                            }).then((result) => {
                                return this.getVenueById(venueObjectId).then(result => {
                                    if (!result) throw "WARN: " + "Could not find venue with id " + id;
                                    return result;
                                });
                            });
                        });
                    });
                })
            }).catch((error) => {
                throw error;
        });
    }
    catch(error) {
        console.log(error);
    }
},


getVenueByHours(lowerRange, upperRange, dayOfTheWeek) {
    try {
        return validate.verifyNumber(lowerRange).then(() => {
            return validate.verifyNumber(upperRange).then(() => {
                return venues().then((venueCollection)=> {
                    return venueCollection.find({
                        $and: [
                            {"hours.dayOfTheWeek":  dayOfTheWeek},
                            {"hours.openingTime": { $lte: lowerRange}},
                            {"hours.closingTime": { $gt: upperRange}}
                        ]
                    })
                    .toArray();
                });
            });
        });
    }
    catch(error) {
        console.log(error);
    }
},

updateVenueStyle(id, newStyle) {
    try {
        validate.verifyString(style).then(()=> {
            return venues()
            .update({ _id: id }, { $set: { "style": newStyle } })
            .then(function() {
              return getVenueById(id);
            });
        })
    }
    catch(error) {
        console.log(error);
    }
 } 
}

module.exports = exportedMethods;


async function ratingReducer(venue) {
    let len =  venue.reviews.length 
    let sum = 0;

    venue.reviews.forEach((x) => {
        sum = sum + x.rating
    });

    let aggRating = (sum/len);
    return Math.round(aggRating);
}




