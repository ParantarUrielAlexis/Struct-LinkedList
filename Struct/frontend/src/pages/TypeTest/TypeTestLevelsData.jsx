export const levels = [
  {
    name: "Level 1: Basics of Arrays",
    words: [
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
    ],
    wordDefinitions: {
      "int arr[10];": "Declares an integer array named arr with a size of 10.",
      "arr[i]": "Accessing an array element using an index variable i.",
      "int nums[3];": "Declares an integer array named nums with a size of 3.",
      "char letters[];":
        "Declares a character array named letters, size determined by initialization.",
      "float prices[5] = {10.0, 5.5};":
        "Declares and partially initializes a float array named prices.",
      "int data[] = {1, 2, 3};":
        "Declares and initializes an integer array named data, size determined by the initializer list.",
      "arr[0]": "Accessing the first element of the array arr.",
      "arr[size - 1]": "Accessing the last element of the array arr.",
      "sizeof(arr)": "Calculates the total size of the array arr in bytes.",
      "sizeof(arr[0])":
        "Calculates the size of a single element in the array arr in bytes.",
      "for (int i = 0; i < size; ++i)":
        "A standard for loop to iterate through an array from index 0 to size-1.",
    },
  },
  {
    name: "Level 2: Multidimensional Arrays",
    words: [
      "int matrix[2][3];",
      "matrix[0][0]",
      "float scores[3][5] = {{...}, {...}};",
      "int threeD[2][2][2];",
      "matrix[i][j]",
      "*(matrix[i] + j)",
    ],
    wordDefinitions: {
      "int matrix[2][3];":
        "Declares a 2x3 integer two-dimensional array named matrix.",
      "matrix[0][0]":
        "Accessing the element at the first row and first column of a 2D array.",
      "float scores[3][5] = {{...}, {...}}:":
        "Declares and initializes a 3x5 float 2D array.",
      "int threeD[2][2][2];":
        "Declares a 2x2x2 integer three-dimensional array.",
      "matrix[i][j]":
        "Accessing an element of a 2D array using row index i and column index j.",
      "*(matrix[i] + j)":
        "Pointer arithmetic to access an element of a 2D array.",
    },
  },
  {
    name: "Level 3: Arrays and Functions",
    words: [
      "void printArray(int arr[], int size);",
      "void processArray(float* data, int size);",
      "void modifyArray(int (&arr)[5]);",
      "returnType func(dataType arrayName[])",
      "functionCall(myArray, arraySize);",
    ],
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
    },
  },
  {
    name: "Level 4: Arrays of Structs",
    words: [
      "struct Person { string name; int age; };",
      "Person people[10];",
      'people[0].name = "Alice";',
      "struct Book { string title; float price; };",
      "Book inventory[5];",
      "inventory[i].price",
    ],
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
    },
  },
  {
    name: "Level 5: C++ Vectors",
    words: [
      "std::vector<int> vec;",
      "std::vector<float> scores = {1.0, 2.5};",
      "vec.push_back(value);",
      "vec.size();",
      "vec.at(i);",
      "vec[i];",
      "vec.empty();",
      "vec.resize(newSize);",
      "std::vector<std::vector<int>> twoDVec;",
    ],
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
    },
  },
  {
    name: "Level 6: Pointers and Dynamic Memory",
    words: [
      "int* ptr;",
      "int* dynamicArray = new int[size];",
      "delete[] dynamicArray;",
      "malloc(size * sizeof(int))",
      "free(ptr);",
      "realloc(ptr, newSize)",
      "calloc(count, elementSize)",
    ],
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
    },
  },
];
