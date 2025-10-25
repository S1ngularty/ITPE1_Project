import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../utils/authUtil";

function useHome() {
  const [screws, setScrews] = useState([]);
  const [name, setName] = useState("");
  const [selectedScrew, setSelectedScrew] =useState("")
  const [error, setError] = useState("");

  function search(data) {
    // console.log("from home:", data);
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
        console.log(response.data);
        setName(response.data.result.name.split(" ")[0]);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    fetchUserName();
  }, []);

  return { screws, name, error, search,selectedScrew,setSelectedScrew};
}

export default useHome;
