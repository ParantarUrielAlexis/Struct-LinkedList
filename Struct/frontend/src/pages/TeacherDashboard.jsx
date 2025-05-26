import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaGamepad,
  FaUserClock,
  FaKeyboard,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaCaretDown,
} from "react-icons/fa";
import { useClass } from "../contexts/ClassContext";
import ClassInfo from "../components/ClassInfo";
import ClassRequiredWrapper from "../components/ClassRequiredWrapper";

const TeacherDashboard = () => {
  const { activeClass } = useClass();
  const [studentWPMData, setStudentWPMData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeGameType, setActiveGameType] = useState("overall");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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

  // Game type options
  const gameTypes = [
    { 
      id: "overall", 
      name: "Overall Leaderboard", 
      icon: <FaTrophy className="text-yellow-500" />, 
      color: "yellow" 
    },
    { 
      id: "typingTest", 
      name: "Typing Test", 
      icon: <FaKeyboard className="text-blue-500" />, 
      color: "blue" 
    },
    { 
      id: "snakeGame", 
      name: "Snake Game", 
      icon: <FaGamepad className="text-green-500" />, 
      color: "green" 
    },
    { 
      id: "sortShift", 
      name: "SortShift", 
      icon: <FaUserClock className="text-orange-500" />, 
      color: "orange" 
    }
  ];

  // Get current game type
  const currentGameType = gameTypes.find(game => game.id === activeGameType);

  // Toggle dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Select game type
  const selectGameType = (type) => {
    setActiveGameType(type);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.game-selector')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <ClassRequiredWrapper>
      <div className="w-full px-4 py-8 mt-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Teacher Dashboard
        </h1>

        <ClassInfo />
        
        {/* Game Type Selector */}
        <div className="relative game-selector mt-6 mb-4">
          <button 
            onClick={toggleDropdown}
            className="flex items-center justify-between w-full md:w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <span className="w-6 h-6 flex items-center justify-center mr-2">
                {currentGameType?.icon}
              </span>
              <span className="font-medium text-gray-700">
                {currentGameType?.name || "Select Game Type"}
              </span>
            </div>
            <FaCaretDown className="ml-2 text-gray-500" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute z-10 w-full md:w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {gameTypes.map((game) => (
                <button
                  key={game.id}
                  className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 ${activeGameType === game.id ? 'bg-gray-100' : ''}`}
                  onClick={() => selectGameType(game.id)}
                >
                  <span className="w-6 h-6 flex items-center justify-center mr-2">
                    {game.icon}
                  </span>
                  <span className="font-medium text-gray-700">{game.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Dashboard Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              {currentGameType?.icon && <span className="mr-2">{currentGameType.icon}</span>}
              {currentGameType?.name} Dashboard
            </h2>
            {activeGameType === "overall" && (
              <p className="text-sm text-gray-500">Summary of student performance across all game types</p>
            )}
            {activeGameType === "typingTest" && (
              <p className="text-sm text-gray-500">Monitor your students' typing speed and progress</p>
            )}
            {activeGameType === "snakeGame" && (
              <p className="text-sm text-gray-500">Track student progress in the Snake typing game</p>
            )}
            {activeGameType === "sortShift" && (
              <p className="text-sm text-gray-500">Review student performance in the SortShift game</p>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading student data...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : sortedStudents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No data available for students in this class.
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Overall Leaderboard */}
              {activeGameType === "overall" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typing Test</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Snake Game</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SortShift</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedStudents.map((student, index) => (
                      <tr
                        key={`overall-${student.user_id}`}
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
                              <div className="text-sm font-medium text-gray-900">{student.username}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {Math.round(student.overall_avg_wpm * 10)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {student.overall_avg_wpm} WPM
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {/* Placeholder for Snake Game score */}
                            {Math.floor(Math.random() * 500) + 100}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            {/* Placeholder for SortShift score */}
                            {Math.floor(Math.random() * 100) + 50}s
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Typing Test Performance */}
              {activeGameType === "typingTest" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average WPM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Level Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Levels Completed</th>
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
                              <div className="text-sm font-medium text-gray-900">{student.username}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                            student.overall_avg_wpm > 40
                              ? "bg-green-100 text-green-800"
                              : student.overall_avg_wpm > 25
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
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
              )}

              {/* Snake Game Performance */}
              {activeGameType === "snakeGame" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Games Played</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedStudents.map((student, index) => {
                      // Generate placeholder snake game data
                      const bestScore = Math.floor(Math.random() * 500) + 100;
                      const avgScore = bestScore - Math.floor(Math.random() * 50);
                      const gamesPlayed = Math.floor(Math.random() * 20) + 1;
                      
                      return (
                        <tr
                          key={`snake-${student.user_id}`}
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
                                <div className="text-sm font-medium text-gray-900">{student.username}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {bestScore} pts
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-50 text-green-800">
                              {avgScore} pts
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{gamesPlayed} games</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* SortShift Performance */}
              {activeGameType === "sortShift" && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puzzles Completed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedStudents.map((student, index) => {
                      // Generate placeholder sortshift game data
                      const bestTime = Math.floor(Math.random() * 40) + 30;
                      const avgTime = bestTime + Math.floor(Math.random() * 20);
                      const puzzlesCompleted = Math.floor(Math.random() * 15) + 1;
                      
                      return (
                        <tr
                          key={`sortshift-${student.user_id}`}
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
                                <div className="text-sm font-medium text-gray-900">{student.username}</div>
                                <div className="text-xs text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              {bestTime}s
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-50 text-orange-800">
                              {avgTime}s
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{puzzlesCompleted} puzzles</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </ClassRequiredWrapper>
  );
};

export default TeacherDashboard;