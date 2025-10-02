import React from "react";
import { useState, useEffect } from "react";

const useNavbar = () => {
  let [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(true);
  }, []);
};

export default useNavbar