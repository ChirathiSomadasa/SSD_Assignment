// routes/user_route.js
const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            userType: user.user_type
        },
        process.env.JWT_SECRET || "210edd3338fdba8c2c0ea2247cea7ae343f3f110779a829c51412c3a7e3e5e1a",
        { expiresIn: "1h" }
    );
};

// Register 
router.post("/register", async (req, res) => {
    const { first_name, last_name, mobile_number, email, city, password } = req.body;

    if (!first_name || !last_name || !mobile_number || !email || !city || !password) {
        return res.status(400).json({
            status: "required_failed",
            message: "All fields are required."
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: "already_email",
                message: "Email already taken."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            first_name,
            last_name,
            mobile_number,
            email,
            city,
            password: hashedPassword,
            user_type: "user"
        });

        await user.save();

        res.status(201).json({
            status: "success",
            message: "User registered successfully. Please log in."
        });
    } catch (e) {
        console.error("Register error:", e);
        res.status(500).json({
            status: "failed",
            message: "Server error. Please try again."
        });
    }
});

// Login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: "invalid_user",
                message: "Incorrect email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: "invalid_user",
                message: "Incorrect email or password."
            });
        }

        const token = generateToken(user);

        res.json({
            status: "success",
            message: "Login successful",
            token,
            email: user.email,
            user_id: user._id,
            user_type: user.user_type
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({
            status: "failed",
            message: "Server error. Please try again."
        });
    }
});


// ========================
// Google OAuth Routes
// ========================
// Step 1: Start Google login
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"   // this forces the chooser every time
  })
);

// Step 2: Google redirects here after login
// Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    // req.user comes from passport after successful login
    const token = generateToken(req.user);

    // Redirect back to frontend with JWT in query param
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);



// Public Users (for notifications) - Auth Required
router.get("/users", async (req, res) => {
    if (!req.current_user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    try {
        const users = await User.find({}, "first_name last_name email");
        res.json({ status: "success", users });
    } catch (e) {
        res.status(500).json({ status: "failed", message: "Error fetching users." });
    }
});

// Admin: View All Users
router.get("/api/admin/register", async (req, res) => {
    if (!req.current_user || req.current_user.user?.user_type !== "admin") {
        return res.status(403).json({ status: "error", message: "Access denied." });
    }
    try {
        const users = await User.find({});
        res.status(200).json({ message: "Users retrieved", status: "success", users });
    } catch (error) {
        res.status(500).json({ message: "Error", status: "error", error: error.message });
    }
});

module.exports = router;


