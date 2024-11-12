import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const logOutFunc = () => {
    alert("You are logged out!");
    setTimeout(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      navigate("/");
    }, 1000);
  };

  return (
    <header>
      <div></div>
      <div className="user" onClick={toggleDropdown}>
        <div className="user_icon">
          <FaRegUser />
        </div>
        <span>{localStorage.getItem("userName")}</span>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={logOutFunc}>LogOut</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
