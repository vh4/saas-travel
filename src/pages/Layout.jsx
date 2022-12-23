//make create function reactjs

import React, {useState} from "react";
import Header from "./partials/Header";
// import Footer from "./partials/Footer";
import Sidebar from "./partials/Sidebar";

export default function Home({children}){

    const [sidebarOpen, setSidebarOpen] = useState("block");

    return(
        <div className="block">
             < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />
            <div className="block md:flex">
                <div className={`${sidebarOpen} xl:block`}>
                    <Sidebar/>
                </div>

                <div className="container mt-24">
                    <main>{children}</main>
                </div>
            </div>

            {/* <Footer/> */}
        </div>
    )
}