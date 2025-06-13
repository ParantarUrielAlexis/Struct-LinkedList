import React from "react";
import { FaCode, FaSearch } from "react-icons/fa";

const Slide5 = () => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Looping Through Arrays 🔄
      </p>
      
      <p>
        JavaScript offers several methods for iterating over arrays, each with its own use cases.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <h3 className="font-medium mb-3">for loop</h3>
          <p className="mb-3 text-sm">
            The classic way to iterate arrays:
          </p>
          <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
            <p className="text-green-400">const fruits = ["apple", "banana", "orange"];</p>
            <p></p>
            <p className="text-green-400">for (let i = 0; i {"<"} fruits.length; i++) {"{"}</p>
            <p className="text-green-400">  console.log(`${"{i}"}: ${"{fruits[i]}"}`);</p>
            <p className="text-green-400">{"}"}</p>
            <p className="text-blue-400">// 0: apple</p>
            <p className="text-blue-400">// 1: banana</p>
            <p className="text-blue-400">// 2: orange</p>
          </div>
        </div>

        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
          <h3 className="font-medium mb-3">for...of loop</h3>
          <p className="mb-3 text-sm">
            Modern and cleaner way to iterate values:
          </p>
          <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
            <p className="text-green-400">const colors = ["red", "green", "blue"];</p>
            <p></p>
            <p className="text-green-400">for (const color of colors) {"{"}</p>
            <p className="text-green-400">  console.log(color);</p>
            <p className="text-green-400">{"}"}</p>
            <p className="text-blue-400">// red</p>
            <p className="text-blue-400">// green</p>
            <p className="text-blue-400">// blue</p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 mt-4">
        <h3 className="font-medium mb-3">forEach() Method</h3>
        <p className="mb-3 text-sm">
          Using a callback function for each element:
        </p>
        <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
          <p className="text-green-400">const numbers = [1, 2, 3, 4, 5];</p>
          <p></p>
          <p className="text-green-400">numbers.forEach((number, index) ={">"} {"{"}</p>
          <p className="text-green-400">  console.log(`Number at position ${"{index}"} is ${"{number}"}`);</p>
          <p className="text-green-400">{"}"}</p>
          <p className="text-blue-400">// Number at position 0 is 1</p>
          <p className="text-blue-400">// Number at position 1 is 2</p>
          <p className="text-blue-400">// ...</p>
        </div>
      </div>

      <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200 mt-4">
        <h3 className="font-medium mb-3">Specialized Iteration Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <FaSearch className="text-indigo-500 mr-2" size={14} />
              find() & findIndex()
            </h4>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p className="text-green-400">const users = [</p>
              <p className="text-green-400">  {"{"} id: 1, name: "Alice" {"}"},</p>
              <p className="text-green-400">  {"{"} id: 2, name: "Bob" {"}"},</p>
              <p className="text-green-400">  {"{"} id: 3, name: "Charlie" {"}"}</p>
              <p className="text-green-400">];</p>
              <p></p>
              <p className="text-green-400">const bob = users.find(user ={">"} user.name === "Bob");</p>
              <p className="text-blue-400">// {"{"} id: 2, name: "Bob" {"}"}</p>
              <p></p>
              <p className="text-green-400">const index = users.findIndex(user ={">"} user.id === 3);</p>
              <p className="text-blue-400">// 2</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <FaCode className="text-indigo-500 mr-2" size={14} />
              some() & every()
            </h4>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p className="text-green-400">const grades = [75, 80, 95, 60, 88];</p>
              <p></p>
              <p className="text-yellow-400">// Check if ANY score is failing</p>
              <p className="text-green-400">const hasFailingGrade = grades.some(grade ={">"} grade {"<"} 70);</p>
              <p className="text-blue-400">// true</p>
              <p></p>
              <p className="text-yellow-400">// Check if ALL scores are passing</p>
              <p className="text-green-400">const allPassed = grades.every(grade ={">"} grade {">="} 70);</p>
              <p className="text-blue-400">// false</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 mt-4">
        <h3 className="font-medium mb-3">Performance Considerations</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><code>for</code> loop is generally fastest for large arrays</li>
          <li><code>forEach</code> is slightly slower but more readable</li>
          <li>Array methods may create closures, impacting performance in critical code</li>
          <li>Early termination: <code>some()</code>, <code>find()</code> stop once a match is found</li>
          <li><code>forEach</code> cannot be broken out of (unlike traditional loops)</li>
        </ul>
      </div>

      <div className="mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-bold text-lg mb-3">Challenge 5: Array Iteration</h3>
        <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm mb-4">
          <p className="text-green-400">const students = [</p>
          <p className="text-green-400">{"{"} name: "Emma", grades: [85, 90, 78, 88] {"}"},</p>
          <p className="text-green-400">{"{"} name: "Michael", grades: [76, 65, 83, 90] {"}"},</p>
          <p className="text-green-400">{"{"} name: "Sofia", grades: [92, 95, 89, 88] {"}"},</p>
          <p className="text-green-400">{"{"} name: "Lucas", grades: [62, 71, 80, 75] {"}"}</p>
          <p className="text-green-400">];</p>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Calculate the average grade for each student</li>
          <li>Find the student with the highest average grade</li>
          <li>Check if all students have passed (average grade {">="} 70)</li>
          <li>Find all students who have any failing grades (below 70)</li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p className="font-medium">Hint:</p>
          <p>Use a combination of methods. For averaging grades, you can use <code>reduce()</code>. For finding students with failing grades, combine <code>filter()</code> with <code>some()</code>.</p>
        </div>
      </div>
    </div>
  );
};

export default Slide5;