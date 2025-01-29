import { Router, Request, Response, NextFunction } from "express";
import Book, { IBook } from "../models/books";
import { generateToken, verifyToken } from "../utils/jwt";
import User, { IUser } from "../models/user";
const router = Router();



// Get all books
router.get("/books", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const startIndex = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
        const endIndex = startIndex + parseInt(limit as string, 10);

        const books = await Book.find();

        res.status(200).json({
            books: books,
            total: books.length
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
    try {
        // Add book logic (e.g., database interaction)
        const token = req.header("Authorization")?.replace("Bearer", "");
        const { title } = req.body;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        // Verify the token
        const decoded = verifyToken(token);
        const userId = decoded.userId;
        // const user = await User.findById(decoded.userId);

        const book: IBook = new Book({ title, user: userId })
        await book.save();

        res.status(201).json({ status: 201, message: "Book created successfully", data: book });

    }
    catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ status: 500, message: "Error creating book" });
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

export default router;