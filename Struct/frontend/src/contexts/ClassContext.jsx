// src/context/ClassContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";

// Create context
export const ClassContext = createContext();

// Context provider component
export const ClassProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [activeClass, setActiveClass] = useState(null);
  const [teachingClasses, setTeachingClasses] = useState([]);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user classes on initial load if authenticated
  useEffect(() => {
    const fetchUserClasses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          "http://localhost:8000/api/classes/user/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const teaching = data.teaching_classes || [];
          const enrolled = data.enrolled_classes || [];

          setTeachingClasses(teaching);
          setEnrolledClasses(enrolled);

          const allClasses = [...teaching, ...enrolled];

          const storedActiveClass = localStorage.getItem("activeClass");
          const parsedStoredClass = storedActiveClass
            ? JSON.parse(storedActiveClass)
            : null;

          // NEW: If the user is a student and has no enrolled classes -> force no active class
          if (user?.userType === "student" && enrolled.length === 0) {
            clearActiveClass();
            return;
          }

          // 1. No classes at all? Clear activeClass
          if (allClasses.length === 0) {
            clearActiveClass();
            return;
          }

          // 2. If there's a stored active class, check if it still exists
          if (parsedStoredClass) {
            const found = allClasses.find(
              (cls) => cls.id === parsedStoredClass.id
            );

            if (found) {
              setActiveClass(parsedStoredClass);
              return; // Active class is valid, no need to set a new one
            } else {
              clearActiveClass(); // Old class no longer valid
            }
          }

          // 3. No valid active class → Set first available one
          if (user?.userType === "teacher" && teaching.length > 0) {
            setActiveClassAndStore(teaching[0]);
          } else if (enrolled.length > 0) {
            setActiveClassAndStore(enrolled[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserClasses();
  }, [isAuthenticated, user]);

  // Helper function to set active class and store in localStorage
  const setActiveClassAndStore = (classObj) => {
    setActiveClass(classObj);
    localStorage.setItem("activeClass", JSON.stringify(classObj));
  };

  // Join a class with a code
  const joinClass = async (code) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8000/api/classes/join/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the class to enrolled classes if it's not already there
        if (!enrolledClasses.some((c) => c.id === data.class.id)) {
          setEnrolledClasses([...enrolledClasses, data.class]);
        }

        // Set as active class
        setActiveClassAndStore(data.class);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error("Error joining class:", error);
      return {
        success: false,
        message: "An error occurred while joining the class",
      };
    }
  };

  // Create a new class (for teachers)
  const createClass = async (className, description) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:8000/api/classes/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ name: className, description }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newClass = data;
        setTeachingClasses([...teachingClasses, newClass]);
        setActiveClassAndStore(newClass);
        return { success: true, class: newClass };
      } else {
        return {
          success: false,
          message: data.error || "Failed to create class",
        };
      }
    } catch (error) {
      console.error("Error creating class:", error);
      return {
        success: false,
        message: "An error occurred while creating the class",
      };
    }
  };

  const deleteClass = async (classId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8000/api/classes/delete/${classId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove the class from teaching classes
        setTeachingClasses(teachingClasses.filter((c) => c.id !== classId));

        // If active class was deleted, set to another class or clear
        if (activeClass?.id === classId) {
          if (teachingClasses.length > 1) {
            // Find first class that's not the one being deleted
            const newActiveClass = teachingClasses.find(
              (c) => c.id !== classId
            );
            setActiveClassAndStore(newActiveClass);
          } else {
            clearActiveClass();
          }
        }

        return { success: true, message: "Class deleted successfully" };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error || "Failed to delete class",
        };
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      return {
        success: false,
        message: "An error occurred while deleting the class",
      };
    }
  };

  // Leave a class (for students)
  const leaveClass = async (classId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8000/api/classes/leave/${classId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove the class from enrolled classes
        setEnrolledClasses(enrolledClasses.filter((c) => c.id !== classId));

        // If active class was left, set to another class or clear
        if (activeClass?.id === classId) {
          if (enrolledClasses.length > 1) {
            // Find first class that's not the one being left
            const newActiveClass = enrolledClasses.find(
              (c) => c.id !== classId
            );
            setActiveClassAndStore(newActiveClass);
          } else {
            clearActiveClass();
          }
        }

        return { success: true, message: "Successfully left the class" };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error || "Failed to leave class",
        };
      }
    } catch (error) {
      console.error("Error leaving class:", error);
      return {
        success: false,
        message: "An error occurred while leaving the class",
      };
    }
  };

  // Clear active class
  const clearActiveClass = () => {
    setActiveClass(null);
    localStorage.removeItem("activeClass");
  };

  return (
    <ClassContext.Provider
      value={{
        activeClass,
        teachingClasses,
        enrolledClasses,
        loading,
        joinClass,
        createClass,
        deleteClass,
        leaveClass,
        setActiveClass: setActiveClassAndStore,
        clearActiveClass,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

// Custom hook to use the class context
export const useClass = () => useContext(ClassContext);
