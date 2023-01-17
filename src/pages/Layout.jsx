//make create function reactjs

import React, {useState, useContext} from "react";
import Header from "./partials/Header";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {ImHome2} from "react-icons/im"
import Box from '@mui/material/Box';
import {HiUser} from "react-icons/hi"
import {IoIosListBox} from "react-icons/io" 
import {BsFillBookmarkStarFill} from "react-icons/bs"
import { Link } from "react-router-dom";
import {NavContext} from '../App';

export default function Layout({children}){

    const [sidebarOpen, setSidebarOpen] = useState("block");
    const {nav, setNav} = useContext(NavContext);

    return(
        <div className="block">
            <div className="">
                < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
            </div>

            <div>
                <main>{children}</main>
            </div>
            <div className="relative block md:hidden z-10 shadow-lg">
            <Box sx={{ width:"100%", position: "fixed", bottom:0 }} elevation={3}>
                <BottomNavigation
                    sx={{display:'flex', justifyContent:'around'}}
                    showLabels
                    value={nav.isActive}
                    onChange={(event, newValue) => {
                        setNav({
                            type: 'NAVIGATION',
                            isActive:newValue
                        });
                    }}
                >
                    
                    <BottomNavigationAction to='/' label="Home" component={Link} icon={<ImHome2 size={20} />} />
                    <BottomNavigationAction to='/booking/pesawat' component={Link} label="Booking" icon={<BsFillBookmarkStarFill size={18} />} />
                    <BottomNavigationAction to='/transaksi/pesawat' component={Link} label="Transaksi" icon={<IoIosListBox size={20} />} />
                    <BottomNavigationAction to='/profile/view' component={Link} label="Akun saya" icon={<HiUser size={22} />} />
                </BottomNavigation>
            </Box>
            </div>
        </div>
    )
}