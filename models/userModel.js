
const db = require('../config/db');


exports.findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.insertUser = (user, callback) => {
  db.query('INSERT INTO users SET ?', user, callback);
};

exports.insertLog = (log, callback) => {
  db.query('INSERT INTO logs SET ?', log, callback);
};

exports.findUserById = (id, callback) => {
  db.query('SELECT id, user_id, name, email, role, district, taluka FROM users WHERE id = ?', [id], callback);
};

exports.updateUserProfile = (id, data, callback) => {
  let fields = [];
  let values = [];

  if (data.name) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.password) {
    fields.push('password = ?');
    values.push(data.password);
  }

  if (fields.length === 0) {
    return callback(new Error('No fields to update'), null);
  }

  const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, callback);
};
