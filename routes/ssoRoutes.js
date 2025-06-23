const express = require("express");
const passport = require("passport");
const fs = require("fs");
const SamlStrategy = require("passport-saml").Strategy;

const router = express.Router();

const samlStrategy = new SamlStrategy(
  {
    callbackUrl: "http://localhost:5000/sso/login/callback",
    entryPoint: "https://accounts.zoho.com/sso/saml", // Replace with real Zoho SSO URL
    issuer: "levrage-app",
    cert: fs.readFileSync("./cert/cert.pem", "utf-8"),
    privateCert: fs.readFileSync("./cert/key.pem", "utf-8"),
    decryptionPvk: fs.readFileSync("./cert/key.pem", "utf-8"),
    validateInResponseTo: false,
    disableRequestedAuthnContext: true,
  },
  (profile, done) => {
    if (!profile.nameID.endsWith("@levrage.ai")) {
      return done(null, false, { message: "Unauthorized domain" });
    }
    return done(null, profile);
  }
);

passport.use("saml", samlStrategy);

router.get("/login", passport.authenticate("saml"));

router.post(
  "/login/callback",
  passport.authenticate("saml", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

router.get("/metadata", (req, res) => {
  res.type("application/xml");
const cert = fs.readFileSync("./cert/cert.pem", "utf-8");
res.send(samlStrategy.generateServiceProviderMetadata(cert, cert));
});

module.exports = router;
