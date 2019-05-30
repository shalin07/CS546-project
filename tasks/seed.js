const dbConnection = require("../config/connection");
const data = require("../data/");
const users = data.users;
const venues = data.venues;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    
    let venueIds = [];
    let userIds = [];
    // name, location, style, description, rating

    const loc1 = await venues.createVenue("Saffron", "Ahmedabad", "Indian, Continental", "Blah blah", "4")
    console.log("added a venue", loc1)
    venueIds.push(loc1._id);
    const loc2 = await venues.createVenue("Indian Essence", "Rockaway, NJ", "Indian", "Great Buffet place to get what you need!", "4")
    console.log("added a venue", loc2)
    venueIds.push(loc2._id);
    const loc3 = await venues.createVenue("Adam's Bagels", "Jefferson, NJ", "Barkery", "Try the Assiago Cheese Bagel, this bakery is great", "5")
    console.log("added a venue", loc3)
    venueIds.push(loc3._id);
    const loc4 = await venues.createVenue("Pop's Bagels", "Dover, NJ", "Bakery", "Great for a bagel in the morning, or a good sandwich for lunch", "4")
    console.log("added a venue", loc4)
    venueIds.push(loc4._id);
    const loc5 = await venues.createVenue("Heielburgs", "New York, NY", "German Deli", "Come here to get authentic German suasage, beers, and much more", "4")
    console.log("added a venue", loc5)
    venueIds.push(loc5._id);
    const loc6 = await venues.createVenue("South Pine", "Morris Town, NJ", "Fine Dining", "Great atmosphere, great food, local wine delivery service... just make sure you make a reservation ", "4")
    console.log("added a venue", loc6)
    venueIds.push(loc6._id);
    const loc7 = await venues.createVenue("Alisha's Kitchen", "Hoboken, NJ", "Indian", "Alisha's always cooking when we chat about the project. Must be cooking up something good!", "5")
    console.log("added a venue", loc7)
    venueIds.push(loc7._id);
    const loc8 = await venues.createVenue("Shalin's Famous Cookies", "Hoboken, NJ", "Digital", "Not the type of cookie you eat, but good nonetheless", "5")
    console.log("added a venue", loc8)
    venueIds.push(loc8._id);
    const loc9 = await venues.createVenue("Brian's Bar-B-Q", "Jefferson, NJ", "Bar-B-Q", "Come grab a burger or sausage from off the grill here at Brian's", "5")
    console.log("added a venue", loc9)
    venueIds.push(loc9._id);
    const loc10 = await venues.createVenue("Hot Rods", "Dover, NJ", "BBQ", "Good enough for government work", "3")
    console.log("added a venue", loc10)
    venueIds.push(loc10._id);
    const loc11 = await venues.createVenue("Ichibans", "Hopatcong, NJ", "Japanese", "Perfect place to get your sushi fix", "4")
    console.log("added a venue", loc11)
    venueIds.push(loc11._id);
    const loc12 = await venues.createVenue("Miga Sushi", "Denville, NJ", "Japanese", "Delisous sushi baffet made to order", "5")
    console.log("added a venue", loc12)
    venueIds.push(loc12._id);
    const loc13 = await venues.createVenue("Jefferson Diner", "Hopatcong, NJ", "Diner", "If you like TV icons and classic diners, then this place might be alright for you", "2")
    console.log("added a venue", loc13)
    venueIds.push(loc13._id);
    const loc14 = await venues.createVenue("Maria's Pizza", "Hopatcong, NJ", "Italian", "Best place for pizza within a 10 mile radius of Picatinny", "5")
    console.log("added a venue", loc14)
    venueIds.push(loc14._id);
    const loc15 = await venues.createVenue("Clove Berry", "Sparta, NJ", "Breakfast", "Porch seating, healthy food, and good service", "4")
    console.log("added a venue", loc15)
    venueIds.push(loc15._id);

    console.log("Done seeding Venues for database");

    //create(firstName, lastName, email, phone, age, password, bday)
    
    const user1 = await users.create("Brian", "Hartigan", "brian@stevens.edu", "555-555-5555", 30, "Password", "07-19-1988")
    console.log("added a user", user1)
    userIds.push(user1);
    const user2 = await users.create("Phil", "Barresi", "phil@stevens.edu", "555-555-5556", 99, "Password", "08-19-1919")
    console.log("added a user", user2)
    userIds.push(user2);
    const user3 = await users.create("Alisha", "Singh", "alisha@stevens.edu", "555-555-5557", 23, "Password", "06-17-1995")
    console.log("added a user", user3)
    userIds.push(user3);
    const user4 = await users.create("Shalin", "Shalin", "shalin@stevens.edu", "555-555-5558", 25, "Password", "10-19-1993")
    console.log("added a user", user4)
    userIds.push(user4);
    const user5 = await users.create("Guest", "Guest", "guest@stevens.edu", "555-555-5559", 1, "Password", "07-19-1919")
    console.log("added a user", user5)
    userIds.push(user5);

    //addVenueReview(venueId, userId, review, rating)
    let i = 0

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

    let result = await asyncForEach(venueIds, async (id) => {

        let outcomes = [
            "terrible", "bad", "okay", "pretty good", "the Best!"
        ]

        let result = await asyncForEach([1,2,3,4], async (i) => {
            let randomUser =  Math.floor(Math.random()* userIds.length);
            let randomNum5 =  Math.floor(Math.random()* 6);

            let result = await venues.addVenueReview(id, userIds[randomUser]._id, i +
                "  Hi, I am " + userIds[randomUser].firstName + 
                ". I rated my last visit at this venue as " + outcomes[randomNum5], randomNum5)

            console.log(result)
        });
    })

    await db.serverConfig.close();

};


main().catch(console.log);
