//make create function reactjs

import React, { useState, useContext } from "react";
import Header from "./partials/Header";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { NavContext } from "../App";
import Footer from "./partials/Footer";
import { BsBookmarkCheckFill, BsTicket } from "react-icons/bs";
import { CiBookmarkCheck, CiGrid42, CiSettings } from "react-icons/ci";
import { HiOutlineTicket, HiTicket } from "react-icons/hi2";
import { HiViewGridAdd } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { PiTicketThin } from "react-icons/pi";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState("block");
  const { nav, setNav } = useContext(NavContext);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="">
          <Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
        </div>
        <div>
          <main>{children}</main>
        </div>
        <div className="relative block md:hidden z-10 shadow-xl">
          <Box
            sx={{ width: "100%", position: "fixed", bottom: 0 }}
            elevation={3}
          >
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
              to='/'
              icon={nav.isActive === 0 ?  <HiViewGridAdd className={"bg-blue-500 text-white p-1 rounded-full"} size={26} /> : <CiGrid42 size={26} />}
              />
              <BottomNavigationAction
              component={Link}
              to='/booking'
              icon={nav.isActive === 1 ? <BsBookmarkCheckFill className={"bg-blue-500 text-white p-1 rounded-full"} size={26} /> : <CiBookmarkCheck size={26}/>}
            />
            <BottomNavigationAction
              to='/transaksi'
              component={Link}
              icon={nav.isActive === 2 ? <HiTicket className={"bg-blue-500 text-white p-1 rounded-full"} size={26} /> : <PiTicketThin size={26} />}
            />
             <BottomNavigationAction
              component={Link}
              to='/profile'
              icon={nav.isActive === 3 ?  <IoMdSettings className={"bg-blue-500 text-white p-1 rounded-full"} size={26} /> : <CiSettings size={26} />}
            />
            </BottomNavigation>
          </Box>
          {/* footer */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
