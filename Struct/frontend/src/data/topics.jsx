import { FaBook, FaCode, FaGamepad } from "react-icons/fa";

const topics = [
  {
    label: "Basic Definition of Arrays",
    icon: <FaBook className="text-4xl text-pink-300" />,
    content: [
      {
        title: "Key Recap of Arrays",
        content: (
          <p>
            Arrays are data structures that store multiple values under a single
            variable name. Each value is called an element, and elements are
            accessed using their index, starting from 0.
          </p>
        ),
      },
      {
        title: "Key Characteristics of Arrays",
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li>Fixed size: Arrays have a predefined size.</li>
            <li>Homogeneous: All elements are of the same data type.</li>
            <li>Indexed: Elements are accessed using indices.</li>
          </ul>
        ),
      },
      {
        title: "Types of Arrays",
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li>One-dimensional arrays</li>
            <li>Multi-dimensional arrays (e.g., 2D arrays)</li>
            <li>Dynamic arrays (e.g., ArrayList in Java)</li>
          </ul>
        ),
      },
      {
        title: "Common Operations",
        content: (
          <ul className="list-disc ml-6 space-y-2">
            <li>Traversal: Looping through elements.</li>
            <li>Insertion: Adding elements at specific indices.</li>
            <li>Deletion: Removing elements and shifting others.</li>
            <li>Search: Finding elements by value.</li>
          </ul>
        ),
      },
      {
        title: "Play the Game!",
        content: (
          <p>
            Test your knowledge of arrays by playing interactive games like
            sorting challenges and typing tests! 🎮
          </p>
        ),
      },
    ],
  },
  {
    label: "Indexing and Modifying Elements",
    icon: <FaCode className="text-4xl text-yellow-300" />,
    content: [
      {
        title: "Understanding Indexing",
        content: (
          <p>
            Indexing is the process of accessing elements in an array using
            their position. Array indices start at 0, meaning the first element
            is at index 0, the second at index 1, and so on.
          </p>
        ),
      },
      {
        title: "Accessing Elements",
        content: (
          <p>
            To access an element, use square brackets with the index. For
            example: <code>arr[2]</code> retrieves the third element of the
            array.
          </p>
        ),
      },
      {
        title: "Modifying Elements",
        content: (
          <p>
            You can modify an element by assigning a new value to its index. For
            example: <code>arr[2] = 10</code> changes the third element to 10.
          </p>
        ),
      },
      {
        title: "Out of Bounds Indexing",
        content: (
          <p>
            Accessing an index outside the array's bounds (e.g.,{" "}
            <code>arr[10]</code> when the array has only 5 elements) will result
            in an error or undefined behavior.
          </p>
        ),
      },
      {
        title: "Practice Time!",
        content: (
          <p>
            Try modifying elements in an array using an interactive coding
            environment or a game to reinforce your understanding! 🎮
          </p>
        ),
      },
    ],
  },
  {
    label: "Placeholder Topic",
    icon: <FaGamepad className="text-4xl text-cyan-300" />,
    content: [
      {
        title: "Coming Soon",
        content: <p>More exciting topics will be added here soon! 🚀</p>,
      },
    ],
  },
];

export default topics;
