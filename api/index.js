const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create MySQL connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// ✅ Configure multer for memory-based file upload
const upload = multer({ storage: multer.memoryStorage() });

/** 📥 File Upload API
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
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

/** 📦 Property List API
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
    console.error('Property fetch error:', error);
    res.status(500).json({ error: 'Unable to load properties' });
  }
});

// ✅ Required for Vercel serverless deployment
module.exports = app;