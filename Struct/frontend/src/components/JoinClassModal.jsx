// src/components/JoinClassModal.js
import React, { useState } from "react";
import { useClass } from "../contexts/ClassContext";

const JoinClassModal = ({ isOpen, onClose }) => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { joinClass } = useClass();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!classCode.trim()) {
      setError("Please enter a class code");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await joinClass(classCode.trim());

      if (result.success) {
        setSuccess(result.message || "Successfully joined class!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.message || "Failed to join class");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Join a Class</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="classCode"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Enter Class Code
            </label>
            <input
              type="text"
              id="classCode"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. ABC123"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClassModal;
