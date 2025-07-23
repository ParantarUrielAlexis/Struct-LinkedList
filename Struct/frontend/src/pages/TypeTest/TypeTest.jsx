// TODO: add more levels/change levels or change words and ask if can merge
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { FaHeart } from "react-icons/fa";
import axios from "axios";

import { useParams, useNavigate } from "react-router-dom";
// Assuming levels and sound files are correctly pathed
import typingSoundFile from "../../assets/typing.mp3";
import pingSoundFile from "../../assets/ping.mp3";
import { levels, randomizeLevel } from "./TypeTestLevelsData";
import { useAuth } from "../../contexts/AuthContext";

// Import the split components
import {
  TypeTestNavbar,
  LevelProgressDisplay,
  GameStats,
  StartScreen,
  GamePlayArea,
  GameOverScreen,
} from "./TypeTestComponents"; // Adjust path if you saved them elsewhere

function TypeTest() {
  const { isAuthenticated, user, authToken, updateUser } = useAuth();

  const [hearts, setHearts] = useState(0);
  const [showNoHeartsModal, setShowNoHeartsModal] = useState(false);
  const [hasDeductedHeart, setHasDeductedHeart] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setHearts(user.hearts || 0);
    }
  }, [isAuthenticated, user]);

  const deductHeart = async () => {
    try {
      if (isAuthenticated && user) {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // Check if user has hearts before deducting
        const currentHearts = user.hearts || 0;
        if (currentHearts <= 0) {
          setShowNoHeartsModal(true);
          return false;
        }

        const newHeartCount = Math.max(0, currentHearts - 1);
        const API_BASE_URL = "http://localhost:8000";

        // Update backend first
        await axios.patch(
          `${API_BASE_URL}/api/user/profile/`,
          { hearts: newHeartCount },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        // Update local state
        setHearts(newHeartCount);

        // Update user context
        if (typeof updateUser === "function") {
          updateUser({
            ...user,
            hearts: newHeartCount,
          });
        }

        return true;
      }
    } catch (error) {
      console.error("Error deducting heart:", error);
      return false;
    }
  };

  const { levelIndex: levelIndexParam } = useParams();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const typingSound = useRef(null);
  const pingSound = useRef(null);

  const currentLevelIndex = useMemo(
    () => parseInt(levelIndexParam, 10),
    [levelIndexParam]
  );

  const [currentLevel, setCurrentLevel] = useState(null);

  // Initialize currentLevel when component mounts or levelIndex changes
  useEffect(() => {
    if (currentLevelIndex >= 0 && currentLevelIndex < levels.length) {
      setCurrentLevel(levels[currentLevelIndex]);
    }
  }, [currentLevelIndex]);

  const currentLevelWords = useMemo(
    () => (currentLevel ? currentLevel.words : []),
    [currentLevel]
  );
  const currentLevelDefinitions = useMemo(
    () => (currentLevel ? currentLevel.wordDefinitions : {}),
    [currentLevel]
  );

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState("Competitive");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(30);
  const [timeLeft, setTimeLeft] = useState(selectedTimer);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [multiplierAnimation, setMultiplierAnimation] = useState(false);
  const [wordAnimation, setWordAnimation] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDefinitionGameOver, setShowDefinitionGameOver] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);
  const [backgroundState, setBackgroundState] = useState("normal");
  const [levelProgress, setLevelProgress] = useState(0);

  const calculateStars = useCallback(
    (timeTaken, selectedTimer, allWordsCompleted) => {
      // words not completed then 0 stars
      if (!allWordsCompleted) {
        return 0;
      }

      // if timer is 30 , then reward 3 stars
      if (selectedTimer === 30) {
        return 3;
      } else if (selectedTimer === 40) {
        return 2;
      } else if (selectedTimer === 60) {
        return 1;
      }

      return 0; // default no stars if no timer, (for practice)
    },
    []
  );

  useEffect(() => {
    typingSound.current = new Audio(typingSoundFile);
    pingSound.current = new Audio(pingSoundFile);
    return () => {
      typingSound.current?.pause();
      if (typingSound.current) typingSound.current.src = "";
      pingSound.current?.pause();
      if (pingSound.current) pingSound.current.src = "";
    };
  }, []);

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
    setShowDefinitionGameOver(false);
  }, [selectedTimer]);

  useEffect(() => {
    if (
      isNaN(currentLevelIndex) ||
      currentLevelIndex < 0 ||
      currentLevelIndex >= levels.length
    ) {
      navigate("/type-test/levels");
      return;
    }
    resetGameState();
    setGameStarted(false);
    const timerId = setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      clearTimeout(timerId);
      typingSound.current?.pause();
      if (typingSound.current) typingSound.current.currentTime = 0;
      pingSound.current?.pause();
      if (pingSound.current) pingSound.current.currentTime = 0;
    };
  }, [currentLevelIndex, selectedTimer, mode, navigate, resetGameState]);

  useEffect(() => {
    let timerId;
    if (
      mode === "Competitive" &&
      gameStarted &&
      startTime &&
      timeLeft > 0 &&
      !gameOver
    ) {
      timerId = setTimeout(
        () => setTimeLeft((prevTime) => Math.max(0, prevTime - 1)),
        1000
      );
    } else if (
      mode === "Competitive" &&
      timeLeft === 0 &&
      gameStarted &&
      !gameOver
    ) {
      setGameOver(true);
    }
    return () => clearTimeout(timerId);
  }, [mode, gameStarted, startTime, timeLeft, gameOver]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (!gameStarted && value.length > 0) {
        setGameStarted(true);
        if (!startTime) setStartTime(Date.now());
      }

      if (value.length > 0 && !isMuted && typingSound.current) {
        typingSound.current.currentTime = 0;
        typingSound.current
          .play()
          .catch((err) => console.error("Typing sound error:", err));
      }
      setInputValue(value);

      const currentWord = currentLevelWords[currentWordIndex];
      if (!currentWord) return;

      if (value === currentWord) {
        if (!isMuted && pingSound.current) {
          pingSound.current.currentTime = 0;
          pingSound.current
            .play()
            .catch((err) => console.error("Ping sound error:", err));
        }
        setCompletedWords((prev) => [...prev, currentWord]);
        setWordAnimation(true);
        const newStreakCount = streakCount + 1;
        setStreakCount(newStreakCount);
        if (newStreakCount >= 3) setShowStreak(true);
        setBackgroundState(newStreakCount >= 5 ? "hot" : "normal");
        setLevelProgress(
          Math.min(
            100,
            ((currentWordIndex + 1) / currentLevelWords.length) * 100
          )
        );
        setScore((prevScore) => prevScore + 5 * multiplier);
        setScoreAnimation(true);
        setMultiplier(
          (prevMultiplier) => prevMultiplier + (mistakes === 0 ? 1 : 0.5)
        );
        // Only trigger multiplier animation if game has started
        if (gameStarted) {
          setMultiplierAnimation(true);
        }

        if (currentWordIndex + 1 < currentLevelWords.length) {
          setCurrentWordIndex((prevIndex) => prevIndex + 1);
          setInputValue("");
          setMistakes(0);
        } else {
          setGameOver(true);
        }
      } else {
        if (value.length > 0 && !currentWord.startsWith(value)) {
          setMistakes((prevMistakes) => prevMistakes + 1);
          setStreakCount(0);
          setShowStreak(false);
          setBackgroundState("normal");
          if (mistakes + 1 === 2) {
            setMultiplier((prevMultiplier) =>
              Math.max(1, prevMultiplier - 0.5)
            );
            // Only trigger multiplier animation if game has started
            if (gameStarted) {
              setMultiplierAnimation(true);
            }
          }
        }
      }
    },
    [
      gameStarted,
      startTime,
      isMuted,
      currentLevelWords,
      currentWordIndex,
      streakCount,
      multiplier,
      mistakes,
    ]
  );

  useEffect(() => {
    let id;
    if (scoreAnimation) id = setTimeout(() => setScoreAnimation(false), 300);
    return () => clearTimeout(id);
  }, [scoreAnimation]);
  useEffect(() => {
    let id;
    if (multiplierAnimation)
      id = setTimeout(() => setMultiplierAnimation(false), 300);
    return () => clearTimeout(id);
  }, [multiplierAnimation]);
  useEffect(() => {
    let id;
    if (wordAnimation) id = setTimeout(() => setWordAnimation(false), 300);
    return () => clearTimeout(id);
  }, [wordAnimation]);
  useEffect(() => {
    let id;
    if (showStreak) id = setTimeout(() => setShowStreak(false), 1500);
    return () => clearTimeout(id);
  }, [showStreak, streakCount]);

  const currentWordToDisplay = useMemo(
    () => currentLevelWords[currentWordIndex],
    [currentLevelWords, currentWordIndex]
  );
  const progressBarColor = useMemo(() => {
    if (levelProgress < 30) return "bg-blue-500";
    if (levelProgress < 60) return "bg-green-500";
    if (levelProgress < 90) return "bg-yellow-500";
    return "bg-red-500";
  }, [levelProgress]);

  const handleModeChange = useCallback((newMode) => setMode(newMode), []);
  const handleTimerSelection = useCallback(
    (e) => setSelectedTimer(parseInt(e.target.value, 10)),
    []
  );
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        // If will be muted (prev is false)
        typingSound.current?.pause();
        pingSound.current?.pause();
      }
      return !prev;
    });
  }, []);
  // In TypeTest.jsx - modify the restartCurrentLevel function
  const restartCurrentLevel = useCallback(() => {
    // Re-randomize the current level
    const newLevel = randomizeLevel(currentLevelIndex);
    if (newLevel) {
      // Update the current level with new randomized words
      setCurrentLevel(newLevel); // You'll need to add this state
    }

    resetGameState();
    setGameStarted(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [resetGameState, currentLevelIndex]);

  const handleStartGame = useCallback(async () => {
    // Check hearts before starting (only in Competitive mode)
    if (isAuthenticated && mode === "Competitive" && (user.hearts || 0) <= 0) {
      setShowNoHeartsModal(true);
      return;
    }

    // Randomize the current level when starting the game
    const newLevel = randomizeLevel(currentLevelIndex);
    if (newLevel) {
      setCurrentLevel(newLevel);
    }

    // Deduct heart when starting the game (only in Competitive mode)
    if (isAuthenticated && mode === "Competitive" && !hasDeductedHeart) {
      const success = await deductHeart();
      if (!success) {
        return; // Don't start game if heart deduction failed
      }
      setHasDeductedHeart(true);
    }

    setGameStarted(true);
    if (!startTime) setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [
    startTime,
    isAuthenticated,
    user,
    hasDeductedHeart,
    currentLevelIndex,
    mode,
  ]);

  // Add handler for no hearts modal continue button
  const handleContinueClick = () => {
    navigate("/type-test/levels");
  };

  // Add redirection timer for no hearts modal
  useEffect(() => {
    let redirectTimer;

    if (showNoHeartsModal) {
      redirectTimer = setTimeout(() => {
        navigate("/type-test/levels");
      }, 5000); // 5 seconds timeout
    }

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [showNoHeartsModal, navigate]);

  // Add page refresh protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (gameStarted && !gameOver) {
        const message =
          "Are you sure you want to leave? Your heart has already been deducted.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameStarted, gameOver]);

  // Add this missing function after your other callback functions
  const navigateToNextLevel = useCallback(() => {
    const nextLevelIndex = currentLevelIndex + 1;
    if (nextLevelIndex < levels.length) {
      navigate(`/type-test/${nextLevelIndex}`);
    }
  }, [currentLevelIndex, navigate]);

  // Reset heart deduction flag when level changes
  useEffect(() => {
    setHasDeductedHeart(false);
  }, [currentLevelIndex]);

  const navigateToLevels = useCallback(
    () => navigate("/type-test/levels"),
    [navigate]
  );
  const toggleShowDefinitionGameOver = useCallback(
    () => setShowDefinitionGameOver((prev) => !prev),
    []
  );

  // Props for GameOverScreen
  const gameStatusTitle = useMemo(() => {
    const allWordsDone =
      currentWordIndex + 1 >= currentLevelWords.length ||
      completedWords.length === currentLevelWords.length;
    if (allWordsDone && (timeLeft > 0 || mode === "Practice"))
      return "Level Complete!";
    if (timeLeft === 0 && mode === "Competitive") return "Time's Up!";
    return "Game Over"; // Should ideally not be reached if logic is tight
  }, [currentWordIndex, currentLevelWords, completedWords, timeLeft, mode]);

  const nextLevelName = useMemo(() => {
    return currentLevelIndex + 1 < levels.length
      ? levels[currentLevelIndex + 1].name
      : null;
  }, [currentLevelIndex]);

  const isLastLevel = useMemo(
    () => currentLevelIndex + 1 >= levels.length,
    [currentLevelIndex]
  );
  const allWordsTypedInLevel = useMemo(
    () =>
      completedWords.length === currentLevelWords.length &&
      currentLevelWords.length > 0,
    [completedWords, currentLevelWords]
  );

  // Determine if navbar should be shown
  const showNavbar = !gameStarted || gameOver;

  const wpm = useMemo(() => {
    if (!startTime || completedWords.length === 0) return 0;
    let elapsedSeconds;
    if (mode === "Competitive") {
      elapsedSeconds = selectedTimer - timeLeft;
      if (gameOver && gameStarted)
        elapsedSeconds = (Date.now() - startTime) / 1000;
      else if (!gameStarted && gameOver) elapsedSeconds = selectedTimer;
      else if (!gameStarted) return 0;
    } else {
      elapsedSeconds = (Date.now() - startTime) / 1000;
    }
    if (elapsedSeconds <= 0) return 0;
    const totalChars = completedWords.reduce(
      (sum, word) => sum + word.length,
      0
    );
    return Math.round(totalChars / 5 / (elapsedSeconds / 60)) || 0;
  }, [
    startTime,
    completedWords,
    mode,
    selectedTimer,
    timeLeft,
    gameStarted,
    gameOver,
  ]);

  // New better implementation of sendProgressToBackend
  const sendProgressToBackend = useCallback(async (progressData) => {
    // Create a copy with rounded score
    const modifiedData = {
      ...progressData,
      score: Math.round(progressData.score), // Round the floating point score to an integer
    };

    console.log("Sending progress data:", modifiedData);

    try {
      const response = await fetch(
        "http://localhost:8000/api/progress/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(modifiedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save type test progress:", errorData);
        return false;
      } else {
        const savedProgress = await response.json();
        console.log("Type test progress saved successfully:", savedProgress);
        return true;
      }
    } catch (error) {
      console.error("Error sending type test progress:", error);
      return false;
    }
  }, []);

  // Updated useEffect for game completion
  useEffect(() => {
    const handleGameCompletion = async () => {
      if (
        gameOver &&
        gameStarted &&
        isAuthenticated &&
        user &&
        mode === "Competitive"
      ) {
        const finalTimeTaken = selectedTimer - timeLeft;
        const allWordsCompleted =
          completedWords.length === currentLevelWords.length;
        const finalStars = calculateStars(
          finalTimeTaken,
          selectedTimer,
          allWordsCompleted
        );

        const progressData = {
          level_index: currentLevelIndex,
          time_taken: finalTimeTaken,
          selected_timer: selectedTimer,
          wpm: wpm,
          score: score,
          stars_earned: finalStars,
          all_words_completed: allWordsCompleted,
        };

        await sendProgressToBackend(progressData);

        // Set gameStarted to false AFTER the API call completes
        setGameStarted(false);
      }
    };

    handleGameCompletion();
  }, [
    gameOver,
    gameStarted,
    isAuthenticated,
    user,
    mode,
    currentLevelIndex,
    selectedTimer,
    timeLeft,
    wpm,
    score,
    calculateStars,
    sendProgressToBackend,
    completedWords,
    currentLevelWords, // Added this dependency
  ]);

  if (!currentLevel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading level...
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center min-h-screen w-full transition-all duration-500 ${
        backgroundState === "hot"
          ? "bg-gradient-to-b from-red-900 to-red-800"
          : "bg-gradient-to-b from-gray-900 to-gray-800"
      }`}
    >
      <div className="flex flex-col items-center justify-center flex-grow w-full p-6">
        <div className="relative bg-gray-800 shadow-xl w-full max-w-7xl rounded-lg border border-gray-700 backdrop-filter backdrop-blur-sm bg-opacity-80">
          {showNavbar && (
            <TypeTestNavbar
              mode={mode}
              selectedTimer={selectedTimer}
              isMuted={isMuted}
              gameStarted={gameStarted}
              gameOver={gameOver}
              levelName={currentLevel.name}
              onModeChange={handleModeChange}
              onTimerChange={handleTimerSelection}
              onToggleMute={toggleMute}
            />
          )}

          {/* Add heart counter - place this after the navbar
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center bg-gray-700 px-3 py-2 rounded-lg shadow-lg">
              <FaHeart className="text-red-500 mr-2" />
              <span className="text-white font-bold">{hearts}</span>
            </div>
          </div> */}

          <div className="px-6 pb-6">
            <LevelProgressDisplay
              gameStarted={gameStarted}
              gameOver={gameOver}
              levelName={currentLevel.name}
              levelProgress={levelProgress}
              progressBarColor={progressBarColor}
              showStreak={showStreak}
              streakCount={streakCount}
            />
            <GameStats
              score={score}
              scoreAnimation={scoreAnimation}
              multiplier={multiplier}
              multiplierAnimation={multiplierAnimation}
            />

            {!gameStarted && !gameOver && (
              <StartScreen
                mode={mode}
                selectedTimer={selectedTimer}
                onStartGame={handleStartGame}
              />
            )}

            {gameStarted && !gameOver && (
              <GamePlayArea
                currentWordToDisplay={currentWordToDisplay}
                inputValue={inputValue}
                wordAnimation={wordAnimation} // For the pop effect on current word display div
                isInputDisabled={
                  gameOver || !gameStarted || !currentWordToDisplay
                }
                wpm={wpm}
                mode={mode}
                timeLeft={timeLeft}
                onInputChange={handleInputChange}
                onRestartLevel={restartCurrentLevel}
                inputRef={inputRef}
                completedWords={completedWords} // For side display
                currentLevelWords={currentLevelWords} // For side display
                currentWordIndex={currentWordIndex} // For side display
              />
            )}

            {gameOver && (
              <GameOverScreen
                gameStatusTitle={gameStatusTitle}
                nextLevelName={nextLevelName}
                wpm={wpm}
                score={score}
                completedWords={completedWords}
                multiplier={multiplier}
                currentLevelDefinitions={currentLevelDefinitions}
                onNavigateToNextLevel={navigateToNextLevel}
                onNavigateToLevels={navigateToLevels}
                onRestartLevel={restartCurrentLevel}
                isLastLevel={isLastLevel}
                allWordsTyped={allWordsTypedInLevel}
                showDefinition={showDefinitionGameOver}
                onToggleShowDefinition={toggleShowDefinitionGameOver}
              />
            )}
          </div>
        </div>
      </div>
      {/* Add the no hearts modal */}
      {showNoHeartsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 shadow-xl border border-gray-600">
            <div className="text-center">
              <div className="mb-4">
                <FaHeart className="text-red-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Out of Hearts!
                </h2>
              </div>
              <p className="text-gray-300 mb-6">
                You don't have any hearts left to play. Hearts regenerate over
                time or you can earn more through achievements.
              </p>
              <div className="text-sm text-gray-400 mb-4">
                Redirecting to levels in 5 seconds...
              </div>
              <button
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors w-full"
                onClick={handleContinueClick}
              >
                Return to Levels
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TypeTest;
