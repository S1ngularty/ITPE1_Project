import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { getToken } from "./utils/authUtil";

import Navbar from "./components/layouts/Navbar";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import UploadPage from "./pages/UploadPage";
import PrivateRoute from "./PrivateRoute";
import Home from "./pages/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        {getToken() && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/home"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <Home></Home>
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/upload-page"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <UploadPage></UploadPage>
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
