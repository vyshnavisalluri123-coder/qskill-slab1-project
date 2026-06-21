// Load .env automatically for ease of local development
try {
  require('dotenv').config();
} catch (e) {}

const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Gracefully handle malformed JSON request bodies.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
// Defaults for Google Translate RapidAPI endpoint. You can override via env vars.
const RAPIDAPI_URL = process.env.RAPIDAPI_URL || 'https://google-translate1.p.rapidapi.com/language/translate/v2';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // your RapidAPI key (required)
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'google-translate1.p.rapidapi.com';

if (!RAPIDAPI_KEY) {
  console.error('Warning: RAPIDAPI_KEY not set. Add it to your .env file as RAPIDAPI_KEY.');
}
console.log('RapidAPI proxy configured for URL:', RAPIDAPI_URL);

// Proxy endpoint for translations.
app.post('/api/translate', async (req, res) => {
  if (!RAPIDAPI_URL) {
    return res.status(500).json({ error: 'RAPIDAPI_URL not configured on server.' });
  }

  try {
    const payload = new URLSearchParams({
      q: req.body.q ?? req.body.text ?? req.body.input ?? '',
      source: req.body.source ?? 'en',
      target: req.body.target ?? req.body.lang ?? 'hi',
      format: req.body.format ?? 'text',
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Accept-Encoding': 'application/gzip',
      'x-rapidapi-host': RAPIDAPI_HOST,
    };
    if (RAPIDAPI_KEY) headers['x-rapidapi-key'] = RAPIDAPI_KEY;

    console.log('Proxy request to', RAPIDAPI_URL);
    console.log('Proxy headers:', headers);
    console.log('Proxy body:', payload.toString());

    const r = await fetch(RAPIDAPI_URL, {
      method: 'POST',
      headers,
      body: payload.toString(),
    });

    const text = await r.text();
    // If response is JSON, forward as JSON; otherwise forward raw text
    try {
      const json = JSON.parse(text);
      res.status(r.status).json(json);
    } catch (e) {
      res.status(r.status).type('text').send(text);
    }
  } catch (err) {
    console.error('Proxy error', err);
    res.status(502).json({ error: err.message });
  }
});

// Serve React build in production mode (so /api works alongside static files).
const buildPath = path.join(__dirname, 'build');
if (require('fs').existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get(/.*/, (req, res, next) => {
    // If the request starts with /api, skip to API handlers
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`RapidAPI proxy server listening on http://localhost:${PORT}`);
});
