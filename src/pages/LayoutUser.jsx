//make create function reactjs

import React, { useState, useContext } from "react";
import Header from "./partials/Header";
import Sidebar from "./partials/sidebar/desktop/SidebarUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { ImHome2 } from "react-icons/im";
import Box from "@mui/material/Box";
import { HiUser } from "react-icons/hi";
import { IoIosListBox } from "react-icons/io";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { NavContext } from "../App";

export default function LayoutUser({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState("block");
  const location = useLocation();

  const { nav, setNav } = useContext(NavContext);

  const pathSidebar = location.pathname.toString();

  return (
    <div className="flex flex-col min-h-screen">
      <Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />

      <div className="flex-grow md:flex relative ml-0 md:ml-16 xl:ml-0 2xl:ml-0 mt-4 md:mt-0 md:justify-center">
        <div
          className={`${sidebarOpen} w-full md:w-1/2 xl:w-auto 2xl:w-auto md:block xl:block 2xl:block`}
        >
          <Sidebar pathSidebar={pathSidebar} />
        </div>

        <div
          className={
            sidebarOpen === "block"
              ? `container  px-0 w-full xl:w-1/2`
              : "container px-0 w-full xl:w-1/2"
          }
        >
          <main className="">{children}</main>
        </div>
      </div>
      <div className="relative text-gray-500 block md:hidden z-10 bg-white shadow-lg">
        <Box sx={{ width: "100%", position: "fixed", bottom: 0 }} elevation={3}>
          <BottomNavigation
            sx={{ display: "flex", justifyContent: "around" }}
            showLabels
            value={nav.isActive}
            onChange={(event, newValue) => {
              setNav({
                type: "NAVIGATION",
                isActive: newValue,
              });
            }}
          >
            <BottomNavigationAction
              to="/"
              label="Home"
              component={Link}
              icon={<ImHome2 size={20} />}
            />
            <BottomNavigationAction
              to="/booking/pesawat"
              component={Link}
              label="Booking"
              icon={<BsFillBookmarkStarFill size={18} />}
            />
            <BottomNavigationAction
              to="/transaksi/pesawat"
              component={Link}
              label="Transaksi"
              icon={<IoIosListBox size={20} />}
            />
            <BottomNavigationAction
              to="/profile/view"
              component={Link}
              label="Akun saya"
              icon={<HiUser size={22} />}
            />
          </BottomNavigation>
        </Box>
      </div>

      {/* <Footer/> */}

      <footer className="border-t text-sm text-gray-500 py-6">
        <div className="container mx-auto">
          <p className="text-center">
            © 2015-2023 PT. Bimasakti Multisinergi. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
