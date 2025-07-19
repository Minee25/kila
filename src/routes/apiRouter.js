const express = require("express");
const router = express.Router();
const apiControllers = require("../controllers/apiController");

router.get("/get-student", apiControllers.getStudent);
router.get("/get-committee", apiControllers.getCommittee);

module.exports = router;