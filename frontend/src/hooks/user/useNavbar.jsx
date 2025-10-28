import React from "react";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/authUtil";
import axios from "axios";

const useNavbar = () => {
  let [isLogin, setIsLogin] = useState(false);
  let [showModal, setShowModal] = useState(false);
  let [filterData, setFilterData] = useState({
    category: [],
    material: [],
    driverType: [],
    threadedType: [],
  });

  const getFilterData = async () => {
    await axios
      .get(
        `${import.meta.env.VITE_APP_API}api/v1/screw/filter/options`
      )
      .then((response) => {
        setFilterData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFilterData();
  },[]);  

  useEffect(() => {
    if (getToken()) setIsLogin(true);
    return;
  }, []);

  return { isLogin, showModal, setShowModal, filterData };
};

export default useNavbar;
