import React, { useState, useEffect } from "react";
import { useClass } from "../contexts/ClassContext";
import { FaKeyboard, FaChartLine, FaTrophy } from "react-icons/fa";

const ClassUserWPM = () => {
  const [userWPMData, setUserWPMData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeClass } = useClass();

  useEffect(() => {
    const fetchUserWPMData = async () => {
      if (!activeClass) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:8000/api/classes/${activeClass.id}/users/wpm/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user WPM data");
        }

        const data = await response.json();
        setUserWPMData(data);
      } catch (error) {
        console.error("Error fetching user WPM data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWPMData();
  }, [activeClass]);

  // Sort users by overall WPM (highest first)
  const sortedUsers = [...userWPMData].sort(
    (a, b) => b.overall_avg_wpm - a.overall_avg_wpm
  );

  if (loading) {
    return <div className="p-4 text-center">Loading user typing data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!activeClass) {
    return (
      <div className="p-4 text-center">
        Please select a class to view student data.
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">
          No typing test data available for students in this class.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaKeyboard className="mr-2 text-blue-500" />
        Student Typing Performance
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <span>Average WPM</span>
                  <FaChartLine className="ml-1 text-blue-500" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Levels Completed
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user, index) => (
              <tr
                key={user.user_id}
                className={index === 0 ? "bg-yellow-50" : ""}
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
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      user.overall_avg_wpm > 40
                        ? "bg-green-100 text-green-800"
                        : user.overall_avg_wpm > 25
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.overall_avg_wpm} WPM
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.levels.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {user.levels.map((level) => (
                        <span
                          key={level.level_index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          Level {level.level_index + 1}: {level.best_wpm} WPM
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No levels completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassUserWPM;
