const express = require("express");
const router = express.Router();
const data = require("../data");
const venueData = data.venues;

router.post("/:userid", async (req, res) => {
    try {
        console.log("Hey you're in post route of search")
        console.log(req.body)
        console.log(req.body.searchtype)
        console.log(req.body.searchstring.trim())

        let type = req.body.searchtype
        let searchStr = req.body.searchstring.trim()

        let userId = req.params.userid
        console.log("============", userId);
        let data;

        if (type === "name") {
            data = await venueData.getVenuesBySearchString(searchStr)
        } else if (type === "location") {
            data = await venueData.getVenueByLocation(searchStr)
        } else {
            let param = searchStr.split(",")
            console.log("Searching by rating")
            console.log("\nSearch string after splitting", param)
            param.forEach(element => {
                element = Number(element)
            });
            //data = await venueData.getVenueByRating(param)
            data = await venueData.getVenueByRatingGT(searchStr);
        }

        if (data.length === 0) {
            res.render("pages/searchResults", { hasErrors: true, title: "Search Result", foundData: data, searchStr: searchStr, type: type.toUpperCase(), userId:userId })
        } else {
            res.render("pages/searchResults", { hasErrors: false, title: "Search Result", foundData: data, searchStr: searchStr, type: type.toUpperCase(), userId:userId})
        }       
    } catch (error) {
        res.status(500).json({error: error})
    }
    
})

module.exports = router;