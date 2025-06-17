// src/components/ManageStudentsModal.js
import React, { useState } from "react";
import {
  FaUserGraduate,
  FaTimes,
  FaPlus,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

const ManageStudentsModal = ({ isOpen, onClose, classData }) => {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joinedDate: "2024-01-16",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      joinedDate: "2024-01-17",
    },
  ]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentEmail.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/classes/${classData.id}/add-student/`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: newStudentEmail })
      // });

      // Mock success - remove this when implementing real API
      setTimeout(() => {
        const newStudent = {
          id: Date.now(),
          name: newStudentEmail.split("@")[0],
          email: newStudentEmail,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        setStudents([...students, newStudent]);
        setNewStudentEmail("");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding student:", error);
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this student from the class?"
      )
    ) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/classes/${classData.id}/remove-student/${studentId}/`, {
      //   method: 'DELETE'
      // });

      // Mock removal - remove this when implementing real API
      setStudents(students.filter((student) => student.id !== studentId));
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setActiveTab("students");
      setSearchTerm("");
      setNewStudentEmail("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
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
                {filteredStudents.length === 0 ? (
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
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            Joined: {student.joinedDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(student.id)}
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
  );
};

export default ManageStudentsModal;
