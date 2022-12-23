//make create function reactjs

import React, {useState} from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Sidebar from "./partials/Sidebar";

export default function Home({children}){

    const [sidebarOpen, setSidebarOpen] = useState("x");

    return(
        <div className="block">
            {/* untuk navbar */}

                < Header toogleSidebar={setSidebarOpen} valueSidebar={sidebarOpen} />

            {/* untuk sidebar */}
                <div className={`${sidebarOpen} xl:block`}>
                    <Sidebar />
                </div>

            {/* untuk main nya */}

            <div className="container mt-24">
                    <main>{children}</main>
            </div>

             {/* untuk footernya */}

                  <Footer />

        </div>
    )
}
