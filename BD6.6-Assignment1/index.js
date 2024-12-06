const cors = require("cors");
const express = require("express");
const { getAllBooks, getBookById } = require("./controllers");

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to get all books
app.get("/books", async (req, res) => {
  const books = getAllBooks();
  res.json({ books });
});

// Endpoint to get a book by ID
app.get("/books/details/:id", async (req, res) => {
  const book = getBookById(parseInt(req.params.id));
  res.json({ book });
});

module.exports = { app, getAllBooks, getBookById };
