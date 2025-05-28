import React from "react";
import { FaTrophy, FaUserGraduate } from "react-icons/fa";

const TypingTestPerformance = ({ students }) => {
  // Sort students by WPM (highest first)
  const sortedStudents = [...students].sort(
    (a, b) => b.overall_avg_wpm - a.overall_avg_wpm
  );

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Rank
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Student Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Average WPM
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Best Level Performance
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Levels Completed
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedStudents.map((student, index) => (
          <tr
            key={`typing-${student.user_id}`}
            className={index === 0 ? "bg-yellow-50" : "hover:bg-gray-50"}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              {index === 0 ? (
                <div className="flex items-center">
                  <FaTrophy className="text-yellow-500 mr-1" />
                  <span className="font-bold">{index + 1}</span>
                </div>
              ) : (
                <span>{index + 1}</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="h-8 w-8 flex items-center justify-center bg-teal-100 rounded-full">
                  <FaUserGraduate className="text-teal-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {student.username}
                  </div>
                  <div className="text-xs text-gray-500">{student.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  student.overall_avg_wpm > 40
                    ? "bg-green-100 text-green-800"
                    : student.overall_avg_wpm > 25
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {student.overall_avg_wpm} WPM
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              {student.levels.length > 0 ? (
                <span className="font-medium text-gray-900">
                  Level{" "}
                  {student.levels.reduce(
                    (best, level) =>
                      level.best_wpm > (best?.best_wpm || 0) ? level : best,
                    null
                  )?.level_index + 1 || "N/A"}
                  :{" "}
                  {student.levels.reduce(
                    (best, level) =>
                      level.best_wpm > (best?.best_wpm || 0) ? level : best,
                    null
                  )?.best_wpm || "N/A"}{" "}
                  WPM
                </span>
              ) : (
                <span className="text-gray-500">No data</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex gap-1 flex-wrap">
                {student.levels.map((level) => (
                  <span
                    key={level.level_index}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                  >
                    L{level.level_index + 1}
                  </span>
                ))}
                {student.levels.length === 0 && (
                  <span className="text-gray-500 text-sm">None</span>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TypingTestPerformance;
