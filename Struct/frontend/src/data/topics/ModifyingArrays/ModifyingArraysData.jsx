import React from "react";
import { FaCode } from "react-icons/fa";
import Slide1Introduction from "./slides/Slide1";
import Slide2Creation from "./slides/Slide2";
import Slide3Accessing from "./slides/Slide3";
import Slide4Modifying from "./slides/Slide4";
import Slide5Iteration from "./slides/Slide5";
import Slide6Methods from "./slides/Slide6";
import Slide7BestPractices from "./slides/Slide7";

const ModifyingArrays = {
  label: "Modifying Arrays",
  icon: <FaCode className="text-4xl text-blue-300" />,
  content: [
    // Slide 1 – Introduction to Arrays
    {
      title: "Introduction to Array Declaration",
      content: <Slide1Introduction />,
      hints: "Arrays are fundamental data structures that store multiple values in a single variable.",
    },

    // Slide 2 – Creating Arrays
    {
      title: "Creating Arrays",
      content: <Slide2Creation />,
      hints: "Use array literals [1, 2, 3] for most array creation scenarios.",
    },

    // Slide 3 - Accessing Array Elements
    {
      title: "Accessing Array Elements Challenge",
      content: <Slide3Accessing />,
      hints: "Remember that array indices start at 0, not 1. The first element is at position 0.",
    },

    // Slide 4 – Modifying Arrays
    {
      title: "Modifying Arrays",
      content: <Slide4Modifying />,
      hints: "Arrays in JavaScript are mutable, meaning you can change their content after creation.",
    },

    // Slide 5 - Array Iteration Methods
    {
      title: "Array Iteration Methods",
      content: <Slide5Iteration />,
      hints: "Methods like map(), filter(), and forEach() provide elegant ways to process array elements.",
    },

    // Slide 6 - Array Methods and Utilities
    {
      title: "Array Declaration Methods Challenge",
      content: <Slide6Methods />,
      hints: "JavaScript provides many built-in array methods for common operations like searching and sorting.",
    },

    // Slide 7 - Array Best Practices
    {
      title: "Array Best Practices",
      content: <Slide7BestPractices />,
      hints: "Following best practices can make your array operations more efficient and your code more readable.",
    },
    
  ],
};

export default ModifyingArrays;