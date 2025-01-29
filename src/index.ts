import express, { Request, Response } from "express";
import bookRoutes from "./routes/bookRoutes";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";


import cors from "cors";

const corsOptions = {
    // Allow only requests from this domain
    origin: 'http://localhost:8000',
    Credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json())
app.use("/api", bookRoutes)
app.use("/api/auth", authRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to Node js + Typescript")
})

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });