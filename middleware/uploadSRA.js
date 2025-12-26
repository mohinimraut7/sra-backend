
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads/sra_docs');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.png', '.jpg', '.jpeg', '.pdf', '.mp4'];
  if (!allowed.includes(ext)) {
    return cb(new Error('Only PNG, JPG, JPEG, PDF, and MP4 formats are allowed'), false);
  }
  cb(null, true);
};

const limits = {
  // fileSize: 10 * 1024 * 1024 // 10 MB
  fileSize: 500 * 1024 * 1024 // 10 MB
};

module.exports = multer({ storage, fileFilter, limits });
