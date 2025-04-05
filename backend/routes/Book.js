import express from 'express';
import Book from '../models/book.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new book
router.post('/', verifyToken, async (req, res) => {
  const { title, author, description, imageUrl, price, downloadLink } = req.body;

  try {
    // Check if a book with the same title already exists
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(400).json({ message: "Book with this title already exists" });
    }

    const newBook = new Book({
      title,
      author,
      description,
      imageUrl,
      price,
      downloadLink
    });

    await newBook.save();
    res.status(201).json({ message: 'Book saved successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error saving book', error: error.message });
  }
});
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

export default router;