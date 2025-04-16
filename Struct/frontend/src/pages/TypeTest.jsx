import React, { useState, useEffect, useRef } from "react";
import "./TypeTest.css";

import { useNavigate } from "react-router-dom";

import { FaRedo } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

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

  const [difficulty, setDifficulty] = useState("Easy");

  const typingSound = new Audio(typingSoundFile);
  const pingSound = new Audio(pingSoundFile);
  const [isMuted, setIsMuted] = useState(false);

  const [showNavbar, setShowNavbar] = useState(true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // const [isDarkMode, setIsDarkMode] = useState(false);

  // const [pulseEffect, setPulseEffect] = useState(false);

  const navigate = useNavigate();

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

    // matic focus on input field
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
      // Trigger pulse effect
      // setPulseEffect(true);
      // setTimeout(() => setPulseEffect(false), 500);
      // Play ping sound when a word is completed (only if not muted)
      if (!isMuted) {
        pingSound.currentTime = 0;
        pingSound.play();
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
    return currentWord.split("").map((char, index) => {
      const isCorrect = inputValue[index] === char;
      const isTyped = index < inputValue.length;

      return (
        <span
          key={index}
          className={`letter ${
            isTyped ? (isCorrect ? "correct" : "incorrect") : ""
          }`}
        >
          {char}
        </span>
      );
    });
  };

  const renderDefinitions = () => {
    return words.slice(0, currentWordIndex + 1).map((word, index) => (
      <div key={index} className="definition-card">
        <div className="definition-word">{word}</div>
        <div className="definition-text">
          {wordDefinitions[word] || "Definition not available."}
        </div>
      </div>
    ));
  };

  // const toggleDarkMode = () => {
  //   setIsDarkMode((prev) => !prev);
  // };

  return (
    <div className="type-test-wrapper">
      {/* Navigation Bar */}
      {showNavbar && !hasStartedTyping && (
        <nav className="type-test-navbar">
          <div className="modes">
            <button
              className={`mode-button ${
                mode === "Competitive" ? "active" : ""
              }`}
              onClick={() => handleModeChange("Competitive")}
            >
              Competitive Mode
            </button>
            <button
              className={`mode-button ${mode === "Practice" ? "active" : ""}`}
              onClick={() => handleModeChange("Practice")}
            >
              Practice Mode
            </button>

            {/* Mute Button */}
            <button className="mute-button" onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            {/* Dark Mode Toggle
            <button className="dark-mode-button" onClick={toggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button> */}
          </div>

          <div className="difficulty">
            <div className="difficulty-options">
              <div
                className={`difficulty-item ${
                  difficulty === "Easy" ? "selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Easy")}
              >
                Easy
              </div>
              <div
                className={`difficulty-item ${
                  difficulty === "Medium" ? "selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Medium")}
              >
                Medium
              </div>
              <div
                className={`difficulty-item ${
                  difficulty === "Hard" ? "selected" : ""
                }`}
                onClick={() => handleDifficultyChange("Hard")}
              >
                Hard
              </div>
            </div>
          </div>
          {mode === "Competitive" && (
            <div className="timers">
              <div className="timer-options">
                <div
                  className={`timer-item ${
                    selectedTimer === 15 ? "selected" : ""
                  }`}
                  onClick={() => handleTimerChange(15)}
                >
                  15
                </div>
                <div className="line"></div>
                <div
                  className={`timer-item ${
                    selectedTimer === 30 ? "selected" : ""
                  }`}
                  onClick={() => handleTimerChange(30)}
                >
                  30
                </div>
                <div className="line"></div>
                <div
                  className={`timer-item ${
                    selectedTimer === 60 ? "selected" : ""
                  }`}
                  onClick={() => handleTimerChange(60)}
                >
                  60
                </div>
                <div className="line"></div>
                <div
                  className="timer-item custom-timer"
                  onClick={() => setShowCustomTimeModal(true)}
                >
                  <FaClock /> {/* React clock icon */}
                </div>
                {/* Back Arrow */}
                <div
                  className="timer-item back-arrow"
                  onClick={() => navigate("/module")} // Navigate back to Module.jsx
                >
                  <FaArrowLeft /> {/* React back arrow icon */}
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* Custom Timer Modal */}
      {showCustomTimeModal && (
        <div className="custom-timer-modal">
          <div className="custom-timer-modal-content">
            <h3>Set Custom Timer</h3>
            <input
              type="number"
              placeholder="Enter custom time (seconds)"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleCustomTimeSubmit}>Set Timer</button>
              <button onClick={() => setShowCustomTimeModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add gradient background and pulse effect based on game state */}
      {/* <div
        className={`game-container ${gameStarted ? "gradient" : ""} ${
          pulseEffect ? "pulse" : ""
        }`}
      > */}
      {/* Game Container */}
      <div className="game-container">
        {/* Score and Multiplier */}
        <div className="score-multiplier-container">
          <div
            className={`score-multiplier ${scoreAnimation ? "animate" : ""}`}
          >
            <span
              className={`score-display ${scoreAnimation ? "animate" : ""}`}
            >
              Score: {score}
            </span>
            <span
              className={`multiplier-display ${
                multiplierAnimation ? "animate" : ""
              }`}
            >
              Multiplier: x{multiplier.toFixed(1)}
            </span>
          </div>
        </div>

        {!gameStarted && !gameOver && (
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        )}
        {gameStarted && (
          <div className="game-layout">
            {/* Left side: Words answered */}
            <div className="answered-words">
              {words
                .slice(Math.max(0, currentWordIndex - 1), currentWordIndex)
                .map((word, index) => (
                  <div key={index} className="word-item">
                    {word}
                  </div>
                ))}
            </div>

            {/* Middle: Current word */}
            <div className="current-word">
              <div className="word-display">{renderHighlightedWord()}</div>
              <input
                type="text"
                className="input-field"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type the word here"
                ref={inputRef}
              />
              <div className="info-display">
                <span
                  className={`wpm-display ${
                    mode === "Practice" ? "centered-wpm" : ""
                  }`}
                >
                  WPM: {calculateWPM()}
                </span>
                {mode === "Competitive" && (
                  <span className="timer-display">Time Left: {timeLeft}s</span>
                )}
              </div>
              <button className="restart-button" onClick={restartGame}>
                <FaRedo className="restart-icon" /> Restart
              </button>
            </div>

            {/* Right side: Upcoming words */}
            <div className="upcoming-words">
              {words
                .slice(currentWordIndex + 1, currentWordIndex + 2)
                .map((word, index) => (
                  <div key={index} className="word-item">
                    {word}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Game Over Section */}
        {gameOver && (
          <div className="game-over-container">
            <h2 className="game-over-title">Game Over!</h2>
            <p className="game-over-wpm">Your WPM: {calculateWPM()}</p>
            <div className="definitions-container">
              <h3>Words and Definitions:</h3>
              {renderDefinitions()}
            </div>
            <button onClick={restartGame} className="restart-button">
              <FaRedo className="restart-icon" /> Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeTest;
