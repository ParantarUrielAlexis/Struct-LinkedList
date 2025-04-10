import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SortRush from "./pages/SortRush";
import TypeTest from "./pages/TypeTest";
import SnakeGame from "./pages/SnakeGame";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sort" element={<SortRush />} />
        <Route path="/type-test" element={<TypeTest />} />
        <Route path="/snake-game" element={<SnakeGame />} />
      </Routes>
    </Router>
  );
}

export default App;
