const express = require("express");
const employeesRouter = express.Router();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "/database.sqlite"
);

const timesheetsRouter = require("./timesheet.js");

employeesRouter.param("employeeId", (req, res, next, employeeId) => {
  const sql = "SELECT * FROM Employee WHERE Employee.id = $employeeId";
  const values = { $employeeId: employeeId };
  db.get(sql, values, (error, employee) => {
    if (error) {
      next(error);
    } else if (employee) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

employeesRouter.use("/:employeeId/timesheets", timesheetsRouter);

employeesRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Employee WHERE Employee.is_current_employee = 1",
    (err, employees) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ employees: employees });
      }
    }
  );
});
