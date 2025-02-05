import { Router, Request, Response, NextFunction } from "express";
import Book, { IBook } from "../models/books";
import { generateToken, verifyToken } from "../utils/jwt";
import User, { IUser } from "../models/user";

const router = Router();



// Get all books
router.get("/books", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const books = await Book.find().populate({
            path: 'user',
            select: 'name email'
        });

        res.status(200).json({
            books: books,
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }

});

// // Get a book by ID
// router.get("/books/:id", (req: Request, res: Response) => {
//     const bookId = parseInt(req.params.id);
//     const book = books.find(b => b.id === bookId);
//     if (book) {
//         res.json(book);
//     } else {
//         res.status(404).json({ message: "Book not found" });
//     }
// });

// Create a new book
router.post("/books", async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const token = req.header("Authorization")?.replace("Bearer", '');
    const { title } = req.body;
    try {
        // Add book logic (e.g., database interaction)
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = verifyToken(token);
        if (!decoded) { // Check for invalid token
            return res.status(401).json({ message: "Invalid token" });
        }

        const userId = decoded.userId;

        const book: IBook = new Book({ title, user: userId });

        const savedBook = await book.save(); // **Crucial: Save the book and get the saved object**

        const io = req.app.get('io'); // Get io from app locals
        if (io) {
            await emitBookUpdates(io); // Call emitBookUpdates
        } else {
            console.error("Socket.IO instance not available in bookRoutes.");
        }
        // Populate the user object after saving
        const populatedBook = await Book.findById(savedBook._id).populate({
            path: 'user',
            select: 'name email'
        });

        res.status(201).json({ status: 201, message: "Book created successfully", data: populatedBook });

    }
    catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ status: error });
    }
});
// Update a book by ID
// router.put("/books/:id", (req: Request, res: Response) => {
//     const bookId = parseInt(req.params.id);
//     const bookIndex = books.findIndex(b => b.id === bookId);

//     if (bookIndex !== -1) {
//         books[bookIndex] = { id: bookId, title: req.body.title, author: req.body.author };
//         res.json(books[bookIndex]);
//     } else {
//         res.status(404).json({ message: "Book not found" });
//     }
// });

// // Delete a book by ID
router.delete("/books/:id", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id; // ID is usually a string (or ObjectId)

        const deletedBook = await Book.findByIdAndDelete(bookId); // Use findByIdAndDelete

        if (deletedBook) {
            res.status(204).send(); // 204 No Content is standard for successful delete
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Server error" }); // Handle errors
    }
});


async function emitBookUpdates(io: any) {
    try {
        const books = await Book.find().populate({
            path: 'user',
            select: 'name email'
        });
        io.emit('book-updates', books);
    } catch (error) {
        console.error("Error fetching books for update:", error);

    }
}
export default router;