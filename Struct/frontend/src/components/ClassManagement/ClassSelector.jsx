import React, { useState, useRef, useEffect } from "react";
import {
  FaChevronDown,
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useClass } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";

const ClassSelector = ({ onJoinClick, onCreateClick }) => {
  const {
    activeClass,
    teachingClasses,
    enrolledClasses,
    setActiveClass,
    deleteClass,
    leaveClass,
  } = useClass();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState({ type: "", classObj: null });
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClassSelect = (classObj) => {
    setActiveClass(classObj);
    setIsOpen(false);
  };

  const handleActionClick = (e, type, classObj) => {
    e.stopPropagation(); // Prevent class selection
    setModalAction({ type, classObj });
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    const { type, classObj } = modalAction;

    if (type === "delete" && classObj) {
      await deleteClass(classObj.id);
    } else if (type === "leave" && classObj) {
      await leaveClass(classObj.id);
    }

    setShowConfirmModal(false);
  };

  const allClasses =
    user?.userType === "teacher" ? [...teachingClasses] : [...enrolledClasses];

  return (
    <div className="relative min-w-[200px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-2 rounded-md text-sm font-medium transition"
      >
        <span className="truncate max-w-[10rem]">
          {activeClass
            ? `${activeClass.code}: ${
                activeClass.name.length > 20
                  ? activeClass.name.substring(0, 20) + "..."
                  : activeClass.name
              }`
            : "Select Class"}
        </span>
        <FaChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-64 max-w-xs bg-white shadow-lg rounded-md border border-gray-200 z-50">
          <div className="py-1 max-h-60 overflow-y-auto">
            {allClasses.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
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
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{classObj.name}</div>
                      {user?.userType === "teacher" ? (
                        <FaTrash
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={(e) =>
                            handleActionClick(e, "delete", classObj)
                          }
                          title="Delete class"
                        />
                      ) : (
                        <FaSignOutAlt
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={(e) =>
                            handleActionClick(e, "leave", classObj)
                          }
                          title="Leave class"
                        />
                      )}
                    </div>
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
            <div className="border-t border-gray-100 mt-1">
              {user?.userType === "teacher" ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onCreateClick();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-teal-700 hover:bg-gray-100"
                >
                  <FaPlus className="mr-2" /> Create New Class
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onJoinClick();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-teal-700 hover:bg-gray-100"
                >
                  <FaPlus className="mr-2" /> Join Class with Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center text-red-500 mb-4">
              <FaExclamationTriangle className="text-2xl mr-2" />
              <h3 className="text-lg font-bold">
                {modalAction.type === "delete" ? "Delete Class" : "Leave Class"}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">
              {modalAction.type === "delete"
                ? `Are you sure you want to delete "${modalAction.classObj?.name}"? This action cannot be undone and will remove the class for all students.`
                : `Are you sure you want to leave "${modalAction.classObj?.name}"? You'll need a new class code to rejoin.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {modalAction.type === "delete" ? "Delete" : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSelector;
