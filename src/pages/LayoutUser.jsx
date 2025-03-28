//make create function reactjs

import React, { useState, useContext } from "react";
import Header from "./partials/Header";
import Sidebar from "./partials/sidebar/desktop/SidebarUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { NavContext } from "../App";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { CiBookmarkCheck, CiGrid42, CiSettings } from "react-icons/ci";
import { HiTicket } from "react-icons/hi2";
import { HiViewGridAdd } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { PiTicketThin } from "react-icons/pi";


export default function LayoutUser({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState("block");
  const location = useLocation();
  const { nav, setNav } = useContext(NavContext);
  const pathSidebar = location.pathname.toString();
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="hidden xl:block">
        <Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-grow xl:flex relative ml-0 mt-4 xl:mt-0 xl:justify-center w-full">
        {token === null || token === undefined ? (
          <></>
        ) : (
          <div className={`${sidebarOpen} w-full xl:w-auto 2xl:w-auto xl:block`}>
            <Sidebar pathSidebar={pathSidebar} />
          </div>
        )}

        <div
          className={
            sidebarOpen === "block"
              ? `w-full xl:w-1/2`
              : "w-full xl:w-1/2"
          }
        >
          <main className="w-full">{children}</main>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="text-black block xl:hidden z-10 bg-white shadow-lg">
        <Box sx={{ width: "100%", position: "fixed", bottom: 0 }} elevation={3}>
          <BottomNavigation
            sx={{ display: "flex", justifyContent: "around" }}
            value={nav.isActive}
            showLabels={false}
            onChange={(event, newValue) => {
              setNav({
                type: "NAVIGATION",
                isActive: newValue,
              });
            }}
          >
            <BottomNavigationAction
              component={Link}
              to="/"
              icon={
                nav.isActive === 0 ? (
                  <HiViewGridAdd className="bg-blue-500 text-white p-1 rounded-full" size={26} />
                ) : (
                  <CiGrid42 size={26} />
                )
              }
            />
            <BottomNavigationAction
              component={Link}
              to="/booking"
              icon={
                nav.isActive === 1 ? (
                  <BsBookmarkCheckFill className="bg-blue-500 text-white p-1 rounded-full" size={26} />
                ) : (
                  <CiBookmarkCheck size={26} />
                )
              }
            />
            <BottomNavigationAction
              component={Link}
              to="/transaksi"
              icon={
                nav.isActive === 2 ? (
                  <HiTicket className="bg-blue-500 text-white p-1 rounded-full" size={26} />
                ) : (
                  <PiTicketThin size={26} />
                )
              }
            />
            <BottomNavigationAction
              component={Link}
              to="/profile"
              icon={
                nav.isActive === 3 ? (
                  <IoMdSettings className="bg-blue-500 text-white p-1 rounded-full" size={26} />
                ) : (
                  <CiSettings size={26} />
                )
              }
            />
          </BottomNavigation>
        </Box>
      </div>
    </div>
  );
}
