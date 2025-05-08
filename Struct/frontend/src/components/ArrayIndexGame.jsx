import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ArrayIndexGame = ({ onScore = () => {} }) => {
  const [gameArray, setGameArray] = useState([]);
  const [targetIndex, setTargetIndex] = useState(null);
  const [targetValue, setTargetValue] = useState(null);
  const [gameMode, setGameMode] = useState("findIndex"); // "findIndex" or "findValue"
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  // Generate a random array when game starts
  useEffect(() => {
    if (gameActive) {
      generateNewRound();
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setMessage("");
  };

  const endGame = () => {
    setGameActive(false);
    setMessage(`Game over! Your score: ${score}`);
    onScore(score);
  };

  const generateNewRound = () => {
    // Generate array of 5-8 random numbers between 1-99
    const size = Math.floor(Math.random() * 4) + 5;
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 99) + 1
    );
    setGameArray(newArray);

    // Randomly choose game mode
    const newGameMode = Math.random() > 0.5 ? "findIndex" : "findValue";
    setGameMode(newGameMode);

    if (newGameMode === "findIndex") {
      // Ask player to find index of a value
      const randomIdx = Math.floor(Math.random() * newArray.length);
      setTargetValue(newArray[randomIdx]);
      setTargetIndex(randomIdx);
    } else {
      // Ask player to find value at an index
      const randomIdx = Math.floor(Math.random() * newArray.length);
      setTargetIndex(randomIdx);
      setTargetValue(newArray[randomIdx]);
    }

    setUserAnswer("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gameActive) return;

    const userGuess = parseInt(userAnswer);
    let correct = false;

    if (gameMode === "findIndex") {
      correct = userGuess === targetIndex;
    } else {
      correct = userGuess === targetValue;
    }

    if (correct) {
      setScore(score + 10);
      setMessage("Correct! +10 points");
      setTimeout(() => {
        setMessage("");
        generateNewRound();
      }, 1000);
    } else {
      setScore(Math.max(0, score - 5));
      setMessage("Incorrect! -5 points");
    }

    setUserAnswer("");
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border-2 border-indigo-100">
      <h3 className="text-lg font-bold mb-3">Array Challenge!</h3>

      {!gameActive ? (
        <div className="text-center">
          <p className="mb-4">
            Test your array knowledge with a quick challenge!
          </p>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Start Game
          </button>
          {message && <p className="mt-4 font-medium">{message}</p>}
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div>
              Score: <span className="font-bold">{score}</span>
            </div>
            <div className={`font-bold ${timeLeft < 10 ? "text-red-600" : ""}`}>
              Time: {timeLeft}s
            </div>
          </div>

          <div className="flex justify-center mb-4">
            {gameArray.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="w-10 h-10 border border-gray-300 flex items-center justify-center m-1"
              >
                {value}
                <div className="absolute -bottom-6 text-xs text-gray-500">
                  [{index}]
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center my-4">
            <p className="font-medium">
              {gameMode === "findIndex"
                ? `Find the index of element with value: ${targetValue}`
                : `Find the value at index: [${targetIndex}]`}
            </p>

            <form onSubmit={handleSubmit} className="mt-2 flex justify-center">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) =>
                  setUserAnswer(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
                autoFocus
              />
              <button
                type="submit"
                className="ml-2 px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
              >
                Submit
              </button>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 text-sm font-medium ${
                  message.includes("Correct")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArrayIndexGame;
