const db = require('../config/db');

exports.submitSRAFormLog = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;

    const insertData = {
      ...data,
      photo_self_path: files?.photo_self?.[0]?.path || null,
      photo_family_path: files?.photo_family?.[0]?.path || null,
      biometric_path: files?.biometric?.[0]?.path || null,
      front_photo_path: files?.doc_front_view?.[0]?.path || null,
      side_photo_path: files?.doc_side_view?.[0]?.path || null,
      inside_video_path: files?.video_inside?.[0]?.path || null,
      declaration_video_path: files?.video_self_declaration?.[0]?.path || null,

      adivashihutimage: files?.adivashihutimage?.[0]?.path || null,

      doc_before_2000: files?.doc_before_2000?.[0]?.path || null,
      submitted_docs_before_2000: files?.submitted_docs_before_2000?.[0]?.path || null,
      description_doc_before_2000: files?.description_doc_before_2000?.[0]?.path || null,
      after_2000_proof_submitted: files?.after_2000_proof_submitted?.[0]?.path || null,
      possession_doc_info: files?.possession_doc_info?.[0]?.path || null,
      Seldeclaration_letter: files?.Seldeclaration_letter?.[0]?.path || null,
      Ration_card_info: files?.Ration_card_info?.[0]?.path || null,
      Voter_card_info: files?.Voter_card_info?.[0]?.path || null,
      Other_doc_info: files?.Other_doc_info?.[0]?.path || null,

      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ') // ✅ Only this field stays (as your DB has it)
    };

    const sql = 'INSERT INTO sra_form_logs SET ?';
    db.query(sql, insertData, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error', error: err });
      }
      res.json({ success: true, message: 'Form submitted successfully', form: insertData });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};



exports.getSRAFormLogs = (req, res) => {
  const sql = 'SELECT * FROM sra_form_logs ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch SRA logs', err });
    res.json(results);
  });
};


exports.updateSRAFormLog = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const files = req.files;

  try {
    db.query('SELECT * FROM sra_form_logs WHERE id = ?', [id], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ success: false, message: 'Record not found' });
      }

      const existing = results[0];

      const updateData = {};

      for (const key in data) {
        if (data[key] && data[key] !== existing[key]) {
          updateData[key] = data[key];
        }
      }

      const fileFieldsMap = {
        photo_self: 'photo_self_path',
        photo_family: 'photo_family_path',
        biometric: 'biometric_path',
        doc_front_view: 'front_photo_path',
        doc_side_view: 'side_photo_path',
        video_inside: 'inside_video_path',
        video_self_declaration: 'declaration_video_path',
        adivashihutimage: 'adivashihutimage',
        doc_before_2000: 'doc_before_2000',
        submitted_docs_before_2000: 'submitted_docs_before_2000',
        description_doc_before_2000: 'description_doc_before_2000',
        after_2000_proof_submitted: 'after_2000_proof_submitted',
        possession_doc_info: 'possession_doc_info',
        Seldeclaration_letter: 'Seldeclaration_letter',
        Ration_card_info: 'Ration_card_info',
        Voter_card_info: 'Voter_card_info',
        Other_doc_info: 'Other_doc_info'
      };

      for (const field in fileFieldsMap) {
        const dbField = fileFieldsMap[field];
        if (files[field] && files[field][0]?.path) {
          updateData[dbField] = files[field][0].path;
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ success: false, message: 'No changes detected' });
      }

     
      db.query('UPDATE sra_form_logs SET ? WHERE id = ?', [updateData, id], (updateErr) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ success: false, message: 'Update failed', error: updateErr });
        }

        res.json({ success: true, message: 'Form updated successfully', updated: updateData });
      });
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};



exports.getSRADashboardStats = (req, res) => {
  const queries = {
    totalRecords: 'SELECT COUNT(*) as count FROM sra_form_logs',
    todayRecords: 'SELECT COUNT(*) as count FROM sra_form_logs WHERE DATE(timestamp) = "2025-07-24"',
    maleRecords: 'SELECT COUNT(*) as count FROM sra_form_logs WHERE gender = "Male"',
    photoSelfSubmitted: 'SELECT COUNT(*) as count FROM sra_form_logs WHERE photo_self_path IS NOT NULL',

    byDay: 'SELECT DATE_FORMAT(timestamp, "%Y-%m-%d") as day, COUNT(*) as count FROM sra_form_logs GROUP BY day ORDER BY day DESC LIMIT 30',
    byMonth: 'SELECT DATE_FORMAT(timestamp, "%Y-%m") as month, COUNT(*) as count FROM sra_form_logs GROUP BY month ORDER BY month DESC',
    byResidencySince: `
      SELECT 
        CASE 
          WHEN residency_since < '1980' THEN 'Before 1980'
          WHEN residency_since BETWEEN '1980' AND '1989' THEN '1980-1989'
          WHEN residency_since BETWEEN '1990' AND '1999' THEN '1990-1999'
          WHEN residency_since BETWEEN '2000' AND '2009' THEN '2000-2009'
          WHEN residency_since >= '2010' THEN '2010 or Later'
          ELSE 'Unknown'
        END as residency_period,
        COUNT(*) as count
      FROM sra_form_logs
      WHERE residency_since IS NOT NULL
      GROUP BY residency_period
      ORDER BY residency_period
    `,

    byGender: 'SELECT gender, COUNT(*) as count FROM sra_form_logs WHERE gender IS NOT NULL GROUP BY gender',
    bySlumUse: 'SELECT slum_use, COUNT(*) as count FROM sra_form_logs WHERE slum_use IS NOT NULL GROUP BY slum_use',
    bySocietyRegistered: 'SELECT society_registered, COUNT(*) as count FROM sra_form_logs WHERE society_registered IS NOT NULL GROUP BY society_registered',
    byPlanSubmitted: 'SELECT plan_submitted, COUNT(*) as count FROM sra_form_logs WHERE plan_submitted IS NOT NULL GROUP BY plan_submitted',
    byPhotoSelf: 'SELECT CASE WHEN photo_self_path IS NOT NULL THEN "Submitted" ELSE "Not Submitted" END as photo_self_status, COUNT(*) as count FROM sra_form_logs GROUP BY photo_self_status',

    byMunicipalCorporation: 'SELECT municipal_corporation, COUNT(*) as count FROM sra_form_logs WHERE municipal_corporation IS NOT NULL GROUP BY municipal_corporation ORDER BY count DESC LIMIT 10',
    byDistrict: 'SELECT district, COUNT(*) as count FROM sra_form_logs WHERE district IS NOT NULL GROUP BY district ORDER BY count DESC LIMIT 10',
    byFamilyMembers: `
      SELECT 
        CASE 
          WHEN num_family_members <= 2 THEN '1-2'
          WHEN num_family_members BETWEEN 3 AND 4 THEN '3-4'
          WHEN num_family_members BETWEEN 5 AND 6 THEN '5-6'
          WHEN num_family_members > 6 THEN '7+'
          ELSE 'Unknown'
        END as family_size,
        COUNT(*) as count
      FROM sra_form_logs
      WHERE num_family_members IS NOT NULL
      GROUP BY family_size
      ORDER BY family_size
    `,
    byAreaRange: `
      SELECT 
        CASE 
          WHEN area_sq_m < 10 THEN '< 10 sq.m'
          WHEN area_sq_m BETWEEN 10 AND 20 THEN '10-20 sq.m'
          WHEN area_sq_m BETWEEN 20 AND 30 THEN '20-30 sq.m'
          WHEN area_sq_m BETWEEN 30 AND 50 THEN '30-50 sq.m'
          WHEN area_sq_m >= 50 THEN '>= 50 sq.m'
          ELSE 'Unknown'
        END as area_range,
        COUNT(*) as count
      FROM sra_form_logs
      WHERE area_sq_m IS NOT NULL
      GROUP BY area_range
      ORDER BY area_range
    `,
    bySurveyStatus: 'SELECT survey_status, COUNT(*) as count FROM sra_form_logs WHERE survey_status IS NOT NULL GROUP BY survey_status ORDER BY count DESC'
  };

  const results = {};

  Promise.all(
    Object.keys(queries).map((key) =>
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
    .catch((err) => res.status(500).json({ message: 'Failed to fetch stats', err }));
};