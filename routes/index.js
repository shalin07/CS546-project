const userRoutes = require("./users");
const venuesRoutes = require("./venues");
const searchRoutes = require("./search");
const path = require("path");


const constructorMethod = app => {
  app.use("/users", userRoutes);

  //add userid as req param in venues search and about us while the user is logged in and home2 
  app.use("/venues",venuesRoutes);
  app.use("/search", searchRoutes);
  
  //add userid as a tag in the below route
  app.get("/:userid/home", async (req, res) => {
    const userid = req.params.userid
    res.render("pages/home", {title:"Home", userID: userid})
})
  // app.get("/test", (req,res) => { 
  //   let route = path.resolve("static/testLandingPage.html");
  //   res.sendFile(route);
  // });

  // app.use("*", (req, res) => {
  //   res.render("pages/aboutUs");
  // });
  app.get("/aboutus", (req, res) => {
    let route = path.resolve("static/aboutUs.html");
    res.sendFile(route)
  })
  app.use("*", (req, res) => {
    //res.render("pages/login");
    res.render('pages/login', {layout: 'alternate.handlebars'});
  });
};

module.exports = constructorMethod;
