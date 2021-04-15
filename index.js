const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const morgan = require("morgan");
const uuid = require("uuid");
const path = require("path");
const app = express();
const fs = require("fs");

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname + "/test-front/dist/test-front")));
const pathToImages = "/uploads";
app.use(pathToImages, express.static(path.join(__dirname + "/uploads")));

app.post("/api/upload", (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      const image = req.files.fileKey;
      const newImageName = new Date().getMilliseconds() + uuid.v4();
      image.name = newImageName;
      image.mv("./uploads/" + newImageName);
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/test-front/dist/test-front/index.html"));
});
app.listen(3000);

const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.send(
    fs
      .readdirSync(path.join(__dirname + "/uploads"))
      .map((el) => `${pathToImages}/${el}`)
  );
  socket.on("newImageSended", (object) => {
    console.log(object);
    socket.broadcast.emit("newImage", {
      msg: `${pathToImages}/${object.msg}`,
    });
  });
});
