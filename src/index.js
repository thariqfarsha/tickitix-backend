const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
const routerNavigation = require("./routes");

const app = express();
const port = 3001;

// middleware
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// request
// request ditaro abis middleware, jadi midwarenya jalan dulu, baru request dijalankan
app.use("/", routerNavigation);

app.use("/*", (req, res) => {
  res.status(404).send("Path not found!");
});

// app.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}!`);
});
