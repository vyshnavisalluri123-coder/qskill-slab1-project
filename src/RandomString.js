import { useState } from "react";

function RandomString() {
  const [randomStr, setRandomStr] = useState("");

  const generateString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomStr(result);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🎲 Random String Generator</h1>
      <button onClick={generateString}>Generate New String</button>
      <h2 style={{ color: "purple", marginTop: "20px" }}>{randomStr}</h2>
    </div>
  );
}

export default RandomString;

