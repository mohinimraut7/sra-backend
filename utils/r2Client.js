// r2Client.js
const { S3Client } = require("@aws-sdk/client-s3");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
const https = require("https");
const crypto = require("crypto");

// Windows Node 20 Compatible HTTPS Agent
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 90000,
  
  // Use TLS 1.2 for better compatibility
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3', // Allow 1.3 as fallback
  
  // Standard secure ciphers
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
  ].join(':'),
  
  honorCipherOrder: true,
  rejectUnauthorized: true,
  
  // Proper session timeout (in seconds)
  sessionTimeout: 300,
  
  // Disable old SSL/TLS versions
  secureOptions: crypto.constants.SSL_OP_NO_SSLv2 
    | crypto.constants.SSL_OP_NO_SSLv3
    | crypto.constants.SSL_OP_NO_TLSv1
    | crypto.constants.SSL_OP_NO_TLSv1_1,
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  requestHandler: new NodeHttpHandler({
    httpsAgent,
    connectionTimeout: 30000,
    requestTimeout: 90000,
  }),
  forcePathStyle: true,
  maxAttempts: 5,
  retryMode: "adaptive",
});

module.exports = r2;