const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const router = express.Router();

// Convenience endpoint to trigger seeding from the browser during demo
router.post('/', (req, res) => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'seedDatabase.js');

  exec(`node "${scriptPath}"`, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Seed failed', error: error.message });
    }
    return res.json({ message: 'Seed triggered successfully' });
  });
});

module.exports = router;

