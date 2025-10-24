const db = require('../config/db');

exports.insertVillageDataBatch = (data) => {
  return new Promise((resolve, reject) => {
    const values = data.map(item => [item.village, item.taluka, item.district]);
    const sql = 'INSERT INTO village_data (village, taluka, district) VALUES ?';
    db.query(sql, [values], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getAllDistricts = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT DISTINCT district FROM district_taluka', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.getTalukasByDistrict = (district) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT DISTINCT taluka FROM district_taluka WHERE district = ?', [district], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.getVillagesByTaluka = (taluka) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT village FROM village_data WHERE taluka = ?', [taluka], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

