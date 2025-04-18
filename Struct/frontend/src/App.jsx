import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header"; // Import Header
import Home from "./pages/Home";
import SortRush from "./pages/SortRush";
import TypeTest from "./pages/TypeTest";
import Module from "./pages/Module";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Assuming you have a Signin page
const AppLayout = () => {
  const location = useLocation();

  // Check if the current route is "/type-test"
  const isTypeTestRoute = location.pathname === "/type-test";

  return (
    <div className="flex">
      {!isTypeTestRoute && <Sidebar />} {/* Conditionally render Sidebar */}
      <div className="flex-1">
        {!isTypeTestRoute && <Navbar />} {/* Conditionally render Navbar */}
        {isTypeTestRoute && <Header />}{" "}
        {/* Show Header only for "/type-test" */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sort" element={<SortRush />} />
          <Route path="/type-test" element={<TypeTest />} />
          <Route path="/module" element={<Module />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
