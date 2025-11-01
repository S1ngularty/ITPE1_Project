import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/authUtil";

function useHome() {
  const [screws, setScrews] = useState([]);
  const [name, setName] = useState("Guest");
  const [selectedScrew, setSelectedScrew] = useState("");
  const [error, setError] = useState("");

  function search(data) {
    // console.log("from search:", data);
    setScrews(data);
  }

  function cbFilter(data) {
    // console.log("from filter:", data);
    setScrews(data);
  }

  function fetchUserName() {
    axios
      .get(`${import.meta.env.VITE_APP_API}api/v1/getUser`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        const data = response.data.result.name.split(" ")[0] || "Guest";
        setName(data);
      })
      .catch((error) => {
        localStorage.clear()
        console.log(error)});
  }

  useEffect(() => {
    if (getToken()) fetchUserName();
  }, []);

  useEffect(() => {
    // console.log("confirmation",screws);
  }, [screws]);

  return {
    screws,
    name,
    error,
    search,
    selectedScrew,
    setSelectedScrew,
    cbFilter,
  };
}

export default useHome;
