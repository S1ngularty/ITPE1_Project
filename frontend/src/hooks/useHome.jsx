import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function useHome() {
  const [screws, setScrews] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function fetchScrews() {}

  function fetchUserName() {
    axios
      .get(`${import.meta.env.VITE_APP_API}api/v1/getUser`)
      .then((response) => setName(response.data.name))
      .catch((error) => console.log(error));
  }

  useEffect(()=>{
    fetchUserName()
  },[])

  return { screws, name, error };
}

export default useHome