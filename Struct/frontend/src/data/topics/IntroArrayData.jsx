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
      title: "Array Basics Mini-Activity",
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
              <p className="text-sm text-green-700">+ points added to your account</p>
            </div>
          </div>
        </div>
      ),
      hints: "Think about the zero-based indexing we just learned about!",
    },
    
    // Slide 4
    {
      title: "Updating Array Elements",
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
      title: "Common Array Operations",
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
  title: "Array Operation Mini-Quiz",
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
                  
                  // Hide the completion message when editing answers
                  const completeMessage = document.getElementById('challenge-complete-2');
                  if (completeMessage) {
                    completeMessage.classList.add('hidden');
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
                  
                  // Hide the completion message when editing answers
                  const completeMessage = document.getElementById('challenge-complete-2');
                  if (completeMessage) {
                    completeMessage.classList.add('hidden');
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
                  
                  // Hide the completion message when editing answers
                  const completeMessage = document.getElementById('challenge-complete-2');
                  if (completeMessage) {
                    completeMessage.classList.add('hidden');
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
              // Handle single/double quotes normalization
              const normalizedUserAnswer = userAnswer.replace(/'/g, '"').replace(/"/g, '"');
              
              const correctAnswer = input.getAttribute('data-answer').toLowerCase();
              const normalizedCorrectAnswer = correctAnswer.replace(/'/g, '"').replace(/"/g, '"');
              
              // Check if the answer is correct with either exact match or normalized match
              if (!(userAnswer === correctAnswer || normalizedUserAnswer === normalizedCorrectAnswer)) {
                allCorrect = false;
                
                // Highlight incorrect answers in red for visual feedback
                input.classList.remove('border-green-500', 'bg-green-50');
                input.classList.add('border-red-500', 'bg-red-50');
              } else {
                // Highlight correct answers in green
                input.classList.remove('border-red-500', 'bg-red-50');
                input.classList.add('border-green-500', 'bg-green-50');
              }
            });
            
            // Show completion message only if all answers are correct
            const completeMessage = document.getElementById('challenge-complete-2');
            if (completeMessage) {
              if (allCorrect) {
                completeMessage.classList.remove('hidden');
                
                // Optional: You could add animation here for the points display
                completeMessage.classList.add('animate-bounce');
                setTimeout(() => {
                  completeMessage.classList.remove('animate-bounce');
                }, 1000);
              } else {
                completeMessage.classList.add('hidden');
              }
            }
          }}
        >
          Check Answers
        </button>
        
        <div className="mt-4 hidden text-center p-3 bg-green-100 rounded-lg" id="challenge-complete-2">
          <p className="text-green-800 font-medium">Awesome! You know how to manipulate arrays! 🎉</p>
          <p className="text-sm text-green-700">+50 points added to your score!</p>
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
              <p className="text-sm text-green-700">+30 points added to your score!</p>
            </div>
          </div>
        </div>
      ),
      hints: "Pay attention to array indices and remember that array indices start at 0!",
    },
    
    // Slide 10
    {
  title: "Key Array Takeaways",
  content: (
    <div className="space-y-4">
      <p className="text-lg font-medium text-center text-blue-600">
        🔑 Array Fundamentals: Key Takeaways 🔑
      </p>
      
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-md">
        <h3 className="font-medium text-center mb-4 text-blue-800">What You've Learned About Arrays</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium flex items-center mb-2">
              <span className="bg-blue-100 p-1 rounded-full text-blue-600 mr-2">1</span>
              Definition & Purpose
            </h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>Ordered collections of data</li>
              <li>Store multiple values in a single variable</li>
              <li>Access elements by numeric index</li>
              <li>Foundation for complex data structures</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium flex items-center mb-2">
              <span className="bg-blue-100 p-1 rounded-full text-blue-600 mr-2">2</span>
              Creating Arrays
            </h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>Array literals <code>['a', 'b', 'c']</code></li>
              <li>Array constructor <code>new Array()</code></li>
              <li>Can hold mixed data types</li>
              <li>Zero-indexed (first element is at position 0)</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium flex items-center mb-2">
              <span className="bg-blue-100 p-1 rounded-full text-blue-600 mr-2">3</span>
              Basic Operations
            </h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>Accessing elements: <code>array[index]</code></li>
              <li>Getting length: <code>array.length</code></li>
              <li>Adding elements: <code>push()</code>, <code>unshift()</code></li>
              <li>Removing elements: <code>pop()</code>, <code>shift()</code></li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium flex items-center mb-2">
              <span className="bg-blue-100 p-1 rounded-full text-blue-600 mr-2">4</span>
              Common Methods
            </h3>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li><code>splice()</code> - add/remove at any position</li>
              <li><code>slice()</code> - extract a portion</li>
              <li><code>join()</code> - combine into string</li>
              <li><code>indexOf()</code> - find element position</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg mt-5">
          <h3 className="font-medium flex items-center mb-2">
            <span className="text-indigo-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
            Array Advantages
          </h3>
          <ul className="text-sm list-disc ml-5 grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>Fast access to elements (O(1) time)</li>
            <li>Memory efficiency with same-type data</li>
            <li>Built-in methods for common operations</li>
            <li>Easy to iterate through with loops</li>
            <li>Simple syntax for creation and access</li>
            <li>Universal across programming languages</li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="font-medium flex items-center mb-2 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Syntax Summary
          </h3>
          <div className="bg-gray-50 p-3 rounded-md font-mono text-xs">
            <div className="mb-1">// Creating an array</div>
            <div className="text-blue-600 mb-2">let fruits = ["apple", "banana", "orange"];</div>
            
            <div className="mb-1">// Accessing elements</div>
            <div className="text-blue-600 mb-2">let firstFruit = fruits[0]; // "apple"</div>
            
            <div className="mb-1">// Modifying arrays</div>
            <div className="text-blue-600 mb-2">fruits.push("grape"); // Add to end</div>
            <div className="text-blue-600">fruits[1] = "mango"; // Replace element</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
          <h3 className="font-medium flex items-center mb-2 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Common Patterns
          </h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2 text-xs">→</span>
              <span><strong>Iteration:</strong> Using <code>for</code> loops or <code>forEach()</code> to process each element</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2 text-xs">→</span>
              <span><strong>Transformation:</strong> Creating new arrays with modified elements</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2 text-xs">→</span>
              <span><strong>Filtering:</strong> Creating subsets based on conditions</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2 text-xs">→</span>
              <span><strong>Aggregation:</strong> Combining elements to create a single value</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
        <p className="font-medium flex items-center mb-2 text-amber-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Remember
        </p>
        <ul className="text-sm list-disc ml-5 space-y-1">
          <li>Arrays are zero-indexed (positions start at 0, not 1)</li>
          <li>Some methods modify the original array (mutating), while others create new arrays</li>
          <li>Arrays can change size dynamically</li>
          <li>Out-of-bounds access returns <code>undefined</code> rather than causing errors</li>
        </ul>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
        <p className="text-blue-800">
          <span className="font-medium">Next Steps:</span> Build on these fundamentals as we explore more advanced array manipulation techniques in the coming lessons!
        </p>
      </div>
    </div>
  ),
  hints: "These are the core concepts that form the foundation for all array operations you'll learn!",
}
    
    
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