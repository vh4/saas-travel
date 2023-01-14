//make create function reactjs

import React, {useState} from "react";
import Header from "./partials/Header";
import Sidebar from "./partials/sidebar/desktop/SidebarUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'

export default function LayoutUser({children}){

    const [sidebarOpen, setSidebarOpen] = useState("block");
    const location = useLocation();

    const pathSidebar = location.pathname.toString();

    return(
        <div style={{backgroundColor: '#f7f9ff'}} className="h-auto">
            < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
            
            <div className="relative ml-0 md:ml-16 xl:ml-0 2xl:ml-0 mt-4 md:mt-0 md:flex md:justify-center">
                <div className={`${sidebarOpen} w-full md:w-1/2 xl:w-auto 2xl:w-auto md:block xl:block 2xl:block`}>
                    <Sidebar pathSidebar={pathSidebar}/>
                </div>

                <div className={ sidebarOpen === 'block' ? `container  px-0 w-full xl:w-1/2` : 'container px-0 w-full xl:w-1/2'}>                  
                    <main className="">{children}</main>
                </div>
            </div>

            {/* <Footer/> */}
        </div>
    )
}