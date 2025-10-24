// const db = require('../config/db');

// // 🔹 Add Cluster
// exports.addCluster = (req, res) => {
//   const { cluster_number, cluster_name } = req.body;

//   if (!cluster_number || !cluster_name) {
//     return res.status(400).json({ message: 'Cluster number and name are required' });
//   }

//   const sql = 'INSERT INTO clusters SET ?';
//   const newCluster = { cluster_number, cluster_name };

//   db.query(sql, newCluster, (err, result) => {
//     if (err) {
//       console.error('Database insert error:', err);
//       return res.status(500).json({ message: 'Failed to add cluster', error: err });
//     }

//     res.status(201).json({ message: 'Cluster added successfully', cluster: newCluster });
//   });
// };

// // 🔹 Get All Clusters
// exports.getAllClusters = (req, res) => {
//   const sql = 'SELECT * FROM clusters ORDER BY id DESC';
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ message: 'Failed to fetch clusters', error: err });
//     res.json(results);
//   });
// };

// // 🔹 Update Cluster
// exports.updateCluster = (req, res) => {
//   const { id } = req.params;
//   const { cluster_number, cluster_name } = req.body;

//   if (!cluster_number && !cluster_name)
//     return res.status(400).json({ message: 'Nothing to update' });

//   const updateData = {};
//   if (cluster_number) updateData.cluster_number = cluster_number;
//   if (cluster_name) updateData.cluster_name = cluster_name;

//   db.query('UPDATE clusters SET ? WHERE id = ?', [updateData, id], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Update failed', error: err });
//     res.json({ message: 'Cluster updated successfully', updated: updateData });
//   });
// };

// // 🔹 Delete Cluster
// exports.deleteCluster = (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM clusters WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Delete failed', error: err });
//     res.json({ message: 'Cluster deleted successfully' });
//   });
// };

// // 🔹 Get Cluster by ID
// exports.getClusterById = (req, res) => {
//   const { id } = req.params;
//   db.query('SELECT * FROM clusters WHERE id = ?', [id], (err, results) => {
//     if (err) return res.status(500).json({ message: 'Fetch failed', error: err });
//     if (results.length === 0) return res.status(404).json({ message: 'Cluster not found' });
//     res.json(results[0]);
//   });
// };


// ==========================================================================================



const db = require('../config/db');

// 🔹 Add Cluster
// exports.addCluster = (req, res) => {
//   const { cluster_number, cluster_name, district, taluka, ward, municipal_corporation } = req.body;

//   if (!cluster_number || !cluster_name) {
//     return res.status(400).json({ message: 'Cluster number and name are required' });
//   }

//   const sql = 'INSERT INTO clusters SET ?';
//   const newCluster = {
//     cluster_number,
//     cluster_name,
//     district: district || null,
//     taluka: taluka || null,
//     ward: ward || null,
//     municipal_corporation: municipal_corporation || null,
//   };

//   db.query(sql, newCluster, (err, result) => {
//     if (err) {
//       console.error('Database insert error:', err);
//       return res.status(500).json({ message: 'Failed to add cluster', error: err });
//     }

//     res.status(201).json({ message: 'Cluster added successfully', cluster: newCluster });
//   });
// };



exports.addCluster = (req, res) => {
  const { cluster_number, cluster_name, district, taluka, ward, municipal_corporation } = req.body;

  if (!cluster_number || !cluster_name) {
    return res.status(400).json({ message: 'Cluster number and name are required' });
  }

  // 🔹 Step 1: Check if cluster already exists (both number and name)
  const checkSql = 'SELECT * FROM clusters WHERE cluster_number = ? AND cluster_name = ?';
  db.query(checkSql, [cluster_number, cluster_name], (err, results) => {
    if (err) {
      console.error('Database check error:', err);
      return res.status(500).json({ message: 'Database error while checking cluster', error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Cluster already exists with this number and name' });
    }

    // 🔹 Step 2: Insert if not exists
    const insertSql = 'INSERT INTO clusters SET ?';
    const newCluster = {
      cluster_number,
      cluster_name,
      district: district || null,
      taluka: taluka || null,
      ward: ward || null,
      municipal_corporation: municipal_corporation || null,
    };

    db.query(insertSql, newCluster, (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ message: 'Failed to add cluster', error: err });
      }

      res.status(201).json({
        message: 'Cluster added successfully',
        cluster: newCluster,
      });
    });
  });
};




// 🔹 Get All Clusters
exports.getAllClusters = (req, res) => {
  const sql = 'SELECT * FROM clusters ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch clusters', error: err });
    res.json(results);
  });
};

// 🔹 Update Cluster
exports.updateCluster = (req, res) => {
  const { id } = req.params;
  const { cluster_number, cluster_name, district, taluka, ward, municipal_corporation } = req.body;

  if (!cluster_number && !cluster_name && !district && !taluka && !ward && !municipal_corporation)
    return res.status(400).json({ message: 'Nothing to update' });

  const updateData = {};
  if (cluster_number) updateData.cluster_number = cluster_number;
  if (cluster_name) updateData.cluster_name = cluster_name;
  if (district) updateData.district = district;
  if (taluka) updateData.taluka = taluka;
  if (ward) updateData.ward = ward;
  if (municipal_corporation) updateData.municipal_corporation = municipal_corporation;

  db.query('UPDATE clusters SET ? WHERE id = ?', [updateData, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Update failed', error: err });
    res.json({ message: 'Cluster updated successfully', updated: updateData });
  });
};

// 🔹 Delete Cluster
exports.deleteCluster = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM clusters WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete failed', error: err });
    res.json({ message: 'Cluster deleted successfully' });
  });
};

// 🔹 Get Cluster by ID
exports.getClusterById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clusters WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Fetch failed', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Cluster not found' });
    res.json(results[0]);
  });
};


exports.getClusterByNumber = (req, res) => {
  const { cluster_number } = req.params;
  
  // Debugging logs
  console.log('🔍 Searching for cluster:', cluster_number);
  console.log('Request params:', req.params);
  console.log('Request URL:', req.url);
  
  if (!cluster_number) {
    return res.status(400).json({ message: "cluster_number is required" });
  }

  const sql = 'SELECT * FROM clusters WHERE cluster_number = ?';
  
  console.log('📝 Executing SQL:', sql);
  console.log('📝 With parameter:', [cluster_number]);

  db.query(sql, [cluster_number], (err, results) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ 
        message: "Fetch failed", 
        error: err.message 
      });
    }
    
    console.log('✅ Query executed successfully');
    console.log('📊 Results count:', results.length);
    console.log('📊 Results:', JSON.stringify(results, null, 2));
    
    if (results.length === 0) {
      // Let's also try to see all cluster_numbers to compare
      db.query('SELECT cluster_number FROM clusters', (err2, allClusters) => {
        console.log('📋 All cluster_numbers in DB:', allClusters?.map(c => c.cluster_number));
        return res.status(404).json({ 
          message: "Cluster not found",
          searched_for: cluster_number,
          available_clusters: allClusters?.map(c => c.cluster_number)
        });
      });
      return;
    }
    
    console.log('✅ Returning cluster:', results[0]);
    res.json(results[0]);
  });
};
