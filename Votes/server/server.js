const express = require("express");

const webserver = express();

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.json());

const port = 80;

const variants = [
   {code: 1, text: 'ВИСКИ', count:0},
   {code: 2, text: 'ВОДКА', count:0},
   {code: 3, text: 'СОК', count:0},
];

webserver.get("/index", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  webserver.get("/variants", (req, res) => {
    res.send(variants); 
  });
  
  webserver.post("/vote", (req, res) => {

    if (!req.body) {
        return res.sendStatus(400)

    }

    variants.find(v => v.code === req.body.code).count ++;
    res.sendStatus(200)
  }); 
  
  webserver.get("/stat", (req, res) => {
    res.sendFile(__dirname + "/stat.html");
  });


webserver.listen(port, () => {
    console.log("web server running on port " + port);
  });