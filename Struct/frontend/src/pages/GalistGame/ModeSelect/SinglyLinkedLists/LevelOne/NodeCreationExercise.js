
// NodeOrderExercise.js - Only validates the order of node values entered into the portal

export class NodeOrderExercise {
  constructor(exerciseData) {
    this.sequence = exerciseData.sequence;
    this.addresses = exerciseData.addresses;
    this.title = exerciseData.title;
    this.description = exerciseData.description;
    this.key = exerciseData.key || null;
    // Build expectedStructure for frontend display
    this.expectedStructure = this.sequence.map(value => ({
      value,
      address: this.addresses ? this.addresses[value] : ''
    }));
  }

  // Validate only the order of values entered into the portal
  validateSubmission(circles, _connections, entryOrder = null) {
    const result = {
      isCorrect: false,
      message: '',
      details: '',
      score: 0,
      totalPoints: 100,
      userCircles: [], // Add this to store user's entered circles
      perNodeCorrectness: [] // New: array of booleans for each node
    };

    if (!circles || !entryOrder || entryOrder.length !== this.sequence.length) {
      result.message = 'Please enter all nodes into the portal in order.';
      result.details = `Expected ${this.sequence.length} nodes, but got ${entryOrder ? entryOrder.length : 0}.`;
      return result;
    }


    // Map entryOrder (ids) to values, ensure correct mapping for partial scoring
    let enteredValues = [];
    if (Array.isArray(entryOrder) && entryOrder.length === this.sequence.length) {
      for (let i = 0; i < entryOrder.length; i++) {
        const id = entryOrder[i];
        const circle = circles.find(c => c.id === id);
        // Only push a number, never undefined or NaN
        enteredValues.push(circle && !isNaN(Number(circle.value)) ? Number(circle.value) : null);
      }
    }

    // Also store the circle objects for display
    result.userCircles = [];
    if (Array.isArray(entryOrder)) {
      for (let i = 0; i < entryOrder.length; i++) {
        const id = entryOrder[i];
        const circle = circles.find(c => c.id === id);
        if (circle) result.userCircles.push(circle);
      }
    }

    // Per-node correctness
    let correctCount = 0;
    for (let i = 0; i < this.sequence.length; i++) {
      if (enteredValues[i] === this.sequence[i]) {
        result.perNodeCorrectness[i] = true;
        correctCount++;
      } else {
        result.perNodeCorrectness[i] = false;
      }
    }

    // Scoring: full correct = 100, else partial points
    if (
      correctCount === this.sequence.length &&
      enteredValues.length === this.sequence.length &&
      enteredValues.every((v, i) => v === this.sequence[i])
    ) {
      result.isCorrect = true;
      result.score = 100;
      result.message = '🌟 PERFECT! All nodes entered the portal in the correct order!';
      result.details = `✅ Correct order: [${this.sequence.join(' → ')}]`;
    } else {
      // Partial score: equally weighted per node
      result.score = Math.round((correctCount / this.sequence.length) * 100);
      result.message = '❌ Incorrect order!';
      result.details = `Expected: [${this.sequence.join(', ')}], got: [${enteredValues.join(', ')}]`;
    }
    return result;
  }

  arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
  }
}

// Predefined exercise templates (addresses are ignored)
export const EXERCISE_TEMPLATES = {
  exercise_one: {
    sequence: [1, 2, 3, 4, 5],
    addresses: {
      1: "a",
      2: "b",
      3: "c",
      4: "d",
      5: "e"
    },
    title: "Node Creation Order",
    description: "Enter the nodes into the portal in the correct order."
  },
  exercise_two: {
    sequence: [10, 4, 2, 17, 9, 5],
    addresses: {
      10: "z",
      4: "y",
      2: "x",
      17: "w",
      9: "v",
      5: "u"
    },
    title: "Node Creation Order",
    description: "Enter the nodes into the portal in the correct order."
  },
  exercise_tree: {
    sequence: [66, 65, 64, 67, 76, 77, 78],
    addresses: {
      66: "l",
      65: "m",
      64: "n",
      67: "o",
      76: "p",
      77: "q",
      78: "r"
    },
    title: "Node Creation Order",
    description: "Enter the nodes into the portal in the correct order."
  }
};

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
    this.currentExercise = new NodeOrderExercise(template);
    this.submissionData = null;
    this.isWaitingForValidation = false;
    this.currentExercise.key = templateKey;
    return this.currentExercise;
  }

  // Submit answer for validation (store for later)
  submitAnswer(circles) {
    if (!this.currentExercise) {
      throw new Error('No exercise loaded');
    }
    this.submissionData = {
      circles: JSON.parse(JSON.stringify(circles))
    };
    this.isWaitingForValidation = true;
    return true;
  }

  // Validate submission (called after all circles are entered)
  validateSubmission(circles = null, entryOrder = null) {
    if (!this.currentExercise) {
      return {
        isCorrect: false,
        message: 'System not ready',
        details: 'Please try again in a moment.',
        score: 0,
        totalPoints: 100
      };
    }
    // Use provided circles and entryOrder
    return this.currentExercise.validateSubmission(
      circles,
      [],
      entryOrder
    );
  }

  getCurrentExercise() {
    return this.currentExercise;
  }

  isWaiting() {
    return this.isWaitingForValidation;
  }

  reset() {
    this.submissionData = null;
    this.isWaitingForValidation = false;
  }
}
