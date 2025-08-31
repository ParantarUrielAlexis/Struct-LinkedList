// LinkedListExercise.js - Exercise validation system for linked list creation

export class LinkedListExercise {
  constructor(exerciseData) {
    this.sequence = exerciseData.sequence;
    this.addresses = exerciseData.addresses;
    this.title = exerciseData.title;
    this.description = exerciseData.description;
  }

  // Validate the user's linked list against the exercise requirements
  validateSubmission(circles, connections, entryOrder = null) {
    const result = {
      isCorrect: false,
      message: '',
      details: '',
      score: 0,
      totalPoints: entryOrder ? 120 : 100 // Extra points for portal entry order if provided
    };

    try {
      // Ensure we have valid input data
      if (!circles || !connections) {
        result.message = 'No submission data provided';
        result.details = 'Please create your linked list first.';
        return result;
      }

      // Check 1: Correct number of nodes (20 points)
      if (circles.length !== this.sequence.length) {
        result.message = `Wrong number of nodes!`;
        result.details = `Expected ${this.sequence.length} nodes, but found ${circles.length} nodes.`;
        return result;
      }
      result.score += 20;

      // Check 2: All required values exist (20 points)
      const userValues = circles.map(c => parseInt(c.value)).sort((a, b) => a - b);
      const expectedValues = [...this.sequence].sort((a, b) => a - b);
      
      if (!this.arraysEqual(userValues, expectedValues)) {
        result.message = `Incorrect node values!`;
        result.details = `Expected values: [${expectedValues.join(', ')}], but found: [${userValues.join(', ')}]`;
        return result;
      }
      result.score += 20;

      // Check 3: All required addresses exist and are correctly mapped (20 points)
      const addressCheck = this.validateAddresses(circles);
      if (!addressCheck.isValid) {
        result.message = addressCheck.message;
        result.details = addressCheck.details;
        return result;
      }
      result.score += 20;

      // Check 4: Correct number of connections (20 points)
      if (connections.length !== this.sequence.length - 1) {
        result.message = `Wrong number of connections!`;
        result.details = `Expected ${this.sequence.length - 1} connections, but found ${connections.length} connections.`;
        return result;
      }
      result.score += 20;

      // Check 5: Correct sequence and structure (20 points)
      const structureCheck = this.validateStructure(circles, connections);
      if (!structureCheck.isValid) {
        result.message = structureCheck.message;
        result.details = structureCheck.details;
        return result;
      }
      result.score += 20;

      // Check 5: Portal entry order validation (20 bonus points if portal was used)
      if (entryOrder && entryOrder.length > 0) {
        const orderCheck = this.validatePortalEntryOrder(circles, connections, entryOrder);
        if (orderCheck.isValid) {
          result.score += 20;
          result.message = '🌟 PERFECT! Your linked list is correct AND entered the portal in proper order!';
          result.details = `✅ Correct values: [${this.sequence.join(' → ')}]\n✅ Correct addresses\n✅ Perfect structure\n✅ All connections valid\n🌀 Perfect portal entry order!`;
        } else {
          result.message = '⚠️ Linked list is correct but portal entry order was wrong!';
          result.details = `✅ Correct values: [${this.sequence.join(' → ')}]\n✅ Correct addresses\n✅ Perfect structure\n✅ All connections valid\n❌ ${orderCheck.message}`;
        }
      } else {
        result.message = '🎉 Perfect! Your linked list is completely correct!';
        result.details = `✅ Correct values: [${this.sequence.join(' → ')}]\n✅ Correct addresses\n✅ Perfect structure\n✅ All connections valid`;
      }

      // All checks passed!
      result.isCorrect = true;
      
      return result;

    } catch (error) {
      // Only log and return error result for actual critical failures
      console.warn('Validation processing error:', error);
      result.message = 'Unable to validate submission';
      result.details = 'Please try submitting again.';
      return result;
    }
  }

  // Helper method to check if two arrays are equal
  arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
  }

  // Validate addresses and their mapping to values
  validateAddresses(circles) {
    for (const circle of circles) {
      const expectedAddress = this.addresses[circle.value];
      if (!expectedAddress) {
        return {
          isValid: false,
          message: `Unexpected value found!`,
          details: `Value ${circle.value} is not part of this exercise.`
        };
      }
      
      if (circle.address !== expectedAddress) {
        return {
          isValid: false,
          message: `Wrong address mapping!`,
          details: `Value ${circle.value} should have address "${expectedAddress}", but has "${circle.address}".`
        };
      }
    }
    
    return { isValid: true };
  }

  // Validate the linked list structure and sequence
  validateStructure(circles, connections) {
    // Create mapping from value to circle ID
    const valueToId = {};
    circles.forEach(circle => {
      valueToId[parseInt(circle.value)] = circle.id;
    });

    // Check for proper head node
    const headValue = this.sequence[0];
    const headId = valueToId[headValue];
    const headHasIncoming = connections.some(conn => conn.to === headId);
    const headHasOutgoing = connections.some(conn => conn.from === headId);

    if (headHasIncoming) {
      return {
        isValid: false,
        message: `Head node error!`,
        details: `The first node (${headValue}) should not have any incoming connections.`
      };
    }

    if (!headHasOutgoing && this.sequence.length > 1) {
      return {
        isValid: false,
        message: `Head node error!`,
        details: `The first node (${headValue}) should have an outgoing connection to the next node.`
      };
    }

    // Check for proper tail node
    const tailValue = this.sequence[this.sequence.length - 1];
    const tailId = valueToId[tailValue];
    const tailHasIncoming = connections.some(conn => conn.to === tailId);
    const tailHasOutgoing = connections.some(conn => conn.from === tailId);

    if (tailHasOutgoing) {
      return {
        isValid: false,
        message: `Tail node error!`,
        details: `The last node (${tailValue}) should not have any outgoing connections.`
      };
    }

    if (!tailHasIncoming && this.sequence.length > 1) {
      return {
        isValid: false,
        message: `Tail node error!`,
        details: `The last node (${tailValue}) should have an incoming connection from the previous node.`
      };
    }

    // Check sequential connections
    for (let i = 0; i < this.sequence.length - 1; i++) {
      const currentValue = this.sequence[i];
      const nextValue = this.sequence[i + 1];
      const currentId = valueToId[currentValue];
      const nextId = valueToId[nextValue];

      const connectionExists = connections.some(conn => 
        conn.from === currentId && conn.to === nextId
      );

      if (!connectionExists) {
        return {
          isValid: false,
          message: `Missing connection!`,
          details: `Expected connection from ${currentValue} (${this.addresses[currentValue]}) to ${nextValue} (${this.addresses[nextValue]}).`
        };
      }
    }

    // Check for invalid extra connections
    for (const connection of connections) {
      const fromCircle = circles.find(c => c.id === connection.from);
      const toCircle = circles.find(c => c.id === connection.to);
      
      if (!fromCircle || !toCircle) continue;

      const fromValue = parseInt(fromCircle.value);
      const toValue = parseInt(toCircle.value);
      
      const fromIndex = this.sequence.indexOf(fromValue);
      const toIndex = this.sequence.indexOf(toValue);

      if (toIndex !== fromIndex + 1) {
        return {
          isValid: false,
          message: `Invalid connection!`,
          details: `Found unexpected connection from ${fromValue} to ${toValue}. Only sequential connections are allowed.`
        };
      }
    }

    return { isValid: true };
  }

  // Get a progress report
  getProgressReport(circles, connections) {
    const report = {
      nodesCreated: circles.length,
      expectedNodes: this.sequence.length,
      connectionsCreated: connections.length,
      expectedConnections: this.sequence.length - 1,
      correctValues: 0,
      correctAddresses: 0,
      hasValidStructure: false
    };

    // Count correct values
    const userValues = circles.map(c => parseInt(c.value));
    report.correctValues = userValues.filter(val => this.sequence.includes(val)).length;

    // Count correct addresses
    circles.forEach(circle => {
      if (this.addresses[circle.value] === circle.address) {
        report.correctAddresses++;
      }
    });

    // Check structure
    if (circles.length === this.sequence.length && connections.length === this.sequence.length - 1) {
      const structureCheck = this.validateStructure(circles, connections);
      report.hasValidStructure = structureCheck.isValid;
    }

    return report;
  }

  // Validate portal entry order - circles should enter in linked list order (head to tail)
  validatePortalEntryOrder(circles, connections, entryOrder) {
    try {
      // Build the correct traversal order by following the linked list chain
      const correctOrder = this.getLinkedListTraversalOrder(circles, connections);
      
      if (!correctOrder || correctOrder.length === 0) {
        return {
          isValid: false,
          message: "Could not determine correct traversal order"
        };
      }

      // Compare the entry order with the correct linked list order
      if (entryOrder.length !== correctOrder.length) {
        return {
          isValid: false,
          message: `Expected ${correctOrder.length} circles to enter portal, but ${entryOrder.length} entered`
        };
      }

      // Check if the entry order matches the linked list traversal order
      for (let i = 0; i < entryOrder.length; i++) {
        if (entryOrder[i] !== correctOrder[i]) {
          const entryCircle = circles.find(c => c.id === entryOrder[i]);
          const correctCircle = circles.find(c => c.id === correctOrder[i]);
          
          return {
            isValid: false,
            message: `Wrong portal entry order! Expected ${correctCircle?.value || 'unknown'} at position ${i + 1}, but got ${entryCircle?.value || 'unknown'}`
          };
        }
      }

      return {
        isValid: true,
        message: "Perfect portal entry order!"
      };

    } catch (error) {
      return {
        isValid: false,
        message: `Error validating portal entry order: ${error.message}`
      };
    }
  }

  // Get the correct traversal order by following the linked list from head to tail
  getLinkedListTraversalOrder(circles, connections) {
    // Find the head node (has outgoing connection but no incoming)
    const headCircle = circles.find(circle => {
      const hasOutgoing = connections.some(conn => conn.from === circle.id);
      const hasIncoming = connections.some(conn => conn.to === circle.id);
      return hasOutgoing && !hasIncoming;
    });

    if (!headCircle) {
      throw new Error("No head node found");
    }

    // Traverse the linked list from head to tail
    const traversalOrder = [];
    let currentId = headCircle.id;
    const visited = new Set();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      traversalOrder.push(currentId);

      // Find the next node
      const nextConnection = connections.find(conn => conn.from === currentId);
      currentId = nextConnection ? nextConnection.to : null;
    }

    return traversalOrder;
  }
}

// Predefined exercise templates
export const EXERCISE_TEMPLATES = {
  exercise_one: {
    sequence: [101, 102, 103, 104, 105],
    addresses: {
      101: "0x100",
      102: "0x105",
      103: "0x110",
      104: "0x115",
      105: "0x120"
    },
    title: "Reverse The Linked List",
    description: "Reverse the linked list in place"
  },
  exercise_two: {
    sequence: [11, 57, 24, 42, 81, 52],
    addresses: {
      11: "z10",
      57: "y15",
      24: "x20",
      42: "w25",
      81: "v30",
      52: "u35",
    },
    title: "Sorted Insertion Challenge",
    description: "Insert the nodes so that the linked list remains sorted in ascending order."
  },
  exercise_tree: {
    sequence: [91, 76, 23, 12, 41, 22, 34],
    addresses: {
      91: "0x57",
      76: "0x58",
      23: "0x59",
      12: "0x5a",
      41: "0x5b",
      22: "0x5c",
      34: "0x5d"
    },
    title: "Position-Based Insertion",
    description: "Insert each node at the specified position in the linked list. (e.g., Insert 23 at position 2, 41 at position 5, etc.)"
  }
};
  export const INITIAL_CIRCLES = [
    { id: 1, value: "105", address: "0x120", next: "0x115" },
    { id: 2, value: "104", address: "0x115", next: "0x110" },
    { id: 3, value: "103", address: "0x110", next: "0x105" },
    { id: 4, value: "102", address: "0x105", next: "0x100" },
    { id: 5, value: "101", address: "0x100", next: null }
  ];

// For more challenge, start with a partially filled, unsorted, or "broken" list for exercise 2 and 3
export const INITIAL_CIRCLES_TWO = [
  // Unsorted and missing some nodes from the sequence, user must fix and insert the rest in sorted order
  { id: 1, value: "24", address: "x20", next: "y15" },
  { id: 2, value: "57", address: "y15", next: null }
  // User must insert 11, 42, 81, 52 and sort the list
];

export const INITIAL_CIRCLES_THREE = [
  // Nodes are out of order and not all are present, user must insert and rearrange to match the required positions
  { id: 1, value: "41", address: "0x5b", next: "0x5d" },
  { id: 2, value: "34", address: "0x5d", next: null }
  // User must insert 91, 76, 23, 12, 22 and arrange all nodes in the correct order
];
  
// Latest Insert Node
// Exercise manager class
export class ExerciseManager {
  constructor() {
    this.currentExercise = null;
    this.submissionData = null;
    this.isWaitingForValidation = false;
  }

  // Load an exercise
  loadExercise(templateKey) {
    const template = EXERCISE_TEMPLATES[templateKey];
    if (!template) {
      throw new Error(`Exercise template "${templateKey}" not found`);
    }
    
    this.currentExercise = new LinkedListExercise(template);
    this.submissionData = null;
    this.isWaitingForValidation = false;
    
    // Build expectedStructure for UI display
    this.currentExercise.key = templateKey;
    this.currentExercise.expectedStructure = template.sequence.map(value => ({
      value: value,
      address: template.addresses[value],
      next: null // Will be calculated based on sequence order
    }));
    
    // Set next addresses based on sequence order
    for (let i = 0; i < this.currentExercise.expectedStructure.length - 1; i++) {
      this.currentExercise.expectedStructure[i].next = this.currentExercise.expectedStructure[i + 1].address;
    }
    // Last node points to null
    if (this.currentExercise.expectedStructure.length > 0) {
      this.currentExercise.expectedStructure[this.currentExercise.expectedStructure.length - 1].next = 'null';
    }
    
    return this.currentExercise;
  }

  // Submit answer for validation (called when user opens suction)
  submitAnswer(circles, connections) {
    if (!this.currentExercise) {
      throw new Error('No exercise loaded');
    }

    // Store the submission data for later validation
    this.submissionData = {
      circles: JSON.parse(JSON.stringify(circles)), // Deep copy
      connections: JSON.parse(JSON.stringify(connections)) // Deep copy
    };
    
    this.isWaitingForValidation = true;
    return true;
  }

  // Validate submission (called after all circles are sucked)
  validateSubmission(circles = null, connections = null, entryOrder = null) {
    console.log('validateSubmission called with:', { circles, connections, entryOrder });
    
    // If parameters are provided (even if empty arrays), use them directly (for portal validation)
    if (circles !== null && connections !== null) {
      console.log('Using provided parameters for validation');
      
      if (!this.currentExercise) {
        console.warn('No exercise loaded, attempting to load basic exercise...');
        try {
          this.loadExercise('exercise_one');
        } catch (loadError) {
          console.error('Failed to load default exercise:', loadError);
          // Return a gentle error instead of throwing
          return {
            isCorrect: false,
            message: 'System not ready',
            details: 'Please try again in a moment.',
            score: 0,
            totalPoints: 100
          };
        }
      }

      const result = this.currentExercise.validateSubmission(
        circles,
        connections,
        entryOrder
      );

      return result;
    }

    // Otherwise, use stored submission data (for manual validation)
    console.log('Using stored submission data for validation');
    
    if (!this.currentExercise) {
      console.error('No exercise loaded for manual validation');
      return {
        isCorrect: false,
        message: 'System not ready',
        details: 'Please refresh and try again.',
        score: 0,
        totalPoints: 100
      };
    }
    
    if (!this.submissionData) {
      console.warn('No stored submission data for manual validation');
      return {
        isCorrect: false,
        message: 'No submission found',
        details: 'Please create your linked list first.',
        score: 0,
        totalPoints: 100
      };
    }

    const result = this.currentExercise.validateSubmission(
      this.submissionData.circles,
      this.submissionData.connections,
      entryOrder
    );

    this.isWaitingForValidation = false;
    return result;
  }

  // Get current exercise info
  getCurrentExercise() {
    return this.currentExercise;
  }

  // Check if waiting for validation
  isWaiting() {
    return this.isWaitingForValidation;
  }

  // Reset the manager
  reset() {
    this.submissionData = null;
    this.isWaitingForValidation = false;
  }
}
