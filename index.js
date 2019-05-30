const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const static = express.static(__dirname + "/public");
const session = require('express-session');
const flash = require('connect-flash');
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(session({
  key:'user_sid',
  cookie: { maxAge: 20 * 60000 },
  secret: 'codeworkrsecret',
  saveUninitialized: false,
  resave: false
}));
//app.engine("handlebars", exphbs({ defaultLayout: "site" }));
//app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  next()
})
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
