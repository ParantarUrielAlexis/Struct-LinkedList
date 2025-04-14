import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar"; // Import Sidebar
import Home from "./pages/Home";
import SortRush from "./pages/SortRush";
import TypeTest from "./pages/TypeTest";
import Module from "./pages/Module";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar /> {/* Sidebar on the left */}
        <div className="flex-1">
          <Navbar /> {/* Navbar at the top */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sort" element={<SortRush />} />
            <Route path="/type-test" element={<TypeTest />} />
            <Route path="/module" element={<Module />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
