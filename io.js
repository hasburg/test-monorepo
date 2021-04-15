const fs = require("fs");
const path = require("path");
const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

const pathToImages = "/uploads";
io.on("connection", (socket) => {
  socket.send(
    fs
      .readdirSync(path.join(__dirname + "/uploads"))
      .map((el) => `${pathToImages}/${el}`)
  );
  socket.on("newImageSended", (object) => {
    socket.broadcast.emit("newImage", {
      msg: `${pathToImages}/${object.msg}`,
    });
  });
});