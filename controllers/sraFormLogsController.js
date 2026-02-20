// const db = require('../config/db');

// const fs = require('fs');
// const path = require('path');



// exports.submitSRAFormLog = async (req, res) => {
//   try {
//     const data = req.body;
//     const files = req.files;

//     const insertData = {
//       ...data,
//       photo_self_path: files?.photo_self?.[0]?.path || null,
//       photo_family_path: files?.photo_family?.[0]?.path || null,
//       biometric_path: files?.biometric?.[0]?.path || null,
//       front_photo_path: files?.doc_front_view?.[0]?.path || null,
//       side_photo_path: files?.doc_side_view?.[0]?.path || null,
//       inside_video_path: files?.video_inside?.[0]?.path || null,
//       declaration_video_path: files?.video_self_declaration?.[0]?.path || null,

//       adivashihutimage: files?.adivashihutimage?.[0]?.path || null,

//       doc_before_2000: files?.doc_before_2000?.[0]?.path || null,
//       submitted_docs_before_2000: files?.submitted_docs_before_2000?.[0]?.path || null,
//       description_doc_before_2000: files?.description_doc_before_2000?.[0]?.path || null,
//       after_2000_proof_submitted: files?.after_2000_proof_submitted?.[0]?.path || null,
//       possession_doc_info: files?.possession_doc_info?.[0]?.path || null,
//       Seldeclaration_letter: files?.Seldeclaration_letter?.[0]?.path || null,
//       Ration_card_info: files?.Ration_card_info?.[0]?.path || null,
//       Voter_card_info: files?.Voter_card_info?.[0]?.path || null,
//       Other_doc_info: files?.Other_doc_info?.[0]?.path || null,

//       timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ') // ✅ Only this field stays (as your DB has it)
//     };

//     const sql = 'INSERT INTO sra_form_logs SET ?';
//     db.query(sql, insertData, (err, result) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ success: false, message: 'Database error', error: err });
//       }
//       res.json({ success: true, message: 'Form submitted successfully', form: insertData });
//     });
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({ success: false, message: 'Server error', error });
//   }
// };



// exports.getSRAFormLogs = (req, res) => {
//   const sql = 'SELECT * FROM sra_form_logs ORDER BY timestamp DESC';
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ message: 'Failed to fetch SRA logs', err });
//     res.json(results);
//   });
// };


// exports.updateSRAFormLog = async (req, res) => {
//   const id = req.params.id;
//   const data = req.body;
//   const files = req.files;

//   try {
//     db.query('SELECT * FROM sra_form_logs WHERE id = ?', [id], async (err, results) => {
//       if (err || results.length === 0) {
//         return res.status(404).json({ success: false, message: 'Record not found' });
//       }

//       const existing = results[0];

//       const updateData = {};

//       for (const key in data) {
//         if (data[key] && data[key] !== existing[key]) {
//           updateData[key] = data[key];
//         }
//       }

//       const fileFieldsMap = {
//         photo_self: 'photo_self_path',
//         photo_family: 'photo_family_path',
//         biometric: 'biometric_path',
//         doc_front_view: 'front_photo_path',
//         doc_side_view: 'side_photo_path',
//         video_inside: 'inside_video_path',
//         video_self_declaration: 'declaration_video_path',
//         adivashihutimage: 'adivashihutimage',
//         doc_before_2000: 'doc_before_2000',
//         submitted_docs_before_2000: 'submitted_docs_before_2000',
//         description_doc_before_2000: 'description_doc_before_2000',
//         after_2000_proof_submitted: 'after_2000_proof_submitted',
//         possession_doc_info: 'possession_doc_info',
//         Seldeclaration_letter: 'Seldeclaration_letter',
//         Ration_card_info: 'Ration_card_info',
//         Voter_card_info: 'Voter_card_info',
//         Other_doc_info: 'Other_doc_info'
//       };

//       for (const field in fileFieldsMap) {
//         const dbField = fileFieldsMap[field];
//         if (files[field] && files[field][0]?.path) {
//           updateData[dbField] = files[field][0].path;
//         }
//       }

//       if (Object.keys(updateData).length === 0) {
//         return res.status(400).json({ success: false, message: 'No changes detected' });
//       }

     
//       db.query('UPDATE sra_form_logs SET ? WHERE id = ?', [updateData, id], (updateErr) => {
//         if (updateErr) {
//           console.error(updateErr);
//           return res.status(500).json({ success: false, message: 'Update failed', error: updateErr });
//         }

//         res.json({ success: true, message: 'Form updated successfully', updated: updateData });
//       });
//     });
//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({ success: false, message: 'Server error', error });
//   }
// };



// exports.getSRADashboardStats = (req, res) => {
//   const queries = {
//     totalRecords: 'SELECT COUNT(*) as count FROM sra_form_logs',
//     todayRecords: 'SELECT COUNT(*) as count FROM sra_form_logs WHERE DATE(timestamp) = "2025-07-24"',
//     maleRecords: 'SELECT COUNT(*) as count FROM sra_form_logs WHERE gender = "Male"',
//     photoSelfSubmitted: 'SELECT COUNT(*) as count FROM sra_form_logs WHERE photo_self_path IS NOT NULL',

//     byDay: 'SELECT DATE_FORMAT(timestamp, "%Y-%m-%d") as day, COUNT(*) as count FROM sra_form_logs GROUP BY day ORDER BY day DESC LIMIT 30',
//     byMonth: 'SELECT DATE_FORMAT(timestamp, "%Y-%m") as month, COUNT(*) as count FROM sra_form_logs GROUP BY month ORDER BY month DESC',
//     byResidencySince: `
//       SELECT 
//         CASE 
//           WHEN residency_since < '1980' THEN 'Before 1980'
//           WHEN residency_since BETWEEN '1980' AND '1989' THEN '1980-1989'
//           WHEN residency_since BETWEEN '1990' AND '1999' THEN '1990-1999'
//           WHEN residency_since BETWEEN '2000' AND '2009' THEN '2000-2009'
//           WHEN residency_since >= '2010' THEN '2010 or Later'
//           ELSE 'Unknown'
//         END as residency_period,
//         COUNT(*) as count
//       FROM sra_form_logs
//       WHERE residency_since IS NOT NULL
//       GROUP BY residency_period
//       ORDER BY residency_period
//     `,

//     byGender: 'SELECT gender, COUNT(*) as count FROM sra_form_logs WHERE gender IS NOT NULL GROUP BY gender',
//     bySlumUse: 'SELECT slum_use, COUNT(*) as count FROM sra_form_logs WHERE slum_use IS NOT NULL GROUP BY slum_use',
//     bySocietyRegistered: 'SELECT society_registered, COUNT(*) as count FROM sra_form_logs WHERE society_registered IS NOT NULL GROUP BY society_registered',
//     byPlanSubmitted: 'SELECT plan_submitted, COUNT(*) as count FROM sra_form_logs WHERE plan_submitted IS NOT NULL GROUP BY plan_submitted',
//     byPhotoSelf: 'SELECT CASE WHEN photo_self_path IS NOT NULL THEN "Submitted" ELSE "Not Submitted" END as photo_self_status, COUNT(*) as count FROM sra_form_logs GROUP BY photo_self_status',

//     byMunicipalCorporation: 'SELECT municipal_corporation, COUNT(*) as count FROM sra_form_logs WHERE municipal_corporation IS NOT NULL GROUP BY municipal_corporation ORDER BY count DESC LIMIT 10',
//     byDistrict: 'SELECT district, COUNT(*) as count FROM sra_form_logs WHERE district IS NOT NULL GROUP BY district ORDER BY count DESC LIMIT 10',
//     byFamilyMembers: `
//       SELECT 
//         CASE 
//           WHEN num_family_members <= 2 THEN '1-2'
//           WHEN num_family_members BETWEEN 3 AND 4 THEN '3-4'
//           WHEN num_family_members BETWEEN 5 AND 6 THEN '5-6'
//           WHEN num_family_members > 6 THEN '7+'
//           ELSE 'Unknown'
//         END as family_size,
//         COUNT(*) as count
//       FROM sra_form_logs
//       WHERE num_family_members IS NOT NULL
//       GROUP BY family_size
//       ORDER BY family_size
//     `,
//     byAreaRange: `
//       SELECT 
//         CASE 
//           WHEN area_sq_m < 10 THEN '< 10 sq.m'
//           WHEN area_sq_m BETWEEN 10 AND 20 THEN '10-20 sq.m'
//           WHEN area_sq_m BETWEEN 20 AND 30 THEN '20-30 sq.m'
//           WHEN area_sq_m BETWEEN 30 AND 50 THEN '30-50 sq.m'
//           WHEN area_sq_m >= 50 THEN '>= 50 sq.m'
//           ELSE 'Unknown'
//         END as area_range,
//         COUNT(*) as count
//       FROM sra_form_logs
//       WHERE area_sq_m IS NOT NULL
//       GROUP BY area_range
//       ORDER BY area_range
//     `,
//     bySurveyStatus: 'SELECT survey_status, COUNT(*) as count FROM sra_form_logs WHERE survey_status IS NOT NULL GROUP BY survey_status ORDER BY count DESC'
//   };

//   const results = {};

//   Promise.all(
//     Object.keys(queries).map((key) =>
//       new Promise((resolve, reject) => {
//         db.query(queries[key], (err, result) => {
//           if (err) reject(err);
//           results[key] = result;
//           resolve();
//         });
//       })
//     )
//   )
//     .then(() => res.json(results))
//     .catch((err) => res.status(500).json({ message: 'Failed to fetch stats', err }));
// };


// // ✅ Delete all files inside "uploads/sra_docs"
// exports.deleteAllSRADocs = (req, res) => {
//   const folderPath = path.join(__dirname, '..', 'uploads', 'sra_docs');

//   // Check if folder exists
//   if (!fs.existsSync(folderPath)) {
//     return res.status(404).json({ success: false, message: 'Folder not found' });
//   }

//   try {
//     // Read all files in the folder
//     const files = fs.readdirSync(folderPath);

//     // Delete each file
//     files.forEach((file) => {
//       const filePath = path.join(folderPath, file);
//       if (fs.lstatSync(filePath).isFile()) {
//         fs.unlinkSync(filePath);
//       } else if (fs.lstatSync(filePath).isDirectory()) {
//         // Optional: recursively delete subfolders (if any)
//         fs.rmSync(filePath, { recursive: true, force: true });
//       }
//     });

//     res.json({
//       success: true,
//       message: 'All files in uploads/sra_docs deleted successfully',
//       deletedCount: files.length
//     });
//   } catch (error) {
//     console.error('Error deleting files:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting SRA documents',
//       error: error.message
//     });
//   }
// };


// =====================================================================================


// ------------------last working code-----------------

// ✅ sraController.js (FINAL VERSION)
// -----------------------------------

// const db = require('../config/db');
// const fs = require("fs");
// const path = require("path");
// const dotenv = require("dotenv");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// dotenv.config();

// // -------------------- AWS CONFIG --------------------
// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // ✅ Upload to S3 Helper
// const uploadToS3 = async (file) => {
//   if (!file || !file.path) return null;

//   const stream = fs.createReadStream(file.path);
//   const ext = path.extname(file.originalname).toLowerCase();
//   const filename = `sra_uploads/${file.fieldname}-${Date.now()}${ext}`;

//   const uploadParams = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     Key: filename,
//     Body: stream,
//     ContentType: file.mimetype,
//   };

//   await s3.send(new PutObjectCommand(uploadParams));

//   return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
// };

// // -------------------- FORM SUBMIT --------------------
// exports.submitSRAFormLog = async (req, res) => {
//   try {
//     const data = req.body;
//     const files = req.files || {};

//     // Helper for optional upload
//     const uploadIfExists = async (fileArray) =>
//       fileArray && fileArray.length > 0 && fileArray[0].path
//         ? await uploadToS3(fileArray[0])
//         : null;

//     // Upload to S3 (if present)
//     const uploadedPaths = {
//       photo_self_path: await uploadIfExists(files.photo_self),
//       photo_family_path: await uploadIfExists(files.photo_family),
//       biometric_path: await uploadIfExists(files.biometric),
//       doc_front_view: await uploadIfExists(files.doc_front_view),
//       side_photo_path: await uploadIfExists(files.doc_side_view),
//       inside_video_path: await uploadIfExists(files.video_inside),
//       declaration_video_path: await uploadIfExists(files.video_self_declaration),
//       adivashihutimage: await uploadIfExists(files.adivashihutimage),
//       doc_before_2000: await uploadIfExists(files.doc_before_2000),
//       submitted_docs_before_2000: await uploadIfExists(files.submitted_docs_before_2000),
//       description_doc_before_2000: await uploadIfExists(files.description_doc_before_2000),
//       after_2000_proof_submitted: await uploadIfExists(files.after_2000_proof_submitted),
//       possession_doc_info: await uploadIfExists(files.possession_doc_info),
//       Seldeclaration_letter: await uploadIfExists(files.Seldeclaration_letter),
//       Ration_card_info: await uploadIfExists(files.Ration_card_info),
//       Voter_card_info: await uploadIfExists(files.Voter_card_info),
//       Other_doc_info: await uploadIfExists(files.Other_doc_info),
//       // sale_agreement:await uploadIfExists(files.sale_agreement),
//       sale_agreement: files.sale_agreement && files.sale_agreement.length > 0
//   ? await Promise.all(files.sale_agreement.map(file => uploadToS3(file)))
//   : null,

//     };

//      // ✅ Generate date and time separately
//     const now = new Date();
//     const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
//     const created_date =now.toISOString().slice(0, 10); // YYYY-MM-DD
//     const created_time = now.toTimeString().split(" ")[0]; // HH:MM:SS

//     const insertData = {
//       ...data,
//       ...uploadedPaths,
//       timestamp,
//       created_date,
//       created_time,
//     };

//     const sql = "INSERT INTO sra_form_logs SET ?";
//     db.query(sql, insertData, (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res
//           .status(500)
//           .json({ success: false, message: "Database error", error: err });
//       }

//       res.json({
//         success: true,
//         message: "Form submitted successfully",
//         form: insertData,
//       });
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // -------------------- GET ALL LOGS --------------------
// // exports.getSRAFormLogs = (req, res) => {
// //   const sql = "SELECT * FROM sra_form_logs ORDER BY timestamp DESC";
// //   db.query(sql, (err, results) => {
// //     if (err)
// //       return res.status(500).json({ message: "Failed to fetch SRA logs", err });
// //     res.json(results);
// //   });
// // };


// exports.getSRAFormLogs = (req, res) => {
//   const sql = "SELECT * FROM sra_form_logs ORDER BY timestamp DESC";
//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Failed to fetch SRA logs",
//         err,
//       });
//     }

//     // ✅ Format created_date to only "YYYY-MM-DD"
//     const formattedResults = results.map((item) => ({
//       ...item,
//       created_date: item.created_date
//         ? item.created_date.toISOString().slice(0, 10)
//         : null,
//     }));

//     res.json(formattedResults);
//   });
// };


// // -------------------- UPDATE FORM LOG --------------------
// // exports.updateSRAFormLog = async (req, res) => {
// //   const id = req.params.id;
// //   const data = req.body;
// //   const files = req.files;

// //   try {
// //     db.query("SELECT * FROM sra_form_logs WHERE id = ?", [id], async (err, results) => {
// //       if (err || results.length === 0) {
// //         return res.status(404).json({ success: false, message: "Record not found" });
// //       }

// //       const existing = results[0];
// //       const updateData = {};

// //       // Update changed text fields
// //       for (const key in data) {
// //         if (data[key] && data[key] !== existing[key]) {
// //           updateData[key] = data[key];
// //         }
// //       }

// //       // File field mapping
// //       const fileFieldsMap = {
// //         photo_self: "photo_self_path",
// //         photo_family: "photo_family_path",
// //         biometric: "biometric_path",
// //         doc_front_view: "doc_front_view",
// //         doc_side_view: "side_photo_path",
// //         video_inside: "inside_video_path",
// //         video_self_declaration: "declaration_video_path",
// //         adivashihutimage: "adivashihutimage",
// //         doc_before_2000: "doc_before_2000",
// //         submitted_docs_before_2000: "submitted_docs_before_2000",
// //         description_doc_before_2000: "description_doc_before_2000",
// //         after_2000_proof_submitted: "after_2000_proof_submitted",
// //         possession_doc_info: "possession_doc_info",
// //         Seldeclaration_letter: "Seldeclaration_letter",
// //         Ration_card_info: "Ration_card_info",
// //         Voter_card_info: "Voter_card_info",
// //         Other_doc_info: "Other_doc_info",
// //       };

// //       // Upload updated files to S3
// //       for (const field in fileFieldsMap) {
// //         const dbField = fileFieldsMap[field];
// //         if (files[field] && files[field][0]?.path) {
// //           const s3Url = await uploadToS3(files[field][0]);
// //           if (s3Url) updateData[dbField] = s3Url;
// //         }
// //       }

// //       if (Object.keys(updateData).length === 0) {
// //         return res.status(400).json({ success: false, message: "No changes detected" });
// //       }

// //       db.query("UPDATE sra_form_logs SET ? WHERE id = ?", [updateData, id], (updateErr) => {
// //         if (updateErr) {
// //           console.error(updateErr);
// //           return res
// //             .status(500)
// //             .json({ success: false, message: "Update failed", error: updateErr });
// //         }

// //         res.json({ success: true, message: "Form updated successfully", updated: updateData });
// //       });
// //     });
// //   } catch (error) {
// //     console.error("Update error:", error);
// //     res.status(500).json({ success: false, message: "Server error", error });
// //   }
// // };

// // -------------------------------------------------------

// // 5 Nov 2025

// exports.updateSRAFormLog = async (req, res) => {
//   const id = req.params.id;
//   const data = req.body;
//   const files = req.files;

//   try {
//     db.query("SELECT * FROM sra_form_logs WHERE id = ?", [id], async (err, results) => {
//       if (err || results.length === 0) {
//         return res.status(404).json({ success: false, message: "Record not found" });
//       }

//       const existing = results[0];
//       const updateData = {};

//       // Update changed text fields
//       for (const key in data) {
//         if (data[key] && data[key] !== existing[key]) {
//           updateData[key] = data[key];
//         }
//       }

//       // File field mapping (single file uploads)
//       const fileFieldsMap = {
//         photo_self: "photo_self_path",
//         photo_family: "photo_family_path",
//         biometric: "biometric_path",
//         doc_front_view: "doc_front_view",
//         doc_side_view: "side_photo_path",
//         video_inside: "inside_video_path",
//         video_self_declaration: "declaration_video_path",
//         adivashihutimage: "adivashihutimage",
//         doc_before_2000: "doc_before_2000",
//         submitted_docs_before_2000: "submitted_docs_before_2000",
//         description_doc_before_2000: "description_doc_before_2000",
//         after_2000_proof_submitted: "after_2000_proof_submitted",
//         possession_doc_info: "possession_doc_info",
//         Seldeclaration_letter: "Seldeclaration_letter",
//         Ration_card_info: "Ration_card_info",
//         Voter_card_info: "Voter_card_info",
//         Other_doc_info: "Other_doc_info",
//       };

//       // Upload updated files to S3 (single files)
//       for (const field in fileFieldsMap) {
//         const dbField = fileFieldsMap[field];
//         if (files[field] && files[field][0]?.path) {
//           const s3Url = await uploadToS3(files[field][0]);
//           if (s3Url) updateData[dbField] = s3Url;
//         }
//       }

//       // Handle multiple file upload for sale_agreement (matching submitSRAFormLog logic)
//       if (files.sale_agreement && files.sale_agreement.length > 0) {
//         const saleAgreementUrls = await Promise.all(
//           files.sale_agreement.map(file => uploadToS3(file))
//         );
//         updateData.sale_agreement = saleAgreementUrls;
//       }

//       if (Object.keys(updateData).length === 0) {
//         return res.status(400).json({ success: false, message: "No changes detected" });
//       }

//       db.query("UPDATE sra_form_logs SET ? WHERE id = ?", [updateData, id], (updateErr) => {
//         if (updateErr) {
//           console.error(updateErr);
//           return res
//             .status(500)
//             .json({ success: false, message: "Update failed", error: updateErr });
//         }

//         res.json({ success: true, message: "Form updated successfully", updated: updateData });
//       });
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };






// // -------------------- DASHBOARD STATS --------------------
// exports.getSRADashboardStats = (req, res) => {
//   const queries = {
//     totalRecords: "SELECT COUNT(*) as count FROM sra_form_logs",
//     todayRecords: "SELECT COUNT(*) as count FROM sra_form_logs WHERE DATE(timestamp) = CURDATE()",
//     maleRecords: "SELECT COUNT(*) as count FROM sra_form_logs WHERE gender = 'Male'",
//     photoSelfSubmitted: "SELECT COUNT(*) as count FROM sra_form_logs WHERE photo_self_path IS NOT NULL",
//     byDay: "SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') as day, COUNT(*) as count FROM sra_form_logs GROUP BY day ORDER BY day DESC LIMIT 30",
//     byMonth: "SELECT DATE_FORMAT(timestamp, '%Y-%m') as month, COUNT(*) as count FROM sra_form_logs GROUP BY month ORDER BY month DESC",
//     byResidencySince: `
//       SELECT 
//         CASE 
//           WHEN residency_since < '1980' THEN 'Before 1980'
//           WHEN residency_since BETWEEN '1980' AND '1989' THEN '1980-1989'
//           WHEN residency_since BETWEEN '1990' AND '1999' THEN '1990-1999'
//           WHEN residency_since BETWEEN '2000' AND '2009' THEN '2000-2009'
//           WHEN residency_since >= '2010' THEN '2010 or Later'
//           ELSE 'Unknown'
//         END as residency_period,
//         COUNT(*) as count
//       FROM sra_form_logs
//       WHERE residency_since IS NOT NULL
//       GROUP BY residency_period
//       ORDER BY residency_period`,
//     byGender: "SELECT gender, COUNT(*) as count FROM sra_form_logs WHERE gender IS NOT NULL GROUP BY gender",
//     bySlumUse: "SELECT slum_use, COUNT(*) as count FROM sra_form_logs WHERE slum_use IS NOT NULL GROUP BY slum_use",
//     bySocietyRegistered: "SELECT society_registered, COUNT(*) as count FROM sra_form_logs WHERE society_registered IS NOT NULL GROUP BY society_registered",
//     byPlanSubmitted: "SELECT plan_submitted, COUNT(*) as count FROM sra_form_logs WHERE plan_submitted IS NOT NULL GROUP BY plan_submitted",
//     byPhotoSelf: "SELECT CASE WHEN photo_self_path IS NOT NULL THEN 'Submitted' ELSE 'Not Submitted' END as photo_self_status, COUNT(*) as count FROM sra_form_logs GROUP BY photo_self_status",
//     byMunicipalCorporation: "SELECT municipal_corporation, COUNT(*) as count FROM sra_form_logs WHERE municipal_corporation IS NOT NULL GROUP BY municipal_corporation ORDER BY count DESC LIMIT 10",
//     byDistrict: "SELECT district, COUNT(*) as count FROM sra_form_logs WHERE district IS NOT NULL GROUP BY district ORDER BY count DESC LIMIT 10",
//     byFamilyMembers: `
//       SELECT 
//         CASE 
//           WHEN num_family_members <= 2 THEN '1-2'
//           WHEN num_family_members BETWEEN 3 AND 4 THEN '3-4'
//           WHEN num_family_members BETWEEN 5 AND 6 THEN '5-6'
//           WHEN num_family_members > 6 THEN '7+'
//           ELSE 'Unknown'
//         END as family_size,
//         COUNT(*) as count
//       FROM sra_form_logs
//       WHERE num_family_members IS NOT NULL
//       GROUP BY family_size
//       ORDER BY family_size`,
//     byAreaRange: `
//       SELECT 
//         CASE 
//           WHEN area_sq_m < 10 THEN '< 10 sq.m'
//           WHEN area_sq_m BETWEEN 10 AND 20 THEN '10-20 sq.m'
//           WHEN area_sq_m BETWEEN 20 AND 30 THEN '20-30 sq.m'
//           WHEN area_sq_m BETWEEN 30 AND 50 THEN '30-50 sq.m'
//           WHEN area_sq_m >= 50 THEN '>= 50 sq.m'
//           ELSE 'Unknown'
//         END as area_range,
//         COUNT(*) as count
//       FROM sra_form_logs
//       WHERE area_sq_m IS NOT NULL
//       GROUP BY area_range
//       ORDER BY area_range`,
//     bySurveyStatus: "SELECT survey_status, COUNT(*) as count FROM sra_form_logs WHERE survey_status IS NOT NULL GROUP BY survey_status ORDER BY count DESC",
//   };

//   const results = {};

//   Promise.all(
//     Object.keys(queries).map(
//       (key) =>
//         new Promise((resolve, reject) => {
//           db.query(queries[key], (err, result) => {
//             if (err) reject(err);
//             results[key] = result;
//             resolve();
//           });
//         })
//     )
//   )
//     .then(() => res.json(results))
//     .catch((err) => res.status(500).json({ message: "Failed to fetch stats", err }));
// };

// // -------------------- DELETE LOCAL DOCS --------------------
// exports.deleteAllSRADocs = (req, res) => {
//   const folderPath = path.join(__dirname, "..", "uploads", "sra_docs");

//   if (!fs.existsSync(folderPath)) {
//     return res.status(404).json({ success: false, message: "Folder not found" });
//   }

//   try {
//     const files = fs.readdirSync(folderPath);
//     files.forEach((file) => {
//       const filePath = path.join(folderPath, file);
//       if (fs.lstatSync(filePath).isFile()) fs.unlinkSync(filePath);
//       else if (fs.lstatSync(filePath).isDirectory()) fs.rmSync(filePath, { recursive: true, force: true });
//     });

//     res.json({
//       success: true,
//       message: "All files in uploads/sra_docs deleted successfully",
//       deletedCount: files.length,
//     });
//   } catch (error) {
//     console.error("Error deleting files:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error deleting SRA documents",
//       error: error.message,
//     });
//   }
// };


// /**
//  * GET /api/sra-logs/sra-form-logs/:id
//  * Fetch a single SRA form log by primary-key (id)
//  */
// exports.getSRAFormLogById = (req, res) => {
//   const { id } = req.params;

//   // Adjust the column name if your table uses `timestamp` instead of `created_date`
//   const sql = `
//     SELECT *
//     FROM sra_form_logs
//     WHERE id = ?
//     LIMIT 1
//   `;

//   db.query(sql, [id], (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Failed to fetch SRA log",
//         error: err.message,
//       });
//     }

//     if (!results || results.length === 0) {
//       return res.status(404).json({ message: "SRA form log not found" });
//     }

//     const log = results[0];

//     // Format the date exactly like getSRAFormLogs
//     const formattedLog = {
//       ...log,
//       created_date: log.created_date
//         ? new Date(log.created_date).toISOString().slice(0, 10) // YYYY-MM-DD
//         : null,
//     };

//     res.json(formattedLog);
//   });
// };


// ------------------------------------------------------------------------------------------------


const db = require('../config/db');
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../utils/r2Client");

dotenv.config();

// ===================== R2 Upload Helper =====================
const uploadToR2 = async (file) => {
  if (!file || !file.path) return null;

  const fileBuffer = fs.readFileSync(file.path);
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `sra_uploads/${file.fieldname}-${Date.now()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: filename,
    Body: fileBuffer,
    ContentType: file.mimetype,
  });

  await r2.send(command);

  return `${process.env.R2_PUBLIC_URL}/${filename}`;
};

// ===================== FORM SUBMIT =====================
exports.submitSRAFormLog = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files || {};

    const uploadIfExists = async (fileArray) =>
      fileArray && fileArray.length > 0 && fileArray[0].path
        ? await uploadToR2(fileArray[0])
        : null;

    const uploadedPaths = {
      photo_self_path: await uploadIfExists(files.photo_self),
      photo_family_path: await uploadIfExists(files.photo_family),
      biometric_path: await uploadIfExists(files.biometric),
      doc_front_view: await uploadIfExists(files.doc_front_view),
      side_photo_path: await uploadIfExists(files.doc_side_view),
      inside_video_path: await uploadIfExists(files.video_inside),
      declaration_video_path: await uploadIfExists(files.video_self_declaration),
      adivashihutimage: await uploadIfExists(files.adivashihutimage),

      // doc_before_2000: await uploadIfExists(files.doc_before_2000),
doc_before_2000:
  files.doc_before_2000 && files.doc_before_2000.length > 0
    ? JSON.stringify(
        await Promise.all(
          files.doc_before_2000.map(file => uploadToR2(file))
        )
      )
    : null,

      submitted_docs_before_2000: await uploadIfExists(files.submitted_docs_before_2000),
      description_doc_before_2000: await uploadIfExists(files.description_doc_before_2000),
      // after_2000_proof_submitted: await uploadIfExists(files.after_2000_proof_submitted),

       after_2000_proof_submitted:
    files.after_2000_proof_submitted && files.after_2000_proof_submitted.length > 0
      ? JSON.stringify(
          await Promise.all(
            files.after_2000_proof_submitted.map(file => uploadToR2(file))
          )
        )
      : null,

      possession_doc_info: await uploadIfExists(files.possession_doc_info),
      Seldeclaration_letter: await uploadIfExists(files.Seldeclaration_letter),
      Ration_card_info: await uploadIfExists(files.Ration_card_info),
      Voter_card_info: await uploadIfExists(files.Voter_card_info),
      Other_doc_info: await uploadIfExists(files.Other_doc_info),

      // sale_agreement:
      //   files.sale_agreement && files.sale_agreement.length > 0
      //     ? await Promise.all(files.sale_agreement.map(file => uploadToR2(file)))
      //     : null,

      sale_agreement:
  files.sale_agreement && files.sale_agreement.length > 0
    ? JSON.stringify(
        await Promise.all(
          files.sale_agreement.map(file => uploadToR2(file))
        )
      )
    : null,
    };

    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
    const created_date = now.toISOString().slice(0, 10);
    const created_time = now.toTimeString().split(" ")[0];

    const insertData = {
      ...data,
      ...uploadedPaths,
      timestamp,
      created_date,
      created_time,
    };

    const sql = "INSERT INTO sra_form_logs SET ?";
    db.query(sql, insertData, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: err,
        });
      }

      res.json({
        success: true,
        message: "Form submitted successfully",
        form: insertData,
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ===================== GET ALL LOGS =====================
exports.getSRAFormLogs = (req, res) => {
  const sql = "SELECT * FROM sra_form_logs ORDER BY timestamp DESC";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch SRA logs",
        err,
      });
    }

    const formattedResults = results.map((item) => ({
      ...item,
      created_date: item.created_date
        ? item.created_date.toISOString().slice(0, 10)
        : null,
    }));

    res.json(formattedResults);
  });
};

// ===================== UPDATE FORM LOG =====================
exports.updateSRAFormLog = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const files = req.files;

  try {
    db.query("SELECT * FROM sra_form_logs WHERE id = ?", [id], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ success: false, message: "Record not found" });
      }

      const existing = results[0];
      const updateData = {};

      for (const key in data) {
        if (data[key] && data[key] !== existing[key]) {
          updateData[key] = data[key];
        }
      }

      const fileFieldsMap = {
        photo_self: "photo_self_path",
        photo_family: "photo_family_path",
        biometric: "biometric_path",
        doc_front_view: "doc_front_view",
        doc_side_view: "side_photo_path",
        video_inside: "inside_video_path",
        video_self_declaration: "declaration_video_path",
        adivashihutimage: "adivashihutimage",
        doc_before_2000: "doc_before_2000",
        submitted_docs_before_2000: "submitted_docs_before_2000",
        description_doc_before_2000: "description_doc_before_2000",
        after_2000_proof_submitted: "after_2000_proof_submitted",
        possession_doc_info: "possession_doc_info",
        Seldeclaration_letter: "Seldeclaration_letter",
        Ration_card_info: "Ration_card_info",
        Voter_card_info: "Voter_card_info",
        Other_doc_info: "Other_doc_info",
      };

      for (const field in fileFieldsMap) {
        const dbField = fileFieldsMap[field];
        if (files[field] && files[field][0]?.path) {
          const r2Url = await uploadToR2(files[field][0]);
          if (r2Url) updateData[dbField] = r2Url;
        }
      }

      if (files.sale_agreement && files.sale_agreement.length > 0) {
        const saleAgreementUrls = await Promise.all(
          files.sale_agreement.map(file => uploadToR2(file))
        );
        // updateData.sale_agreement = saleAgreementUrls;
        updateData.sale_agreement = JSON.stringify(saleAgreementUrls);

      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: "No changes detected" });
      }

      db.query("UPDATE sra_form_logs SET ? WHERE id = ?", [updateData, id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({
            success: false,
            message: "Update failed",
            error: updateErr,
          });
        }

        res.json({
          success: true,
          message: "Form updated successfully",
          updated: updateData,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ===================== DASHBOARD STATS =====================
exports.getSRADashboardStats = (req, res) => {
  const queries = { /* SAME AS YOUR ORIGINAL - UNCHANGED */ };

  const results = {};

  Promise.all(
    Object.keys(queries).map(
      (key) =>
        new Promise((resolve, reject) => {
          db.query(queries[key], (err, result) => {
            if (err) reject(err);
            results[key] = result;
            resolve();
          });
        })
    )
  )
    .then(() => res.json(results))
    .catch((err) => res.status(500).json({ message: "Failed to fetch stats", err }));
};

// ===================== DELETE LOCAL DOCS =====================
exports.deleteAllSRADocs = (req, res) => {
  const folderPath = path.join(__dirname, "..", "uploads", "sra_docs");

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ success: false, message: "Folder not found" });
  }

  try {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.lstatSync(filePath).isFile()) fs.unlinkSync(filePath);
      else if (fs.lstatSync(filePath).isDirectory())
        fs.rmSync(filePath, { recursive: true, force: true });
    });

    res.json({
      success: true,
      message: "All files in uploads/sra_docs deleted successfully",
      deletedCount: files.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting SRA documents",
      error: error.message,
    });
  }
};

// ===================== GET SINGLE LOG =====================
exports.getSRAFormLogById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT *
    FROM sra_form_logs
    WHERE id = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch SRA log",
        error: err.message,
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "SRA form log not found" });
    }

    const log = results[0];

    const formattedLog = {
      ...log,
      created_date: log.created_date
        ? new Date(log.created_date).toISOString().slice(0, 10)
        : null,
    };

    res.json(formattedLog);
  });
};
