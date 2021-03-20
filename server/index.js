const express = require("express");
const app = express();
const path = require("path");
const cron = require('node-cron');



app.use(express.static(path.join(__dirname, "..", "build")));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });

cron.schedule('0 0 23 ? * TUE,SAT *', () => {
    require(path.join(__dirname, "arp-scrape.js"))
    require(path.join(__dirname, "rpcna-scrape.js"))
    require(path.join(__dirname, "opc-scrape.js"))
    require(path.join(__dirname, "pca-scrape.js"))
    require(path.join(__dirname, "urcna-scrape.js"))
    require(path.join(__dirname, "prc-scrape.js"))
    require(path.join(__dirname, "hrc-scrape.js"))
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server started on port 5000");
});