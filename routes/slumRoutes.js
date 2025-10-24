const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const slumController = require("../controllers/slumController");

// ➕ Add new cluster
router.post("/add", authMiddleware, slumController.addSlum);
router.get("/all", authMiddleware, slumController.getAllSlums);


module.exports = router;
