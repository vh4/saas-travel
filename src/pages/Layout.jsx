//make create function reactjs

import React, {useState} from "react";
import Header from "./partials/Header";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {ImHome2} from "react-icons/im"
import Box from '@mui/material/Box';
import {HiUser} from "react-icons/hi"
import {IoIosListBox} from "react-icons/io" 
import {BsFillBookmarkStarFill} from "react-icons/bs"

export default function Layout({children}){

    const [sidebarOpen, setSidebarOpen] = useState("block");
    const [value, setValue] = React.useState(0);

    return(
        <div className="block">
            <div className="">
                < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
            </div>

            <div>
                <main>{children}</main>
            </div>
            <div className="block md:hidden z-auto shadow-lg">
            <Box sx={{ width:"100%", position: "absolute", bottom:0 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                    setValue(newValue);
                    }}
                >
                    <BottomNavigationAction label="Home" icon={<ImHome2 size={28} />} />
                    <BottomNavigationAction label="Disimpan" icon={<BsFillBookmarkStarFill size={25} />} />
                    <BottomNavigationAction label="Pesanan" icon={<IoIosListBox size={27} />} />
                    <BottomNavigationAction label="Akun saya" icon={<HiUser size={28} />} />
                </BottomNavigation>
            </Box>
            </div>
        </div>
    )
}