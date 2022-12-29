//make create function reactjs

import React, {useState} from "react";
import Header from "./partials/Header";
import Sidebar from "./partials/SidebarUser";
import {AiOutlineHome} from 'react-icons/ai'
import { useLocation } from "react-router-dom";
import _ from 'lodash'

export default function LayoutUser({children}){

    const [sidebarOpen, setSidebarOpen] = useState("block");
    const location = useLocation();

    const path = _.startCase(location.pathname.toString()).split('  ').join('/');
    const pathSidebar = location.pathname.toString();

    return(
        <div className="block">
            < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
            
            <div className="relative mt-4 md:mt-0 md:flex">
                <div className={`${sidebarOpen} md:block xl:block 2xl:block`}>
                    <Sidebar pathSidebar={pathSidebar}/>
                </div>

                <div className={ sidebarOpen === 'block' ? `container mt-4 md:mt-32 px-0 xl:px-24` : 'container mt-32 md:mt-4 px-0 xl:px-24'}>
                <div className="profile-header mt-4 mx-8">
                    <div className="flex space-x-2 items-center">
                        < AiOutlineHome size={20} />
                        <p>Home</p>
                        <p> / </p>
                        <p>{path}</p>
                    </div>
                </div>                     
                    <main className="">{children}</main>
                </div>
            </div>

            {/* <Footer/> */}
        </div>
    )
}