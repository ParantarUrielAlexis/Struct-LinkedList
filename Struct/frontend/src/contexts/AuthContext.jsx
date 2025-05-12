import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
export const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          // Parse user data
          const parsedUserData = JSON.parse(userData);
          
          // Check for profile photo data for this user
          const allPhotos = JSON.parse(localStorage.getItem('allProfilePhotos') || '{}');
          const userPhotoUrl = allPhotos[parsedUserData.id];
          
          // If we have a stored photo for this user and they don't have one in their data
          if (userPhotoUrl && !parsedUserData.profile_photo_url) {
            parsedUserData.profile_photo_url = userPhotoUrl;
          }
          
          setIsAuthenticated(true);
          setUser(parsedUserData);
        } catch (error) {
          console.error("Error parsing authentication data:", error);
          // Reset auth state if there's an error
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    
    // Check if we have a saved photo for this user
    try {
      const allPhotos = JSON.parse(localStorage.getItem('allProfilePhotos') || '{}');
      const userPhotoUrl = allPhotos[userData.id];
      
      // If we have a photo for this user and they don't have one in their data
      if (userPhotoUrl && !userData.profile_photo_url) {
        userData = {...userData, profile_photo_url: userPhotoUrl};
      }
      
      setUser(userData);
    } catch (e) {
      console.error("Error processing saved photo during login:", e);
      setUser(userData);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // We don't remove profile photos as they should persist between sessions
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    // Update both state and localStorage
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    
    // Also update in localStorage to persist across refreshes
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // If profile photo is updated, store it separately too
    if (updatedUserData.profile_photo_url && user?.id) {
      try {
        // Store photos for all users in a single object keyed by user ID
        const allPhotos = JSON.parse(localStorage.getItem('allProfilePhotos') || '{}');
        allPhotos[user.id] = updatedUserData.profile_photo_url;
        localStorage.setItem('allProfilePhotos', JSON.stringify(allPhotos));
      } catch (error) {
        console.error("Error storing profile photo:", error);
      }
    }
    
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
