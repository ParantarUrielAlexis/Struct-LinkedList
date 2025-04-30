import React from "react";
import { FaUserGraduate, FaGamepad, FaUserClock } from "react-icons/fa";
import { useClass } from "../contexts/ClassContext";
import ClassInfo from "../components/ClassInfo";
import ClassRequiredWrapper from "../components/ClassRequiredWrapper";

const TeacherDashboard = () => {
  const { activeClass } = useClass();

  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      sortRushScore: 850,
      typeTestWPM: 65,
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Sam Wilson",
      sortRushScore: 720,
      typeTestWPM: 58,
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Taylor Brown",
      sortRushScore: 930,
      typeTestWPM: 72,
      lastActive: "3 hours ago",
    },
    {
      id: 4,
      name: "Jordan Lee",
      sortRushScore: 680,
      typeTestWPM: 50,
      lastActive: "Just now",
    },
    {
      id: 5,
      name: "Casey Martinez",
      sortRushScore: 790,
      typeTestWPM: 63,
      lastActive: "5 hours ago",
    },
  ];

  return (
    <ClassRequiredWrapper>
      <div className="w-full px-4 py-8 mt-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Teacher Dashboard
        </h1>

        <ClassInfo />

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              Students in {activeClass?.name}
            </h2>
            <p className="text-sm text-gray-500">
              Monitor your students' progress in the Arrays module
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sort Rush Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typing Test WPM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex items-center justify-center bg-teal-100 rounded-full">
                          <FaUserGraduate className="text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaGamepad className="text-gray-400 mr-2" />
                        {student.sortRushScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.typeTestWPM} WPM
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaUserClock className="text-gray-400 mr-2" />
                        {student.lastActive}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              This is a preview of the teacher dashboard. More features will be
              available in the next implementation.
            </p>
          </div>
        </div>
      </div>
    </ClassRequiredWrapper>
  );
};

export default TeacherDashboard;
