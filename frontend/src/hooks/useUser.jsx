import * as userService from "../services/userService";
import { useEffect, useState } from "react";

function useUser() {
  let [user, setUser] = useState({
    email: "",
    name: "",
    role: "",
  });
  let [password, setPassword] = useState({
    new: "",
    confirm: "",
  });
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");

  const loadUser = () => {
    userService
      .fetchUserInfo()
      .then((response) => {
        console.log(response);
        setUser(response.data.result);
        setLoading(false);
      })
      .catch((error) => setError(error.message));
  };

  const changeHandler = (field, e) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
  };

  const submitHandler = () => {
    userService
      .updateData(user)
      .then((response) => loadUser())
      .catch((error) => setError(error.message));
  };

  const passwordHandler = (name, e) => {
    setPassword({
      ...password,
      [name]: e.target.value,
    });
  };

  const passwordSubmit = () => {
    userService
      .updatePassword(password.new, password.confirm)
      .then((response) => loadUser())
      .catch((error) => setError(error.message));
  };

  useEffect(() => loadUser(), []);
  useEffect(() => console.log(password), [password]);

  return {
    user,
    loading,
    error,
    password,
    changeHandler,
    submitHandler,
    passwordHandler,
    passwordSubmit,
  };
}

export default useUser;
