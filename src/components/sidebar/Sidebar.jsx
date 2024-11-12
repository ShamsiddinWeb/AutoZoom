import React from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../assets/icons/autozoom.svg";
import { BsShopWindow } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi";
import { GrMapLocation } from "react-icons/gr";
import { BiSolidCity } from "react-icons/bi";
import { IoCarSportOutline, IoSettingsOutline } from "react-icons/io5";
import "./sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/dashboard">
          <img src={Logo} alt="Avtozoom logo" />
        </Link>
      
      </div>
      <nav className="menu">
        <NavLink to="/settings" className="menu-item">
          <IoSettingsOutline />
          <span>Settings</span>
        </NavLink>
        <NavLink to="/brands" className="menu-item">
          <BsShopWindow />
          <span>Brands</span>
        </NavLink>
        <NavLink to="/models" className="menu-item">
          <HiOutlineNewspaper />
          <span>Models</span>
        </NavLink>
        <NavLink to="/locations" className="menu-item">
          <GrMapLocation />
          <span>Locations</span>
        </NavLink>
        <NavLink to="/cities" className="menu-item">
          <BiSolidCity />
          <span>Cities</span>
        </NavLink>
        <NavLink to="/cars" className="menu-item">
          <IoCarSportOutline />
          <span>Cars</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
