import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/sample/")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-gray-100">
      <h1 className="text-4xl font-bold text-black-800 mb-4">React + Django</h1>
      {data ? (
        <p className="text-xl text-green-500">{data.message}</p>
      ) : (
        <p className="text-xl text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Home;
