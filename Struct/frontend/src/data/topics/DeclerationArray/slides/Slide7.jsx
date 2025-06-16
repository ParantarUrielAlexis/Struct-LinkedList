import React from "react";
import { FaLightbulb, FaCheckCircle, FaBan } from "react-icons/fa";

const Slide7 = () => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-blue-600">
        Array Best Practices 📝
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium mb-3 flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" />
          Do's
        </h3>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li className="text-sm">
            <span className="font-medium">Use array methods instead of loops</span> when possible for cleaner, more readable code.
          </li>
          <li className="text-sm">
            <span className="font-medium">Prefer immutable operations</span> that return new arrays (map, filter, etc.) for better predictability.
          </li>
          <li className="text-sm">
            <span className="font-medium">Check array length</span> before accessing elements to avoid undefined values.
          </li>
          <li className="text-sm">
            <span className="font-medium">Use typed arrays</span> (Int8Array, Float32Array, etc.) for performance-critical numeric operations.
          </li>
          <li className="text-sm">
            <span className="font-medium">Destructure arrays</span> when you need specific elements for cleaner variable assignments.
          </li>
        </ul>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
        <h3 className="font-medium mb-3 flex items-center">
          <FaBan className="text-red-500 mr-2" />
          Don'ts
        </h3>
        <ul className="list-disc list-inside space-y-2 pl-2">
          <li className="text-sm">
            <span className="font-medium">Avoid modifying arrays</span> during iteration to prevent unexpected behavior.
          </li>
          <li className="text-sm">
            <span className="font-medium">Don't use delete operator</span> on arrays as it creates sparse arrays (use splice instead).
          </li>
          <li className="text-sm">
            <span className="font-medium">Avoid comparing arrays directly</span> with equality operators (== or ===) as they compare references, not values.
          </li>
          <li className="text-sm">
            <span className="font-medium">Don't rely on array length</span> for associative array-like usage (use objects or Maps instead).
          </li>
          <li className="text-sm">
            <span className="font-medium">Avoid unnecessary array copies</span> which can impact performance for large arrays.
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-4">
        <h3 className="font-medium mb-2 flex items-center">
          <FaLightbulb className="text-amber-500 mr-2" />
          Performance Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Pre-allocate Arrays</p>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p className="text-yellow-400">// Good: Pre-allocate</p>
              <p className="text-green-400">const arr = new Array(1000);</p>
              <p className="text-yellow-400">// Bad: Grow incrementally</p>
              <p className="text-green-400">const arr = [];</p>
              <p className="text-green-400">for (let i = 0; i {"<"} 1000; i++) {"{"}</p>
              <p className="text-green-400">  arr.push(i);</p>
              <p className="text-green-400">{"}"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Chaining Methods Efficiently</p>
            <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
              <p className="text-yellow-400">// Efficient chaining</p>
              <p className="text-green-400">const result = items</p>
              <p className="text-green-400">  .filter(x ={">"} x {">"} 10)</p>
              <p className="text-green-400">  .map(x ={">"} x * 2)</p>
              <p className="text-green-400">  .reduce((sum, x) ={">"} sum + x, 0);</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
        <h3 className="font-medium mb-2">Interactive Exercise</h3>
        <p className="text-sm mb-3">
          Identify which of these array operations follows best practices:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-sm font-mono">
              const filtered = arr.filter(x ={">"} x {">"} 5);
            </p>
            <p className="text-xs text-green-600 mt-1">✓ Good practice (immutable operation)</p>
          </div>
          <div className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-sm font-mono">
              for (let i = 0; i {"<"} arr.length; i++) {"{"}
              <br/>
              {"  "}arr.splice(i, 1);
              <br/>
              {"}"}
            </p>
            <p className="text-xs text-red-600 mt-1">✗ Bad practice (modifying during iteration)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide7;