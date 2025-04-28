// src/components/CreateClassModal.js
import React, { useState } from "react";
import { useClass } from "../contexts/ClassContext";

const CreateClassModal = ({ isOpen, onClose }) => {
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { createClass } = useClass();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      setError("Please enter a class name");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createClass(className.trim(), description.trim());

      if (result.success) {
        setSuccess(
          `Class created successfully! Your class code is: ${result.class.code}`
        );
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.message || "Failed to create class");
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
        <h2 className="text-2xl font-bold text-teal-600 mb-4">
          Create a New Class
        </h2>

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
              htmlFor="className"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Class Name*
            </label>
            <input
              type="text"
              id="className"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. Data Structures & Algorithms"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter class description..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-teal-300"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
