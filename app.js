const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
const ssoRoutes = require("./routes/ssoRoutes");

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "levrage_secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/sso", ssoRoutes);

app.get("/", (req, res) => {
  res.send("✅ Levrage SAML SSO Server is Running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
