const {verifyAccessToken} = require("../middleware/authMiddleware")
const newsController = require("../controllers/newsController");

const router = require("express").Router();

//GET NEWS
router.get("/", verifyAccessToken, newsController.getHotNews);

module.exports = router;