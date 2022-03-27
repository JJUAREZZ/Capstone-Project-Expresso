const express = require("express");
const menusRouter = express.Router();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "/database.sqlite"
);

const menuItemsRouter = require("./timesheet.js");

menusRouter.param("menuId", (req, res, next) => {
  const sql = "SELECET * FROM Menu WHERE Menu.id = $menuId";
  const values = { $menuId: menuId };
  db.get(sql, values, (err, menu) => {
    if (err) {
      next(err);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});
