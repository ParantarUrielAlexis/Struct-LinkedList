import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

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
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Define routes that should only show the Header
  const headerOnlyRoutes = [
    "/type-test",
    "/sortshift",
    "/sortshiftselection",
    "/sortshiftbubble",
    "/sortshiftinsertion",
    "/snake-game",
  ];

  // Define routes where user authentication isn't required
  const publicRoutes = ["/login", "/signup", "/"];

  // Check if the current route is in the header-only routes
  const isHeaderOnlyRoute = headerOnlyRoutes.includes(location.pathname);
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Only show sidebar if user is authenticated and not on a header-only route
  const showSidebar = isAuthenticated && !isHeaderOnlyRoute;

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <aside className="w-12 bg-gray-800 text-white z-10">
          <Sidebar />
        </aside>
      )}
      <div className={`flex-1 flex flex-col ${showSidebar ? "ml-0" : ""}`}>
        {isHeaderOnlyRoute && <Header />}
        {!isHeaderOnlyRoute && <Navbar />}
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<LandingPage />} />

            {/* Protected routes */}
            <Route
              path="/sort"
              element={
                <ProtectedRoute>
                  <SortRush />
                </ProtectedRoute>
              }
            />
            <Route
              path="/type-test"
              element={
                <ProtectedRoute>
                  <TypeTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/module"
              element={
                <ProtectedRoute>
                  <Module />
                </ProtectedRoute>
              }
            />
            <Route
              path="/badges"
              element={
                <ProtectedRoute>
                  <CreateBadgeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sortshift"
              element={
                <ProtectedRoute>
                  <SortShift />
                </ProtectedRoute>
              }
            />
            <Route
              path="/snake-game"
              element={
                <ProtectedRoute>
                  <SnakeGame />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sortshiftselection"
              element={
                <ProtectedRoute>
                  <SortShiftSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sortshiftbubble"
              element={
                <ProtectedRoute>
                  <SortShiftBubble />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sortshiftinsertion"
              element={
                <ProtectedRoute>
                  <SortShiftInsertion />
                </ProtectedRoute>
              }
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
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
