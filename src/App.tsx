import { Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
