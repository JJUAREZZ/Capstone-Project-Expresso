const bodyParser = require("body-parser");
const cors = require("cors");
const errorhandler = require("errorhandler");
const express = require("express");
const sqlite3 = require("sqlite3");

const apiRouter = require("./api/api");

const app = express();
const PORT = precess.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", apiRouter);

app.use(errorhandler());

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});

module.exports = app;
