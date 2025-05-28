import React, { useState, useEffect, useRef, useMemo } from "react";
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
  FaMedal,
  FaStar,
} from "react-icons/fa";
import { useClass } from "../contexts/ClassContext";
import ClassInfo from "../components/ClassInfo";
import ClassRequiredWrapper from "../components/ClassRequiredWrapper";
import TypingTestPerformance from "../components/TypingTestPerformance";

const API_BASE_URL = "http://localhost:8000";

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

  const [snakeGameData, setSnakeGameData] = useState([]);
  const [loadingSnakeData, setLoadingSnakeData] = useState(false);
  const [snakeDataError, setSnakeDataError] = useState(null);
  const [snakeGameStats, setSnakeGameStats] = useState(null);
  const [activeLevelFilter, setActiveLevelFilter] = useState("all");
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const levelDropdownRef = useRef(null);
  const [classSnakeData, setClassSnakeData] = useState(null);
  const calculateStars = (score) => {
    if (score >= 30) return 3;
    if (score >= 20) return 2;
    if (score >= 10) return 1;
    return 0;
  };
  // Fixed useMemo for filtered snake game data
  const filteredSnakeGameData = useMemo(() => {
    if (!snakeGameData || snakeGameData.length === 0) {
      return [];
    }

    if (activeLevelFilter === "all") {
      return snakeGameData;
    }

    // Filter students who have played the selected level
    return snakeGameData.filter((student) => {
      const levelData =
        student.level_breakdown && student.level_breakdown[activeLevelFilter];
      return levelData && levelData.attempts > 0;
    });
  }, [snakeGameData, activeLevelFilter]);

  const fetchSnakeGameData = async (classId) => {
    setLoadingSnakeData(true);
    setSnakeDataError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!classId) {
        setSnakeGameData([]);
        setSnakeGameStats({
          totalGames: 0,
          totalStars: 0,
          averageScore: 0,
          completionRate: 0,
        });
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/classes/${classId}/snake-game/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "You don't have permission to view this class's data"
          );
        } else if (response.status === 404) {
          throw new Error("Class not found");
        } else {
          throw new Error(
            `Failed to fetch snake game data: ${response.status}`
          );
        }
      }

      const data = await response.json();
      console.log("Class snake game data:", data);

      // Store the full API response for detailed views
      setClassSnakeData(data);

      // Helper function to calculate stars based on score
      const calculateStars = (score) => {
        if (score >= 30) return 3;
        if (score >= 20) return 2;
        if (score >= 10) return 1;
        return 0;
      };

      // Helper function to calculate completion rate for a student (completed levels out of 5)
      const calculateOverallCompletionRate = (levelBreakdown) => {
        if (!levelBreakdown) return 0;

        let completedLevels = 0;
        const totalLevels = 5;

        for (let level = 1; level <= totalLevels; level++) {
          const levelData = levelBreakdown[level.toString()];
          if (levelData && levelData.completed) {
            completedLevels++;
          }
        }

        return (completedLevels / totalLevels) * 100;
      };

      // Helper function to calculate total stars for a student across all levels
      const calculateTotalStars = (levelBreakdown) => {
        if (!levelBreakdown) return 0;

        let totalStars = 0;

        for (let level = 1; level <= 5; level++) {
          const levelData = levelBreakdown[level.toString()];
          if (levelData && levelData.best_score) {
            totalStars += calculateStars(levelData.best_score);
          }
        }

        return totalStars;
      };

      // Transform the API response for the main table
      const studentSnakeData = [];

      Object.values(data.students_data || {}).forEach((studentData) => {
        const student = studentData.student_info;
        const stats = studentData.overall_stats;
        const levelBreakdown = studentData.level_breakdown;

        // Calculate corrected values
        const totalStars = calculateTotalStars(levelBreakdown);
        const completionRate = calculateOverallCompletionRate(levelBreakdown);

        // Find highest completed level
        let highestLevel = 0;
        if (levelBreakdown) {
          for (let level = 5; level >= 1; level--) {
            const levelData = levelBreakdown[level.toString()];
            if (levelData && levelData.completed) {
              highestLevel = level;
              break;
            }
          }
        }

        studentSnakeData.push({
          user_id: student.id,
          username: student.username,
          email: student.email,
          best_score: stats.overall_best_score || 0,
          best_score_level: stats.overall_best_level || 1,
          total_stars: totalStars, // Use calculated stars
          games_played: stats.total_attempts,
          average_score: stats.avg_score_per_attempt,
          highest_level: highestLevel, // Use calculated highest completed level
          completion_rate: completionRate, // Use calculated completion rate
          skill_level: studentData.student_metrics?.skill_level || "Beginner",
          engagement_level:
            studentData.student_metrics?.engagement_level || "Not Started",
          progress_velocity:
            studentData.student_metrics?.progress_velocity || "Not Started",
          play_style: studentData.student_metrics?.play_style || "Unknown",
          level_breakdown: levelBreakdown,
          recent_activity: studentData.recent_activity || [],
          performance_insights: studentData.performance_insights || {},
          student_metrics: studentData.student_metrics || {},
        });
      });

      // Sort students by best score, then by total stars
      const sortedStudentData = studentSnakeData.sort((a, b) => {
        if (b.best_score !== a.best_score) {
          return b.best_score - a.best_score;
        }
        return b.total_stars - a.total_stars;
      });

      // Calculate corrected class statistics
      const totalClassStars = sortedStudentData.reduce(
        (sum, student) => sum + student.total_stars,
        0
      );
      const avgClassCompletionRate =
        sortedStudentData.length > 0
          ? sortedStudentData.reduce(
              (sum, student) => sum + student.completion_rate,
              0
            ) / sortedStudentData.length
          : 0;

      // Find top performer (highest total stars, then best score)
      const topPerformer =
        sortedStudentData.length > 0
          ? sortedStudentData.reduce((top, student) => {
              if (student.total_stars > top.total_stars) return student;
              if (
                student.total_stars === top.total_stars &&
                student.best_score > top.best_score
              )
                return student;
              return top;
            }, sortedStudentData[0])
          : null;

      // Find most engaged (most games played)
      const mostEngaged =
        sortedStudentData.length > 0
          ? sortedStudentData.reduce(
              (most, student) =>
                student.games_played > most.games_played ? student : most,
              sortedStudentData[0]
            )
          : null;

      const classSummary = data.class_summary || {};

      const classStats = {
        totalGames: classSummary.total_class_attempts || 0,
        totalStars: totalClassStars, // Use calculated total stars
        averageScore: Math.round(classSummary.class_avg_score || 0),
        completionRate: Math.round(avgClassCompletionRate), // Use calculated completion rate
        topPerformer: topPerformer,
        mostEngaged: mostEngaged,
        studentsWithProgress: sortedStudentData.filter(
          (s) => s.games_played > 0
        ).length,
        totalStudents: sortedStudentData.length,
      };

      setSnakeGameData(sortedStudentData);
      setSnakeGameStats(classStats);
    } catch (error) {
      console.error("Error fetching snake game data:", error);
      setSnakeDataError(error.message || "Failed to load snake game data");
      setSnakeGameData([]);
      setSnakeGameStats(null);
    } finally {
      setLoadingSnakeData(false);
    }
  };

  // Add this useEffect to fetch data when activeGameType changes to snakeGame
  useEffect(() => {
    if (activeGameType === "snakeGame" && activeClass?.id) {
      fetchSnakeGameData(activeClass.id);
    }
  }, [activeGameType, activeClass?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        levelDropdownRef.current &&
        !levelDropdownRef.current.contains(event.target)
      ) {
        setLevelDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Updated statistics calculation to reflect the filtered level
  // Updated statistics calculation to reflect the filtered level
  const filteredSnakeGameStats = useMemo(() => {
    // Helper function to calculate stars based on score
    const calculateStars = (score) => {
      if (score >= 30) return 3;
      if (score >= 20) return 2;
      if (score >= 10) return 1;
      return 0;
    };

    if (!filteredSnakeGameData || filteredSnakeGameData.length === 0) {
      return {
        totalGames: 0,
        totalStars: 0,
        averageScore: 0,
        completionRate: 0,
      };
    }

    if (activeLevelFilter === "all") {
      // Show overall stats when "all" is selected (use the already calculated values)
      const totalGames = filteredSnakeGameData.reduce(
        (sum, student) => sum + (student.games_played || 0),
        0
      );
      const totalStars = filteredSnakeGameData.reduce(
        (sum, student) => sum + (student.total_stars || 0),
        0
      );
      const totalScore = filteredSnakeGameData.reduce(
        (sum, student) => sum + (student.best_score || 0),
        0
      );
      const avgScore =
        filteredSnakeGameData.length > 0
          ? totalScore / filteredSnakeGameData.length
          : 0;
      const completionRate =
        filteredSnakeGameData.length > 0
          ? filteredSnakeGameData.reduce(
              (sum, student) => sum + (student.completion_rate || 0),
              0
            ) / filteredSnakeGameData.length
          : 0;

      return {
        totalGames,
        totalStars,
        averageScore: Math.round(avgScore),
        completionRate: Math.round(completionRate),
      };
    } else {
      // Show level-specific stats when a specific level is selected
      let totalGames = 0;
      let totalStars = 0;
      let totalScore = 0;
      let totalCompletions = 0;
      let studentsWithData = 0;

      filteredSnakeGameData.forEach((student) => {
        const levelData =
          student.level_breakdown && student.level_breakdown[activeLevelFilter];
        if (levelData && levelData.attempts > 0) {
          totalGames += levelData.attempts || 0;

          // Calculate stars for this specific level based on best score
          const levelStars = calculateStars(levelData.best_score || 0);
          totalStars += levelStars;

          totalScore += levelData.best_score || 0;
          if (levelData.completed) {
            totalCompletions++;
          }
          studentsWithData++;
        }
      });

      const avgScore = studentsWithData > 0 ? totalScore / studentsWithData : 0;
      const completionRate =
        studentsWithData > 0 ? (totalCompletions / studentsWithData) * 100 : 0;

      return {
        totalGames,
        totalStars,
        averageScore: Math.round(avgScore),
        completionRate: Math.round(completionRate),
      };
    }
  }, [filteredSnakeGameData, activeLevelFilter]);

  // Helper functions for level dropdown
  const toggleLevelDropdown = () => {
    setLevelDropdownOpen(!levelDropdownOpen);
  };

  const selectLevel = (level) => {
    setActiveLevelFilter(level);
    setLevelDropdownOpen(false);
  };

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
      color: "yellow",
    },
    {
      id: "typingTest",
      name: "Typing Test",
      icon: <FaKeyboard className="text-blue-500" />,
      color: "blue",
    },
    {
      id: "snakeGame",
      name: "Snake Game",
      icon: <FaGamepad className="text-green-500" />,
      color: "green",
    },
    {
      id: "sortShift",
      name: "SortShift",
      icon: <FaUserClock className="text-orange-500" />,
      color: "orange",
    },
  ];

  // Get current game type
  const currentGameType = gameTypes.find((game) => game.id === activeGameType);

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
      if (dropdownOpen && !event.target.closest(".game-selector")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close algorithm dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        algorithmDropdownOpen &&
        algorithmDropdownRef.current &&
        !algorithmDropdownRef.current.contains(event.target)
      ) {
        setAlgorithmDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [algorithmDropdownOpen]);

  // Add this function before the return statement in your TeacherDashboard component
  const getSortShiftRankedStudents = () => {
    if (activeAlgorithm === "all") {
      // When showing all algorithms, sort by the best score across any algorithm
      return [...sortedStudents].sort((a, b) => {
        const aData = sortShiftData[a.user_id] || {
          selection: { score: 0 },
          bubble: { score: 0 },
          insertion: { score: 0 },
        };

        const bData = sortShiftData[b.user_id] || {
          selection: { score: 0 },
          bubble: { score: 0 },
          insertion: { score: 0 },
        };

        const aMaxScore = Math.max(
          aData.selection.score || 0,
          aData.bubble.score || 0,
          aData.insertion.score || 0
        );

        const bMaxScore = Math.max(
          bData.selection.score || 0,
          bData.bubble.score || 0,
          bData.insertion.score || 0
        );

        // If both have a score of 0, maintain original WPM sorting
        if (aMaxScore === 0 && bMaxScore === 0) {
          return b.overall_avg_wpm - a.overall_avg_wpm;
        }

        // Otherwise sort by score (highest first)
        return bMaxScore - aMaxScore;
      });
    } else {
      // When filtering by algorithm, sort by that algorithm's score
      return [...sortedStudents].sort((a, b) => {
        const aData = sortShiftData[a.user_id] || {
          [activeAlgorithm]: { score: 0 },
        };
        const bData = sortShiftData[b.user_id] || {
          [activeAlgorithm]: { score: 0 },
        };

        const aScore = aData[activeAlgorithm]?.score || 0;
        const bScore = bData[activeAlgorithm]?.score || 0;

        // If both have a score of 0, maintain original WPM sorting
        if (aScore === 0 && bScore === 0) {
          return b.overall_avg_wpm - a.overall_avg_wpm;
        }

        // Otherwise sort by score (highest first)
        return bScore - aScore;
      });
    }
  };

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
                  className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 ${
                    activeGameType === game.id ? "bg-gray-100" : ""
                  }`}
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
              {currentGameType?.icon && (
                <span className="mr-2">{currentGameType.icon}</span>
              )}
              {currentGameType?.name} Dashboard
            </h2>
            {activeGameType === "overall" && (
              <p className="text-sm text-gray-500">
                Summary of student performance across all game types
              </p>
            )}
            {activeGameType === "typingTest" && (
              <p className="text-sm text-gray-500">
                Monitor your students' typing speed and progress
              </p>
            )}
            {activeGameType === "snakeGame" && (
              <p className="text-sm text-gray-500">
                Track student progress in the Snake typing game
              </p>
            )}
            {activeGameType === "sortShift" && (
              <p className="text-sm text-gray-500">
                Review student performance in the SortShift game
              </p>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overall Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Typing Test
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Snake Game
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SortShift
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedStudents.map((student, index) => (
                      <tr
                        key={`overall-${student.user_id}`}
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
                <TypingTestPerformance students={sortedStudents} />
              )}

              {/* Snake Game Performance */}
              {activeGameType === "snakeGame" && (
                <div>
                  {/* Level Selector */}
                  <div className="px-6 py-3 bg-white border-b border-gray-200">
                    <div
                      className="relative inline-block"
                      ref={levelDropdownRef}
                    >
                      <button
                        onClick={toggleLevelDropdown}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-800 rounded-md border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        <FaFilter className="text-green-600" />
                        <span>
                          {activeLevelFilter === "all"
                            ? "All Levels"
                            : `Level ${activeLevelFilter}`}
                        </span>
                        <FaCaretDown
                          className={`transition-transform ${
                            levelDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {levelDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <button
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                activeLevelFilter === "all"
                                  ? "bg-green-50 text-green-800"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                              onClick={() => selectLevel("all")}
                            >
                              All Levels
                            </button>
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  activeLevelFilter === level
                                    ? "bg-green-50 text-green-800"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => selectLevel(level)}
                              >
                                Level {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Filter performance by game level
                    </div>
                  </div>

                  {/* Loading State */}
                  {loadingSnakeData && (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">
                        Loading snake game data...
                      </span>
                    </div>
                  )}

                  {/* Error State */}
                  {snakeDataError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Error loading snake game data
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{snakeDataError}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Snake Game Statistics Summary */}
                  {!loadingSnakeData &&
                    !snakeDataError &&
                    filteredSnakeGameStats && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 text-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-green-100">
                                Total Games
                              </p>
                              <p className="text-2xl font-bold">
                                {Number.isNaN(filteredSnakeGameStats.totalGames)
                                  ? 0
                                  : filteredSnakeGameStats.totalGames}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4 text-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-blue-100">
                                Total Stars
                              </p>
                              <p className="text-2xl font-bold">
                                {filteredSnakeGameStats.totalStars || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-purple-100">
                                Avg Score
                              </p>
                              <p className="text-2xl font-bold">
                                {filteredSnakeGameStats.averageScore || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 text-white">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-orange-100">
                                Completion Rate
                              </p>
                              <p className="text-2xl font-bold">
                                {filteredSnakeGameStats.completionRate || 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Student Rankings Table */}
                  {!loadingSnakeData && !snakeDataError && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                      <div className="px-6 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                          Snake Game Rankings
                        </h3>
                      </div>

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
                              Best Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Stars
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Games Played
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Highest Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Avg Score
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredSnakeGameData &&
                          filteredSnakeGameData.length > 0 ? (
                            filteredSnakeGameData.map((studentData, index) => {
                              // Get level-specific data if a specific level is selected
                              const isLevelSpecific =
                                activeLevelFilter !== "all";
                              const levelData =
                                isLevelSpecific && studentData.level_breakdown
                                  ? studentData.level_breakdown[
                                      activeLevelFilter
                                    ]
                                  : null;

                              // Use level-specific data or overall data
                              const displayScore =
                                isLevelSpecific && levelData
                                  ? levelData.best_score || 0
                                  : studentData.best_score || 0;

                              const displayGamesPlayed =
                                isLevelSpecific && levelData
                                  ? levelData.attempts || 0
                                  : studentData.games_played || 0;

                              const displayAvgScore =
                                isLevelSpecific && levelData
                                  ? Math.round(levelData.avg_score || 0)
                                  : Math.round(studentData.average_score || 0);

                              const displayStars =
                                isLevelSpecific && levelData
                                  ? calculateStars(levelData.best_score || 0)
                                  : studentData.total_stars || 0;

                              const displayHighestLevel = isLevelSpecific
                                ? levelData && levelData.completed
                                  ? activeLevelFilter
                                  : `${activeLevelFilter}*`
                                : studentData.highest_level || 1;

                              return (
                                <tr
                                  key={`snake-${studentData.user_id}`}
                                  className={
                                    index === 0
                                      ? "bg-yellow-50"
                                      : "hover:bg-gray-50"
                                  }
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {index === 0 ? (
                                      <div className="flex items-center">
                                        <FaTrophy className="text-yellow-500 mr-1" />
                                        <span className="font-bold text-yellow-600">
                                          {index + 1}
                                        </span>
                                      </div>
                                    ) : index === 1 ? (
                                      <div className="flex items-center">
                                        <FaMedal className="text-gray-400 mr-1" />
                                        <span className="font-semibold text-gray-600">
                                          {index + 1}
                                        </span>
                                      </div>
                                    ) : index === 2 ? (
                                      <div className="flex items-center">
                                        <FaMedal className="text-orange-400 mr-1" />
                                        <span className="font-semibold text-orange-600">
                                          {index + 1}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-gray-500">
                                        {index + 1}
                                      </span>
                                    )}
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 rounded-full">
                                        <FaUserGraduate className="text-white text-lg" />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {studentData.username}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {studentData.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      {displayScore} pts
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <FaStar className="text-yellow-400 mr-1" />
                                      <span className="text-sm font-medium text-gray-900">
                                        {displayStars}
                                      </span>
                                      {isLevelSpecific && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          (L{activeLevelFilter})
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                      {displayGamesPlayed} games
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded bg-blue-100 text-blue-800">
                                      Level {displayHighestLevel}
                                    </span>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                      {displayAvgScore} pts
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="7" className="px-6 py-8 text-center">
                                <div className="flex flex-col items-center">
                                  <svg
                                    className="h-12 w-12 text-gray-400 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  <p className="text-gray-500 text-lg font-medium">
                                    No snake game data available
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {activeLevelFilter === "all"
                                      ? "Students haven't played the snake game yet"
                                      : `No data available for Level ${activeLevelFilter}`}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SortShift Performance with Algorithm Filter */}
              {activeGameType === "sortShift" && (
                <>
                  {/* Algorithm Type Selector */}
                  <div className="px-6 py-3 bg-white border-b border-gray-200">
                    <div
                      className="relative inline-block"
                      ref={algorithmDropdownRef}
                    >
                      <button
                        onClick={toggleAlgorithmDropdown}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-800 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        <FaFilter className="text-orange-600" />
                        <span>
                          {algorithmTypes.find(
                            (algo) => algo.id === activeAlgorithm
                          )?.name || "All Algorithms"}
                        </span>
                        <FaCaretDown
                          className={`transition-transform ${
                            algorithmDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {algorithmDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Information
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Best Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Average Time{" "}
                          {activeAlgorithm !== "all" &&
                            `(${
                              algorithmTypes.find(
                                (algo) => algo.id === activeAlgorithm
                              )?.name
                            })`}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed Attempts
                        </th>
                        {activeAlgorithm === "all" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Algorithm Breakdown
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortShiftLoading ? (
                        <tr>
                          <td
                            colSpan={activeAlgorithm === "all" ? 7 : 6}
                            className="px-6 py-4 text-center"
                          >
                            <div className="text-gray-500">
                              Loading SortShift data...
                            </div>
                          </td>
                        </tr>
                      ) : sortShiftError ? (
                        <tr>
                          <td
                            colSpan={activeAlgorithm === "all" ? 7 : 6}
                            className="px-6 py-4 text-center"
                          >
                            <div className="text-red-500">
                              Error: {sortShiftError}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        getSortShiftRankedStudents().map((student, index) => {
                          // Replace the placeholder data with real data
                          const algorithmData = sortShiftData[
                            student.user_id
                          ] || {
                            selection: {
                              bestTime: "-",
                              avgTime: "-",
                              attempts: 0,
                              score: 0,
                            },
                            bubble: {
                              bestTime: "-",
                              avgTime: "-",
                              attempts: 0,
                              score: 0,
                            },
                            insertion: {
                              bestTime: "-",
                              avgTime: "-",
                              attempts: 0,
                              score: 0,
                            },
                          };

                          // Rest of your code remains similar, but now using real data
                          let bestTime,
                            avgTime,
                            totalAttempts,
                            score,
                            bestAlgorithm;

                          if (activeAlgorithm === "all") {
                            // Find the best time across all algorithms
                            const times = [
                              algorithmData.selection.bestTime !== "-"
                                ? algorithmData.selection.bestTime
                                : Infinity,
                              algorithmData.bubble.bestTime !== "-"
                                ? algorithmData.bubble.bestTime
                                : Infinity,
                              algorithmData.insertion.bestTime !== "-"
                                ? algorithmData.insertion.bestTime
                                : Infinity,
                            ];
                            bestTime = Math.min(...times);
                            bestTime = bestTime === Infinity ? "-" : bestTime;

                            // Determine which algorithm has the best time
                            if (bestTime === algorithmData.selection.bestTime) {
                              bestAlgorithm = "Selection Sort";
                            } else if (
                              bestTime === algorithmData.bubble.bestTime
                            ) {
                              bestAlgorithm = "Bubble Sort";
                            } else if (
                              bestTime === algorithmData.insertion.bestTime
                            ) {
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
                              const selectionTime =
                                algorithmData.selection.avgTime !== "-"
                                  ? algorithmData.selection.avgTime
                                  : 0;
                              const bubbleTime =
                                algorithmData.bubble.avgTime !== "-"
                                  ? algorithmData.bubble.avgTime
                                  : 0;
                              const insertionTime =
                                algorithmData.insertion.avgTime !== "-"
                                  ? algorithmData.insertion.avgTime
                                  : 0;

                              avgTime = Math.round(
                                (selectionTime *
                                  algorithmData.selection.attempts +
                                  bubbleTime * algorithmData.bubble.attempts +
                                  insertionTime *
                                    algorithmData.insertion.attempts) /
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
                            totalAttempts =
                              algorithmData[activeAlgorithm].attempts;
                            score = algorithmData[activeAlgorithm].score || 0;
                            bestAlgorithm = algorithmTypes.find(
                              (algo) => algo.id === activeAlgorithm
                            )?.name;
                          }

                          // Continue with rendering the row
                          return (
                            <tr
                              key={`sortshift-${student.user_id}`}
                              className={
                                index === 0
                                  ? "bg-yellow-50"
                                  : "hover:bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                {index === 0 ? (
                                  <div className="flex items-center">
                                    <FaTrophy className="text-yellow-500 mr-1" />
                                    <span className="font-bold">
                                      {index + 1}
                                    </span>
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
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="px-3 py-1 inline-flex text-sm font-bold leading-5 rounded-full bg-orange-100 text-orange-800 border-2 border-orange-300">
                                  {score} pts
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                    {bestTime !== "-"
                                      ? `${bestTime}s`
                                      : "No data"}
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
                                <span className="text-sm text-gray-900">
                                  {totalAttempts} attempts
                                </span>
                              </td>
                              {activeAlgorithm === "all" && (
                                <td className="px-6 py-4">
                                  <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded flex items-center">
                                      Selection:{" "}
                                      {algorithmData.selection.bestTime !== "-"
                                        ? `${algorithmData.selection.bestTime}s`
                                        : "N/A"}
                                      <span className="ml-1 text-gray-500">
                                        ({algorithmData.selection.attempts})
                                      </span>
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded flex items-center">
                                      Bubble:{" "}
                                      {algorithmData.bubble.bestTime !== "-"
                                        ? `${algorithmData.bubble.bestTime}s`
                                        : "N/A"}
                                      <span className="ml-1 text-gray-500">
                                        ({algorithmData.bubble.attempts})
                                      </span>
                                    </span>
                                    <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded flex items-center">
                                      Insertion:{" "}
                                      {algorithmData.insertion.bestTime !== "-"
                                        ? `${algorithmData.insertion.bestTime}s`
                                        : "N/A"}
                                      <span className="ml-1 text-gray-500">
                                        ({algorithmData.insertion.attempts})
                                      </span>
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
