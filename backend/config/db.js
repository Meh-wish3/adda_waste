const mongoose = require('mongoose');

async function connectDb() {
  const MONGO_URI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ward4_waste';

  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

module.exports = connectDb;

