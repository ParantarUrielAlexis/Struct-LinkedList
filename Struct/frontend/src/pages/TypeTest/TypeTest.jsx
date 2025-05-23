// TODO: did not use calculateStars
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
// Assuming levels and sound files are correctly pathed
import typingSoundFile from "../../assets/typing.mp3";
import pingSoundFile from "../../assets/ping.mp3";
import { levels } from "./TypeTestLevelsData";
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
  const { isAuthenticated, user, authToken } = useAuth();

  const { levelIndex: levelIndexParam } = useParams();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const typingSound = useRef(null);
  const pingSound = useRef(null);

  const currentLevelIndex = useMemo(
    () => parseInt(levelIndexParam, 10),
    [levelIndexParam]
  );

  const currentLevel = useMemo(
    () => levels[currentLevelIndex],
    [currentLevelIndex]
  );
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
      // If not all words were completed, return 0 stars regardless of time
      if (!allWordsCompleted) {
        return 0;
      }

      // Only award stars if all words were completed
      if (selectedTimer === 30) {
        if (timeTaken <= 30) return 3;
        if (timeTaken <= 45) return 2;
        if (timeTaken <= 60) return 1;
        return 0;
      } else if (selectedTimer === 45) {
        if (timeTaken <= 45) return 2;
        if (timeTaken <= 60) return 1;
        return 0;
      } else if (selectedTimer === 60) {
        if (timeTaken <= 60) return 1;
        return 0;
      }
      return 0; // Default for practice or undefined timers
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
        setMultiplierAnimation(true);

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
            setMultiplierAnimation(true);
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
  const restartCurrentLevel = useCallback(() => {
    resetGameState();
    setGameStarted(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [resetGameState]);
  const handleStartGame = useCallback(() => {
    setGameStarted(true);
    if (!startTime) setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [startTime]);
  const navigateToNextLevel = useCallback(
    () => navigate(`/type-test/${currentLevelIndex + 1}`),
    [navigate, currentLevelIndex]
  );
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
    </div>
  );
}

export default TypeTest;
