const cors = require("cors");
const express = require("express");
const { getAllGames, getGameById } = require("./controllers");

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to get all games
app.get("/games", async (req, res) => {
  const games = getAllGames();
  res.json({ games });
});

// Endpoint to get game details by ID
app.get("/games/details/:id", async (req, res) => {
  const game = getGameById(parseInt(req.params.id));
  if (game) {
    res.json({ game });
  } else {
    res.status(404).json({ error: "Game not found" });
  }
});

module.exports = { app, getAllGames, getGameById };
