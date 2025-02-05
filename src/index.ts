import express, { Request, Response } from "express";
import http from 'http';
import { Server } from 'socket.io';
import bookRoutes from "./routes/bookRoutes";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import Book from "./models/books"


import cors from "cors";

const corsOptions = {
    // Allow only requests from this domain
    origin: 'http://localhost:8000',
    Credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

dotenv.config();

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
})
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json())
app.use("/api", bookRoutes)
app.use("/api/auth", authRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to Node js + Typescript")
})

// function to emit books
async function emitBookUpdates() {
    try {
        const books = await Book.find({
            path: 'user',
            select: 'name email'
        });
        io.emit('book-updates', books)
    } catch (error) {
        console.error("error fetching books for update", error);
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    emitBookUpdates(); // Send initial book data when a user connects

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
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

// IMPORTANT: make io available to book routes
app.set('io', io);