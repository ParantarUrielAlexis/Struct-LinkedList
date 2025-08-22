import React, { useState, useEffect, useRef, useMemo } from "react";

import ClassInfo from "../components/ClassManagement/ClassInfo";
import ClassRequiredWrapper from "../components/ClassManagement/ClassRequiredWrapper";

const TeacherDashboard = () => {
  return (
    <ClassRequiredWrapper>
      <div className="w-full px-4 py-8 mt-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Teacher Dashboard
        </h1>

        <ClassInfo />
      </div>
    </ClassRequiredWrapper>
  );
};

export default TeacherDashboard;
