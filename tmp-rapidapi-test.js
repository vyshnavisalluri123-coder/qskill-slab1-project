const paths = [
  'https://google-translate1.p.rapidapi.com/translate',
  'https://google-translate1.p.rapidapi.com/language/translate/v2',
  'https://google-translate1.p.rapidapi.com/language/translate/v2?target=hi&source=en&q=hello',
];
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
  'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY_HERE',
};
const body = new URLSearchParams({ q: 'hello', source: 'en', target: 'hi', format: 'text' }).toString();

(async () => {
  for (const url of paths) {
    try {
      const r = await fetch(url, { method: 'POST', headers, body });
      const text = await r.text();
      console.log('---', url, 'status', r.status);
      console.log(text);
    } catch (e) {
      console.error('ERROR', url, e.message);
    }
  }
})();
