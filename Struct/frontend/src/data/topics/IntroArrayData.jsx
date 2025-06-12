import React, { useEffect } from "react";
import { FaBook, FaLightbulb, FaExclamationTriangle } from "react-icons/fa";
// Import any other components you need for interactive elements
import ArrayVisualizer from "../../components/ArrayVisualizer";
import ArrayIndexGame from "../../components/ArrayIndexGame";

// Create a standalone function for quiz setup (not using hooks)
function setupQuizHandlers() {
  // Array Basics Quiz (Quiz #1)
  const setupQuiz1 = () => {
    const checkButton = document.getElementById('check-answers-1');
    if (checkButton) {
      checkButton.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.bg-yellow-50 input[data-answer]');
        let allCorrect = true;
        
        inputs.forEach(input => {
          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = input.getAttribute('data-answer').toLowerCase();
          
          // Clear previous feedback styles
          input.classList.remove('border-red-500', 'border-green-500', 'bg-green-50', 'bg-red-50');
          
          // Add visual feedback immediately
          if (userAnswer === correctAnswer) {
            input.classList.add('border-green-500', 'bg-green-50');
            
            // Show feedback text
            const feedbackElement = input.parentElement.querySelector('.answer-feedback');
            if (feedbackElement) {
              feedbackElement.classList.remove('hidden');
              feedbackElement.textContent = "✓ Correct!";
            }
          } else {
            input.classList.add('border-red-500', 'bg-red-50');
            allCorrect = false;
            
            // Add wrong answer feedback
            const feedbackElement = input.parentElement.querySelector('.answer-feedback');
            if (feedbackElement) {
              feedbackElement.classList.remove('hidden');
              feedbackElement.textContent = "✗ Incorrect. Try again!";
              feedbackElement.classList.remove('text-green-500');
              feedbackElement.classList.add('text-red-500');
            }
          }
        });
        
        const completeMessage = document.getElementById('challenge-complete-1');
        if (allCorrect && completeMessage) {
          completeMessage.classList.remove('hidden');
        } else if (completeMessage) {
          completeMessage.classList.add('hidden');
        }
      });
    }
  };
  
  // Array Operations Quiz (Quiz #2)
  const setupQuiz2 = () => {
    const checkButton = document.getElementById('check-answers-2');
    if (checkButton) {
      checkButton.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.bg-blue-50 input[data-answer]');
        let allCorrect = true;
        
        inputs.forEach(input => {
          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = input.getAttribute('data-answer').toLowerCase();
          
          if (userAnswer === correctAnswer) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500', 'bg-green-50');
            input.parentElement.querySelector('.answer-feedback')?.classList.remove('hidden');
          } else {
            input.classList.remove('border-green-500', 'bg-green-50');
            input.classList.add('border-red-500');
            input.parentElement.querySelector('.answer-feedback')?.classList.add('hidden');
            allCorrect = false;
          }
        });
        
        const completeMessage = document.getElementById('challenge-complete-2');
        if (allCorrect && completeMessage) {
          completeMessage.classList.remove('hidden');
        } else if (completeMessage) {
          completeMessage.classList.add('hidden');
        }
      });
    }
  };
  
  // Debug Challenge Quiz (Quiz #3)
  const setupQuiz3 = () => {
    const checkButton = document.getElementById('check-answers-3');
    if (checkButton) {
      checkButton.addEventListener('click', () => {
        const selects = document.querySelectorAll('.bg-red-50 select[data-answer]');
        let allCorrect = true;
        
        selects.forEach(select => {
          const userAnswer = select.value;
          const correctAnswer = select.getAttribute('data-answer');
          
          // Clear previous styles
          select.classList.remove('border-red-500', 'border-green-500', 'bg-green-50', 'bg-red-50');
          
          if (userAnswer === correctAnswer) {
            select.classList.add('border-green-500', 'bg-green-50');
            
            // Show feedback text
            const feedbackElement = select.parentElement.querySelector('.answer-feedback');
            if (feedbackElement) {
              feedbackElement.classList.remove('hidden');
              feedbackElement.classList.remove('text-red-500');
              feedbackElement.classList.add('text-green-500');
            }
          } else {
            select.classList.add('border-red-500', 'bg-red-50');
            allCorrect = false;
            
            // Show error feedback
            const feedbackElement = select.parentElement.querySelector('.answer-feedback');
            if (feedbackElement) {
              feedbackElement.classList.remove('hidden');
              feedbackElement.textContent = "✗ That's not right. Try again!";
              feedbackElement.classList.remove('text-green-500');
              feedbackElement.classList.add('text-red-500');
            }
          }
        });
        
        const completeMessage = document.getElementById('challenge-complete-3');
        if (allCorrect && completeMessage) {
          completeMessage.classList.remove('hidden');
        } else if (completeMessage) {
          completeMessage.classList.add('hidden');
        }
      });
    }
  };
  
  // Array Traversal Concepts Quiz (Quiz #4)
  const setupQuiz4 = () => {
    const checkButton = document.getElementById('check-answers-4');
    if (checkButton) {
      checkButton.addEventListener('click', () => {
        const inputs = document.querySelectorAll('.bg-gray-100 input[data-answer]');
        let allCorrect = true;
        
        inputs.forEach(input => {
          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = input.getAttribute('data-answer').toLowerCase();
          
          if (userAnswer === correctAnswer) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500', 'bg-green-50');
          } else {
            input.classList.remove('border-green-500', 'bg-green-50');
            input.classList.add('border-red-500');
            allCorrect = false;
          }
        });
        
        const feedbackElement = document.getElementById('code-correct');
        if (allCorrect && feedbackElement) {
          feedbackElement.classList.remove('hidden');
        } else if (feedbackElement) {
          feedbackElement.classList.add('hidden');
        }
      });
    }
  };

  // Setup all quizzes
  setupQuiz1();
  setupQuiz2();
  setupQuiz3();
  setupQuiz4();
};

// Export the function to initialize quizzes that can be called from a component
export function initializeQuizHandlers() {
  // Use setTimeout to ensure DOM is fully rendered
  setTimeout(() => {
    setupQuizHandlers();
  }, 500);
}

const IntroArrayData = {
  label: "Introduction to Arrays",
  icon: <FaBook className="text-4xl text-pink-300" />,
  // Add an init method that can be called when this content is loaded
  init: initializeQuizHandlers,
  content: [
    // Slide 1
    {
      title: "What are Arrays?",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-purple-600">
            Arrays: Your Digital Collection Organizer! 🎮
          </p>
          
          <p>
            Think of an array as a row of labeled boxes where you can store your favorite things.
            Each item has its own special spot that you can find instantly!
          </p>
          
          <div className="bg-indigo-50 p-8 rounded-lg border border-indigo-200 mb-4">
            <div className="flex justify-center">
              {["🎮", "📱", "🎧", "🕹️", "📚"].map((item, i) => (
                <div key={i} className="relative mx-1">
                  <div className="h-12 w-12 bg-white border-2 border-indigo-300 rounded flex items-center justify-center shadow-md">
                    <span className="text-xl">{item}</span>
                  </div>
                  <div className="absolute -bottom-6 w-full text-center text-xs font-mono">
                    {i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p>
            An array is a data structure that stores a collection of elements where each element is accessed by an 
            <span className="text-green-600 font-medium"> index</span> (position number).
          </p>

          <ul className="list-disc ml-6 space-y-2">
            <li>
              Each box has a <span className="text-blue-600 font-medium">value</span>{" "}
              stored inside it (like a game, gadget, or score)
            </li>
            <li>
              Each box has an <span className="text-green-600 font-medium">index</span>{" "}
              that tells you exactly where to find it (starting from 0!)
            </li>
          </ul>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-medium mb-2">For example, your game high scores:</p>
            <code className="bg-gray-100 p-1 rounded">
              highScores = [950, 820, 1020, 760, 890];
            </code>
          </div>
          
          <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-200 flex items-center">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <p className="font-medium">Quick Fact:</p>
              <p className="text-sm">The word "array" comes from how items are "arranged" in order!</p>
            </div>
          </div>
        </div>
      ),
      hints: "Arrays are perfect when you need quick access to any item in your collection!",
    },
    
    // Slide 2
    {
      title: "Array Indexing: Find It Fast!",
      content: (
        <div className="space-y-4">
          <p>
            Every element in an array has a position number called an{" "}
            <strong>index</strong>. Just like houses on a street, each element has an address!
          </p>
          
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
            <h3 className="text-center font-medium mb-3">🔍 The Secret of Array Indexing</h3>
            <p className="text-center mb-4">
              Arrays always start counting from <span className="text-red-500 font-bold">ZERO</span>, not one!
            </p>
            
            <div className="flex justify-center mb-4">
              {["Minecraft", "Fortnite", "Roblox", "Among Us", "Valorant"].map((game, i) => (
                <div key={i} className="relative mx-1">
                  <div className="h-16 w-28 bg-white border-2 border-blue-300 rounded-md flex items-center justify-center shadow-md overflow-hidden">
                    <span className="text-sm font-medium">{game}</span>
                  </div>
                  <div className="absolute -bottom-6 w-full text-center bg-blue-500 text-white rounded-b-md px-1 py-0.5">
                    <span className="font-mono font-bold">[{i}]</span>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center mt-8 text-sm">
              Try remembering: "Zero is the hero" - it's always the starting point!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-medium">To access the first game:</p>
              <code className="bg-gray-100 p-1 rounded block my-2">
                games[0] = "Minecraft"
              </code>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-medium">To access the third game:</p>
              <code className="bg-gray-100 p-1 rounded block my-2">
                games[2] = "Roblox"
              </code>
            </div>
          </div>
        </div>
      ),
      interactive: (
        <div className="py-2">
          <p className="text-sm mb-2 text-gray-600">Try accessing different elements:</p>
          <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
            <p>// Which game is at index 3?</p>
            <p className="text-green-400">games[3] = "Among Us"</p>
          </div>
        </div>
      ),
      hints: "Remember: The position (index) is always one less than the counting number!",
    },
    
    // Slide 3 - QUIZ after first 2 slides
    {
      title: "Quiz: Array Basics",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-center text-purple-600">
            Check Your Array Knowledge! 🧩
          </p>
          
          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 shadow-md">
            <p className="mb-4 font-medium">Fill in the blanks with the correct answers:</p>
            
            <div className="space-y-6">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="mb-2">1. Arrays always start indexing from 
                  <input 
                    type="text" 
                    placeholder="?" 
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-center ml-1" 
                    data-answer="0" 
                    onChange={(e) => {
                      const input = e.target;
                      const userAnswer = input.value.trim().toLowerCase();
                      const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                      
                      if(userAnswer === correctAnswer) {
                        input.classList.remove('border-red-500', 'bg-red-50');
                        input.classList.add('border-green-500', 'bg-green-50');
                        input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                        input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                        input.parentElement.querySelector('.answer-feedback').textContent = "Correct! Arrays use zero-based indexing.";
                      } else if(userAnswer) {
                        input.classList.remove('border-green-500', 'bg-green-50');
                        input.classList.add('border-red-500', 'bg-red-50');
                        input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                        input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                        input.parentElement.querySelector('.answer-feedback').textContent = "Try again. Think about where arrays start counting.";
                      }
                    }}
                  /> instead of 1.
                </p>
                <div className="hidden answer-feedback">Correct! Arrays use zero-based indexing.</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="mb-2">2. To access the first element of an array named "scores", you would write: 
                  <input 
                    type="text" 
                    placeholder="?" 
                    className="border border-gray-300 rounded px-2 py-1 w-28 text-center ml-1" 
                    data-answer="scores[0]" 
                    onChange={(e) => {
                      const input = e.target;
                      const userAnswer = input.value.trim().toLowerCase();
                      const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                      
                      if(userAnswer === correctAnswer) {
                        input.classList.remove('border-red-500', 'bg-red-50');
                        input.classList.add('border-green-500', 'bg-green-50');
                        input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                        input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                        input.parentElement.querySelector('.answer-feedback').textContent = "Correct! We use [0] to access the first element.";
                      } else if(userAnswer) {
                        input.classList.remove('border-green-500', 'bg-green-50');
                        input.classList.add('border-red-500', 'bg-red-50');
                        input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                        input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                        input.parentElement.querySelector('.answer-feedback').textContent = "Not quite. Remember that arrays are zero-indexed.";
                      }
                    }}
                  />
                </p>
                <div className="hidden answer-feedback">Correct! We use [0] to access the first element.</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="mb-2">3. If an array has 5 elements, the index of the last element is 
                  <input 
                    type="text" 
                    placeholder="?" 
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-center ml-1" 
                    data-answer="4" 
                    onChange={(e) => {
                      const input = e.target;
                      const userAnswer = input.value.trim().toLowerCase();
                      const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                      
                      if(userAnswer === correctAnswer) {
                        input.classList.remove('border-red-500', 'bg-red-50');
                        input.classList.add('border-green-500', 'bg-green-50');
                        input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                        input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                        input.parentElement.querySelector('.answer-feedback').textContent = "Correct! For n elements, the last index is n-1.";
                      } else if(userAnswer) {
                        input.classList.remove('border-green-500', 'bg-green-50');
                        input.classList.add('border-red-500', 'bg-red-50');
                        input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                        input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                        input.parentElement.querySelector('.answer-feedback').textContent = "Not quite right. For an array with 5 elements, what's the highest valid index?";
                      }
                    }}
                  />
                </p>
                <div className="hidden answer-feedback">Correct! For n elements, the last index is n-1.</div>
              </div>
            </div>
            
            <button 
              className="mt-6 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full" 
              onClick={() => {
                // Check if all inputs are correct
                const inputs = document.querySelectorAll('.bg-yellow-50 input[data-answer]');
                let allCorrect = true;
                
                inputs.forEach(input => {
                  const userAnswer = input.value.trim().toLowerCase();
                  const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                  
                  if (userAnswer !== correctAnswer) {
                    allCorrect = false;
                  }
                });
                
                // Show completion message if all are correct
                const completeMessage = document.getElementById('challenge-complete-1');
                if (allCorrect && completeMessage) {
                  completeMessage.classList.remove('hidden');
                } else if (completeMessage) {
                  completeMessage.classList.add('hidden');
                }
              }}
            >
              Check Answers
            </button>
            
            <div className="mt-4 hidden text-center p-3 bg-green-100 rounded-lg" id="challenge-complete-1">
              <p className="text-green-800 font-medium">Great job! You understand array basics! 🎉</p>
              <p className="text-sm text-green-700">+5 points added to your score!</p>
            </div>
          </div>
        </div>
      ),
      hints: "Think about the zero-based indexing we just learned about!",
    },
    
    // Slide 4
    {
      title: "Modifying Arrays: Change Your Collection",
      content: (
        <div className="space-y-4">
          <p>
            Arrays are <span className="text-purple-600 font-medium">mutable</span> — meaning you can change what's stored
            in each position whenever you want! Think of it like swapping game cartridges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="font-medium mb-2">Before:</p>
              <div className="flex justify-center">
                {[10, 20, 30, 40, 50].map((score, i) => (
                  <div key={i} className="text-center mx-1 w-12">
                    <div className="bg-white h-12 flex items-center justify-center border border-gray-300 rounded-md shadow-sm">
                      {score}
                    </div>
                    <div className="text-xs mt-1 font-mono">[{i}]</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-medium mb-2">After changing index 2:</p>
              <div className="flex justify-center">
                {[10, 20, 99, 40, 50].map((score, i) => (
                  <div key={i} className="text-center mx-1 w-12">
                    <div className={`h-12 flex items-center justify-center border rounded-md shadow-sm ${i === 2 ? 'bg-green-100 border-green-400 font-bold' : 'bg-white border-gray-300'}`}>
                      {score}
                    </div>
                    <div className="text-xs mt-1 font-mono">[{i}]</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <p className="font-medium mb-2">🎮 Your Turn! Try changing these scores:</p>
            <p className="text-sm mb-4">
              Click on any score below to modify it!
            </p>
            <ArrayVisualizer
              initialArray={[10, 20, 30, 40, 50]}
              onInteraction={(type) => {
                if (type === "update") {
                  return 5; // Award 5 points for interaction
                }
                return 0;
              }}
            />
            <p className="text-xs text-center mt-3 text-gray-600">Earn 5 points for each score you change!</p>
          </div>
        </div>
      ),
      interactive: (
        <div className="py-2">
          <p className="text-sm mb-2 text-gray-600">Try this code example:</p>
          <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
            <p>// Level up your third character (index 2)</p>
            <p>characterLevels[2] = 99;</p>
            <p className="text-green-400">// Result: [10, 20, 99, 40, 50]</p>
          </div>
        </div>
      ),
      hints: "Only the value at the specific index changes - everything else stays the same!",
    },
    
    // Slide 5
    {
      title: "Array Common Operations",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium">Let's explore what you can do with arrays!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200 shadow-sm">
              <h3 className="font-medium flex items-center">
                <span className="text-blue-500 mr-2">📏</span>
                Finding Array Length
              </h3>
              <div className="mt-2 text-sm">
                <code className="bg-gray-100 p-1 rounded block">
                  // How many games do I have?<br/>
                  let count = games.length; // 5
                </code>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-pink-200 shadow-sm">
              <h3 className="font-medium flex items-center">
                <span className="text-pink-500 mr-2">🔍</span>
                Finding an Element
              </h3>
              <div className="mt-2 text-sm">
                <code className="bg-gray-100 p-1 rounded block">
                  // Do I have Minecraft?<br/>
                  let index = games.indexOf("Minecraft"); // 0
                </code>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200 shadow-sm">
              <h3 className="font-medium flex items-center">
                <span className="text-purple-500 mr-2">➕</span>
                Adding Elements
              </h3>
              <div className="mt-2 text-sm">
                <code className="bg-gray-100 p-1 rounded block">
                  // Add a new game<br/>
                  games.push("Zelda"); // Adds at the end
                </code>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-2 border-red-200 shadow-sm">
              <h3 className="font-medium flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                Removing Elements
              </h3>
              <div className="mt-2 text-sm">
                <code className="bg-gray-100 p-1 rounded block">
                  // Remove the last game<br/>
                  let removed = games.pop(); // Removes last
                </code>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-medium text-center mb-3">🎮 Common Gaming Example</h3>
            <p className="mb-2 text-sm">
              In games, arrays store everything from inventory items to enemy positions!
            </p>
            <code className="bg-gray-100 p-2 rounded block text-sm">
              let inventory = ["sword", "potion", "shield", "map"];<br/>
              let useItem = inventory[1]; // Use the potion<br/>
              inventory[1] = "mega-potion"; // Replace with better item
            </code>
          </div>
        </div>
      ),
      hints: "These operations will come in handy when solving programming challenges!",
    },
    
    // Slide 6 - QUIZ after slides 4-5
    {
      title: "Challenge: Array Operations",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-center text-blue-600">
            📝 Array Operations Challenge 📝
          </p>
          
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-md">
            <p className="font-medium mb-4">Complete the code to perform the requested operations:</p>
            
            <div className="space-y-6">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="mb-2 font-medium">Given: <code>let fruits = ["apple", "banana", "orange"];</code></p>
                <p className="mb-2">1. Add "grape" to the end of the array:</p>
                <div className="flex">
                  <code className="bg-gray-100 p-1 mr-2">fruits.</code>
                  <input 
                    type="text" 
                    placeholder="?" 
                    className="border border-gray-400 rounded px-2 py-1 w-40" 
                    data-answer="push('grape')" 
                    onChange={(e) => {
                      const input = e.target;
                      const userAnswer = input.value.trim().toLowerCase();
                      // Make modified version of userAnswer with single quotes replaced by double quotes
                      const normalizedUserAnswer = userAnswer.replace(/'/g, '"').replace(/"/g, '"');
                      // Make modified version of correct answer with single quotes replaced by double quotes
                      const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                      const normalizedCorrectAnswer = correctAnswer.replace(/'/g, '"').replace(/"/g, '"');
                      
                      if(userAnswer === correctAnswer || normalizedUserAnswer === normalizedCorrectAnswer) {
                        input.classList.remove('border-red-500', 'bg-red-50');
                        input.classList.add('border-green-500', 'bg-green-50');                       
                      } else if(userAnswer) {
                        input.classList.remove('border-green-500', 'bg-green-50');
                        input.classList.add('border-red-500', 'bg-red-50');
                      }
                    }}
                  />
                  <code className="bg-gray-100 p-1 ml-2">;</code>
                </div>
                <div className="hidden answer-feedback mt-1">Correct! fruits.push('grape') adds an element to the end.</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="mb-2">2. To find the total number of fruits, write:</p>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="?" 
                    className="border border-gray-300 rounded px-2 py-1 w-full" 
                    data-answer="fruits.length" 
                    onChange={(e) => {
                      const input = e.target;
                      const userAnswer = input.value.trim().toLowerCase();
                      const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                      
                      if(userAnswer === correctAnswer) {
                        input.classList.remove('border-red-500', 'bg-red-50');
                        input.classList.add('border-green-500', 'bg-green-50');
                      } else if(userAnswer) {
                        input.classList.remove('border-green-500', 'bg-green-50');
                        input.classList.add('border-red-500', 'bg-red-50');                     
                      }
                    }}
                  />
                </div>
                <div className="hidden answer-feedback mt-1">Correct! fruits.length gives us the number of elements.</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="mb-2">3. To replace "banana" with "mango", if banana is at index 1:</p>
                <div className="flex">
                  <code className="bg-gray-100 p-1 mr-2">fruits[</code>
                  <input 
                    type="text" 
                    placeholder="?" 
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-center" 
                    data-answer="1" 
                    onChange={(e) => {
                      const input = e.target;
                      const userAnswer = input.value.trim().toLowerCase();
                      const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                      
                      if(userAnswer === correctAnswer) {
                        input.classList.remove('border-red-500', 'bg-red-50');
                        input.classList.add('border-green-500', 'bg-green-50');
                      } else if(userAnswer) {
                        input.classList.remove('border-green-500', 'bg-green-50');
                        input.classList.add('border-red-500', 'bg-red-50');
                      }
                    }}
                  />
                  <code className="bg-gray-100 p-1 ml-2">] = "mango";</code>
                </div>
                <div className="hidden answer-feedback mt-1">Correct! fruits[1] = "mango" replaces the second element.</div>
              </div>
            </div>
            
            <button 
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={() => {
                // Check if all inputs are correct
                const inputs = document.querySelectorAll('.bg-blue-50 input[data-answer]');
                let allCorrect = true;
                
                inputs.forEach(input => {
                  const userAnswer = input.value.trim().toLowerCase();
                  const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                  
                  if (userAnswer !== correctAnswer) {
                    allCorrect = false;
                  }
                });
                
                // Show completion message if all are correct
                const completeMessage = document.getElementById('challenge-complete-2');
                if (allCorrect && completeMessage) {
                  completeMessage.classList.remove('hidden');
                } else if (completeMessage) {
                  completeMessage.classList.add('hidden');
                }
              }}
            >
              Check Answers
            </button>
            
            <div className="mt-4 hidden text-center p-3 bg-green-100 rounded-lg" id="challenge-complete-2">
              <p className="text-green-800 font-medium">Awesome! You know how to manipulate arrays! 🎉</p>
              <p className="text-sm text-green-700">+8 points added to your score!</p>
            </div>
          </div>
        </div>
      ),
      hints: "Think about the array methods we just learned about for adding and accessing elements.",
    },
    
    // Slide 7
    {
      title: "Array Iteration: Processing Every Element",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-indigo-600">
            Looping Through Arrays 🔄
          </p>
          
          <p>
            Often, you'll need to process each element in an array one by one. This is called <span className="font-medium">iteration</span> or <span className="font-medium">traversal</span>.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium mb-2">Using for loops</h3>
              <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
                <p>// Calculate sum of all scores</p>
                <p>let total = 0;</p>
                <p>for (let i = 0; i &lt; scores.length; i++) {'{'}</p>
                <p className="ml-4">total += scores[i];</p>
                <p>{'}'}</p>
                <p>console.log(total); // Sum of all scores</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium mb-2">Using forEach method</h3>
              <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
                <p>// Modern way to iterate</p>
                <p>let total = 0;</p>
                <p>scores.forEach(score =&gt; &#123;)</p>
                <p className="ml-4">total += score;</p>
                <p>{'}'});</p>
                <p>console.log(total); // Sum of all scores</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="font-medium text-center mb-2">Common Array Processing Patterns</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-medium text-amber-700 mb-1">Transformation</p>
                <div className="bg-gray-100 p-2 rounded text-sm">
                  <code>
                    // Double all numbers<br/>
                    const doubled = numbers.map(num =&gt; num * 2);
                  </code>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-medium text-amber-700 mb-1">Filtering</p>
                <div className="bg-gray-100 p-2 rounded text-sm">
                  <code>
                    // Keep only even numbers<br/>
                    const evens = numbers.filter(num =&gt; num % 2 === 0);
                  </code>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 flex items-center">
            <div className="text-2xl mr-3">💡</div>
            <div>
              <p className="font-medium">Pro Tip:</p>
              <p className="text-sm">Modern array methods like <code>map()</code>, <code>filter()</code>, and <code>reduce()</code> are more readable and help you write cleaner code!</p>
            </div>
          </div>
        </div>
      ),
      hints: "Array iteration is essential for processing collections of data efficiently.",
    },
    
    // Slide 8
    {
      title: "Common Array Pitfalls",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-red-500">
            Array Gotchas to Watch Out For! ⚠️
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-medium flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                Out of Bounds Access
              </h3>
              <p className="text-sm mt-2">
                Accessing an index that doesn't exist will return <code>undefined</code> rather than causing an error.
              </p>
              <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm mt-2">
                <p>let games = ["Minecraft", "Fortnite", "Roblox"];</p>
                <p>console.log(games[5]); // undefined (no error!)</p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-medium flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                Array Length vs. Index
              </h3>
              <p className="text-sm mt-2">
                Remember that for an array of length 5, the valid indices are 0-4, not 0-5.
              </p>
              <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm mt-2">
                <p>let scores = [10, 20, 30, 40, 50];</p>
                <p>console.log(scores.length); // 5</p>
                <p>console.log(scores[scores.length - 1]); // 50 (last element)</p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-medium flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                Arrays are Reference Types
              </h3>
              <p className="text-sm mt-2">
                When you assign an array to a new variable, both variables reference the same array in memory.
              </p>
              <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm mt-2">
                <p>let a = [1, 2, 3];</p>
                <p>let b = a; // Both a and b point to the same array</p>
                <p>b[0] = 99;</p>
                <p>console.log(a[0]); // 99 (a is changed too!)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-center text-sm">
              <span className="font-medium">Developer Pro Tip:</span> Always check if an index is valid before accessing it, especially when working with user input or variable array sizes.
            </p>
          </div>
        </div>
      ),
      hints: "Being aware of these common pitfalls will help you debug array-related issues faster!",
    },
    
    // Slide 9 - QUIZ after slides 7-8
    {
      title: "Code Debug Challenge",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-center text-red-600">
            🐞 Debug the Array Code! 🐞
          </p>
          
          <div className="bg-red-50 p-5 rounded-lg border border-red-200 shadow-md">
            <p className="font-medium mb-4">Each snippet below contains a bug. Fill in the blanks to identify and fix the issues:</p>
            
            <div className="space-y-6">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-3">
                  let scores = [85, 90, 78, 92, 88];<br/>
                  let lastScore = scores[5];
                </p>
                <p className="mb-2">The bug is: index is <input 
                  type="text" 
                  placeholder="fill in the blank" 
                  className="border border-gray-300 rounded px-2 py-1 w-40" 
                  data-answer="out of bounds" 
                  onChange={(e) => {
                    const input = e.target;
                    const userAnswer = input.value.trim().toLowerCase();
                    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                    
                    if(userAnswer === correctAnswer) {
                      input.classList.remove('border-red-500', 'bg-red-50');
                      input.classList.add('border-green-500', 'bg-green-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Correct! The array has indices 0-4, but we're trying to access index 5.";
                    } else if(userAnswer) {
                      input.classList.remove('border-green-500', 'bg-green-50');
                      input.classList.add('border-red-500', 'bg-red-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Try again. What happens when you access an index that doesn't exist?";
                    }
                  }}
                />
                </p>
                <div className="hidden answer-feedback mt-1">Correct! The array has indices 0-4, but we're trying to access index 5.</div>
                
                <p className="mt-3 mb-2">To fix the code, I should use: scores[<input 
                  type="text" 
                  placeholder="index" 
                  className="border border-gray-300 rounded px-2 py-1 w-16 text-center" 
                  data-answer="4" 
                  onChange={(e) => {
                    const input = e.target;
                    const userAnswer = input.value.trim().toLowerCase();
                    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                    
                    if(userAnswer === correctAnswer) {
                      input.classList.remove('border-red-500', 'bg-red-50');
                      input.classList.add('border-green-500', 'bg-green-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Correct! The last element is at index 4.";
                    } else if(userAnswer) {
                      input.classList.remove('border-green-500', 'bg-green-50');
                      input.classList.add('border-red-500', 'bg-red-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Not quite. For an array with 5 elements, what's the index of the last element?";
                    }
                  }}
                />]</p>
                <div className="hidden answer-feedback mt-1">Correct! The last element is at index 4.</div>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-3">
                  let fruits = ["apple", "banana", "orange"];<br/>
                  fruits.length = 0;<br/>
                  console.log(fruits[0]);
                </p>
                <p className="mb-2">The console will log: <input 
                  type="text" 
                  placeholder="output value" 
                  className="border border-gray-300 rounded px-2 py-1 w-40" 
                  data-answer="undefined" 
                  onChange={(e) => {
                    const input = e.target;
                    const userAnswer = input.value.trim().toLowerCase();
                    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                    
                    if(userAnswer === correctAnswer) {
                      input.classList.remove('border-red-500', 'bg-red-50');
                      input.classList.add('border-green-500', 'bg-green-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Correct! Setting length to 0 empties the array, so fruits[0] is undefined.";
                    } else if(userAnswer) {
                      input.classList.remove('border-green-500', 'bg-green-50');
                      input.classList.add('border-red-500', 'bg-red-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Try again. What happens when you access an element in an empty array?";
                    }
                  }}
                /></p>
                <div className="hidden answer-feedback mt-1">Correct! Setting length to 0 empties the array, so fruits[0] is undefined.</div>
                
                <p className="mt-3 mb-2">Setting <code>fruits.length = 0</code> causes the array to become <input 
                  type="text" 
                  placeholder="describe effect" 
                  className="border border-gray-300 rounded px-2 py-1 w-40" 
                  data-answer="empty" 
                  onChange={(e) => {
                    const input = e.target;
                    const userAnswer = input.value.trim().toLowerCase();
                    const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                    
                    if(userAnswer === correctAnswer) {
                      input.classList.remove('border-red-500', 'bg-red-50');
                      input.classList.add('border-green-500', 'bg-green-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-green-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Correct! Setting the length to 0 removes all elements from the array.";
                    } else if(userAnswer) {
                      input.classList.remove('border-green-500', 'bg-green-50');
                      input.classList.add('border-red-500', 'bg-red-50');
                      input.parentElement.querySelector('.answer-feedback').classList.remove('hidden');
                      input.parentElement.querySelector('.answer-feedback').classList.add('text-red-500');
                      input.parentElement.querySelector('.answer-feedback').textContent = "Not quite. What happens to an array when its length is set to zero?";
                    }
                  }}
                /></p>
                <div className="hidden answer-feedback mt-1">Correct! Setting the length to 0 removes all elements from the array.</div>
              </div>
            </div>
            
            <button 
              className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
              onClick={() => {
                // Check if all inputs are correct
                const inputs = document.querySelectorAll('.bg-red-50 input[data-answer]');
                let allCorrect = true;
                
                inputs.forEach(input => {
                  const userAnswer = input.value.trim().toLowerCase();
                  const correctAnswer = input.getAttribute('data-answer').toLowerCase();
                  
                  if (userAnswer !== correctAnswer) {
                    allCorrect = false;
                  }
                });
                
                // Show completion message if all are correct
                const completeMessage = document.getElementById('challenge-complete-3');
                if (allCorrect && completeMessage) {
                  completeMessage.classList.remove('hidden');
                } else if (completeMessage) {
                  completeMessage.classList.add('hidden');
                }
              }}
            >
              Check Answers
            </button>
            
            <div className="mt-4 hidden text-center p-3 bg-green-100 rounded-lg" id="challenge-complete-3">
              <p className="text-green-800 font-medium">Great debugging skills! You're getting good at this! 🎉</p>
              <p className="text-sm text-green-700">+10 points added to your score!</p>
            </div>
          </div>
        </div>
      ),
      hints: "Pay attention to array indices and remember that array indices start at 0!",
    },
    
    // Slide 10
    {
      title: "Arrays in the Real World",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-center">
            Arrays Are Everywhere! 🌎
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium flex items-center mb-2">
                <span className="text-blue-500 mr-2">🎮</span>
                Gaming
              </h3>
              <ul className="text-sm list-disc list-inside">
                <li>Storing player inventories</li>
                <li>Tracking high scores</li>
                <li>Managing enemy positions</li>
                <li>Animation frame sequences</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium flex items-center mb-2">
                <span className="text-green-500 mr-2">📱</span>
                Apps
              </h3>
              <ul className="text-sm list-disc list-inside">
                <li>Contact lists</li>
                <li>Photo galleries</li>
                <li>Music playlists</li>
                <li>Social media feeds</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
              <h3 className="font-medium flex items-center mb-2">
                <span className="text-pink-500 mr-2">🖼️</span>
                Graphics
              </h3>
              <ul className="text-sm list-disc list-inside">
                <li>Images (2D arrays of pixels)</li>
                <li>Color palettes</li>
                <li>3D model coordinates</li>
                <li>Animation keyframes</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium flex items-center mb-2">
                <span className="text-purple-500 mr-2">🧠</span>
                AI & Science
              </h3>
              <ul className="text-sm list-disc list-inside">
                <li>Neural networks (arrays of weights)</li>
                <li>Scientific measurements</li>
                <li>Statistical data</li>
                <li>Sensor readings</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
            <p className="font-medium mb-2">What's Next in Your Array Journey?</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Multidimensional arrays (arrays of arrays)</li>
              <li>Array sorting algorithms</li>
              <li>Array searching techniques</li>
              <li>Advanced array methods</li>
            </ul>
            <p className="text-xs text-center mt-3">
              Master arrays and unlock the power to organize all your data efficiently!
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-center mb-3">
              <span className="font-medium text-lg">Did You Know? 🤔</span>
            </p>
            <div className="flex items-center">
              <FaLightbulb className="text-3xl text-yellow-500 mr-3 flex-shrink-0" />
              <p>
                Arrays are so fundamental that they're often built directly into computer hardware! 
                Memory in your computer is essentially one giant array of bytes.
              </p>
            </div>
          </div>
        </div>
      ),
      hints: "Arrays are the building blocks for more advanced data structures you'll learn later!",
    },
    
    // Final Quiz - After the entire module
    {
      title: "Final Array Challenge",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-medium text-center text-purple-600">
            🏆 Array Master Challenge 🏆
          </p>
          
          <p className="text-center">
            Let's test everything you've learned about arrays!
          </p>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-blue-200">
            <p className="text-center mb-4 font-medium">Find the correct elements by their index positions:</p>
            <ArrayIndexGame
              onScore={(score) => {
                console.log(`Player earned ${score} points`);
                return score;
              }}
            />
          </div>
        </div>
      ),
      hints: "This is your chance to show off all the array skills you've learned!",
    },
  ],
};

function ArrayTopicContainer() {
  useEffect(() => {
    // Initialize quiz handlers when component mounts
    if (IntroArrayData.init) {
      IntroArrayData.init();
    }
  }, []);
  
  // Render your content here
  return (
    <div>
      {/* Your content rendering */}
    </div>
  );
}

export default IntroArrayData;