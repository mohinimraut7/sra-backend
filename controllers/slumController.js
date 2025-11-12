// slumController.js
const db = require('../config/db');

exports.addSlum = (req, res) => {
  const { slum_id, slum_name, cluster_number } = req.body;

  if (!slum_id || !slum_name || !cluster_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO slums (slum_id, slum_name, cluster_number) VALUES (?, ?, ?)";
  db.query(sql, [slum_id, slum_name, cluster_number], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add slum", error: err });
    }

    res.json({
      message: "Slum added successfully",
      slum: { id: result.insertId,slum_id, slum_name, cluster_number },
    });
  });
};

// 🔹 Get All Clusters
exports.getAllSlums = (req, res) => {
  const sql = 'SELECT * FROM slums ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch clusters', error: err });
    res.json(results);
  });
};

// 🔹 Update Slum
exports.updateSlum = (req, res) => {
  const { id } = req.params;            // Slum record ID (Primary Key)
  const { slum_id, slum_name, cluster_number } = req.body;

  // ✅ Validation
  if (!slum_id || !slum_name || !cluster_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    UPDATE slums 
    SET slum_id = ?, slum_name = ?, cluster_number = ?
    WHERE id = ?
  `;

  db.query(sql, [slum_id, slum_name, cluster_number, id], (err, result) => {
    if (err) {
      console.error("Update Slum Error:", err);
      return res.status(500).json({ message: "Failed to update slum", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Slum not found" });
    }

    res.json({
      message: "Slum updated successfully",
      slum: { id, slum_id, slum_name, cluster_number },
    });
  });
};

// 🔍 Get Single Slum by ID
exports.getSlum = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM slums WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Get Slum Error:", err);
      return res.status(500).json({ message: "Failed to fetch slum", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Slum not found" });
    }

    res.json(results[0]);
  });
};

