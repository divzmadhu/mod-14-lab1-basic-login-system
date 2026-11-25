// 1. Import Express to create routes
import express from "express";

// 2. Import the User model to interact with MongoDB
import User from "../models/User.js";

// 3. Import jsonwebtoken to generate JWT tokens
import jwt from "jsonwebtoken";

// 3.1 Retrieve the JWT secret from environment variables
const secret = process.env.JWT_SECRET;

// 3.2 Set the token expiration time
const expiration = "2h";

// 4. Create a router instance
const router = express.Router();

// 5. POST /api/users/register - Register a new user
router.post("/register", async (req, res) => {
    try {
        // 5.1 Extract username, email and password from request body
        const { username, email, password } = req.body;

        // 5.2 Check whether a user with this email already exists
        const existingUser = await User.findOne({ email });

        // 5.3 Return an error if the email is already registered
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists."
            });
        }

        // 5.4 Create a new User document
        const newUser = new User({
            username,
            email,
            password
        });

        // 5.5 Save the new user to MongoDB
        // The pre-save hook automatically hashes the password
        await newUser.save();

        // 5.6 Return the newly created user without the password
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        // 5.7 Handle registration errors
        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
});

// 7. POST /api/users/login - Authenticate an existing user
router.post("/login", async (req, res) => {
    try {
        // 7.1 Extract email and password from request body
        const { email, password } = req.body;

        // 7.2 Find the user using the provided email
        const user = await User.findOne({ email });

        // 7.3 Check whether the user exists
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password."
            });
        }

        // 7.4 Compare the provided password with the stored hashed password
        const isPasswordCorrect = await user.isCorrectPassword(password);

        // 7.5 Return an error if the password is incorrect
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect email or password."
            });
        }

        // 7.6 Create the JWT payload
        const payload = {
            _id: user._id,
            username: user.username
        };

        // 7.7 Generate a signed JWT
        const token = jwt.sign(payload, secret, {
            expiresIn: expiration
        });

        // 7.8 Return the token and user information
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        // 7.9 Handle login errors
        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
});

// 8. Export the router to use it in index.js
export default router;