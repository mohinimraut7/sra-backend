
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, insertUser, insertLog } = require('../models/userModel');
const db = require('../config/db');

function generateUniqueUserId() {
  const now = new Date();
  const yyyyMMdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.getTime(); // milliseconds since epoch
  const random = Math.floor(Math.random() * 1000); // 0–999
  return `Slum_${yyyyMMdd}${time % 100000}${random}`;
}

exports.register = async (req, res) => {
  const { name, email, password, role, district, taluka } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const uniqueUserId = generateUniqueUserId();

  const user = {
    name,
    email,
    password: hashedPassword,
    role,
    district,
    taluka,
    user_id: uniqueUserId
  };

  const sql = `INSERT INTO users SET ?`;
  db.query(sql, user, (err, result) => {
    if (err) return res.status(500).json({ message: 'Registration failed', err });
    logEvent(email, 'REGISTERED', req);
    res.status(201).json({ message: 'User registered successfully' });
  });
};

exports.login = (req, res) => {
  console.log("fffhfhfhf",process.env.JWT_SECRET)
  const { email, password } = req.body;

  findUserByEmail(email, async (err, results) => {
    if (err || results.length === 0) {
      logEvent(email, 'LOGIN_FAILED', req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      logEvent(email, 'INVALID_PASSWORD', req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        district: user.district,   
        taluka: user.taluka       
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d', issuer: 'wcd.maharashtra.gov.in' }
    );

    logEvent(email, 'LOGIN_SUCCESS', req);
    res.json({ token });
  });
};

exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;
  const userId = req.user.id;

  let sql = 'UPDATE users SET ';
  const values = [];

  if (name) {
    sql += 'name = ?, ';
    values.push(name);
  }

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    sql += 'password = ?, ';
    values.push(hashed);
  }

  sql = sql.slice(0, -2); // remove last comma
  sql += ' WHERE id = ?';
  values.push(userId);

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Update failed', err });
    logEvent(req.user.id, 'PROFILE_UPDATED', req);
    res.json({ message: 'Profile updated successfully' });
  });
};

exports.viewProfile = (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT id, user_id, name, email, role, district, taluka FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
};

function logEvent(emailOrId, action, req) {
  const ip = req.ip || 'unknown';
  const route = req.originalUrl || req.url || 'unknown';
  const userEmail = emailOrId || (req.user?.email ?? 'unknown');

  insertLog({ user_email: userEmail, action, ip_address: ip }, () => { });

  console.log(`📢 ${action} by ${userEmail} from ${ip} on route ${route}`);
}

exports.getAllUsersWithLastLogin = (req, res) => {
  const sql = `
    SELECT 
      u.id,
      u.user_id,
      u.name,
      u.email,
      u.role,
      u.district,
      u.taluka,
      DATE_FORMAT(u.created_at, '%Y-%m-%d') AS created_date,
      DATE_FORMAT(u.created_at, '%H:%i:%s') AS created_time,
      (
        SELECT DATE_FORMAT(MAX(l.timestamp), '%Y-%m-%d')
        FROM logs l 
        WHERE l.user_email = u.email AND l.action = 'LOGIN_SUCCESS'
      ) AS last_login_date,
      (
        SELECT DATE_FORMAT(MAX(l.timestamp), '%H:%i:%s')
        FROM logs l 
        WHERE l.user_email = u.email AND l.action = 'LOGIN_SUCCESS'
      ) AS last_login_time
    FROM users u
    ORDER BY u.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch users', err });
    res.json(results);
  });
};


