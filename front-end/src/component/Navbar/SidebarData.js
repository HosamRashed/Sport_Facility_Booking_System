import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as TfiIcons from "react-icons/tfi";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";

export const setSidebarData = [
  {
    title: "Facility",
    path: "/facility",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Students",
    path: "/students",
    icon: <FaIcons.FaCity />,
    cName: "nav-text",
  },
  {
    title: "Bookings",
    path: "/bookings",
    icon: <FaIcons.FaBookmark />,
    cName: "nav-text",
  },
  {
    title: "Activities",
    path: "/activities",
    icon: <IoIcons.IoMdAnalytics />,
    cName: "nav-text",
  },
  {
    title: "Announcements",
    path: "/announcements",
    icon: <MdIcons.MdScreenShare />,
    cName: "nav-text",
  },
];
