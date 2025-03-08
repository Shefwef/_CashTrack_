import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const generateTokenAndSetCookie = (userID, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set in the environment variables!");
      return res
        .status(500)
        .json({ error: "Internal Server Error: Missing JWT_SECRET" });
    }

    const token = jwt.sign({ userID }, JWT_SECRET, {
      expiresIn: "15d",
    });

    // Set JWT Token in Cookie
    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: process.env.NODE_ENV === "production", // Only HTTP-only in production
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict", // CSRF protection
    });

    console.log("JWT Token Set in Cookie:", token); // Debugging JWT visibility
    return token;
  } catch (error) {
    console.error("Error generating JWT token:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error: Token generation failed" });
  }
};

export default generateTokenAndSetCookie;
