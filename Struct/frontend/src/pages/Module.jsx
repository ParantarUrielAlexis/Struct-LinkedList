import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaPlay, FaBook } from "react-icons/fa";

const lessons = [
  { id: 1, title: "Basic Definition of Arrays", duration: "30 mins" },
  { id: 2, title: "Indexing and Modifying Elements", duration: "30 mins" },
  { id: 3, title: "Static Arrays", duration: "30 mins" },
  { id: 4, title: "Dynamic Arrays", duration: "30 mins" },
  { id: 5, title: "Multidimensional Arrays", duration: "30 mins" },
  { id: 6, title: "Basic Sorting Algorithms", duration: "30 mins" },
];

const Module = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-700">Array Module</h2>
        </div>
        <ul className="p-4 space-y-4">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 cursor-pointer"
            >
              <div className="flex items-center">
                {/* Learning Icon */}
                <FaBook className="text-blue-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700">
                  Lesson {lesson.id}: {lesson.title}
                </h3>
              </div>
              <span className="text-xs text-gray-500">{lesson.duration}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Learn about Arrays
          </h1>
          <p className="text-sm text-blue-600">Basic Definitions of Arrays</p>
        </div>

        {/* Recap Section */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recap of Arrays
          </h2>
          <p className="mt-2 text-gray-600">
            An array is a data structure that stores a collection of elements,
            typically of the same data type, in a contiguous block of memory.
            Arrays are used when:
          </p>
          <ul className="mt-2 ml-4 list-disc text-gray-600">
            <li>You want to store multiple values under one name.</li>
            <li>You need fast access to elements by index.</li>
            <li>
              You want to perform operations over collections of values (e.g.,
              sums, searches, sorts).
            </li>
          </ul>
        </section>

        {/* Key Characteristics Section */}
        <section className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Key Characteristics of an Array
          </h2>
          <p className="mt-2 text-gray-600">
            Like socks in a drawer—organized, matching, and easy to find!
          </p>
          <ul className="mt-2 ml-4 list-disc text-gray-600">
            <li>
              Fixed Size: Once you decide how many elements you want, youre
              (usually) stuck with it.
            </li>
            <li>
              Indexed: Each item has an address (starting from 0), like
              apartments in a building.
            </li>
            <li>
              Homogeneous: All elements are of the same type—no mixing socks
              with shoes!
            </li>
          </ul>
        </section>

        {/* Types of Arrays Section */}
        <section className="mb-6 bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Types of Arrays
          </h2>
          <p className="mt-2 text-gray-600">
            Flat or stacked, arrays come in layers!
          </p>
          <p className="mt-2 text-gray-600">
            In C++, arrays can be classified by their dimensions. The most basic
            form is the one-dimensional array, often just called a linear array.
            Its like a single row of lockers, where each locker holds one value,
            and you access them using an index. For example,{" "}
            <code>int numbers[5]</code> declares a one-dimensional array that
            can hold five integers.
          </p>
        </section>

        {/* Common Operations Section */}
        <section className="mb-6 bg-red-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Common Operations
          </h2>
          <p className="mt-2 text-gray-600">Simple moves, powerful outcomes.</p>
          <p className="mt-2 text-gray-600">
            Once an array is declared and initialized, there are several common
            operations youll often perform. The most frequent is accessing
            elements using the index. In C++, you access the third element of an
            array using
            <code> arr[2]</code> (since indexing starts at 0). You can also
            modify an element directly:
            <code> arr[1] = 10</code> sets the second item to 10.
          </p>
        </section>

        {/* Play to Learn Section */}
        <section className="p-4 rounded-lg shadow-sm bg-teal-400">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleDropdown}
          >
            <h2 className="text-xl font-semibold text-white">Play to Learn!</h2>
            <span className="text-white">
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="mt-4 space-y-4">
              {/* Typing Test Game */}
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
                <p className="text-gray-600">Typing Test Game</p>
                <button className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600">
                  <FaPlay />
                </button>
              </div>

              {/* Sorting Game */}
              <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between">
                <p className="text-gray-600">Sorting Game</p>
                <button className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600">
                  <FaPlay />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Module;
