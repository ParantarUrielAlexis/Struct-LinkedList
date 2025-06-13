import React from "react";
import { FaGamepad } from "react-icons/fa";
import Slide1Overview from "./slides/Slide1";
import Slide2SelectionSort from "./slides/Slide2";
import Slide3SelectionChallenge from "./slides/Slide3";
import Slide4BubbleSort from "./slides/Slide4";
import Slide5BubbleChallenge from "./slides/Slide5";
import Slide6InsertionSort from "./slides/Slide6";
import Slide7InsertionChallenge from "./slides/Slide7";
import Slide8LearningTakeAways from "./slides/Slide8";

const ArrayAlgorithmsData = {
  label: "Basic Sorting Algorithms",
  icon: <FaGamepad className="text-4xl text-cyan-300" />,
  content: [
    // Slide 1 – Overview
    {
      title: "Introduction to Sorting Algorithms",
      content: <Slide1Overview />,
      hints: "Sorting algorithms are fundamental building blocks in computer science and data processing.",
    },

    // Slide 2 – Selection Sort with Interactive Animation
    {
      title: "Selection Sort Algorithm",
      content: <Slide2SelectionSort />,
      hints: "Selection sort makes exactly n-1 swaps, which can be beneficial when write operations are costly.",
    },

    // Slide 3 - Selection Sort Interactive Challenge
     {
      title: "Sorting Algorithms Challenge",
      content: <Slide3SelectionChallenge />,
      hints: "Sorting algorithms are fundamental building blocks in computer science and data processing.",
    },

    // Slide 4 – Bubble Sort with Interactive Animation
    {
      title: "Bubble Sort Algorithm",
      content: <Slide4BubbleSort />,
      hints: "Watch how the largest elements 'bubble up' to their correct positions after each pass through the array.",
    },

    // Slide 5 - Bubble Sort Interactive Challenge
    {
      title: "Bubble Sorting Algorithm Challenge",
      content: <Slide5BubbleChallenge />,
      hints: "Remember that bubble sort compares adjacent elements and swaps them if they're in the wrong order.",
    },

    // Slide 6 - Insertion Sort Algorithm with Card-Based Animation
    {
      title: "Insertion Sort Algorithm",
      content: <Slide6InsertionSort />,
      hints: "Think about how you sort a hand of cards - you pick up one card at a time and insert it into its correct position.",
    },

    // Slide 7 - Insertion Sort Interactive Drag and Drop Challenge
    {
      title: "Insertion Sorting Algorithms Challenge",
      content: <Slide7InsertionChallenge />,
      hints: "Look for the position where the card is greater than all elements to its left, but less than the element to its right.",
    },
    {
      title: "Key Takeaways and Learning Resources",
      content: <Slide8LearningTakeAways />,
      hints: "Review the key concepts, time complexities, and practical applications of each sorting algorithm.",
    }
  ],
};

export default ArrayAlgorithmsData;