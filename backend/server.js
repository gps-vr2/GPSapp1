const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Debug all incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/properties/:id/upload/:slot', upload.single('file'), async (req, res) => {
  const { id, slot } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const validSlots = ['upload', 'upload1', 'upload2', 'upload3'];
  if (!validSlots.includes(slot)) {
    return res.status(400).json({ error: 'Invalid upload slot' });
  }

  const blobColumn = `${slot}_blob`;

  console.log(`Uploading for property ID: ${id}, Slot: ${slot}`);

  try {
    const [result] = await pool.query(
      `UPDATE GPS_VR2_STRUCTURE SET ${blobColumn} = ?, ${slot} = ? WHERE id = ?`,
      [file.buffer, file.originalname, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No property found with matching primary key ID' });
    }

    res.json({ message: '✅ File uploaded successfully', filename: file.originalname });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM GPS_VR2_STRUCTURE');

    const formatted = rows.map((row) => {
      const [latFallback, lngFallback] = (row.location || '').split(',').map(coord => parseFloat(coord.trim()));
      return {
        id: row.id,           // ✅ true primary key
        id_cong: row.id_cong, // legacy field if needed
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
        uploadStatus: {
          step0: row.Upload,
          step1: row.upload1,
          step2: row.upload2,
          step3: row.upload3,
        },
        statusTime: row.Statut_time,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Unable to load properties' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});