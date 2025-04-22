import React, { useState } from "react";
import logo from "../assets/logo.png"; // Import your Struct logo

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Sign Up Form */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Create a password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Confirm your password"
              required
            />
          </div>
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
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-teal-600 transition duration-300 text-sm"
          >
            Sign Up
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
