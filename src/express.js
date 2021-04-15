const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const api = require("./api");
const path = require("path");
const app = express();
const pathToImages = "/uploads";

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());

app.use(morgan("dev"));

app.use(
  express.static(path.resolve(__dirname, "../test-front/dist/test-front"))
);
app.use(pathToImages, express.static(path.resolve(__dirname, "../uploads")));

app.use("", api);
app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../test-front/dist/test-front/index.html")
  );
});

module.exports = app;
