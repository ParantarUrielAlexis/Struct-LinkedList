import React, { useState, useEffect, useRef } from "react";
import {
  FaUserGraduate,
  FaGamepad,
  FaUserClock,
  FaKeyboard,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaCaretDown,
  FaFilter,
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
  // New state for SortShift algorithm filter
  const [activeAlgorithm, setActiveAlgorithm] = useState("all");
  const [algorithmDropdownOpen, setAlgorithmDropdownOpen] = useState(false);
  const algorithmDropdownRef = useRef(null);
  // Add this with your other state variables at the top
  const [sortShiftData, setSortShiftData] = useState({});
  const [sortShiftLoading, setSortShiftLoading] = useState(false);
  const [sortShiftError, setSortShiftError] = useState(null);

  // Add this useEffect after your existing useEffect that fetches student WPM data
  useEffect(() => {
    const fetchSortShiftData = async () => {
      if (!activeClass) return;

      setSortShiftLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `http://localhost:8000/api/classes/${activeClass.id}/sortshift/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch SortShift data");
        }

        const data = await response.json();
        console.log("SortShift data:", data); // For debugging
        setSortShiftData(data);
      } catch (err) {
        console.error("Error fetching SortShift data:", err);
        setSortShiftError(err.message);
      } finally {
        setSortShiftLoading(false);
      }
    };

    if (activeGameType === "sortShift") {
      fetchSortShiftData();
    }
  }, [activeClass, activeGameType]);
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

  // SortShift algorithm options
  const algorithmTypes = [
    { id: "all", name: "All Algorithms" },
    { id: "selection", name: "Selection Sort" },
    { id: "bubble", name: "Bubble Sort" },
    { id: "insertion", name: "Insertion Sort" },
  ];

  // Toggle algorithm dropdown
  const toggleAlgorithmDropdown = () => {
    setAlgorithmDropdownOpen(!algorithmDropdownOpen);
  };

  // Select algorithm type
  const selectAlgorithm = (type) => {
    setActiveAlgorithm(type);
    setAlgorithmDropdownOpen(false);
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

  // Close algorithm dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (algorithmDropdownOpen && 
          algorithmDropdownRef.current && 
          !algorithmDropdownRef.current.contains(event.target)) {
        setAlgorithmDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [algorithmDropdownOpen]);

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

              {/* SortShift Performance with Algorithm Filter */}
              {activeGameType === "sortShift" && (
                <>
                  {/* Algorithm Type Selector */}
                  <div className="px-6 py-3 bg-white border-b border-gray-200">
                    <div className="relative inline-block" ref={algorithmDropdownRef}>
                      <button
                        onClick={toggleAlgorithmDropdown}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-800 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        <FaFilter className="text-orange-600" />
                        <span>
                          {algorithmTypes.find(algo => algo.id === activeAlgorithm)?.name || "All Algorithms"}
                        </span>
                        <FaCaretDown className={`transition-transform ${algorithmDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {algorithmDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {algorithmTypes.map((algorithm) => (
                              <button
                                key={algorithm.id}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  activeAlgorithm === algorithm.id
                                    ? "bg-orange-50 text-orange-800"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => selectAlgorithm(algorithm.id)}
                              >
                                {algorithm.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Filter performance by algorithm type
                    </div>
                  </div>
                  
                  {/* SortShift Table */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Information</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Best Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Time {activeAlgorithm !== "all" && `(${algorithmTypes.find(algo => algo.id === activeAlgorithm)?.name})`}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Attempts</th>
                        {activeAlgorithm === "all" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm Breakdown</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortShiftLoading ? (
                        <tr>
                          <td colSpan={activeAlgorithm === "all" ? 7 : 6} className="px-6 py-4 text-center">
                            <div className="text-gray-500">Loading SortShift data...</div>
                          </td>
                        </tr>
                      ) : sortShiftError ? (
                        <tr>
                          <td colSpan={activeAlgorithm === "all" ? 7 : 6} className="px-6 py-4 text-center">
                            <div className="text-red-500">Error: {sortShiftError}</div>
                          </td>
                        </tr>
                      ) : (
                        sortedStudents.map((student, index) => {
                          // Replace the placeholder data with real data
                          const algorithmData = sortShiftData[student.user_id] || {
                            selection: {
                              bestTime: "-",
                              avgTime: "-",
                              attempts: 0,
                              score: 0
                            },
                            bubble: {
                              bestTime: "-",
                              avgTime: "-",
                              attempts: 0,
                              score: 0
                            },
                            insertion: {
                              bestTime: "-",
                              avgTime: "-",
                              attempts: 0,
                              score: 0
                            }
                          };
                          
                          // Rest of your code remains similar, but now using real data
                          let bestTime, avgTime, totalAttempts, score, bestAlgorithm;
                          
                          if (activeAlgorithm === "all") {
                            // Find the best time across all algorithms
                            const times = [
                              algorithmData.selection.bestTime !== "-" ? algorithmData.selection.bestTime : Infinity,
                              algorithmData.bubble.bestTime !== "-" ? algorithmData.bubble.bestTime : Infinity,
                              algorithmData.insertion.bestTime !== "-" ? algorithmData.insertion.bestTime : Infinity
                            ];
                            bestTime = Math.min(...times);
                            bestTime = bestTime === Infinity ? "-" : bestTime;
                            
                            // Determine which algorithm has the best time
                            if (bestTime === algorithmData.selection.bestTime) {
                              bestAlgorithm = "Selection Sort";
                            } else if (bestTime === algorithmData.bubble.bestTime) {
                              bestAlgorithm = "Bubble Sort";
                            } else if (bestTime === algorithmData.insertion.bestTime) {
                              bestAlgorithm = "Insertion Sort";
                            } else {
                              bestAlgorithm = "No data";
                            }
                            
                            // Calculate weighted average time across all algorithms
                            const totalAttemptsAll = 
                              algorithmData.selection.attempts + 
                              algorithmData.bubble.attempts + 
                              algorithmData.insertion.attempts;
                              
                            if (totalAttemptsAll > 0) {
                              const selectionTime = algorithmData.selection.avgTime !== "-" ? algorithmData.selection.avgTime : 0;
                              const bubbleTime = algorithmData.bubble.avgTime !== "-" ? algorithmData.bubble.avgTime : 0;
                              const insertionTime = algorithmData.insertion.avgTime !== "-" ? algorithmData.insertion.avgTime : 0;
                              
                              avgTime = Math.round(
                                ((selectionTime * algorithmData.selection.attempts) +
                                (bubbleTime * algorithmData.bubble.attempts) +
                                (insertionTime * algorithmData.insertion.attempts)) / 
                                totalAttemptsAll
                              );
                            } else {
                              avgTime = "-";
                            }
                            
                            // Calculate total score (highest of individual scores)
                            score = Math.max(
                              algorithmData.selection.score || 0,
                              algorithmData.bubble.score || 0,
                              algorithmData.insertion.score || 0
                            );
                            
                            totalAttempts = totalAttemptsAll;
                          } else {
                            // Use data for specific algorithm
                            bestTime = algorithmData[activeAlgorithm].bestTime;
                            avgTime = algorithmData[activeAlgorithm].avgTime;
                            totalAttempts = algorithmData[activeAlgorithm].attempts;
                            score = algorithmData[activeAlgorithm].score || 0;
                            bestAlgorithm = algorithmTypes.find(algo => algo.id === activeAlgorithm)?.name;
                          }
                          
                          // Continue with rendering the row
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
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="px-3 py-1 inline-flex text-sm font-bold leading-5 rounded-full bg-orange-100 text-orange-800 border-2 border-orange-300">
                                  {score} pts
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                    {bestTime !== "-" ? `${bestTime}s` : "No data"}
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {bestAlgorithm}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-50 text-orange-800">
                                  {avgTime !== "-" ? `${avgTime}s` : "No data"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{totalAttempts} attempts</span>
                              </td>
                              {activeAlgorithm === "all" && (
                                <td className="px-6 py-4">
                                  <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded flex items-center">
                                      Selection: {algorithmData.selection.bestTime !== "-" ? `${algorithmData.selection.bestTime}s` : "N/A"} 
                                      <span className="ml-1 text-gray-500">({algorithmData.selection.attempts})</span>
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded flex items-center">
                                      Bubble: {algorithmData.bubble.bestTime !== "-" ? `${algorithmData.bubble.bestTime}s` : "N/A"}
                                      <span className="ml-1 text-gray-500">({algorithmData.bubble.attempts})</span>
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded flex items-center">
                                      Insertion: {algorithmData.insertion.bestTime !== "-" ? `${algorithmData.insertion.bestTime}s` : "N/A"}
                                      <span className="ml-1 text-gray-500">({algorithmData.insertion.attempts})</span>
                                    </span>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </ClassRequiredWrapper>
  );
};

export default TeacherDashboard;