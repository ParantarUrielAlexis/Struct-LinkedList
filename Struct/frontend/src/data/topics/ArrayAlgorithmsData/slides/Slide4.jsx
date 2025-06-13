import React from "react";
import { FaGamepad } from "react-icons/fa";

const Slide4 = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Bubble Sort Algorithm</h2>
      <p>
        Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.
        This causes larger elements to "bubble up" to the end of the list.
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium">How Bubble Sort Works:</h4>
        <ol className="list-decimal list-inside pl-4 mt-2">
          <li>Compare each pair of adjacent elements</li>
          <li>Swap them if they are in the wrong order</li>
          <li>Continue to the next pair of elements</li>
          <li>After each pass through the array, the largest unsorted element moves to its correct position</li>
          <li>Repeat until no more swaps are needed</li>
        </ol>
      </div>
      
      {/* Bubble Sort Animation */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-center mb-2">Interactive Bubble Sort</h4>
        <p className="text-sm text-center mb-3">Watch how elements "bubble up" to their correct positions</p>
        
        <div className="flex justify-center mb-4">
          <div id="bubbleSortContainer" className="flex items-end h-60 bg-white p-4 rounded-lg shadow-inner">
            {[42, 19, 33, 76, 25, 54, 14].map((value, index) => (
              <div
                key={index}
                className="mx-1 bg-green-400 rounded-t-md transition-all duration-500 flex items-center justify-center text-white font-bold"
                style={{ height: `${value * 1.2}px`, width: '40px' }}
                data-value={value}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-3 mb-3">
          <button 
            id="resetBubbleSort"
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
            onClick={() => {
              // Reset the visualization
              const container = document.getElementById('bubbleSortContainer');
              const array = [42, 19, 33, 76, 25, 54, 14];
              
              if (!container) return;
              
              // Clear container
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
              
              // Recreate bars
              array.forEach((value, index) => {
                const bar = document.createElement('div');
                bar.className = 'mx-1 bg-green-400 rounded-t-md transition-all duration-500 flex items-center justify-center text-white font-bold';
                bar.style.height = `${value * 1.2}px`;
                bar.style.width = '40px';
                bar.textContent = value;
                bar.setAttribute('data-value', value);
                container.appendChild(bar);
              });
              
              // Reset description
              document.getElementById('bubbleSortDescription').textContent = 'Click "Next Step" to begin sorting';
              document.getElementById('bubbleNextBtn').disabled = false;
              document.getElementById('bubbleNextBtn').classList.remove('opacity-50', 'cursor-not-allowed');
              
              // Reset step counter
              container.setAttribute('data-pass', '0');
              container.setAttribute('data-index', '0');
              container.setAttribute('data-swapped', 'false');
            }}
          >
            Reset
          </button>
          
          <button 
            id="bubbleNextBtn"
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
            onClick={() => {
              const container = document.getElementById('bubbleSortContainer');
              const description = document.getElementById('bubbleSortDescription');
              
              if (!container) return;
              
              const bars = Array.from(container.children);
              const values = bars.map(bar => parseInt(bar.getAttribute('data-value')));
              
              // Get current state
              let pass = parseInt(container.getAttribute('data-pass') || '0');
              let index = parseInt(container.getAttribute('data-index') || '0');
              let swapped = container.getAttribute('data-swapped') === 'true';
              
              // Remove any previous highlights
              bars.forEach(bar => {
                bar.classList.remove('bg-orange-400', 'bg-orange-500');
              });
              
              // Execute step
              const n = values.length;
              
              // Check if sorting is complete
              if (pass >= n - 1) {
                description.textContent = 'Sorting complete!';
                document.getElementById('bubbleNextBtn').disabled = true;
                document.getElementById('bubbleNextBtn').classList.add('opacity-50', 'cursor-not-allowed');
                return;
              }
              
              // Update the pass status if needed
              if (index >= n - pass - 1) {
                // Completed a pass
                bars[n - pass - 1].classList.add('bg-green-600');
                
                if (!swapped) {
                  description.textContent = 'No swaps in this pass. Array is sorted!';
                  document.getElementById('bubbleNextBtn').disabled = true;
                  document.getElementById('bubbleNextBtn').classList.add('opacity-50', 'cursor-not-allowed');
                  // Mark all remaining as sorted
                  for (let i = 0; i < n - pass; i++) {
                    bars[i].classList.add('bg-green-600');
                  }
                  return;
                }
                
                pass++;
                index = 0;
                swapped = false;
                container.setAttribute('data-pass', pass);
                container.setAttribute('data-index', index);
                container.setAttribute('data-swapped', 'false');
                
                description.textContent = `Starting pass ${pass + 1}`;
                return;
              }
              
              // Highlight the current comparison
              bars[index].classList.add('bg-orange-400');
              bars[index + 1].classList.add('bg-orange-400');
              
              description.textContent = `Comparing ${values[index]} and ${values[index + 1]}`;
              
              // Check if swap is needed
              if (values[index] > values[index + 1]) {
                // Swap the elements
                const temp = values[index];
                values[index] = values[index + 1];
                values[index + 1] = temp;
                
                // Update the DOM
                const tempHeight = bars[index].style.height;
                const tempText = bars[index].textContent;
                const tempValue = bars[index].getAttribute('data-value');
                
                bars[index].style.height = bars[index + 1].style.height;
                bars[index].textContent = bars[index + 1].textContent;
                bars[index].setAttribute('data-value', bars[index + 1].getAttribute('data-value'));
                
                bars[index + 1].style.height = tempHeight;
                bars[index + 1].textContent = tempText;
                bars[index + 1].setAttribute('data-value', tempValue);
                
                description.textContent = `Swapped ${values[index + 1]} and ${values[index]}`;
                swapped = true;
                container.setAttribute('data-swapped', 'true');
              }
              
              // Move to next index
              index++;
              container.setAttribute('data-index', index);
            }}
          >
            Next Step
          </button>
          
          <button 
            id="bubbleAutoBtn"
            className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition flex items-center text-sm"
            onClick={(e) => {
              const button = e.currentTarget;
              const isPlaying = button.getAttribute('data-playing') === 'true';
              
              if (isPlaying) {
                // Stop auto-play
                clearInterval(parseInt(button.getAttribute('data-interval')));
                button.setAttribute('data-playing', 'false');
                button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Auto Play';
              } else {
                // Start auto-play
                const nextBtn = document.getElementById('bubbleNextBtn');
                if (nextBtn.disabled) return;
                
                button.setAttribute('data-playing', 'true');
                button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M13 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clip-rule="evenodd"></path></svg> Pause';
                
                const interval = setInterval(() => {
                  if (nextBtn.disabled) {
                    clearInterval(interval);
                    button.setAttribute('data-playing', 'false');
                    button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Auto Play';
                    return;
                  }
                  nextBtn.click();
                }, 800);
                
                button.setAttribute('data-interval', interval);
              }
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
            </svg> Auto Play
          </button>
        </div>
        
        <div id="bubbleSortDescription" className="text-center text-sm p-2 bg-white rounded border border-green-100 min-h-[2rem]">
          Click "Next Step" to begin sorting
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium">Key Characteristics:</h4>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm">
          <li>Time Complexity: O(n²) in worst case, O(n) in best case (already sorted)</li>
          <li>Space Complexity: O(1) - in-place algorithm</li>
          <li>Stable sort - maintains relative order of equal elements</li>
          <li>Optimized by stopping early if no swaps occur in a pass</li>
          <li>Simple to implement but inefficient for large datasets</li>
        </ul>
      </div>
      <div className="mt-2 text-sm italic text-green-700">
        Watch how the largest elements 'bubble up' to their correct positions after each pass through the array.
      </div>
    </div>
  );
};

export default Slide4;