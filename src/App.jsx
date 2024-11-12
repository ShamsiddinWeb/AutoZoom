import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Admin/dashboard/dashboard";
import Brands from "./pages/Admin/brands/Brands";
import Cars from "./pages/Admin/cars/Cars";
import Cities from "./pages/Admin/cities/Cities";
import Models from "./pages/Admin/models/Models";
import "./App.scss";
 import Outletpage from "./api/Outletpage";
import Locations from "./pages/Admin/loactions/Locations"
import SettingsPage from "./pages/Admin/SettingsPage/SettingsPage";
 
export default function App() {
  return (
    <div>
      <ToastContainer />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Outletpage/>}>
            <Route element={<Layout />}> 
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<SettingsPage />  } />
              <Route path="/brands" element={<Brands />} />
              <Route path="/models" element={<Models />} />
              <Route path="/locations" element={<Locations/>} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/cars" element={<Cars />} />
            </Route>
          </Route>
        </Routes>
      </main>
    </div>
  );
}
