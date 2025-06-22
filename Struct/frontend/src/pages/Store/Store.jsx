import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaLightbulb, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Store = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, item: null });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState(null);
  const [successTimeoutId, setSuccessTimeoutId] = useState(null);

  // Get user data
  const [userData, setUserData] = useState({
    points: 0,
    hearts: 0,
    hints: 0
  });

  // Fetch user data when component mounts
  useEffect(() => {
    if (isAuthenticated && authUser) {
      setUserData({
        points: authUser.points || 0,
        hearts: authUser.hearts || 0,
        hints: authUser.hints || 0
      });
    }
  }, [isAuthenticated, authUser]);

  // Clear any lingering timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (successTimeoutId) {
        clearTimeout(successTimeoutId);
      }
    };
  }, [successTimeoutId]);

  // Define store items
  const storeItems = [
    {
      id: 'heart',
      name: 'Heart',
      icon: <FaHeart size={64} />,
      price: 300,
      type: 'hearts'
    },
    {
      id: 'hint',
      name: 'Hint',
      icon: <FaLightbulb size={64} />,
      price: 500,
      type: 'hints'
    }
  ];

  // Open confirm modal
  const openConfirmModal = (item) => {
    // Check if user has enough points first
    if (userData.points < item.price) {
      setError(`Not enough points to purchase ${item.name}`);
      setTimeout(() => setError(null), 3000);
      return;
    }
    setConfirmModal({ show: true, item });
  };

  // Close confirm modal
  const closeConfirmModal = () => {
    setConfirmModal({ show: false, item: null });
  };

  // Handle purchase
  const handlePurchase = async () => {
    const item = confirmModal.item;
    if (!item) return;
    
    closeConfirmModal();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const API_BASE_URL = 'http://localhost:8000';
      
      // Update user data in the backend
      const response = await axios.patch(
        `${API_BASE_URL}/api/user/profile/`,
        {
          points: userData.points - item.price,
          [item.type]: userData[item.type] + 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        }
      );

      if (response.data) {
        // Update local state
        setUserData(prevData => ({
          ...prevData,
          points: prevData.points - item.price,
          [item.type]: prevData[item.type] + 1
        }));

        // Update user in context
        if (typeof updateUser === 'function') {
          updateUser({
            ...authUser,
            points: userData.points - item.price,
            [item.type]: userData[item.type] + 1
          });
        }

        // Set purchased item and show success modal
        setPurchasedItem(item);
        setShowSuccessModal(true);

        // Auto-close success modal after 5 seconds
        const timeoutId = setTimeout(() => {
          setShowSuccessModal(false);
          setPurchasedItem(null);
        }, 5000);

        // Store timeout ID so we can clear it if user clicks Continue
        setSuccessTimeoutId(timeoutId);
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      setError('Failed to complete purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access the store</h2>
          <button 
            onClick={() => navigate('/login')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
            <button 
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md transition-all duration-200 flex items-center shadow-sm hover:shadow"
            >
            <FaArrowLeft className="mr-2" />
            Back
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Store</h1>
        </div>
    </div>

      {/* User's current resources */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 rounded-lg py-3 px-8 flex items-center space-x-6">
          <div className="flex items-center">
            <span className="text-2xl font-semibold mr-2">{userData.hearts}</span>
            <FaHeart className="text-black" />
            <span className="ml-1 text-sm">Hearts Available</span>
          </div>
          <div className="h-8 border-l border-gray-300"></div>
           <div className="text-center">
            <div className="text-lg font-bold">{userData.points}</div>
            <div className="text-sm text-gray-600">Points</div>
          </div>
          <div className="h-8 border-l border-gray-300"></div>
          <div className="flex items-center">
            <span className="text-2xl font-semibold mr-2">{userData.hints}</span>
            <FaLightbulb className="text-black" />
            <span className="ml-1 text-sm">Hints Available</span>
          </div>
        </div>
      </div>

      {/* Notification messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
          {successMessage}
        </div>
      )}

      {/* Store items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {storeItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-200 rounded-lg p-8 flex flex-col items-center"
          >
            <div className="mb-2 text-lg font-semibold">{item.price} points</div>
            <div className="my-6 text-black">{item.icon}</div>
            <div className="mb-4 text-xl font-bold">{item.name}</div>
            <button
              onClick={() => openConfirmModal(item)}
              disabled={isLoading || userData.points < item.price}
              className={`bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-8 rounded-md ${
                isLoading || userData.points < item.price ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Processing...' : 'Buy'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-100 p-8 rounded-lg max-w-md w-full text-center"
          >
            <h2 className="text-2xl font-bold mb-8">Are you sure you want to buy?</h2>
            
            <div className="flex justify-center mb-6">
              <div className="text-black">
                {confirmModal.item.icon}
              </div>
            </div>
            
            <p className="text-xl mb-8">{confirmModal.item.name}</p>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handlePurchase}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-12 rounded-md"
                disabled={isLoading}
              >
                Buy
              </button>
              <button 
                onClick={closeConfirmModal}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded-md"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && purchasedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-lg max-w-sm w-full text-center"
          >
            {/* Success icon */}
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <FaCheck size={40} className="text-green-500" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2">Purchase Complete!</h3>
            
            <p className="text-gray-600 mb-4">
              {purchasedItem.name} Added to your account!
            </p>
            
            <button 
              onClick={() => {
                if (successTimeoutId) {
                  clearTimeout(successTimeoutId);
                  setSuccessTimeoutId(null);
                }
                setShowSuccessModal(false);
                setPurchasedItem(null);
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-12 rounded-md mt-2"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Store;