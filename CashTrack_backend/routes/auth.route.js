import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  generateTokenAndSetCookie(req.user._id, res); // ✅ Set JWT Cookie
  res.json({ message: "Google Authentication Successful", user: req.user });
});

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github/callback", passport.authenticate("github"), (req, res) => {
  generateTokenAndSetCookie(req.user._id, res); // ✅ Set JWT Cookie
  res.json({ message: "GitHub Authentication Successful", user: req.user });
});

export default router;
