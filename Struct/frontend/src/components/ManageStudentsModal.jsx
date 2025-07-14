import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaTimes,
  FaPlus,
  FaTrash,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, studentName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 bg-red-50 border-b border-red-100">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">{message}</p>
          {studentName && (
            <div className="bg-gray-50 rounded-lg p-3 mt-3">
              <div className="flex items-center space-x-2">
                <FaUserGraduate className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-800">{studentName}</span>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-3">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Remove Student
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageStudentsModal = ({ isOpen, onClose, classData }) => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    studentId: null,
    studentName: "",
  });

  // Fetch actual students when the modal opens and classData changes
  useEffect(() => {
    if (isOpen && classData?.id) {
      fetchStudents();
    }
  }, [isOpen, classData?.id]);

  const fetchStudents = async () => {
    if (!classData?.id) return;
    
    setIsLoadingStudents(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/api/classes/${classData.id}/students/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      } else {
        console.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentEmail.trim()) return;

    setIsLoading(true);
    try {
      // This would need a new API endpoint to add students by email
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/api/classes/${classData.id}/add-student/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ email: newStudentEmail })
      });

      if (response.ok) {
        // Refresh the student list
        fetchStudents();
        setNewStudentEmail("");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("An error occurred while adding the student");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudentClick = (student) => {
    setConfirmModal({
      isOpen: true,
      studentId: student.id,
      studentName: student.username,
    });
  };

  const handleConfirmRemove = async () => {
    const { studentId } = confirmModal;
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8000/api/classes/${classData.id}/remove-student/${studentId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.ok) {
        // Remove student from local state
        setStudents(students.filter((student) => student.id !== studentId));
        setConfirmModal({ isOpen: false, studentId: null, studentName: "" });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to remove student");
      }
    } catch (error) {
      console.error("Error removing student:", error);
      alert("An error occurred while removing the student");
    }
  };

  const handleCancelRemove = () => {
    setConfirmModal({ isOpen: false, studentId: null, studentName: "" });
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setActiveTab("students");
      setSearchTerm("");
      setNewStudentEmail("");
      setConfirmModal({ isOpen: false, studentId: null, studentName: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Manage Students - {classData?.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("students")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "students"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Current Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "add"
                  ? "border-b-2 border-teal-500 text-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Add Students
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === "students" && (
              <div>
                {/* Search */}
                <div className="relative mb-6">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Students List */}
                <div className="space-y-3">
                  {isLoadingStudents ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
                      <p className="mt-2 text-gray-600">Loading students...</p>
                    </div>
                  ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm
                        ? "No students found matching your search."
                        : "No students in this class yet."}
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                            <FaUserGraduate className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {student.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.email}
                            </p>
                            <p className="text-xs text-gray-400">
                              Joined: {new Date(student.date_joined).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveStudentClick(student)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove student"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "add" && (
              <div>
                {/* Single Student Add */}
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Email Address
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="email"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="Enter student's email address"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !newStudentEmail.trim()}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <FaPlus className="w-4 h-4" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      The student will receive an invitation to join this class.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove Student"
        message="Are you sure you want to remove this student from the class?"
        studentName={confirmModal.studentName}
      />
    </>
  );
};

export default ManageStudentsModal;