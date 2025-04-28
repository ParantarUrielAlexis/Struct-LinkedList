import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    user_type: "student", // Default value
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        const errorMessage = data.email
          ? `Email: ${data.email[0]}`
          : data.username
          ? `Username: ${data.username[0]}`
          : data.password
          ? `Password: ${data.password[0]}`
          : "Registration failed. Please try again.";

        throw new Error(errorMessage);
      }

      // Registration successful
      alert("Registration successful!");
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-700 to-teal-600 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        {/* Struct Logo */}
        <div className="absolute top-2 right-2">
          <img src={logo} alt="Struct Academy Logo" className="h-8" />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-teal-500 text-center mb-4">
          Create an Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-2">
          Join Struct Academy and start your learning journey today.
        </p>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm_password"
              className="block text-xs font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Confirm your password"
              required
            />
          </div>
          {/* <div>
            <label
              htmlFor="user_type"
              className="block text-xs font-medium text-gray-700"
            >
              I am a:
            </label>
            <select
              id="user_type"
              value={formData.user_type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div> */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-password"
              className="h-4 w-4 text-teal-500 border-gray-300 rounded"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label
              htmlFor="show-password"
              className="ml-2 text-xs text-gray-700"
            >
              Show Password
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-teal-600 transition duration-300 text-sm disabled:bg-teal-300"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-teal-500 font-medium hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
