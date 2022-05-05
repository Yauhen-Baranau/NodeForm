const express = require("express");

const fs = require("fs");
const path = require("path");

const webserver = express();

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.json());

const port = 80;

webserver.get("/index", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

webserver.get("/variants", (req, res) => {
  const variants = fs.readFileSync("variants.json", "utf8");
  res.send(variants);
});

webserver.post("/vote", (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }

  const newStat = JSON.parse(fs.readFileSync("stat.json", "utf8")); // получили json в кодировек utf8, распарсили
  newStat.find((v) => v.code === req.body.code).count++; // что-то сделали
  const stat = path.join(__dirname, "stat.json"); // получили полный путь
  const logFd = fs.openSync(stat, "w"); // открыли в файловой системе по полученному пути
  fs.writeSync(logFd, JSON.stringify(newStat)); // переписали
  fs.closeSync(logFd); // закрыли в файловой системе
  res.sendStatus(200);
});

webserver.get("/stat", (req, res) => {
  const stat = fs.readFileSync("stat.json", "utf8");
  res.send(stat);
});

webserver.listen(port, () => {
  console.log("web server running on port " + port);
});
