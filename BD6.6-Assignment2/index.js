const cors = require("cors");
const express = require("express");
const { getAllStocks, getStockByTicker, addTrade } = require("./controllers");

const app = express();
app.use(cors());
app.use(express.json());

// Retrieve all stocks
app.get("/stocks", async (req, res) => {
  const stocks = getAllStocks();
  res.status(200).json({ stocks });
});

// Retrieve stock by ticker
app.get("/stocks/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const stock = getStockByTicker(ticker);

  if (stock) {
    res.status(200).json({ stock });
  } else {
    res.status(404).json({ error: "Stock not found" });
  }
});

// Add a new trade
app.post("/trades/new", async (req, res) => {
  const { stockId, quantity, tradeType, tradeDate } = req.body;

  if (!stockId || !quantity || !tradeType || !tradeDate) {
    res.status(400).json({ error: "Invalid input. All fields are required." });
    return;
  }

  const newTrade = addTrade({ stockId, quantity, tradeType, tradeDate });
  res.status(201).json({ trade: newTrade });
});

module.exports = { app };
