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
import Signup from "./pages/Signup";
import CreateBadgeForm from "./pages/CreateBadgeForm";
import SortShift from "./pages/SortShift/SortShift";
import SortShiftSelection from "./pages/SortShiftSelection/SortShiftSelection";
import SortShiftBubble from "./pages/SortShiftBubble/SortShiftBubble";
import SortShiftInsertion from "./pages/SortShiftInsertion/SortShiftInsertion";
import SnakeGame from "./pages/SnakeGame";
const AppLayout = () => {
  const location = useLocation();

  // Define routes that should only show the Header
  const headerOnlyRoutes = [
    "/type-test",
    "/sortshift",
    "/sortshiftselection",
    "/sortshiftbubble",
    "/sortshiftinsertion",
    "/snake-game",
  ];

  // Check if the current route is in the header-only routes
  const isHeaderOnlyRoute = headerOnlyRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {!isHeaderOnlyRoute && (
        <aside className="w-12 bg-gray-800 text-white z-10">
          <Sidebar />
        </aside>
      )}
      <div className="flex-1 flex flex-col">
        {isHeaderOnlyRoute && <Header />}
        {!isHeaderOnlyRoute && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sort" element={<SortRush />} />
            <Route path="/type-test" element={<TypeTest />} />
            <Route path="/module" element={<Module />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/badges" element={<CreateBadgeForm />} />
            <Route path="/sortshift" element={<SortShift />} />
            <Route path="/snake-game" element={<SnakeGame />} />
            <Route
              path="/sortshiftselection"
              element={<SortShiftSelection />}
            />
            <Route path="/sortshiftbubble" element={<SortShiftBubble />} />
            <Route
              path="/sortshiftinsertion"
              element={<SortShiftInsertion />}
            />
          </Routes>
        </main>
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
