import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Translator from "./Translator";
import RandomString from "./RandomString";

function App() {
  return (
    <Router>
      <div>
        <nav style={{ margin: "20px" }}>
          <Link to="/translator" style={{ marginRight: "10px" }}>
            Translator
          </Link>
          <Link to="/random">Random String</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Translator />} />   {/* Default route */}
          <Route path="/translator" element={<Translator />} />
          <Route path="/random" element={<RandomString />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



