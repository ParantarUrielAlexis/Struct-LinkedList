import React from "react";
import { FaCode } from "react-icons/fa";
import Slide1 from "./slides/Slide1";
import Slide2 from "./slides/Slide2";
import Slide3 from "./slides/Slide3";
import Slide4 from "./slides/Slide4";
import Slide5 from "./slides/Slide5";
import Slide6 from "./slides/Slide6";
import Slide7 from "./slides/Slide7";
import Slide8 from "./slides/Slide8";

const AdvancedArrayManipulation = {
  label: "Advanced Array Manipulation",
  icon: <FaCode className="text-4xl text-blue-300" />,
  content: [
    // Slide 1 – Introduction to Advanced Array Manipulation
    {
      title: "Introduction to Advanced Array Manipulation",
      content: <Slide1 />,
    },

    // Slide 2 – Complex Modification - Adding and Removing Elements
    {
      title: "Complex Modification - Adding and Removing Elements",
      content: <Slide2 />,
    },

    // Slide 3 - Transforming Arrays - Functional Programming Techniques
    {
      title: "Transforming Arrays - Functional Programming Techniques",
      content: <Slide3 />,
    },

    // Slide 4 – Searching and Extraction Techniques
    {
      title: "Searching and Extraction Techniques",
      content: <Slide4 />,
    },

    // Slide 5 - Sorting and Recording Arrays Efficiently
    {
      title: "Sorting and Recording Arrays Efficiently",
      content: <Slide5 />,
    },

    // Slide 6 - Working with Multidimensional Arrays & Nested Data
    {
      title: "Working with Multidimensional Arrays & Nested Data",
      content: <Slide6 />,
    },

    // Slide 7 - Real-World Applications of Advanced Array Manipulation
    {
      title: "Array Best Practices",
      content: <Slide7 />,
    },
    // Slide 8 - Conclusion and Next Steps
    {
      title: "Conclusion and Next Steps",
      content: <Slide8 />,
    },
  ],
};

export default AdvancedArrayManipulation;