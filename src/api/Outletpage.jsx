
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Outletpage = () => {
  const token = localStorage.getItem("authToken"); 

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default Outletpage;
