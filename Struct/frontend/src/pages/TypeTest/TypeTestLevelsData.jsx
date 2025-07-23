// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Base level data with all available words
const baseLevels = [
  {
    name: "Level 1: Basics of Arrays",
    allWords: [
      "int arr[10]",
      "arr[i]",
      "int nums[3]",
      "char letters[];",
      "float prices",
      "int data",
      "arr[0]",
      "arr[size - 1]",
      "sizeof(arr)",
      "sizeof(arr[0])",
      "for (int i = 0; i < size; ++i)",
      "int values[100];", // Additional words for more variety
      "arr[length]",
      "char name[50];",
      "double weights[5];",
      "arr[index]",
      "int numbers[] = {1, 2, 3};",
      "float grades[30];",
    ],
    wordsPerLevel: 8, // How many words to show per level attempt
    wordDefinitions: {
      "int arr[10]": "Declares an integer array named arr with a size of 10.",
      "arr[i]": "Accessing an array element using an index variable i.",
      "int nums[3]": "Declares an integer array named nums with a size of 3.",
      "char letters[];":
        "Declares a character array named letters, size determined by initialization.",
      "float prices": "Declares a float variable or array named prices.",
      "int data": "Declares an integer variable or array named data.",
      "arr[0]": "Accessing the first element of the array arr.",
      "arr[size - 1]": "Accessing the last element of the array arr.",
      "sizeof(arr)": "Calculates the total size of the array arr in bytes.",
      "sizeof(arr[0])":
        "Calculates the size of a single element in the array arr in bytes.",
      "for (int i = 0; i < size; ++i)":
        "A standard for loop to iterate through an array from index 0 to size-1.",
      "int values[100];":
        "Declares an integer array named values with a size of 100.",
      "arr[length]":
        "Accessing an array element using a length variable as index.",
      "char name[50];":
        "Declares a character array named name with a size of 50.",
      "double weights[5];":
        "Declares a double array named weights with a size of 5.",
      "arr[index]": "Accessing an array element using an index variable.",
      "int numbers[] = {1, 2, 3};":
        "Declares and initializes an integer array with values 1, 2, 3.",
      "float grades[30];":
        "Declares a float array named grades with a size of 30.",
    },
  },
  {
    name: "Level 2: Multidimensional Arrays",
    allWords: [
      "int matrix[2][3];",
      "matrix[0][0]",
      "float scores[3][5] = {{...}, {...}};",
      "int threeD[2][2][2];",
      "matrix[i][j]",
      "*(matrix[i] + j)",
      "char grid[10][10];", // Additional words
      "double table[4][6];",
      "int cube[3][3][3];",
      "matrix[row][col]",
      "char board[8][8];",
      "float data[5][10];",
    ],
    wordsPerLevel: 6,
    wordDefinitions: {
      "int matrix[2][3];":
        "Declares a 2x3 integer two-dimensional array named matrix.",
      "matrix[0][0]":
        "Accessing the element at the first row and first column of a 2D array.",
      "float scores[3][5] = {{...}, {...}};":
        "Declares and initializes a 3x5 float 2D array.",
      "int threeD[2][2][2];":
        "Declares a 2x2x2 integer three-dimensional array.",
      "matrix[i][j]":
        "Accessing an element of a 2D array using row index i and column index j.",
      "*(matrix[i] + j)":
        "Pointer arithmetic to access an element of a 2D array.",
      "char grid[10][10];":
        "Declares a 10x10 character two-dimensional array named grid.",
      "double table[4][6];":
        "Declares a 4x6 double two-dimensional array named table.",
      "int cube[3][3][3];":
        "Declares a 3x3x3 integer three-dimensional array named cube.",
      "matrix[row][col]":
        "Accessing an element of a 2D array using row and column variables.",
      "char board[8][8];":
        "Declares an 8x8 character two-dimensional array named board.",
      "float data[5][10];":
        "Declares a 5x10 float two-dimensional array named data.",
    },
  },
  {
    name: "Level 3: Arrays and Functions",
    allWords: [
      "void printArray(int arr[], int size);",
      "void processArray(float* data, int size);",
      "void modifyArray(int (&arr)[5]);",
      "returnType func(dataType arrayName[])",
      "functionCall(myArray, arraySize);",
      "int findMax(int arr[], int n);", // Additional words
      "void sortArray(int* arr, int length);",
      "bool searchArray(char arr[], char target);",
      "void fillArray(double arr[], int size, double value);",
      "int sumArray(int values[], int count);",
    ],
    wordsPerLevel: 6,
    wordDefinitions: {
      "void printArray(int arr[], int size);":
        "Function declaration for a function that takes an integer array and its size.",
      "void processArray(float* data, int size);":
        "Function declaration taking a float pointer and size, often used for arrays.",
      "void modifyArray(int (&arr)[5]);":
        "C++ function declaration taking a reference to a fixed-size integer array of size 5.",
      "returnType func(dataType arrayName[])":
        "General syntax for a function declaration accepting an array.",
      "functionCall(myArray, arraySize);":
        "Calling a function and passing an array and its size as arguments.",
      "int findMax(int arr[], int n);":
        "Function declaration to find the maximum value in an integer array.",
      "void sortArray(int* arr, int length);":
        "Function declaration to sort an integer array.",
      "bool searchArray(char arr[], char target);":
        "Function declaration to search for a character in a character array.",
      "void fillArray(double arr[], int size, double value);":
        "Function declaration to fill a double array with a specific value.",
      "int sumArray(int values[], int count);":
        "Function declaration to calculate the sum of values in an integer array.",
    },
  },
  {
    name: "Level 4: Arrays of Structs",
    allWords: [
      "struct Person { string name; int age; };",
      "Person people[10];",
      'people[0].name = "Alice";',
      "struct Book { string title; float price; };",
      "Book inventory[5];",
      "inventory[i].price",
      "struct Student { int id; float gpa; };", // Additional words
      "Student class[25];",
      "class[0].gpa = 3.8;",
      "struct Car { string model; int year; };",
      "Car garage[3];",
      "garage[i].model",
    ],
    wordsPerLevel: 7,
    wordDefinitions: {
      "struct Person { string name; int age; };":
        "Defines a structure named Person with name and age members.",
      "Person people[10];":
        "Declares an array named people where each element is a Person structure.",
      'people[0].name = "Alice";':
        "Assigns a value to the name member of the first Person in the people array.",
      "struct Book { string title; float price; };":
        "Defines a structure named Book with title and price members.",
      "Book inventory[5];":
        "Declares an array named inventory where each element is a Book structure.",
      "inventory[i].price":
        "Accesses the price member of the Book structure at index i in the inventory array.",
      "struct Student { int id; float gpa; };":
        "Defines a structure named Student with id and gpa members.",
      "Student class[25];":
        "Declares an array named class where each element is a Student structure.",
      "class[0].gpa = 3.8;":
        "Assigns a GPA value to the first Student in the class array.",
      "struct Car { string model; int year; };":
        "Defines a structure named Car with model and year members.",
      "Car garage[3];":
        "Declares an array named garage where each element is a Car structure.",
      "garage[i].model":
        "Accesses the model member of the Car structure at index i in the garage array.",
    },
  },
  {
    name: "Level 5: C++ Vectors",
    allWords: [
      "std::vector<int> vec;",
      "std::vector<float> scores = {1.0, 2.5};",
      "vec.push_back(value);",
      "vec.size();",
      "vec.at(i);",
      "vec[i];",
      "vec.empty();",
      "vec.resize(newSize);",
      "std::vector<std::vector<int>> twoDVec;",
      "vec.pop_back();", // Additional words
      "vec.clear();",
      "vec.front();",
      "vec.back();",
      "std::vector<string> names;",
      "vec.insert(pos, value);",
      "vec.erase(pos);",
    ],
    wordsPerLevel: 9,
    wordDefinitions: {
      "std::vector<int> vec;": "Declares an empty C++ vector of integers.",
      "std::vector<float> scores = {1.0, 2.5};":
        "Declares and initializes a C++ vector of floats.",
      "vec.push_back(value);": "Adds an element to the end of a C++ vector.",
      "vec.size();": "Returns the number of elements in a C++ vector.",
      "vec.at(i);":
        "Accesses the element at index i in a C++ vector with bounds checking.",
      "vec[i];":
        "Accesses the element at index i in a C++ vector (no bounds checking).",
      "vec.empty();": "Checks if a C++ vector is empty.",
      "vec.resize(newSize);": "Resizes a C++ vector.",
      "std::vector<std::vector<int>> twoDVec;":
        "Declares a C++ vector of vectors, often used for dynamic 2D arrays.",
      "vec.pop_back();": "Removes the last element from a C++ vector.",
      "vec.clear();": "Removes all elements from a C++ vector.",
      "vec.front();":
        "Returns a reference to the first element in a C++ vector.",
      "vec.back();": "Returns a reference to the last element in a C++ vector.",
      "std::vector<string> names;": "Declares an empty C++ vector of strings.",
      "vec.insert(pos, value);":
        "Inserts an element at a specified position in a C++ vector.",
      "vec.erase(pos);":
        "Removes an element at a specified position from a C++ vector.",
    },
  },
  {
    name: "Level 6: Pointers and Dynamic Memory",
    allWords: [
      "int* ptr;",
      "int* dynamicArray = new int[size];",
      "delete[] dynamicArray;",
      "malloc(size * sizeof(int))",
      "free(ptr);",
      "realloc(ptr, newSize)",
      "calloc(count, elementSize)",
      "char* str = new char[100];", // Additional words
      "delete[] str;",
      "float* data = (float*)malloc(n * sizeof(float));",
      "ptr = nullptr;",
      "if (ptr != nullptr)",
      "double* values = new double[size]();",
    ],
    wordsPerLevel: 8,
    wordDefinitions: {
      "int* ptr;": "Declares a pointer to an integer.",
      "int* dynamicArray = new int[size];":
        "Dynamically allocates an array of integers in C++.",
      "delete[] dynamicArray;":
        "Deallocates a dynamically allocated array in C++.",
      "malloc(size * sizeof(int))": "Allocates a block of memory in C.",
      "free(ptr);":
        "Deallocates memory previously allocated by malloc, calloc, or realloc in C.",
      "realloc(ptr, newSize)":
        "Resizes a previously allocated block of memory in C.",
      "calloc(count, elementSize)":
        "Allocates memory for an array and initializes elements to zero in C.",
      "char* str = new char[100];":
        "Dynamically allocates a character array of size 100 in C++.",
      "delete[] str;":
        "Deallocates a dynamically allocated character array in C++.",
      "float* data = (float*)malloc(n * sizeof(float));":
        "Allocates memory for a float array using malloc with type casting.",
      "ptr = nullptr;": "Sets a pointer to nullptr in C++.",
      "if (ptr != nullptr)": "Checks if a pointer is not null before using it.",
      "double* values = new double[size]();":
        "Dynamically allocates and zero-initializes a double array in C++.",
    },
  },
];

// Function to generate randomized levels
const generateRandomizedLevels = () => {
  return baseLevels.map((level) => ({
    name: level.name,
    words: shuffleArray(level.allWords).slice(0, level.wordsPerLevel),
    wordDefinitions: level.wordDefinitions,
    // Store original data for potential re-randomization
    _originalData: {
      allWords: level.allWords,
      wordsPerLevel: level.wordsPerLevel,
    },
  }));
};

// Export the randomized levels
export const levels = generateRandomizedLevels();

// Export function to re-randomize levels if needed
export const regenerateLevels = () => {
  return generateRandomizedLevels();
};

// Export function to randomize a specific level
export const randomizeLevel = (levelIndex) => {
  if (levelIndex < 0 || levelIndex >= baseLevels.length) {
    return null;
  }

  const baseLevel = baseLevels[levelIndex];
  return {
    name: baseLevel.name,
    words: shuffleArray(baseLevel.allWords).slice(0, baseLevel.wordsPerLevel),
    wordDefinitions: baseLevel.wordDefinitions,
    _originalData: {
      allWords: baseLevel.allWords,
      wordsPerLevel: baseLevel.wordsPerLevel,
    },
  };
};
