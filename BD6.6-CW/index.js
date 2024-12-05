const cors = require("cors");
const express = require("express");
const { getAllEmployees, getEmployeesById } = require("./controllers");

const app = express(); // Fixed the syntax error here
app.use(cors());
app.use(express.json());

// Endpoint to get all employees
app.get("/employees", async (req, res) => {
  // Fixed the syntax for the arrow function
  const employees = getAllEmployees();
  res.json({ employees });
});

// Endpoint to get employee details by ID
app.get("/employees/details/:id", async (req, res) => {
  const employee = getEmployeesById(parseInt(req.params.id));
  res.json({ employee });
});

module.exports = { app, getAllEmployees, getEmployeesById };
