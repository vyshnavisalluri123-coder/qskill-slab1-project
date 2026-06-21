import { useState } from "react";

function Translator() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("hi"); // Default Hindi
  const [translated, setTranslated] = useState("");

  const translateText = async () => {
    const url = `https://free-google-translator.p.rapidapi.com/external-api/free-google-translator?from=en&to=${targetLang}&query=${encodeURIComponent(text)}`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "free-google-translator.p.rapidapi.com",
      },
      body: JSON.stringify({ translate: "rapidapi" }), // dummy body required
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setTranslated(result.translation);
    } catch (error) {
      setTranslated("Error: " + error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌐 Translator App</h1>

      <textarea
        rows="4"
        cols="50"
        placeholder="Enter text in English"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
        <option value="hi">Hindi</option>
        <option value="te">Telugu</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
        <option value="zh">Chinese</option>
        <option value="ru">Russian</option>
        <option value="ar">Arabic</option>
        <option value="it">Italian</option>
      </select>

      <br /><br />

      <button onClick={translateText}>Translate</button>

      <h2 style={{ color: "green", marginTop: "20px" }}>{translated}</h2>
    </div>
  );
}

export default Translator;
