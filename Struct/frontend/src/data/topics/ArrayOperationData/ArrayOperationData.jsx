import React from "react";
import { FaListOl, FaLightbulb, FaGlobe } from "react-icons/fa";
import Slide1Introduction from "./slides/Slide1";
import Slide2Accessing from "./slides/Slide2";
import Slide3AddingRemoving from "./slides/Slide3";
import Slide4AddingRemovingChallenge from "./slides/Slide4";
import Slide5Searching from "./slides/Slide5";
import Slide6SearchingChallenge from "./slides/Slide6";
import Slide7MergingSplitting from "./slides/Slide7";
import Slide8MergingSplittingChallenge from "./slides/Slide8";

const ArrayOperationData = {
  label: "Operations on Arrays",
  icon: <FaListOl className="text-4xl text-blue-300" />,
  // Alternative icon option if needed
  // altIcon: <FaGlobe className="text-4xl text-blue-300" />,
  content: [
    // Slide 1 – Introduction to Array Operations
    {
      title: "Introduction to Array Operations",
      content: <Slide1Introduction />,
      hints: "Array operations allow manipulation, transformation, and optimization of data efficiently.",
    },

    // Slide 2 – Accessing Array Elements
    {
      title: "Accessing Array Elements",
      content: <Slide2Accessing />,
      hints: "Use indexing to retrieve elements. Remember, indices start at 0 in JavaScript.",
    },

    // Slide 3 – Adding and removing elements
    {
      title: "Adding and removing elements",
      content: <Slide3AddingRemoving />,
      hints: "Methods like push(), pop(), shift(), unshift() modify arrays by adding or removing elements.",
    },
    
    // Slide 4 – Challenge: Adding and Removing Elements
    {
      title: "Challenge: Adding and Removing Elements",
      content: <Slide4AddingRemovingChallenge />,
      hints: "Practice using methods to modify arrays and understand their effects on the original array.",
    },

    // Slide 5 – Searching for elements
    {
      title: "Searching for elements",
      content: <Slide5Searching />,
      hints: "Use find(), indexOf(), includes() for searching; sort() and localeCompare() for sorting.",
    },

    // Slide 6 – Searching for elements challenge
    {
      title: "Searching for elements challenge",
      content: <Slide6SearchingChallenge />,
      hints: "Practice finding elements in arrays using various search methods.",
    },
    
    // Slide 7 – Merging and Splitting Arrays
    {
      title: "Merging and Splitting Arrays",
      content: <Slide7MergingSplitting />,
      hints: "Use spread operator (...) for merging; slice() and splice() for splitting arrays.",
    },
    
    // Slide 8 - Merging and Splitting Arrays Challenge
    {
      title: "Merging and Splitting Arrays Challenge",
      content: <Slide8MergingSplittingChallenge />,
      hints: "Practice combining arrays and extracting portions of arrays with various techniques.",
    },
  ],
};

export default ArrayOperationData;