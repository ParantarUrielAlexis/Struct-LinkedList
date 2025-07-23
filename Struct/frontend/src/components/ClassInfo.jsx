// src/components/ClassInfo.js
import React, { useState } from "react";
import { FaUserGraduate, FaChalkboard } from "react-icons/fa";
import { useClass } from "../contexts/ClassContext";
import { useAuth } from "../contexts/AuthContext";
import ManageStudentsModal from "./ManageStudentsModal";

const ClassInfo = () => {
  const { activeClass } = useClass();
  const { user } = useAuth();
  const [showManageModal, setShowManageModal] = useState(false);

  if (!activeClass) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaChalkboard className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {user?.userType === "teacher"
                ? "Please create a class to get started."
                : "Please join a class to get started."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeClass.name}
            </h2>
            <div className="flex items-center mt-1 space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium text-teal-600">Class Code:</span>
                <span className="ml-1 bg-teal-100 text-teal-800 py-0.5 px-2 rounded text-xs font-medium">
                  {activeClass.code}
                </span>
              </div>
              {/* <div className="flex items-center text-sm text-gray-500">
                <FaUserGraduate className="mr-1 text-gray-400" />
                <span>{activeClass.students_count} students</span>
              </div> */}
            </div>
          </div>

          {user?.userType === "teacher" && (
            <button
              onClick={() => setShowManageModal(true)}
              className="bg-teal-100 hover:bg-teal-200 text-teal-800 py-1 px-3 rounded text-sm transition-colors"
            >
              Manage Class
            </button>
          )}
        </div>

        {activeClass.description && (
          <div className="mt-3 text-sm text-gray-600 border-t pt-3">
            {activeClass.description}
          </div>
        )}
      </div>

      <ManageStudentsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        classData={activeClass}
      />
    </>
  );
};

export default ClassInfo;
