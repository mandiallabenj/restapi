import { Router, Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";
import { generateToken, verifyToken } from "../utils/jwt";
import mongoose from "mongoose";

const router = Router();

// Create User Endpoint
router.post("/register", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const user: IUser = new User({ name, email, password });
        await user.save();
        // Generate JWT
        const token = generateToken(user._id.toString());

        const sanitizedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
        }

        res.status(201).json({ message: "User created successfully", user: sanitizedUser, token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Login Endpoint
router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = generateToken(user._id.toString());
        console.log(token);

        const sanitizedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
        }

        res.status(200).json({ message: "Login successful", user: sanitizedUser, token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


// Protected Route
router.get("/profile", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify the token
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const sanitizedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
        }

        res.status(200).json({ message: "Profile accessed successfully", sanitizedUser });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error });
    }
});

export default router;