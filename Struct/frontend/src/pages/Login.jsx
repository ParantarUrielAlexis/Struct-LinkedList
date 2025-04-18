import React from "react";
import logo from "../assets/logo.png"; // Import your Struct logo

const Login = () => {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg relative">
        {/* Struct Logo */}
        <div className="absolute top-4 right-4">
          <img src={logo} alt="Struct Academy Logo" className="h-10" />
        </div>

        {/* Header */}
        <h2 className="text-4xl font-bold text-teal-500 text-center mb-6">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Log in to your account to continue learning.
        </p>

        {/* Login Form */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-teal-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            {/* <a href="#" className="text-sm text-teal-500 hover:underline">
              Forgot password?
            </a> */}
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-teal-500 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
