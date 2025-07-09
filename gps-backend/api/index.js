const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow both local and deployed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://gpsapp1.vercel.app' // 🔁 Replace with your actual frontend domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ✅ MySQL connection pool
let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });
} catch (err) {
  console.error('❌ Failed to create MySQL pool:', err);
}

// ✅ Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

/**
 * 📤 Upload file to a specific slot
 * POST /api/properties/:id/upload/:slot
 */
app.post('/api/properties/:id/upload/:slot', upload.single('file'), async (req, res) => {
  const { id, slot } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const validSlots = ['upload', 'upload1', 'upload2', 'upload3'];
  if (!validSlots.includes(slot)) {
    return res.status(400).json({ error: 'Invalid upload slot' });
  }

  const blobColumn = `${slot}_blob`;

  try {
    const [result] = await pool.query(
      `UPDATE GPS_VR2_STRUCTURE SET ${blobColumn} = ?, ${slot} = ? WHERE id = ?`,
      [file.buffer, file.originalname, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Upload successful', filename: file.originalname });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

/**
 * 📦 Get all properties
 * GET /api/properties
 */
app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM GPS_VR2_STRUCTURE');

    const data = rows.map((row) => {
      const [latFallback, lngFallback] = (row.location || '')
        .split(',')
        .map(coord => parseFloat(coord.trim()));

      return {
        id: row.id,
        id_cong: row.id_cong,
        code: row.Terri,
        status: row.Statut?.toLowerCase() || 'available',
        coordinates: {
          lat: row.latitude ?? latFallback ?? null,
          lng: row.longitude ?? lngFallback ?? null,
        },
        area: row.group_name,
        description: row.Url,
        owner: {
          name: row.User_name,
          phone: row.phone || '',
          email: row.email || '',
        },
        statusTime: row.Statut_time,
      };
    });

    res.json(data);
  } catch (error) {
    console.error('❌ Property fetch error:', error);
    res.status(500).json({ error: 'Unable to load properties' });
  }
});

// ✅ Required for Vercel
module.exports = app;