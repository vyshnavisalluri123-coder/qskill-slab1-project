import React, { useState } from 'react';
import './App.css';
import { translate, LANGUAGES } from './api/translate';

function App() {
  const [input, setInput] = useState('');
  const [target, setTarget] = useState('hi');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleTranslate(e) {
    e?.preventDefault();
    setError(null);
    setOutput('');
    if (!input.trim()) return setError('Please enter text to translate');
    setLoading(true);
    try {
      const result = await translate(input, target, 'en');
      setOutput(result);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Text Translator</h1>

        <form onSubmit={handleTranslate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Input (English)</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type English text to translate..."
            />
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Target language</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Output</label>
          <div className="mt-1 min-h-[5rem] p-3 rounded-md border border-gray-200 bg-gray-50">
            {error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <pre className="whitespace-pre-wrap">{output}</pre>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">Uses LibreTranslate (configurable via <code>REACT_APP_TRANSLATE_API</code>).</p>
      </div>
    </div>
  );
}

export default App;
