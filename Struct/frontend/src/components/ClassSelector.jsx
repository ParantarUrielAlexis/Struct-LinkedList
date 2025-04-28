// src/components/ClassSelector.js
import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import { useClass } from "../contexts/ClassContext";
import { useAuth } from "../contexts/AuthContext";

const ClassSelector = ({ onJoinClick, onCreateClick }) => {
  const { activeClass, teachingClasses, enrolledClasses, setActiveClass } =
    useClass();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle class selection
  const handleClassSelect = (classObj) => {
    setActiveClass(classObj);
    setIsOpen(false);
  };

  // Get all classes depending on user type
  const allClasses =
    user?.userType === "teacher" ? [...teachingClasses] : [...enrolledClasses];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-md px-3 py-2 transition-colors duration-200"
      >
        <span className="font-medium mr-1">
          {activeClass
            ? `${activeClass.code}: ${
                activeClass.name.length > 15
                  ? activeClass.name.substring(0, 15) + "..."
                  : activeClass.name
              }`
            : "Select Class"}
        </span>
        <FaChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1 max-h-60 overflow-y-auto">
            {allClasses.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  Your Classes
                </div>
                {allClasses.map((classObj) => (
                  <button
                    key={classObj.id}
                    onClick={() => handleClassSelect(classObj)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      activeClass?.id === classObj.id
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <div className="font-medium">{classObj.name}</div>
                    <div className="text-xs text-gray-500">
                      Code: {classObj.code}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 italic">
                No classes found
              </div>
            )}

            {/* Action buttons */}
            <div className="border-t border-gray-100 mt-1">
              {user?.userType === "teacher" ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onCreateClick();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-gray-100"
                >
                  <FaPlus className="mr-2" /> Create New Class
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onJoinClick();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-teal-600 hover:bg-gray-100"
                >
                  <FaPlus className="mr-2" /> Join Class with Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;
