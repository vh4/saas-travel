//make create function reactjs

import React, {useState} from "react";
import Header from "./partials/Header";
import Sidebar from "./partials/Sidebar";
import SidebarUser from "./partials/SidebarUser";

import { useLocation } from "react-router-dom";
import _ from 'lodash'
import Carousels from '../components/carousel/Carousel'

export default function Layout({children}){

    const [sidebarOpen, setSidebarOpen] = useState("block");
    const location = useLocation();

    const path = _.startCase(location.pathname.toString()).split('  ').join('/');
    const pathSidebar = location.pathname.toString();

    return(
        <div className="block">
            < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
            
          {/* carousel fitur  */}
            <div className="mt-36 px-12 md:px-0">
                <Carousels />
            </div>
            
            <div className="relative px-0 xl:px-24 mt-4 md:mt-0 md:flex">
                <div className={`${sidebarOpen} md:block xl:block 2xl:block`}>
                    <div className="hidden md:block">
                        <Sidebar pathSidebar={pathSidebar}/>
                    </div>
                    <div className="block md:hidden">
                        <SidebarUser pathSidebar={pathSidebar}/>
                    </div>
                </div>

                <div className={ sidebarOpen === 'block' ? `container mt-4 px-0 2xl:px-12` : 'container mt-4 px-0 2xl:px-12'}>                   
                    <main className="">{children}</main>
                </div>
            </div>

            {/* <Footer/> */}
        </div>
    )
}