const express = require("express");
const router = express.Router();
const controllers = require("../controllers/index");

router.get("/", controllers.home);
router.get("/search", controllers.search); 

module.exports = router;