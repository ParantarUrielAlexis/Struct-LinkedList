import React, { useState } from "react";
import shape1 from "../assets/shape1.png"; // Import shape images
import shape2 from "../assets/shape2.png";
import design1 from "../assets/design1.png"; // Import design images
import design2 from "../assets/design2.png";

const CreateBadgeForm = () => {
  const [badgeType, setBadgeType] = useState("1st");
  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState("");
  const [selectedShape, setSelectedShape] = useState("shape1");
  const [selectedDesign, setSelectedDesign] = useState("design1");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true); // Show the modal when the badge is created
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className="bg-gradient-to-r from-teal-500 to-teal-600 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-500 text-center mb-6">
          Create a Badge
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Design and customize badges for 1st, 2nd, 3rd, and Participation
          awards.
        </p>

        {/* Badge Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Badge Type */}
          <div>
            <label
              htmlFor="badgeType"
              className="block text-sm font-medium text-gray-700"
            >
              Badge Type
            </label>
            <select
              id="badgeType"
              value={badgeType}
              onChange={(e) => setBadgeType(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="1st">1st Place</option>
              <option value="2nd">2nd Place</option>
              <option value="3rd">3rd Place</option>
              <option value="Participation">Participation</option>
            </select>
          </div>

          {/* Badge Name */}
          <div>
            <label
              htmlFor="badgeName"
              className="block text-sm font-medium text-gray-700"
            >
              Badge Name
            </label>
            <input
              type="text"
              id="badgeName"
              value={badgeName}
              onChange={(e) => setBadgeName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter badge name (e.g., Champion)"
              required
            />
          </div>

          {/* Badge Description */}
          <div>
            <label
              htmlFor="badgeDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Badge Description
            </label>
            <textarea
              id="badgeDescription"
              value={badgeDescription}
              onChange={(e) => setBadgeDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter a description for the badge"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Shape Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Badge Shape
            </label>
            <div className="flex items-center space-x-4">
              {/* Shape 1 */}
              <div
                className={`cursor-pointer p-2 border-2 rounded-lg ${
                  selectedShape === "shape1"
                    ? "border-teal-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedShape("shape1")}
              >
                <img
                  src={shape1}
                  alt="Shape 1"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Shape 2 */}
              <div
                className={`cursor-pointer p-2 border-2 rounded-lg ${
                  selectedShape === "shape2"
                    ? "border-teal-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedShape("shape2")}
              >
                <img
                  src={shape2}
                  alt="Shape 2"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Design Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Badge Design
            </label>
            <div className="flex items-center space-x-4">
              {/* Design 1 */}
              <div
                className={`cursor-pointer p-2 border-2 rounded-lg ${
                  selectedDesign === "design1"
                    ? "border-teal-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedDesign("design1")}
              >
                <img
                  src={design1}
                  alt="Design 1"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Design 2 */}
              <div
                className={`cursor-pointer p-2 border-2 rounded-lg ${
                  selectedDesign === "design2"
                    ? "border-teal-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedDesign("design2")}
              >
                <img
                  src={design2}
                  alt="Design 2"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
          >
            Create Badge
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold text-teal-500 text-center mb-4">
              Badge Created!
            </h3>
            <div className="relative w-32 h-32 mx-auto">
              {/* Badge Shape */}
              <img
                src={selectedShape === "shape1" ? shape1 : shape2}
                alt="Badge Shape"
                className="w-full h-full object-contain"
              />
              {/* Badge Design */}
              <img
                src={selectedDesign === "design1" ? design1 : design2}
                alt="Badge Design"
                className="absolute inset-0 w-16 h-16 object-contain m-auto"
              />
            </div>
            <p className="text-center mt-4 text-gray-600">
              <strong>{badgeName}</strong>: {badgeDescription}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBadgeForm;
