import React from "react";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/authUtil";

const useNavbar = () => {
  let [isLogin, setIsLogin] = useState(false);
  let [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (getToken()) setIsLogin(true);
    return
  }, []);

  return { isLogin, showModal,setShowModal,showModal };
};

export default useNavbar;
