const router = require("express").Router();
const upload = require("./upload");
router.use("/api", upload);
module.exports = router;
