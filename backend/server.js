const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDb();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Ward-level Waste Management API running' });
});

app.use('/api/households', require('./routes/households'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/collectors', require('./routes/collectors'));
app.use('/api/incentives', require('./routes/incentives'));
app.use('/api/route', require('./routes/route'));
app.use('/api/seed', require('./routes/seed'));

// Global error handler (simple)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

