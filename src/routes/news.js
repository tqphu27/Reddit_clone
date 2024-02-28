const {verifyAccessToken} = require('../utils/jwt_service')
const newsController = require("../controllers/newsController");

const router = require("express").Router();

//GET NEWS
router.get("/", verifyAccessToken, newsController.getHotNews);

module.exports = router;