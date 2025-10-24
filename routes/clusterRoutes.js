const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const clusterController = require("../controllers/clusterController");

// ➕ Add new cluster
router.post("/add", authMiddleware, clusterController.addCluster);

// 📋 Get all clusters
router.get("/all", authMiddleware, clusterController.getAllClusters);

// 📌 Get a single cluster by ID
// router.get("/:id", authMiddleware, clusterController.getClusterById);


// 📌 Get a single cluster by cluster_number
// Make sure this line exists and is correct
router.get("/:cluster_number", authMiddleware, clusterController.getClusterByNumber);

// Check it's NOT conflicting with other routes like:
// router.get("/something", ...)  <- this should come AFTER the dynamic route




// ✏️ Update a cluster
router.put("/update/:id", authMiddleware, clusterController.updateCluster);

// ❌ Delete a cluster
router.delete("/delete/:id", authMiddleware, clusterController.deleteCluster);

module.exports = router;
