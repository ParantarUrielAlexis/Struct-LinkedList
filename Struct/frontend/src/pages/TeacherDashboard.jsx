import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaGamepad,
  FaUserClock,
  FaKeyboard,
  FaTrophy,
} from "react-icons/fa";
import { useClass } from "../contexts/ClassContext";
import ClassInfo from "../components/ClassInfo";
import ClassRequiredWrapper from "../components/ClassRequiredWrapper";

const TeacherDashboard = () => {
  const { activeClass } = useClass();
  const [studentWPMData, setStudentWPMData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch student WPM data when the active class changes
  useEffect(() => {
    const fetchStudentWPMData = async () => {
      if (!activeClass) return;

      setLoading(true);
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
          throw new Error("Failed to fetch student WPM data");
        }

        const data = await response.json();
        setStudentWPMData(data);
      } catch (err) {
        console.error("Error fetching student WPM data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentWPMData();
  }, [activeClass]);

  // Sort students by WPM (highest first)
  const sortedStudents = [...studentWPMData].sort(
    (a, b) => b.overall_avg_wpm - a.overall_avg_wpm
  );

  return (
    <ClassRequiredWrapper>
      <div className="w-full px-4 py-8 mt-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Teacher Dashboard
        </h1>

        <ClassInfo />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              <FaKeyboard className="mr-2 text-blue-500" />
              Students Typing Performance in {activeClass?.name}
            </h2>
            <p className="text-sm text-gray-500">
              Monitor your students' typing speed and progress
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading student data...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : sortedStudents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No typing test data available for students in this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      key={student.user_id}
                      className={
                        index === 0 ? "bg-yellow-50" : "hover:bg-gray-50"
                      }
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
                            <div className="text-xs text-gray-500">
                              {student.email}
                            </div>
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
                                level.best_wpm > (best?.best_wpm || 0)
                                  ? level
                                  : best,
                              null
                            )?.level_index + 1 || "N/A"}
                            :{" "}
                            {student.levels.reduce(
                              (best, level) =>
                                level.best_wpm > (best?.best_wpm || 0)
                                  ? level
                                  : best,
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
            </div>
          )}

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Student typing performance is based on completed typing tests.
              Encourage students to practice regularly for more accurate data.
            </p>
          </div>
        </div>
      </div>
    </ClassRequiredWrapper>
  );
};

export default TeacherDashboard;
