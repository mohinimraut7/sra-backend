const db = require('../config/db');

// 🔹 Add New Hut
exports.addHut = (req, res) => {
  const { hut_id, hut_name, hut_use, hut_floor, ownership_of_hut_land, slum_id } = req.body;

  // Validation
  if (!hut_id || !hut_name || !hut_use || !hut_floor || !ownership_of_hut_land || !slum_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO huts (hut_id, hut_name, hut_use, hut_floor, ownership_of_hut_land, slum_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [hut_id, hut_name, hut_use, hut_floor, ownership_of_hut_land, slum_id], (err, result) => {
    if (err) {
      console.error("Error adding hut:", err);
      return res.status(500).json({ message: "Failed to add hut", error: err });
    }

    res.json({
      message: "Hut added successfully",
      hut: { id: result.insertId, hut_id, hut_name, hut_use, hut_floor, ownership_of_hut_land, slum_id },
    });
  });
};

// 🔹 Get All Huts
exports.getAllHuts = (req, res) => {
  const sql = `
    SELECT * FROM huts ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching huts:", err);
      return res.status(500).json({ message: "Failed to fetch huts", error: err });
    }

    res.json(results);
  });
};
