const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const sraFormLogsRoutes = require('./routes/sraFormLogsRoutes');
const authRoutes = require('./routes/authRoutes');
const clusterRoutes = require('./routes/clusterRoutes');
const slumRoutes = require('./routes/slumRoutes');
const hutRoutes = require('./routes/hutRoutes');


dotenv.config();
dotenv.config({ path: '.env.development' });  // explicitly load .env.development

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads/sra_docs', express.static(path.join(__dirname, 'uploads/sra_docs')));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:61855', 'http://localhost:3000', 'http://43.205.212.92:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/sra-logs', sraFormLogsRoutes);
app.use('/api/clusters',clusterRoutes)
app.use('/api/slums',slumRoutes)
app.use('/api/huts',hutRoutes)



app.get('/api/wards', (req, res) => {
  const wards = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F\\N",
    "F\\S",
    "G\\N",
    "G\\S",
    "H\\E",
    "H\\W",
    "K\\E",
    "K\\W",
    "L",
    "M\\E",
    "M\\W",
    "N",
    "P\\N",
    "P\\S",
    "R\\N",
    "R\\S",
    "R\\C",
    "S",
    "T"
  ];

  res.status(200).json(wards);
});

app.get('/',(req,res)=>{
  res.status(200).json("Hello Mohini .....");
})
app.get('/api/use-of-hut', (req, res) => {
  const hutUses = [
    "Residential",
    "Commercial",
    "Combine",
    "Social",
    "Devotional",
    "Educational"
  ];

  res.status(200).json(hutUses);
});


const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
