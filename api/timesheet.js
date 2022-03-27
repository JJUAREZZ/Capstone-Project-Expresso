const express = require("express");
const timesheetsRouter = express.Router();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "/database.sqlite"
);

timesheetsRouter.param("timesheetId", (req, res, next, timesheetId) => {
  const sql = "SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId";
  const values = { $timesheetId: timesheetId };
  db.get(sql, values, (err, timesheet) => {
    if (err) {
      next(err);
    } else if (timesheet) {
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

timesheetsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId",
    (err, timesheets) => {
      if (err) {
        next(err);
      } else {
        res.send(200).json({ timesheets });
      }
    }
  );
});

timesheetsRouter.post("/", (req, res, next) => {
  const hours = req.body.timesheet.hours,
    rate = req.body.timesheet.rate,
    date = req.body.timesheet.date,
    employeeId = req.body.timesheet.employee_id;
  if (!rate || !date || !hours) {
    res.sendStatus(400);
  }
  const sql =
    "INSERT INTO Timesheet (hours, rate, date, employeeId)" +
    "VALUES ($hours, $rate, $date, $employeeId";
  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId,
  };
  db.run(sql, values, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
        (error, timesheet) => {
          res.status(201).json({ timesheet: timesheet });
        }
      );
    }
  });
});

timesheetsRouter.put("/:timesheetId", (req, res, next) => {
  const hours = req.body.timesheet.hours,
    rate = req.body.timesheet.rate,
    date = req.body.timesheet.date,
    employeeId = req.body.timesheet.employee_id;
  if (!rate || !date || !hours) {
    res.sendStatus(400);
  }
  const sql =
    "UPDATE Timesheet SET hours=$hours, rate=$rate, date=$date, employeeId=$employeeId" +
    "WHERE Timesheet.Id = $timesheetId";
  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId,
  };
  db.run(sql, values, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
        (error, timesheet) => {
          res.status(201).json({ timesheet: timesheet });
        }
      );
    }
  });
});

timesheetsRouter.delete("/:timesheetId", (req, res, next) => {
  const sql = "DELETE * FROM Timesheet WHERE Timesheet.id = $timesheetId";
  const values = { $timesheetId: req.params.timesheetId };
  db.run(sql, values, (err) => {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`,
        (error, timesheet) => {
          res.status(204).json({ timesheet: timesheet });
        }
      );
    }
  });
});
