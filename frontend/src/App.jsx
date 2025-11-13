import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getToken } from "./utils/authUtil";

import Navbar from "./components/user/layouts/Navbar.jsx";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import UploadPage from "./pages/user/UploadPage";
import PrivateRoute from "./PrivateRoute";
import Home from "./pages/user/Home";
import Analyses from "./pages/user/AnalysesPage.jsx";
import Profile from "./pages/user/Profle";
import RecoveryPassword from "./pages/auth/RecoveryPassword.jsx";
import Dashboard from "./pages/user/Dashboard.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import "./index.css";
import UserManagement from "./pages/admin/UserManagement.jsx";
import FeedbackManagement from "./pages/admin/FeedbackManagement.jsx";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route
            path="/home"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <Home></Home>
              </PrivateRoute>
            }></Route>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <Dashboard></Dashboard>
              </PrivateRoute>
            }></Route>
          <Route
            path="/save-analyses"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <Analyses></Analyses>
              </PrivateRoute>
            }></Route>
          <Route
            path="/profile"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <Profile></Profile>
              </PrivateRoute>
            }></Route>
          <Route
            path="/upload-page"
            element={
              <PrivateRoute redirectedTo={"/login"}>
                <UploadPage></UploadPage>
              </PrivateRoute>
            }></Route>
          <Route
            path="/recovery-password"
            element={<RecoveryPassword></RecoveryPassword>}></Route>

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard></AdminDashboard>}></Route>
          <Route
            path="/admin/feedback"
            element={<FeedbackManagement></FeedbackManagement>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
