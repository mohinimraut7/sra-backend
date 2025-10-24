const connection = require("../config/db"); 

exports.insertDistrictTalukaBatch = (data) => {
  return new Promise((resolve, reject) => {
    const values = data.map((row) => [row.district, row.taluka]);

    connection.query(
      "INSERT INTO district_taluka (district, taluka) VALUES ?",
      [values],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.getAllDistricts = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT DISTINCT district FROM district_taluka",
      (err, results) => {
        if (err) return reject(err);
        resolve(results.map((row) => row.district));
      }
    );
  });
};

exports.getTalukasByDistrict = (district) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT taluka FROM district_taluka WHERE district = ?",
      [district],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};
