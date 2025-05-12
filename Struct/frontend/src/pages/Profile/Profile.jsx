import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaLightbulb, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { isAuthenticated, user: authUser } = useAuth();
  const updateUserFromContext = useAuth().updateUser;
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [localProfilePhoto, setLocalProfilePhoto] = useState(null);
  const [profileData, setProfileData] = useState({
    points: 0,
    hearts: 0,
    hints: 0,
    modules: [],
    badges: []
  });

  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    // Prevent scrolling on the body when this component is mounted
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        setIsDataLoading(true);
        
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            console.error("No authentication token found");
            return;
          }
          
          const API_BASE_URL = 'http://localhost:8000';
          
          // Fetch the latest user data directly from the API
          const response = await axios.get(
            `${API_BASE_URL}/api/user/profile/`,
            {
              headers: {
                'Authorization': `Token ${token}`
              }
            }
          );
          
          console.log("Fetched user data:", response.data);
          
          if (response.data) {
            // Update user in context if needed
            if (typeof updateUserFromContext === 'function') {
              updateUserFromContext(response.data);
            }
            
            // Update profile data with real values from the database
            setProfileData(prevData => ({
              ...prevData,
              points: response.data.points || 0,
              hearts: response.data.hearts || 0, // Default to 3 if not provided
              hints: response.data.hints || 0    // Default to 3 if not provided
            }));
            
            // Set profile photo if available
            if (response.data.profile_photo_url) {
              setLocalProfilePhoto(response.data.profile_photo_url);
            }
          }
          
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsDataLoading(false);
        }
        
        // Set sample modules/badges data if needed (this doesn't affect hearts/hints)
        if (!profileData.modules.length) {
          setProfileData(prevData => ({
            ...prevData,
            modules: [
              { id: 1, name: 'Arrays', progress: 100, completed: true },
              { id: 2, name: 'Stacks', progress: 63, completed: false }
            ],
            badges: [
              { id: 1, name: 'Array Novice', icon: '/path/to/array-badge.png', earned: true }
            ]
          }));
        }
      }
    };
    
    fetchUserData();
  }, [isAuthenticated]); // Remove authUser dependency to prevent circular updates

  // Handler to open file dialog
  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  // Handler for file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handler to cancel photo upload
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handler to confirm and upload photo
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('photo', selectedFile);
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUploadError("Authentication token is missing. Please log in again.");
        setIsUploading(false);
        return;
      }
      
      const API_BASE_URL = 'http://localhost:8000';
      
      const response = await axios.post(
        `${API_BASE_URL}/api/user/update-profile-photo/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
          }
        }
      );
      
      console.log('Upload response:', response.data);
      
      if (response.data.success && response.data.profile_photo_url) {
        // Update context if possible
        if (typeof updateUserFromContext === 'function') {
          try {
            // Only update the current user's profile photo in context
            updateUserFromContext({
              ...authUser,
              profile_photo_url: response.data.profile_photo_url
            });
          } catch (err) {
            console.warn("Could not update user in context:", err);
          }
        }
        
        // Update local state for current user's profile photo
        setLocalProfilePhoto(response.data.profile_photo_url);
        
        // Reset file selection
        setSelectedFile(null);
        setPreviewUrl(null);
      }
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadError('Failed to upload photo. Please try again later.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated || !authUser) {
    return (
      <div className="p-6 max-w-7xl mt-16 mx-auto text-center">
        <h2 className="text-xl font-bold">Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mt-16 mx-auto h-[calc(100vh-4rem)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-200 p-6 rounded-lg shadow-md text-center"
          >
            <div className="w-36 h-36 rounded-full bg-gray-300 mx-auto overflow-hidden relative group">
              <img 
                src={previewUrl || localProfilePhoto || authUser?.profile_photo_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"} 
                alt={authUser?.username || 'User'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onError = null; 
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                }}
              />
              
              {!previewUrl && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handlePhotoClick}
                >
                  <FaCamera className="text-white text-2xl" />
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
              />
            </div>
            
            {isUploading && (
              <p className="text-teal-600 mt-2 text-sm">Uploading...</p>
            )}
            
            {uploadError && (
              <p className="text-red-500 mt-2 text-sm">{uploadError}</p>
            )}
            
            <h2 className="text-2xl font-bold mt-4">{authUser.username}</h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mt-1">
              <span className="capitalize text-teal-600">
                {authUser.user_type}
              </span>
            </div>
            
            {selectedFile ? (
              <div className="flex justify-center gap-3 mt-4">
                <button 
                  onClick={handleCancelUpload}
                  className="flex items-center gap-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition"
                  disabled={isUploading}
                >
                  <FaTimes /> Cancel
                </button>
                <button 
                  onClick={handleConfirmUpload}
                  className="flex items-center gap-1 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition"
                  disabled={isUploading}
                >
                  <FaCheck /> Save
                </button>
              </div>
            ) : (
              <button 
                onClick={handlePhotoClick} 
                className="mt-4 bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <FaCamera /> Upload Photo
              </button>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-200 p-6 rounded-lg shadow-md"
          >
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <span className="text-4xl font-bold">{profileData.points}</span>
              </div>
              <p className="mt-2 text-gray-700">Points</p>
            </div>
            
            <div className="flex justify-around text-center">
              <div>
                <div className="flex items-center justify-center text-xl mb-1">
                  <span className="mr-1">{profileData.hearts}</span>
                  <FaHeart className="text-black" />
                </div>
                <p className="text-sm">Hearts Available</p>
              </div>
              
              <div>
                <div className="flex items-center justify-center text-xl mb-1">
                  <span className="mr-1">{profileData.hints}</span>
                  <FaLightbulb className="text-black" />
                </div>
                <p className="text-sm">Hints Available</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-200 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Modules</h3>
              <button className="text-teal-500 hover:underline">view more</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileData.modules.map(module => (
                <div key={module.id} className="bg-gray-800 text-white p-4 rounded-lg">
                  <div className="flex justify-center items-center h-24">
                    {module.name === 'Arrays' && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-teal-500 w-12 h-12"></div>
                        <div className="bg-teal-500 w-12 h-12"></div>
                        <div className="bg-teal-500 w-12 h-12"></div>
                      </div>
                    )}
                    {module.name === 'Stacks' && (
                      <div className="flex flex-col items-center">
                        <div className="bg-teal-500 w-12 h-2 mb-1"></div>
                        <div className="bg-teal-500 w-12 h-2 mb-1"></div>
                        <div className="bg-teal-500 w-12 h-2"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mt-2">
                    <p className="text-teal-500">{module.name}</p>
                    <div className="w-full bg-gray-700 h-1 mt-2">
                      <div 
                        className="bg-teal-500 h-1" 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-teal-500">{module.progress}% complete</p>
                    
                    <button className="bg-teal-500 text-white px-4 py-1 rounded-full mt-2 hover:bg-teal-600 transition">
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-200 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Badges</h3>
              <button className="text-teal-500 hover:underline">view more</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {profileData.badges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img 
                      src={badge.icon} 
                      alt={badge.name}
                      className="w-full"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' fill='%23333'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <p className="text-center text-sm mt-2">{badge.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;