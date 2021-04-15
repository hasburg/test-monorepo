const upload = require("express").Router();
const uuid = require("uuid");
const path = require("path");
upload.post("/upload", (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      const image = req.files.fileKey;
      const newImageName =
        new Date().getMilliseconds() + uuid.v4() + image.name;
      image.name = newImageName;
      image.mv(
        path.resolve(__dirname, "../../../uploads") + "/" + newImageName
      );
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
module.exports = upload;
