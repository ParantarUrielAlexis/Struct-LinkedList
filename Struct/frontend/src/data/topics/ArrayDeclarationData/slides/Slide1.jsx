import React, { useState } from "react";
import { FaCode, FaInfoCircle, FaRocket } from "react-icons/fa";

const Slide1 = () => {
  const [showFunFact, setShowFunFact] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Welcome to Array Declaration! 🚀
      </p>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200 shadow-md transform hover:scale-[1.01] transition-transform">
        <p>
          Arrays are one of the most fundamental data structures in programming, allowing us to store 
          multiple values in a single variable. Think of them as organized containers for your data!
        </p>
        
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {["Ordered 📋", "Indexed 🔢", "Dynamic 🔄", "Versatile 🌈"].map((trait, i) => (
            <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 transform hover:rotate-2 transition-transform">
              <p className="font-medium text-center">{trait}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md font-mono text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative">
          <p className="text-yellow-400">// Your first array</p>
          <p className="text-green-400">const superheroes = ["Spider-Man", "Iron Man", "Thor", "Hulk"];</p>
          <p className="text-blue-400">// Access first hero: superheroes[0] = "Spider-Man"</p>
        </div>
      </div>

      <button 
        onClick={() => setShowFunFact(!showFunFact)} 
        className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md flex items-center justify-center w-full transition-colors"
      >
        <FaRocket className="mr-2" /> Click for a fun fact!
      </button>
      
      {showFunFact && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 animate-fadeIn relative">
          <p className="text-sm">
            <span className="font-bold">Fun Fact:</span> Arrays in JavaScript can store different types of data in the same array! 
            You can mix numbers, strings, objects, and even other arrays - something that's not allowed in many other programming languages!
          </p>
          <div className="absolute -top-2 -right-2 bg-yellow-100 rounded-full p-1">
            <FaInfoCircle className="text-yellow-500" />
          </div>
        </div>
      )}
      
      <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
        <p className="font-medium">Ready to create your own arrays?</p>
        <p className="text-sm mt-1">Let's dive in and explore the world of array declarations!</p>
      </div>
    </div>
  );
};

export default Slide1;