const express = require("express");
const apiRouter = express.Router();
const menusRouter = require("./menus.js");
const employeesRouter = require("./employees.js");
const sqlite3 = require("sqlite3");

apiRouter.use("/menus", menusRouter);
apiRouter.use("/employees", employeesRouter);

module.exports = apiRouter;
