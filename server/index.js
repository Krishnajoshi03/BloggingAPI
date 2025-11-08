const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'dev-secret-key-change-me';
const PORT = 4000;

// Simple users DB
const users = [
  { id: 1, username: 'demo', password: 'demo', name: 'Demo User' }
];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  return res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});

// Protected example endpoint
app.get('/api/me', (req, res) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Missing Authorization header' });
  const parts = String(auth).split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    return res.json({ ok: true, payload });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => console.log(`Mock auth server listening on http://localhost:${PORT}`));
