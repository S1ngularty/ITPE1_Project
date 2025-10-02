import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layouts/Navbar";
import Login from "./pages/auth/login";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
