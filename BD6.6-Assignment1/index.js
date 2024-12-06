const cors = require("cors");
const express = require("express");
const { getAllShows, getShowById, addShow } = require("./controllers");

const app = express();
app.use(cors());
app.use(express.json());

// Get all shows
app.get("/shows", async (req, res) => {
  const shows = getAllShows();
  res.status(200).json({ shows });
});

// Get show by ID
app.get("/shows/:id", async (req, res) => {
  const showId = parseInt(req.params.id);
  const show = getShowById(showId);

  if (show) {
    res.status(200).json({ show });
  } else {
    res.status(404).json({ error: "Show not found" });
  }
});

// Add a new show
app.post("/shows", async (req, res) => {
  const { title, theatreId, time } = req.body;

  if (!title || !theatreId || !time) {
    res.status(400).json({ error: "Invalid input. All fields are required." });
    return;
  }

  const newShow = addShow({ title, theatreId, time });
  res.status(201).json(newShow);
});

module.exports = { app };
