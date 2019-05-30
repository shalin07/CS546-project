let validate = require("./objectValidation");
//let v = require("./objectValidation");
const mongoCollections = require("../config/collections");
let users = mongoCollections.users;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


let exportedMethods = {
  getAllUsers() {

     return users()
     .then((userCollection) => {
         return userCollection.find({}).toArray()
         .then((allUsers) => {
             if(allUsers===undefined) throw "No Users Found";
             return allUsers;
         });
     });
 },

async getUserById(id) {
       
    return validate.validateAndConvertId(id)
        .then((objectId) => {
            return users()
            .then(userCollection => {
                return userCollection.findOne({ _id: objectId })
                .then(user => {
                if (!user) throw "WARN: " + "Could not find user with id " + id;
                return user;
                });
            });
          }).catch((error) => {
        console.log("ERROR: " + error);
    });
},


// getUserByName(name) {
//     validate.verifyString(name)
//         return users()
//         .then(userCollection => {
//             return userCollection.findOne({ name: name })
//             .then(user => {
//             if (!user) throw "WARN: " + "Could not find user with name " + name;
//             return user;
//             });
//           }).catch((error) => { 
//         console.log("ERROR: " + error);
//     });
// },

// getUserByDOB(dob) {
//     validate.verifyString(dob)
//         return users()
//         .then(userCollection => {
//             return userCollection.findOne({ dob: dob })
//             .then(user => {
//             if (!user) throw "WARN: " + "Could not find user with dob " + dob;
//             return user;
//             });
//           }).catch((error) => { 
//         console.log("ERROR: " + error);
//     });
// },

async getUserByEmail(email) {
    //add regex for email
    validate.verifyString(email)
        return users()
        .then(userCollection => {
            return userCollection.findOne({ email: email })
            .then(user => {
            if (!user) throw "WARN: " + "Could not find user with email " + email;
            return user;
            });
          }).catch((error) => { 
        console.log("ERROR: " + error);
    });
},

// getUserByPhoneNumber(phoneNumber) {
//     //add regex for phone number
//     validate.verifyString(phoneNumber)
//         return users()
//         .then(userCollection => {
//             return userCollection.findOne({ phoneNumber: phoneNumber })
//             .then(user => {
//             if (!user) throw "WARN: " + "Could not find user with phoneNumber " + phoneNumber;
//             return user;
//             });
//           }).catch((error) => { 
//         console.log("ERROR: " + error);
//     });
// },

async addRatedVenue(userId, venueId, venueName) {
    try {
        let userObjectId = await validate.validateAndConvertId(userId);
        let venueObjectId = await validate.validateAndConvertId(venueId); 
        await validate.verifyString(venueName);

        const userCollection = await users();

        let result = await userCollection.updateOne(
            { _id: userObjectId }, 
            { $push: {ratedVenues: {
                venueId: venueObjectId, 
                name: venueName
            }}})

        if(result.modifiedCount <= 0) throw "Unable to update User Collection with the new review. Confirm the user exists."

        let user =  await this.getUserById(userObjectId);
        return user
    }
    catch(error) {
        console.log(error);
    }
},

async create(firstName, lastName, email, phone, age, password, bday) {
       
    if (!firstName|| typeof firstName != 'string') throw "You must provide a string of first name";

    if (!lastName|| typeof lastName != 'string') throw "You must provide a string of last name";

    if (!phone || typeof phone != 'string') throw "Please provide a proper 10 digit phone number";

    if (!email|| typeof email != 'string') throw "You must provide a string of email";

    if (!password|| typeof password != 'string') throw "You must provide a string of password";

    if (!age|| typeof age != 'number') throw "Age should be number"
   
    const userCollection = await users();
 
    var checkExist = await userCollection.find({email: email}).toArray();

    if(checkExist.length>=1){
       throw "Mail exists please try to login"
    }else{

    
        var tmp = await bcrypt.hash(password, 10).then(function (data) {return data}).catch(e=> {throw e;});
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            age: age,
            hashedPassword: tmp,
            bday: bday,
            ratedVenues:[],

            };
            const insertInfo = await userCollection.insertOne(newUser);
            if (insertInfo.insertedCount === 0) throw "Could not add user";

            const newId = insertInfo.insertedId;
            const user = await this.getUserById(newId);

            return user
    } 
  },
  
  async login(email, password){
    console.log('step 1')
    var obj = {}
    const userCollection = await users();
    var user = await userCollection.find({ email: email }).toArray()
    if(user.length < 1){
        throw "Email doesn\'t exist! Please sign up"
    }
    console.log("User's password")
    // console.log(user[0])
    var tmp = await bcrypt.compare(password, user[0].hashedPassword).then(function (data) {return data}).catch(e=> {throw e;});
    // console.log("tmp")
    console.log(tmp)
    if(tmp != true){
        throw "Your email and password doesn't match!"
    }else{
        const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
        },
        '123'
        )
        obj["token"]=token
        obj["user"]=user
        // console.log("obj")
        // console.log(obj)
        // const people = await this.getUserByEmail(email)
        // return people
        return obj  
    }
}

}
module.exports = exportedMethods;