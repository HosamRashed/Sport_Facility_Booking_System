import React, { useState } from "react";
import Cookies from "universal-cookie";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { setSidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import "./Navbar.css";

function Navbar() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => {
    setSidebar(!sidebar);
  };
  const handleClick = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  };
  
  return (
    <>
      <IconContext.Provider value={{ color: "#4B87A8" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            {" "}
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <Link to="#" className="logout">
            {" "}
            <AiIcons.AiOutlineLogout onClick={handleClick} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <IoIcons.IoMdClose />
              </Link>
            </li>
            {setSidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path} className>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
