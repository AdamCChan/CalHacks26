const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check - also tests Supabase connection
app.get('/api/health', async (req, res) => {
  try {
    // Try a simple query to confirm Supabase is reachable
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    res.json({ 
      message: 'TimeCapsule API is running!',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'API running but database connection failed',
      error: err.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});