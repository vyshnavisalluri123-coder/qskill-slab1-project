// By default prefer an env-configured API. If none provided, use a relative
// `/api` path so CRA dev server proxy (setupProxy.js) can forward requests
// to LibreTranslate and avoid CORS errors during development.
const DEFAULT_API = process.env.REACT_APP_TRANSLATE_API || '/api';

export async function translate(text, target = 'hi', source = 'en') {
  if (!text) return '';
  const url = `${DEFAULT_API}/translate`;
  const body = {
    q: text,
    source,
    target,
    format: 'text',
  };

  let res;
  try {
    res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new Error('Network or CORS error: failed to reach translation API');
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Translation API error: ${res.status} ${errText}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const html = await res.text();
    throw new Error(
      'Translation API returned HTML instead of JSON. Check your proxy/API URL and ensure the backend server is running.' +
        ` Response preview: ${html.slice(0, 240)}`
    );
  }

  const data = await res.json();

  if (typeof data.translatedText === 'string') {
    return data.translatedText;
  }
  if (Array.isArray(data.translatedTexts) && data.translatedTexts.length > 0) {
    return data.translatedTexts[0];
  }
  if (Array.isArray(data.translations) && data.translations.length > 0) {
    return data.translations[0].translatedText ?? data.translations[0].text ?? '';
  }
  if (Array.isArray(data.texts) && data.texts.length > 0) {
    return data.texts[0];
  }

  return JSON.stringify(data);
}

export async function detectLanguage(text) {
  const url = `${DEFAULT_API}/detect`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text }),
  });
  if (!res.ok) throw new Error('Language detection failed');
  const data = await res.json();
  // returns array of {language, confidence}
  return data[0]?.language ?? 'en';
}

export const LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'pt', name: 'Portuguese' },
];

export default translate;
