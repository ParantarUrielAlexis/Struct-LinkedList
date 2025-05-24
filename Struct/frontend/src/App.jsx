import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useParams
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import SortRush from "./pages/SortRush";
import TypeTest from "./pages/TypeTest/TypeTest";
import TypeTestLevels from "./pages/TypeTest/TypeTestLevels";

import Module from "./pages/Module";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateBadgeForm from "./pages/CreateBadgeForm";
import SortShift from "./pages/SortShift/SortShift";
import SortShiftSelection from "./pages/SortShiftSelection/SortShiftSelection";
import SortShiftBubble from "./pages/SortShiftBubble/SortShiftBubble";
import SortShiftInsertion from "./pages/SortShiftInsertion/SortShiftInsertion";
import Profile from "./pages/Profile/Profile";
import Store from "./pages/Store/Store";

// import SnakeGame from "./pages/SnakeGame/SnakeGame";
import LevelSelect from "./pages/SnakeGame/LevelSelect";
import SnakeGame1 from "./pages/SnakeGame/SnakeGame_1";
import SnakeGame2 from "./pages/SnakeGame/SnakeGame_2";
import SnakeGame3 from "./pages/SnakeGame/SnakeGame_3";
import SnakeGame4 from "./pages/SnakeGame/SnakeGame_4";
import SnakeGame5 from "./pages/SnakeGame/SnakeGame_5";
import GameShowcase from "./pages/GameShowcase";

import TeacherDashboard from "./pages/TeacherDashboard";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ClassProvider } from "./contexts/ClassContext";

import ClassRequiredWrapper from "./components/ClassRequiredWrapper";

import ProtectedRoute from "./routes/ProtectedRoute";
import TeacherRoute from "./routes/TeacherRoute";

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
  const isHeaderOnlyRoute = headerOnlyRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Only show sidebar if user is authenticated and not on a header-only route
  const showSidebar = isAuthenticated && !isHeaderOnlyRoute;
  const SnakeGameLevelHandler = () => {
  const { level } = useParams();
  
  switch(level) {
    case '1': return <SnakeGame1 />;
    case '2': return <SnakeGame2 />;
    case '3': return <SnakeGame3 />;
    case '4': return <SnakeGame4 />;
    case '5': return <SnakeGame5 />;
    default: return <Navigate to="/snake-game" />;
  }
};
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
                  <ClassRequiredWrapper>
                    <SortRush />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <Store />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <Profile />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/type-test/:levelIndex"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <TypeTest />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/type-test/levels"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <TypeTestLevels />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/module"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <Module />
                  </ClassRequiredWrapper>
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
                  <ClassRequiredWrapper>
                    <SortShift />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />
            <Route
            path="/snake-game"
            element={
              <ProtectedRoute>
                <ClassRequiredWrapper>
                  <LevelSelect />
                </ClassRequiredWrapper>
              </ProtectedRoute>
            }
          />
          <Route
          path="/snake-game/:level"
          element={
            <ProtectedRoute>
              <ClassRequiredWrapper>
                <SnakeGameLevelHandler />
              </ClassRequiredWrapper>
            </ProtectedRoute>
          }
        />
            <Route
              path="/sortshiftselection"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <SortShiftSelection />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sortshiftbubble"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <SortShiftBubble />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sortshiftinsertion"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <SortShiftInsertion />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <ClassRequiredWrapper>
                    <GameShowcase />
                  </ClassRequiredWrapper>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher-dashboard"
              element={
                <TeacherRoute>
                  <TeacherDashboard />
                </TeacherRoute>
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
        <ClassProvider>
          <AppLayout />
        </ClassProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
