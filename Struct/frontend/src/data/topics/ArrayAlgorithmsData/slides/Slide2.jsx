import React from "react";

const Slide2 = () => {
  return (
    <div className="space-y-4">
      <p>
        Selection Sort works by repeatedly finding the smallest element and placing it at the beginning of the unsorted portion of the array.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium">How Selection Sort Works:</h4>
        <ol className="list-decimal list-inside pl-4 mt-2">
          <li>Find the minimum element in the unsorted part of the array</li>
          <li>Swap it with the element at the current position</li>
          <li>Move the boundary between sorted and unsorted sections one element to the right</li>
          <li>Repeat until the entire array is sorted</li>
        </ol>
      </div>
      
      {/* Interactive Selection Sort Visualization */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-center mb-2">Interactive Selection Sort</h4>
        <p className="text-sm text-center mb-3">Control the sorting process step by step or watch the animation</p>
        
        {/* Legend for color coding */}
        <div className="flex flex-wrap justify-center mb-3 gap-3 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 mr-1"></div>
            <span>Current position</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 mr-1"></div>
            <span>Current minimum</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 mr-1"></div>
            <span>Being compared</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-400 mr-1"></div>
            <span>Sorted</span>
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <div id="selectionSortContainer" className="flex items-end h-60 bg-white p-4 rounded-lg shadow-inner">
            {[35, 22, 63, 17, 42, 51, 28].map((value, index) => (
              <div
                key={index}
                className="mx-1 bg-blue-400 rounded-t-md transition-all duration-500 flex items-center justify-center text-white font-bold"
                style={{ height: `${value * 1.5}px`, width: '40px' }}
                data-value={value}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center space-x-3 mb-3">
          <button 
            id="resetSelectionSort"
            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-sm"
            onClick={() => {
              // Reset the visualization
              const container = document.getElementById('selectionSortContainer');
              const array = [35, 22, 63, 17, 42, 51, 28];
              
              if (!container) return;
              
              // Clear container
              while (container.firstChild) {
                container.removeChild(container.firstChild);
              }
              
              // Recreate bars
              array.forEach((value, index) => {
                const bar = document.createElement('div');
                bar.className = 'mx-1 bg-blue-400 rounded-t-md transition-all duration-500 flex items-center justify-center text-white font-bold';
                bar.style.height = `${value * 1.5}px`;
                bar.style.width = '40px';
                bar.textContent = value;
                bar.setAttribute('data-value', value);
                container.appendChild(bar);
              });
              
              // Reset other UI elements
              document.getElementById('sortStepDescription').textContent = 'Click "Next Step" to begin sorting';
              document.getElementById('nextStepBtn').disabled = false;
              document.getElementById('nextStepBtn').classList.remove('opacity-50', 'cursor-not-allowed');
              
              // Reset step counter
              container.setAttribute('data-step', '0');
              container.setAttribute('data-i', '0');
              container.setAttribute('data-j', '1');
              container.setAttribute('data-min', '0');
              
              // Reset auto play button if it's playing
              const autoPlayBtn = document.getElementById('autoPlayBtn');
              if (autoPlayBtn.getAttribute('data-playing') === 'true') {
                clearInterval(parseInt(autoPlayBtn.getAttribute('data-interval')));
                autoPlayBtn.setAttribute('data-playing', 'false');
                autoPlayBtn.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Auto Play';
              }
            }}
          >
            Reset
          </button>
          
          <button 
            id="nextStepBtn"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            onClick={() => {
              const container = document.getElementById('selectionSortContainer');
              const description = document.getElementById('sortStepDescription');
              
              if (!container) return;
              
              const bars = Array.from(container.children);
              const values = bars.map(bar => parseInt(bar.getAttribute('data-value')));
              
              // Get current state
              let step = parseInt(container.getAttribute('data-step') || '0');
              let i = parseInt(container.getAttribute('data-i') || '0');
              let j = parseInt(container.getAttribute('data-j') || '1');
              let minIdx = parseInt(container.getAttribute('data-min') || '0');
              
              // Execute next step
              if (step === 0) {
                // Initialize first pass
                description.textContent = `Pass ${i+1}: Finding minimum value in unsorted portion [${values.slice(i).join(', ')}]`;
                bars[i].classList.add('bg-yellow-400');
                bars[minIdx].classList.add('bg-red-400');
                step = 1;
              } 
              else if (step === 1) {
                // Compare current j with min
                if (j < values.length) {
                  // Remove highlighting from previous j
                  if (j > 1) {
                    bars[j-1].classList.remove('bg-blue-200');
                  }
                  
                  // Highlight current j for comparison
                  bars[j].classList.add('bg-blue-200');
                  
                  description.textContent = `Comparing ${values[j]} with current minimum ${values[minIdx]}`;
                  
                  // Check if new minimum
                  if (values[j] < values[minIdx]) {
                    bars[minIdx].classList.remove('bg-red-400');
                    minIdx = j;
                    bars[minIdx].classList.add('bg-red-400');
                    description.textContent = `Found new minimum: ${values[minIdx]}`;
                  }
                  
                  j++;
                  container.setAttribute('data-j', j);
                  container.setAttribute('data-min', minIdx);
                } else {
                  // Done comparing, swap if needed
                  step = 2;
                  description.textContent = `Swapping ${values[i]} with minimum ${values[minIdx]}`;
                }
              }
              else if (step === 2) {
                // Perform swap
                if (i !== minIdx) {
                  // Update the actual array values
                  const temp = values[i];
                  values[i] = values[minIdx];
                  values[minIdx] = temp;
                  
                  // Update the visual representation
                  bars[i].style.height = `${values[i] * 1.5}px`;
                  bars[i].textContent = values[i];
                  bars[i].setAttribute('data-value', values[i]);
                  
                  bars[minIdx].style.height = `${values[minIdx] * 1.5}px`;
                  bars[minIdx].textContent = values[minIdx];
                  bars[minIdx].setAttribute('data-value', values[minIdx]);
                }
                
                // Update styling
                bars[i].classList.remove('bg-yellow-400');
                bars[minIdx].classList.remove('bg-red-400');
                bars[i].classList.add('bg-green-400');
                
                // Clear any comparison highlighting
                bars.forEach(bar => bar.classList.remove('bg-blue-200'));
                
                // Move to next iteration
                i++;
                
                // Check if done
                if (i >= values.length - 1) {
                  bars[values.length - 1].classList.add('bg-green-400');
                  description.textContent = 'Sorting complete!';
                  document.getElementById('nextStepBtn').disabled = true;
                  document.getElementById('nextStepBtn').classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                  minIdx = i;
                  j = i + 1;
                  step = 0;
                  container.setAttribute('data-j', j);
                  container.setAttribute('data-min', minIdx);
                }
              }
              
              // Update state
              container.setAttribute('data-step', step);
              container.setAttribute('data-i', i);
            }}
          >
            Next Step
          </button>
          
          <button 
            id="autoPlayBtn"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition flex items-center text-sm"
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
                const nextStepBtn = document.getElementById('nextStepBtn');
                if (nextStepBtn.disabled) return;
                
                button.setAttribute('data-playing', 'true');
                button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M13 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clip-rule="evenodd"></path></svg> Pause';
                
                const interval = setInterval(() => {
                  if (nextStepBtn.disabled) {
                    clearInterval(interval);
                    button.setAttribute('data-playing', 'false');
                    button.innerHTML = '<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg> Auto Play';
                    return;
                  }
                  nextStepBtn.click();
                }, 1000);
                
                button.setAttribute('data-interval', interval);
              }
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
            </svg> Auto Play
          </button>
        </div>
        
        <div id="sortStepDescription" className="text-center text-sm p-2 bg-white rounded border border-blue-100 min-h-[2rem]">
          Click "Next Step" to begin sorting
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium">Key Characteristics:</h4>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm">
          <li>Time Complexity: O(n²) in all cases</li>
          <li>Space Complexity: O(1) - only requires a single additional memory space</li>
          <li>Makes exactly (n-1) swaps</li>
          <li>Not stable (doesn't preserve order of equal elements)</li>
          <li>Performs well when memory writing is expensive</li>
        </ul>
      </div>
    </div>
  );
};

export default Slide2;