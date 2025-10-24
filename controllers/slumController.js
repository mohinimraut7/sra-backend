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
