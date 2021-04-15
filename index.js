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
app.use("/images", express.static(path.join(__dirname + "/uploads")));

app.post("/api/upload", (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let image = req.files.fileKey;
      image.mv("./uploads/" + uuid.v4() + image.name);
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
  socket.on("newImageSended", () => {
    socket.broadcast.emit("newImage", {
      msg: fs.readdirSync(path.join(__dirname + "/uploads")),
    });
  });
});


