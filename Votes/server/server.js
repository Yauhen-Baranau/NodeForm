const express = require("express");

const fs = require("fs");
const path = require("path");

const webserver = express();

webserver.use(express.urlencoded({ extended: true }));
webserver.use(express.json());

const port = 80;

// webserver.get("/index", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

webserver.use("/index", express.static(path.resolve(__dirname)));

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
  res.setHeader("Cache-Control", "public, max-age=0");
  res.setHeader("Content-Type", req.headers.accept);
  res.send(convertDocumentToMime(req.headers.accept, stat));
});

webserver.listen(port, () => {
  console.log("web server running on port " + port);
});

function convertDocumentToMime(mime, data) {
  let dataCode = JSON.parse(data);

  switch (mime) {
    case "application/json":
      return data;

    case "text/html":
      // let dataCode = JSON.parse(data);
      let strHTML = "";
      dataCode.forEach((element) => {
        strHTML += `<div><span>id</span><span>${element.code}</span> <span>count</span><span>${element.count}</span></div> <br/>`;
      });

      return strHTML;

    case "application/xml":
      let strXML = `<root>`;
      dataCode.forEach((element) => {
        strXML += `<code>${element.code}</code>
        <count>${element.count}</count>`;
      });

      return strXML + "</root>";

      default:  return console.log('unknown MIMEtype');
  }
}
