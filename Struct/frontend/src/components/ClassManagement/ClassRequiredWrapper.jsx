// src/components/ClassRequiredWrapper.js
import React, { useState } from "react";
import { useClass } from "../../contexts/ClassContext";
import { useAuth } from "../../contexts/AuthContext";
import JoinClassModal from "./JoinClassModal";
import CreateClassModal from "./CreateClassModal";
import { FaChalkboard, FaChalkboardTeacher } from "react-icons/fa";

/**
 * A wrapper component that checks if the user has an active class.
 * If not, it prompts them to join or create a class before accessing content.
 */
const ClassRequiredWrapper = ({ children }) => {
  const { activeClass } = useClass();
  const { user } = useAuth();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // If user has an active class, render the children directly
  if (activeClass) {
    return children;
  }

  // If no active class, show the class entry screen
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <FaChalkboard className="text-teal-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user?.userType === "teacher"
              ? "Create Your Class"
              : "Join a Class"}
          </h2>
          <p className="text-gray-600">
            {user?.userType === "teacher"
              ? "Create a new class to get started with your Array learning module."
              : "You need to join a class before you can access the Array learning materials."}
          </p>
        </div>

        <div className="space-y-4">
          {user?.userType === "teacher" ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <FaChalkboardTeacher className="mr-2" />
              Create New Class
            </button>
          ) : (
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <FaChalkboard className="mr-2" />
              Enter Class Code
            </button>
          )}

          <div className="text-center text-sm text-gray-500 mt-6">
            <p>
              {user?.userType === "teacher"
                ? "Create a class to organize your students and track their progress."
                : "Ask your teacher for the class code to join."}
            </p>
          </div>
        </div>
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ClassRequiredWrapper;
