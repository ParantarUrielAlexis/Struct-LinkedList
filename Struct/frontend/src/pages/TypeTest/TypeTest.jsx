// TODO: Refactor levels data to a separate file

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FaPlayCircle,
  FaPauseCircle,
} from "react-icons/fa";

import typingSoundFile from "../../assets/typing.mp3";
import pingSoundFile from "../../assets/ping.mp3";
import { levels } from "./TypeTestLevelsData";

function TypeTest() {
  const { levelIndex } = useParams();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [mode, setMode] = useState("Competitive");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(null);
  const [selectedTimer, setSelectedTimer] = useState(30);

  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [multiplierAnimation, setMultiplierAnimation] = useState(false);
  const [wordAnimation, setWordAnimation] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showStreak, setShowStreak] = useState(false);

  const typingSound = useRef(new Audio(typingSoundFile));
  const pingSound = useRef(new Audio(pingSoundFile));
  const [isMuted, setIsMuted] = useState(false);

  const [showDefinition, setShowDefinition] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);

  const [backgroundState, setBackgroundState] = useState("normal");
  const [levelProgress, setLevelProgress] = useState(0);

  const currentLevelIndex = parseInt(levelIndex, 10);
  const currentLevel = levels[currentLevelIndex];
  const currentLevelWords = currentLevel ? currentLevel.words : [];
  const currentLevelDefinitions = currentLevel
    ? currentLevel.wordDefinitions
    : {};

  const resetGameState = useCallback(() => {
    setCurrentWordIndex(0);
    setInputValue("");
    setGameOver(false);
    setStartTime(null);
    setScore(0);
    setMultiplier(1);
    setMistakes(0);
    setStreakCount(0);
    setShowStreak(false);
    setBackgroundState("normal");
    setLevelProgress(0);
    setCompletedWords([]);
    setTimeLeft(selectedTimer);
  }, [selectedTimer]);

  useEffect(() => {
    if (
      currentLevelIndex >= levels.length ||
      currentLevelIndex < 0 ||
      isNaN(currentLevelIndex)
    ) {
      navigate("/type-test/levels");
      return;
    }

    resetGameState();

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    return () => {
      typingSound.current.pause();
      typingSound.current.currentTime = 0;
      pingSound.current.pause();
      pingSound.current.currentTime = 0;
    };
  }, [levelIndex, selectedTimer, mode, navigate, resetGameState]);

  useEffect(() => {
    let timerId;
    if (mode === "Competitive" && gameStarted && startTime && timeLeft > 0) {
      timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (mode === "Competitive" && timeLeft === 0 && gameStarted) {
      setGameOver(true);
      setGameStarted(false);
    }
    return () => clearTimeout(timerId);
  }, [mode, gameStarted, startTime, timeLeft]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!gameStarted && value.length > 0) {
      setGameStarted(true);
    }

    if (gameStarted && !startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    if (value.length > 0 && !isMuted) {
      typingSound.current.currentTime = 0;
      typingSound.current.play();
    }

    setInputValue(value);

    const currentWord = currentLevelWords[currentWordIndex];
    if (!currentWord) return;

    if (value === currentWord) {
      if (!isMuted) {
        pingSound.current.currentTime = 0;
        pingSound.current.play();
      }
      setCompletedWords((prev) => [...prev, currentWord]);

      setWordAnimation(true);
      setTimeout(() => setWordAnimation(false), 300);

      setStreakCount((prevStreak) => prevStreak + 1);
      if (streakCount + 1 >= 3) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 1500);
      }

      if (streakCount + 1 >= 5) {
        setBackgroundState("hot");
      } else if (backgroundState === "hot" && streakCount + 1 < 5) {
        setBackgroundState("normal");
      }

      setLevelProgress(
        Math.min(100, ((currentWordIndex + 1) / currentLevelWords.length) * 100)
      );

      const points = 5 * multiplier;
      setScore((prevScore) => prevScore + points);
      setScoreAnimation(true);

      if (mistakes === 0) {
        setMultiplier((prevMultiplier) => prevMultiplier + 1);
      } else {
        setMultiplier((prevMultiplier) => prevMultiplier + 0.5);
      }
      setMultiplierAnimation(true);

      if (currentWordIndex + 1 < currentLevelWords.length) {
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
        setInputValue("");
        setMistakes(0);
      } else {
        setGameOver(true);
        setGameStarted(false);
      }
    } else {
      if (!currentWord.startsWith(value)) {
        setMistakes((prevMistakes) => prevMistakes + 1);

        setStreakCount(0);
        setShowStreak(false);

        if (backgroundState === "hot") {
          setBackgroundState("normal");
        }

        if (mistakes + 1 === 2) {
          setMultiplier((prevMultiplier) => Math.max(1, prevMultiplier - 0.5));
          setMultiplierAnimation(true);
        }
      }
    }
  };

  useEffect(() => {
    let scoreTimer, multiplierTimer;
    if (scoreAnimation) {
      scoreTimer = setTimeout(() => setScoreAnimation(false), 300);
    }
    if (multiplierAnimation) {
      multiplierTimer = setTimeout(() => setMultiplierAnimation(false), 300);
    }
    return () => {
      clearTimeout(scoreTimer);
      clearTimeout(multiplierTimer);
    };
  }, [scoreAnimation, multiplierAnimation]);

  const calculateWPM = () => {
    if (!startTime || completedWords.length === 0) return 0;

    let elapsedSeconds;
    if (mode === "Competitive") {
      elapsedSeconds = selectedTimer - timeLeft;
      if (!gameStarted && gameOver) {
        elapsedSeconds = selectedTimer;
      } else if (!gameStarted) {
        return 0;
      }
    } else {
      elapsedSeconds = (Date.now() - startTime) / 1000;
    }

    if (elapsedSeconds <= 0) return 0;

    const totalCharactersTyped = completedWords.reduce(
      (sum, word) => sum + word.length,
      0
    );
    const minutesElapsed = elapsedSeconds / 60;
    return Math.round(totalCharactersTyped / 5 / minutesElapsed) || 0;
  };

  const renderHighlightedWord = () => {
    const currentWord = currentLevelWords[currentWordIndex];
    if (!currentWord) return null;
    return (
      <div className="text-gray-200">
        {currentWord.split("").map((char, index) => {
          const isCorrect = inputValue[index] === char;
          const isTyped = index < inputValue.length;
          const isIncorrect = isTyped && !isCorrect;

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
        {inputValue.length > currentWord.length && (
          <span className="text-red-500">
            {inputValue.substring(currentWord.length)}
          </span>
        )}
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
          {currentLevelDefinitions[word] || "Definition not available."}
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

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetGameState();
    setGameStarted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const restartCurrentLevel = () => {
    resetGameState();
    setGameStarted(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div
      className={`flex flex-col items-center min-h-screen w-full transition-all duration-500 ${
        backgroundState === "hot"
          ? "bg-gradient-to-b from-red-900 to-red-800"
          : "bg-gradient-to-b from-gray-900 to-gray-800"
      }`}
    >
      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center flex-grow w-full p-6">
        {/* Game Container */}
        {/* Removed p-6 from here */}
        <div className="relative bg-gray-800 shadow-xl w-full max-w-7xl rounded-lg border border-gray-700 backdrop-filter backdrop-blur-sm bg-opacity-80">
          {/* Mode Selection, Timer Selection, and Audio Toggle Navbar */}
          {/* Removed -mt-6 and -mx-6 from here */}
          <div className="w-full bg-gray-700 p-3 rounded-t-lg mb-6 flex justify-between items-center flex-wrap gap-2 shadow-inner">
            <div className="flex items-center gap-2 flex-grow justify-center md:justify-start">
              <button
                onClick={() => handleModeChange("Competitive")}
                className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm md:text-base ${
                  mode === "Competitive"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                Competitive
              </button>
              <button
                onClick={() => handleModeChange("Practice")}
                className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm md:text-base ${
                  mode === "Practice"
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                }`}
              >
                Practice
              </button>
            </div>
            <div className="flex items-center gap-2 flex-grow justify-center md:justify-end">
              {mode === "Competitive" && (
                <select
                  value={selectedTimer}
                  onChange={(e) => setSelectedTimer(parseInt(e.target.value))}
                  className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
                >
                  <option value={25}>25s</option>
                  <option value={40}>40s</option>
                  <option value={60}>60s</option>
                </select>
              )}
              {/* Audio Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all text-sm md:text-base"
                aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? (
                  <FaVolumeMute className="text-lg md:text-xl" />
                ) : (
                  <FaVolumeUp className="text-lg md:text-xl" />
                )}
              </button>
            </div>
          </div>
          {/* Wrapper for the rest of the content to apply padding */}
          <div className="px-6 pb-6">
            {/* Current Level Display */}
            <div className="text-center text-xl font-bold text-blue-400 mb-4">
              {currentLevel ? currentLevel.name : "Loading Level..."}
            </div>

            {/* Container for Progress Bar and Streak Indicator */}
            <div className="relative w-full mb-4">
              {" "}
              {/* Parent container for positioning */}
              {/* Progress Bar */}
              {gameStarted && (
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressBarColor()}`}
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              )}
              {/* Streak Display (Absolutely Positioned) */}
              {showStreak && (
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-orange-600 text-white font-bold px-3 py-1 rounded-lg animate-pulse flex items-center text-sm shadow-lg z-10">
                  <FaFire className="mr-1" /> {streakCount} COMBO!
                </div>
              )}
            </div>

            {/* Score and Multiplier */}
            <div className="flex justify-center gap-6 mb-6 text-lg font-bold">
              <span
                className={`text-white ${
                  scoreAnimation ? "animate-pulse" : ""
                }`}
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

            {/* --- Start Screen --- */}
            {!gameStarted && !gameOver && (
              <div className="flex flex-col items-center justify-center p-10">
                <h1 className="text-4xl font-bold text-blue-400 mb-6">
                  Ready to Type?
                </h1>
                <p className="text-gray-300 mb-8 text-center">
                  Mode: <span className="font-bold text-white">{mode}</span>
                  {mode === "Competitive" && ` ${selectedTimer}s`}
                </p>
                <button
                  onClick={() => {
                    setGameStarted(true);
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }, 100);
                  }}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                >
                  <span className="flex items-center">
                    <FaPlayCircle className="mr-2" /> Start Level
                  </span>
                </button>
              </div>
            )}

            {gameStarted && (
              <div className="flex flex-col md:flex-row w-full h-full">
                {/* Left side: Words answered */}
                <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4">
                  {completedWords.length > 0 && (
                    <div className="text-green-500 text-xl font-bold flex items-center">
                      <FaCheck className="mr-2" />{" "}
                      {completedWords[completedWords.length - 1]}
                    </div>
                  )}
                </div>

                {/* Middle: Current word and input */}
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
                    disabled={
                      !currentLevel ||
                      currentWordIndex >= currentLevelWords.length ||
                      gameOver ||
                      !gameStarted
                    }
                  />
                  <div className="flex justify-center items-center gap-x-4 w-full md:w-4/5 mb-6">
                    <div className="flex items-center bg-gray-700 px-4 py-2 rounded-lg">
                      <FaFire className="text-orange-500 mr-2" />
                      <span
                        className={`text-lg font-bold text-white ${
                          mode === "Practice" ? "mx-auto" : ""
                        }`}
                      >
                        WPM:{" "}
                        <span className="text-yellow-400">
                          {calculateWPM()}
                        </span>
                      </span>
                    </div>
                    {mode === "Competitive" && (
                      <div className="flex items-center bg-gray-700 px-4 py-2 rounded-lg">
                        <FaClock className="text-blue-400 mr-2" />
                        <span className="text-lg font-bold text-white">
                          Time:{" "}
                          <span
                            className={`${
                              timeLeft !== null && timeLeft <= 5
                                ? "text-red-500 animate-pulse"
                                : "text-white"
                            }`}
                          >
                            {timeLeft !== null ? `${timeLeft}s` : "--"}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={restartCurrentLevel}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                  >
                    <FaRedo /> Restart Level
                  </button>
                </div>

                {/* Right side: Upcoming words */}
                <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4">
                  {currentWordIndex + 1 < currentLevelWords.length && (
                    <div className="text-gray-400 text-xl font-bold my-2">
                      {currentLevelWords[currentWordIndex + 1]}
                    </div>
                  )}
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
                  {currentLevelIndex + 1 === levels.length
                    ? "All Levels Complete!"
                    : "Level Complete!"}
                </h2>
                {currentLevelIndex + 1 < levels.length && (
                  <p className="text-xl font-bold text-white mb-4">
                    Proceed to {levels[currentLevelIndex + 1].name}
                  </p>
                )}

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
                    <div className="text-gray-400">Words Typed (Level)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {multiplier.toFixed(1)}x
                    </div>
                    <div className="text-gray-400">Max Multiplier</div>
                  </div>
                </div>

                <div className="w-full bg-gray-900 rounded-lg shadow-inner p-6 mb-6 max-h-72 overflow-y-auto border border-gray-700">
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
                  {currentLevelIndex + 1 < levels.length ? (
                    <button
                      onClick={() => {
                        navigate(`/type-test/${currentLevelIndex + 1}`);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
                    >
                      <FaChevronRight /> Next Level
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/type-test/levels")}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
                    >
                      <FaRedo /> Play Again (Select Level)
                    </button>
                  )}

                  <button
                    onClick={restartCurrentLevel}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all shadow-lg hover:shadow-yellow-500/50 transform hover:-translate-y-1"
                  >
                    <FaRedo /> Play Again
                  </button>

                  <button
                    onClick={() => navigate("/type-test/levels")}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
                  >
                    <FaArrowLeft /> Main Menu
                  </button>
                </div>
              </div>
            )}
          </div>{" "}
          {/* End of new content wrapper */}
        </div>
      </div>
    </div>
  );
}

export default TypeTest;
