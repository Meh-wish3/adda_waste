const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const { seedUsers } = require('../scripts/seedUsers');

const router = express.Router();

// Convenience endpoint to trigger seeding from the browser during demo
router.post('/', async (req, res) => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'seedDatabase.js');

  // Seed users first
  try {
    await seedUsers();
  } catch (err) {
    console.error('User seeding error:', err);
  }

  // Then seed database
  exec(`node "${scriptPath}"`, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Seed failed', error: error.message });
    }
    return res.json({ message: 'Seed triggered successfully (users + data)' });
  });
});

module.exports = router;

