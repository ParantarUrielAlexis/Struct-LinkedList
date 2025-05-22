import React from "react";
import {
  FaRedo,
  FaClock,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowLeft,
  FaFire,
  FaTrophy,
  FaCheck,
  FaChevronRight,
  FaPlayCircle,
} from "react-icons/fa";

// Memoized from previous step
export const HighlightedWordDisplay = React.memo(
  ({ word, inputValue, wordAnimation }) => {
    if (!word) return null;
    return (
      <div className="text-gray-200">
        {word.split("").map((char, index) => {
          const isTyped = index < inputValue.length;
          const isCorrect = isTyped && inputValue[index] === char;
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
        {inputValue.length > word.length && (
          <span className="text-red-500">
            {inputValue.substring(word.length)}
          </span>
        )}
      </div>
    );
  }
);
HighlightedWordDisplay.displayName = "HighlightedWordDisplay";

export const DefinitionItem = React.memo(({ word, definition }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all border border-blue-400">
    <div className="text-lg font-bold text-blue-400 mb-2">{word}</div>
    <div className="text-gray-300">
      {definition || "Definition not available."}
    </div>
  </div>
));
DefinitionItem.displayName = "DefinitionItem";

export const TypeTestNavbar = React.memo(
  ({
    mode,
    selectedTimer,
    isMuted,
    gameStarted,
    gameOver,
    onModeChange,
    onTimerChange,
    onToggleMute,
  }) => (
    <div className="w-full bg-gray-700 p-3 rounded-t-lg mb-6 flex justify-between items-center flex-wrap gap-2 shadow-inner">
      <div className="flex items-center gap-2 flex-grow justify-center md:justify-start">
        <button
          onClick={() => onModeChange("Competitive")}
          className={`px-4 py-2 rounded-full font-semibold transition-colors text-sm md:text-base ${
            mode === "Competitive"
              ? "bg-blue-600 text-white"
              : "bg-gray-600 text-gray-300 hover:bg-gray-500"
          }`}
        >
          Competitive
        </button>
        <button
          onClick={() => onModeChange("Practice")}
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
            onChange={onTimerChange}
            className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
            disabled={gameStarted && !gameOver}
          >
            <option value={30}>30s</option>
            <option value={40}>40s</option>
            <option value={60}>60s</option>
          </select>
        )}
        <button
          onClick={onToggleMute}
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
  )
);
TypeTestNavbar.displayName = "TypeTestNavbar";

export const LevelProgressDisplay = React.memo(
  ({
    gameStarted,
    gameOver,
    levelName,
    levelProgress,
    progressBarColor,
    showStreak,
    streakCount,
  }) => (
    <>
      <div className="text-center text-xl font-bold text-blue-400 mt-4 mb-4">
        {levelName}
      </div>
      <div className="relative w-full mb-4 h-6">
        {gameStarted && !gameOver && (
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden absolute top-1/2 transform -translate-y-1/2">
            <div
              className={`h-full transition-all duration-500 ${progressBarColor}`}
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        )}
        {showStreak && streakCount >= 3 && (
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-orange-600 text-white font-bold px-3 py-1 rounded-lg animate-pulse flex items-center text-sm shadow-lg z-10">
            <FaFire className="mr-1" /> {streakCount} COMBO!
          </div>
        )}
      </div>
    </>
  )
);
LevelProgressDisplay.displayName = "LevelProgressDisplay";

export const GameStats = React.memo(
  ({ score, scoreAnimation, multiplier, multiplierAnimation }) => (
    <div className="flex justify-center gap-6 mb-6 text-lg font-bold">
      <span className={`text-white ${scoreAnimation ? "animate-pulse" : ""}`}>
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
  )
);
GameStats.displayName = "GameStats";

export const StartScreen = React.memo(
  ({ mode, selectedTimer, onStartGame }) => (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">Ready to Type?</h1>
      <p className="text-gray-300 mb-8 text-center">
        Mode: <span className="font-bold text-white">{mode}</span>
        {mode === "Competitive" && ` ${selectedTimer}s`}
      </p>
      <button
        onClick={onStartGame}
        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
      >
        <span className="flex items-center">
          <FaPlayCircle className="mr-2" /> Start Level
        </span>
      </button>
    </div>
  )
);
StartScreen.displayName = "StartScreen";

export const GamePlayArea = React.memo(
  ({
    currentWordToDisplay,
    inputValue,
    wordAnimation,
    isInputDisabled,
    wpm,
    mode,
    timeLeft,
    onInputChange,
    onRestartLevel,
    inputRef,
    completedWords,
    currentLevelWords,
    currentWordIndex,
  }) => (
    <div className="flex flex-col md:flex-row w-full h-full">
      <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4 min-w-[150px]">
        {completedWords.length > 0 && (
          <div className="text-green-500 text-xl font-bold flex items-center">
            <FaCheck className="mr-2" />
            {completedWords[completedWords.length - 1]}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center flex-2 p-6 w-full md:w-auto">
        <div
          className={`text-3xl font-bold mb-6 p-4 border-b-2 border-blue-500 ${
            wordAnimation ? "scale-110 transition-transform duration-300" : ""
          }`}
        >
          <HighlightedWordDisplay
            word={currentWordToDisplay}
            inputValue={inputValue}
            wordAnimation={false} // Parent div handles the pop for completed word
          />
        </div>
        <input
          type="text"
          className="w-full md:w-4/5 p-4 border-2 border-blue-500 bg-gray-700 text-white rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Type the word here"
          ref={inputRef}
          disabled={isInputDisabled}
          autoFocus
        />
        <div className="flex justify-center items-center gap-x-4 w-full md:w-4/5 mb-6">
          <div className="flex items-center bg-gray-700 px-4 py-2 rounded-lg">
            <FaFire className="text-orange-500 mr-2" />
            <span className="text-lg font-bold text-white">
              WPM: <span className="text-yellow-400">{wpm}</span>
            </span>
          </div>
          {mode === "Competitive" && (
            <div className="flex items-center bg-gray-700 px-4 py-2 rounded-lg">
              <FaClock className="text-blue-400 mr-2" />
              <span className="text-lg font-bold text-white">
                Time:{" "}
                <span
                  className={`${
                    timeLeft !== null && timeLeft <= 5 && timeLeft > 0
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
          onClick={onRestartLevel}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
        >
          <FaRedo /> Restart Level
        </button>
      </div>
      <div className="hidden md:flex flex-col items-center justify-center flex-1 p-4 min-w-[150px]">
        {currentWordIndex + 1 < currentLevelWords.length && (
          <div className="text-gray-400 text-xl font-bold my-2">
            {currentLevelWords[currentWordIndex + 1]}
          </div>
        )}
        {currentWordIndex + 2 < currentLevelWords.length && (
          <div className="text-gray-500 text-lg my-1">
            {currentLevelWords[currentWordIndex + 2]}
          </div>
        )}
      </div>
    </div>
  )
);
GamePlayArea.displayName = "GamePlayArea";

const WordDefinitionsList = React.memo(
  ({
    completedWords,
    currentLevelDefinitions,
    showDefinition,
    onToggleShowDefinition,
  }) => (
    <div className="w-full bg-gray-900 rounded-lg shadow-inner p-6 mb-6 max-h-72 overflow-y-auto border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-400">
          Words and Definitions:
        </h3>
        <button
          onClick={onToggleShowDefinition}
          className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showDefinition ? "Hide Definitions" : "Show Definitions"}
        </button>
      </div>
      {showDefinition ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedWords.map((word) => (
            <DefinitionItem
              key={`def-${word}`}
              word={word}
              definition={currentLevelDefinitions[word]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {completedWords.map((word, index) => (
            <div
              key={`word-${word}-${index}`}
              className="bg-gray-700 px-3 py-1 rounded text-blue-400 border border-gray-600"
            >
              {word}
            </div>
          ))}
        </div>
      )}
    </div>
  )
);
WordDefinitionsList.displayName = "WordDefinitionsList";

export const GameOverScreen = React.memo(
  ({
    gameStatusTitle,
    nextLevelName,
    wpm,
    score,
    completedWords,
    multiplier,
    currentLevelDefinitions,
    onNavigateToNextLevel,
    onNavigateToLevels,
    onRestartLevel,
    isLastLevel,
    allWordsTyped,
    showDefinition,
    onToggleShowDefinition,
  }) => (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 animate-fade-in border border-blue-500">
      <div className="bg-blue-600 -mt-12 rounded-full p-4 shadow-lg mb-4">
        <FaTrophy className="text-4xl text-yellow-300" />
      </div>
      <h2 className="text-3xl font-bold text-blue-400 mb-4">
        {gameStatusTitle}
      </h2>

      {allWordsTyped && !isLastLevel && nextLevelName && (
        <p className="text-xl font-bold text-white mb-4">
          Proceed to {nextLevelName}
        </p>
      )}
      {allWordsTyped && isLastLevel && (
        <p className="text-xl font-bold text-green-400 mb-4">
          All Levels Cleared! Congratulations!
        </p>
      )}

      <p className="text-xl font-bold text-white mb-6">
        Your WPM: <span className="text-yellow-400">{wpm}</span>
      </p>

      <div className="flex flex-col md:flex-row justify-around w-full mb-8 gap-4 md:gap-0">
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{score}</div>
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
          <div className="text-gray-400">Final Multiplier</div>
        </div>
      </div>

      <WordDefinitionsList
        completedWords={completedWords}
        currentLevelDefinitions={currentLevelDefinitions}
        showDefinition={showDefinition}
        onToggleShowDefinition={onToggleShowDefinition}
      />

      <div className="flex flex-wrap justify-center gap-4">
        {allWordsTyped && !isLastLevel ? (
          <button
            onClick={onNavigateToNextLevel}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/50 transform hover:-translate-y-1"
          >
            <FaChevronRight /> Next Level
          </button>
        ) : allWordsTyped && isLastLevel ? (
          <button
            onClick={onNavigateToLevels}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 transform hover:-translate-y-1"
          >
            <FaTrophy /> All Levels Cleared! (Select Level)
          </button>
        ) : null}
        <button
          onClick={onRestartLevel}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-all shadow-lg hover:shadow-yellow-500/50 transform hover:-translate-y-1"
        >
          <FaRedo /> Restart Level
        </button>
        <button
          onClick={onNavigateToLevels}
          className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
        >
          <FaArrowLeft /> Main Menu
        </button>
      </div>
    </div>
  )
);
GameOverScreen.displayName = "GameOverScreen";
