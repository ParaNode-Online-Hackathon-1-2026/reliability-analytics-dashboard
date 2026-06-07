const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../../data/users.json');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  try {
    const data = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // Remove password before sending to client
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error("Error reading users.json:", err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
