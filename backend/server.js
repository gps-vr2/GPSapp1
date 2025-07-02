const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

// Adjusted to your actual sheet columns
app.get('/api/properties', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM GPS_VR2_STRUCTURE');
    const formatted = rows.map(row => {
      const [lat, lng] = (row.location || '').split(',').map(coord => parseFloat(coord.trim()));
      return {
        id: row.id_cong,
        code: row.Terri,
        status: row.Statut?.toLowerCase() || 'available',
        coordinates: {
          lat: isNaN(lat) ? null : lat,
          lng: isNaN(lng) ? null : lng
        },
        area: row['group name'],
        description: row.Url,
        owner: {
          name: row.User_name,
          phone: '',
          email: ''
        },
        uploadStatus: row.Upload,
        statusTime: row.Statut_time
      };
    });
    res.json(formatted);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Unable to load properties from GPS_VR2_STRUCTURE' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend is running at http://localhost:${PORT}`);
});