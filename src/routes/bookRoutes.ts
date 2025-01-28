import { Router, Request, Response } from "express";

const router = Router();

interface Book {
    id: number;
    title: string;
    author: string;
}

const books: Book[] = [
    { id: 1, title: "1984", author: "George Orwell" },
    { id: 2, title: "Brave New World", author: "Aldous Huxley" }
];

// Get all books
router.get("/books", (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const startIndex = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
        const endIndex = startIndex + parseInt(limit as string, 10);

        const results = books.slice(startIndex, endIndex);

        res.status(200).json({
            books: results,
            total: books.length
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Error fetching books" });
    }

});

// Get a book by ID
router.get("/books/:id", (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Create a new book
router.post("/books", (req: Request, res: Response) => {
    const newBook: Book = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author,
    };

    try {
        // Add book logic (e.g., database interaction)
        books.push(newBook); // Assuming in-memory storage for now

        res.status(201).json({ status: 201, message: "Book created successfully", data: newBook });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ status: 500, message: "Error creating book" });
    }
});
// Update a book by ID
router.put("/books/:id", (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        books[bookIndex] = { id: bookId, title: req.body.title, author: req.body.author };
        res.json(books[bookIndex]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book by ID
router.delete("/books/:id", (req: Request, res: Response) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

export default router;