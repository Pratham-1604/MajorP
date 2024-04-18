const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const blockchainRouter = require("./router/blockchain");
app.use(bodyParser.json());

const port = 8080;
app.listen(port, () => {
  console.log("API server is listening on port", port);
});

app.use("/blockchain", blockchainRouter);
