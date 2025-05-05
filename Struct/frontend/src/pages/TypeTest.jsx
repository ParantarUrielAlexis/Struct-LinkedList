// definitions not centered
import React, { useState, useEffect, useRef } from "react";
import {
  FaRedo,
  FaClock,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowLeft,
  FaFire,
  FaKeyboard,
  FaTrophy,
  FaCheck,
  FaCode,
  FaChevronRight,
} from "react-icons/fa";

import typingSoundFile from "../assets/typing.mp3";
import pingSoundFile from "../assets/ping.mp3";

const words = [
  "*(arr+i)",
  "arr[i]",
  "int*",
  "malloc",
  "realloc",
  "calloc",
  "free",
  "delete",
  "arr[i][j]",
  "*(arr+i)+j",
  "capacity * sizeof(int)",
];

const wordDefinitions = {
  "*(arr+i)": "Pointer arithmetic to access an array element.",
  "arr[i]": "Accessing an array element using an index.",
  "int*": "A pointer to an integer.",
  malloc: "Allocates memory dynamically in C.",
  realloc: "Resizes previously allocated memory in C.",
  calloc: "Allocates and initializes memory in C.",
  free: "Deallocates previously allocated memory in C.",
  delete: "Deallocates memory in C++.",
  "arr[i][j]": "Accessing a 2D array element using indices.",
  "*(arr+i)+j": "Pointer arithmetic to access a 2D array element.",
  "capacity * sizeof(int)": "Calculates the memory size required for an array.",
};

function TypeTest() {
  const inputRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [mode, setMode] = useState("Competitive");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [timeLeft, setTimeLeft] = useState(15);
  const [startTime, setStartTime] = useState(null);
  const [selectedTimer, setSelectedTimer] = useState(15);
  const [customTime, setCustomTime] = useState("");
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);

  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [multiplierAnimation, setMultiplierAnimation] = useState(false);
  const [wordAnimation, setWordAnimation] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showStreak, setShowStreak] = useState(false);

  const [difficulty, setDifficulty] = useState("Easy");

  const typingSound = new Audio(typingSoundFile);
  const pingSound = new Audio(pingSoundFile);
  const [isMuted, setIsMuted] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const [showDefinition, setShowDefinition] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);

  // Game background states
  const [backgroundState, setBackgroundState] = useState("normal");
  const [levelProgress, setLevelProgress] = useState(0);

  const startGame = () => {
    if (!gameStarted) {
      setStartTime(Date.now());
    }
    setGameStarted(true);
    setGameOver(false);
    setShowNavbar(false);
    setHasStartedTyping(false);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(mode === "Competitive" ? selectedTimer : null);
    setStartTime(null);
    setScore(0);
    setMultiplier(1);
    setMistakes(0);
    setStreakCount(0);
    setShowStreak(false);
    setBackgroundState("normal");
    setLevelProgress(0);
    setCompletedWords([]);

    // automatic focus on input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleCustomTimeSubmit = () => {
    const time = parseInt(customTime, 10);
    if (!isNaN(time) && time > 0) {
      setSelectedTimer(time);
      setTimeLeft(time);
      setShowCustomTimeModal(false);
      setCustomTime("");
    } else {
      alert("Please enter a valid number greater than 0.");
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setGameStarted(false);
    setGameOver(false);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(newMode === "Competitive" ? selectedTimer : null);
    setScore(0);
    setMultiplier(1);
    setMistakes(0);
    setStreakCount(0);
    setShowStreak(false);
    setBackgroundState("normal");
    setLevelProgress(0);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    if (mode === "Competitive" && gameStarted && startTime && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (mode === "Competitive" && timeLeft === 0) {
      setGameOver(true);
      setGameStarted(false);
    }
  }, [mode, gameStarted, startTime, timeLeft]);

  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setShowNavbar(true);
    setHasStartedTyping(false);
    setCurrentWordIndex(0);
    setInputValue("");
    setTimeLeft(selectedTimer);
    setStartTime(null);
    setScore(0);
    setMultiplier(1);
    setMistakes(0);
    setStreakCount(0);
    setShowStreak(false);
    setBackgroundState("normal");
    setLevelProgress(0);
    setCompletedWords([]);

    // automatic focus on input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    setGameStarted(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      setShowNavbar(false);
    }

    if (!isMuted) {
      typingSound.currentTime = 0;
      typingSound.play();
    }

    // timer start when user input
    if (!startTime) {
      setStartTime(Date.now());
    }

    setInputValue(value);

    const currentWord = words[currentWordIndex];

    if (value === currentWord) {
      // play ping sound if correct
      if (!isMuted) {
        pingSound.currentTime = 0;
        pingSound.play();
      }
      // Add to completed words
      setCompletedWords([...completedWords, currentWord]);

      // Word complete animation
      setWordAnimation(true);
      setTimeout(() => setWordAnimation(false), 300);

      // Increase streak
      setStreakCount((prevStreak) => prevStreak + 1);
      if (streakCount + 1 >= 3) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 1500);
      }

      // Update background state based on streak
      if (streakCount + 1 >= 5) {
        setBackgroundState("hot");
        setLevelProgress(100);
      } else {
        setLevelProgress((prev) => Math.min(100, prev + 20));
      }

      // score and multiplier calculation
      const points = 5 * multiplier;
      setScore((prevScore) => prevScore + points);
      setScoreAnimation(true);

      // multiplier calculation and animation
      if (mistakes === 0) {
        setMultiplier((prevMultiplier) => prevMultiplier + 1);
      } else {
        setMultiplier((prevMultiplier) => prevMultiplier + 0.5);
      }
      setMultiplierAnimation(true);

      // move next
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setInputValue("");
      setMistakes(0);

      // end
      if (currentWordIndex + 1 === words.length) {
        setGameOver(true);
        setGameStarted(false);
      }
    } else {
      // checking mistake
      if (!currentWord.startsWith(value)) {
        setMistakes((prevMistakes) => prevMistakes + 1);

        // Reset streak on mistake
        setStreakCount(0);
        setShowStreak(false);

        // Decrease background intensity
        if (backgroundState === "hot") {
          setBackgroundState("normal");
        }
        setLevelProgress((prev) => Math.max(0, prev - 15));

        // multiplier decreases if mistakes is 2
        if (mistakes + 1 === 2) {
          setMultiplier((prevMultiplier) => Math.max(1, prevMultiplier - 0.5)); // multiplier should never be below 1
          setMultiplierAnimation(true); // Trigger multiplier animation
        }
      }
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty);
    }
  };

  const handleTimerChange = (newTimer) => {
    if (selectedTimer !== newTimer) {
      setSelectedTimer(newTimer);
      setTimeLeft(newTimer);
    }
  };

  useEffect(() => {
    if (gameStarted && startTime && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setGameStarted(false);
    }
  }, [gameStarted, startTime, timeLeft]);

  useEffect(() => {
    if (scoreAnimation) {
      const timer = setTimeout(() => setScoreAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [scoreAnimation]);

  useEffect(() => {
    if (multiplierAnimation) {
      const timer = setTimeout(() => setMultiplierAnimation(false), 300);
      return () => clearTimeout(timer);
    }
  }, [multiplierAnimation]);

  const calculateWPM = () => {
    const elapsedTime = (Date.now() - startTime) / 1000 / 120;
    return Math.round(currentWordIndex / elapsedTime) || 0; // wpm
  };

  const renderHighlightedWord = () => {
    const currentWord = words[currentWordIndex];
    return (
      <div className="text-gray-200">
        {currentWord.split("").map((char, index) => {
          const isCorrect = inputValue[index] === char;
          const isTyped = index < inputValue.length;

          return (
            <span
              key={index}
              className={`${
                isTyped ? (isCorrect ? "text-green-500" : "text-red-500") : ""
              } ${wordAnimation ? "animate-bounce" : ""}`}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const renderDefinitions = () => {
    return completedWords.map((word, index) => (
      <div
        key={index}
        className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all border border-blue-400"
      >
        <div className="text-lg font-bold text-blue-400 mb-2">{word}</div>
        <div className="text-gray-300">
          {wordDefinitions[word] || "Definition not available."}
        </div>
      </div>
    ));
  };

  const getProgressBarColor = () => {
    if (levelProgress < 30) return "bg-blue-500";
    if (levelProgress < 60) return "bg-green-500";
    if (levelProgress < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-full transition-all duration-500 ${
        backgroundState === "hot"
          ? "bg-gradient-to-b from-red-900 to-red-800"
          : "bg-gradient-to-b from-gray-900 to-gray-800"
      }`}
    >
      {/* Navigation Bar */}
      {showNavbar && !hasStartedTyping && (
        <nav className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl p-4 bg-gray-800 shadow rounded-lg border border-gray-700 mb-2">
          <div className="flex flex-wrap justify-center gap-3 mb-4 md:mb-0">
            <button
              className={`px-3 py-2 text-sm font-bold rounded transition-colors ${
                mode === "Competitive"
                  ? "bg-blue-600 text-white"
                  : "border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => handleModeChange("Competitive")}
            >
              <span className="flex items-center gap-2">
                <FaTrophy /> Competitive Mode
              </span>
            </button>
            <button
              className={`px-3 py-2 text-sm font-bold rounded transition-colors ${
                mode === "Practice"
                  ? "bg-blue-600 text-white"
                  : "border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => handleModeChange("Practice")}
            >
              <span className="flex items-center gap-2">
                <FaKeyboard /> Practice Mode
              </span>
            </button>

            {/* Mute Button */}
            <button
              className="text-blue-400 hover:text-blue-200 transition-colors p-2"
              onClick={toggleMute}
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>
          </div>

          <div className="flex flex-col w-full md:w-auto space-y-4 md:space-y-0">
            {mode === "Competitive" && (
              <div className="flex justify-center items-center mt-4 md:mt-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-2 text-sm font-bold rounded cursor-pointer ${
                      selectedTimer === 15
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => handleTimerChange(15)}
                  >
                    15s
                  </div>

                  <div
                    className={`px-3 py-2 text-sm font-bold rounded cursor-pointer ${
                      selectedTimer === 30
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => handleTimerChange(30)}
                  >
                    30s
                  </div>

                  <div
                    className={`px-3 py-2 text-sm font-bold rounded cursor-pointer ${
                      selectedTimer === 60
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => handleTimerChange(60)}
                  >
                    60s
                  </div>

                  <div
                    className="px-3 py-2 text-sm font-bold bg-gray-700 text-blue-400 rounded cursor-pointer hover:bg-gray-600"
                    onClick={() => setShowCustomTimeModal(true)}
                  >
                    <FaClock />
                  </div>

                  {/* <div className="px-3 py-2 text-sm font-bold bg-gray-700 text-blue-400 rounded cursor-pointer hover:bg-gray-600 ml-2">
                    <FaArrowLeft />
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Custom Timer Modal */}
      {showCustomTimeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md border border-blue-500">
            <h3 className="text-xl font-bold text-blue-400 mb-4">
              Set Custom Timer
            </h3>
            <input
              type="number"
              placeholder="Enter custom time (seconds)"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCustomTimeSubmit}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
              >
                Set Timer
              </button>
              <button
                onClick={() => setShowCustomTimeModal(false)}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div className="relative bg-gray-800 shadow-xl w-full max-w-6xl p-6 rounded-lg border border-gray-700 backdrop-filter backdrop-blur-sm bg-opacity-80">
        {showStreak && (
          <div className="absolute top-4 right-4 bg-orange-600 text-white font-bold px-4 py-2 rounded-lg animate-pulse flex items-center">
            <FaFire className="mr-2" /> {streakCount} COMBO!
          </div>
        )}

        {/* Progress Bar */}
        {gameStarted && (
          <div className="w-full h-2 mb-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        )}

        {/* Score and Multiplier */}
        <div className="flex justify-center gap-6 mb-6 text-lg font-bold">
          <span
            className={`text-white ${scoreAnimation ? "animate-pulse" : ""}`}
          >
            Score: <span className="text-yellow-400">{score}</span>
          </span>
          <span
            className={`text-blue-400 ${
              multiplierAnimation ? "animate-pulse" : ""
            }`}
          >
            Multiplier:{" "}
            <span className="text-green-400">x{multiplier.toFixed(1)}</span>
          </span>
        </div>

        {!gameStarted && !gameOver && (
          <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-bold text-blue-400 mb-6">
              Array Syntax Speed Typer
            </h1>
            <p className="text-gray-300 mb-8 text-center">
              Test your array syntax typing speed and accuracy
            </p>
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <span className="absolute -top-2 -left-2 bg-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center text-white">
                  1
                </span>
                <FaCode className="text-5xl text-blue-400" />
              </div>
              <FaChevronRight className="text-gray-500 mx-4 text-2xl mt-3" />
              <div className="relative">
                <span className="absolute -top-2 -left-2 bg-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center text-white">
                  2
                </span>
                <FaKeyboard className="text-5xl text-green-400" />
              </div>
              <FaChevronRight className="text-gray-500 mx-4 text-2xl mt-3" />
              <div className="relative">
                <span className="absolute -top-2 -left-2 bg-blue-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center text-white">
                  3
                </span>
                <FaTrophy className="text-5xl text-yellow-400" />
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
            >
              <span className="flex items-center">
                Start Typing <FaKeyboard className="ml-2" />
              </span>
            </button>
          </div>
        )}

        {gameStarted && (
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* Left side: Words answered */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4">
              {words
                .slice(Math.max(0, currentWordIndex - 1), currentWordIndex)
                .map((word, index) => (
                  <div
                    key={index}
                    className="text-green-500 text-xl font-bold flex items-center"
                  >
                    <FaCheck className="mr-2" /> {word}
                  </div>
                ))}
            </div>

            {/* Middle: Current word */}
            <div className="flex flex-col items-center justify-center flex-2 p-6 w-full md:w-auto">
              <div
                className={`text-3xl font-bold mb-6 p-4 border-b-2 border-blue-500 ${
                  wordAnimation ? "scale-110 transition-all" : ""
                }`}
              >
                {renderHighlightedWord()}
              </div>
              <input
                type="text"
                className="w-full md:w-4/5 p-4 border-2 border-blue-500 bg-gray-700 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type the word here"
                ref={inputRef}
              />
              <div className="flex justify-center items-center gap-x-4 w-full md:w-4/5 mb-6">
                <div className="flex items-center bg-gray-700 px-4 py-2">
                  <FaFire className="text-orange-500 mr-2" />
                  <span
                    className={`text-lg font-bold text-white ${
                      mode === "Practice" ? "mx-auto" : ""
                    }`}
                  >
                    WPM:{" "}
                    <span className="text-yellow-400">{calculateWPM()}</span>
                  </span>
                </div>
                {mode === "Competitive" && (
                  <div className="flex items-center bg-gray-700 px-4 py-2">
                    <FaClock className="text-blue-400 mr-2" />
                    <span className="text-lg font-bold text-white">
                      Time:{" "}
                      <span
                        className={`${
                          timeLeft <= 5
                            ? "text-red-500 animate-pulse"
                            : "text-white"
                        }`}
                      >
                        {timeLeft}s
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                onClick={restartGame}
              >
                <FaRedo /> Restart
              </button>
            </div>

            {/* Right side: Upcoming words */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4">
              {words
                .slice(currentWordIndex + 1, currentWordIndex + 2)
                .map((word, index) => (
                  <div
                    key={index}
                    className={`text-gray-400 text-xl font-bold my-2 ${
                      index === 0 ? "" : ""
                    }`}
                  >
                    {word}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Game Over Section */}
        {gameOver && (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 animate-fade-in border border-blue-500">
            <div className="bg-blue-600 -mt-12 rounded-full p-4 shadow-lg mb-4">
              <FaTrophy className="text-4xl text-yellow-300" />
            </div>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              Game Complete!
            </h2>
            <p className="text-xl font-bold text-white mb-6">
              Your WPM:{" "}
              <span className="text-yellow-400">{calculateWPM()}</span>
            </p>

            <div className="flex justify-around w-full mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {score}
                </div>
                <div className="text-gray-400">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {completedWords.length}
                </div>
                <div className="text-gray-400">Words Typed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {multiplier.toFixed(1)}x
                </div>
                <div className="text-gray-400">Max Multiplier</div>
              </div>
            </div>

            <div className="w-full bg-gray-900 rounded-lg shadow-inner p-6 mb-6 max-h-96 overflow-y-auto border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-400">
                  Words and Definitions:
                </h3>
                <button
                  onClick={() => setShowDefinition(!showDefinition)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {showDefinition ? "Hide Definitions" : "Show Definitions"}
                </button>
              </div>
              {showDefinition ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDefinitions()}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {completedWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 px-3 py-1 rounded text-blue-400 border border-gray-600"
                    >
                      {word}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
              >
                <FaRedo /> Play Again
              </button>
              <button
                onClick={() => {
                  setGameOver(false);
                  setShowNavbar(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
              >
                <FaArrowLeft /> Main Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeTest;
