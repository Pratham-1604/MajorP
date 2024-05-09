const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const blockchainRouter = require("./router/public");
const privateRouter = require("./router/private");
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8080;
app.listen(port, () => {
  console.log("API server is listening on port", port);
});


app.use("/blockchain", blockchainRouter);
app.use("/private", privateRouter);