//make create function reactjs

import React from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Sidebar from "./partials/Sidebar";

export default function Home({children}){
    return(
        <div className="block">
            {/* untuk navbar */}

                < Header />

            {/* untuk sidebar */}
                <Sidebar/>

            {/* untuk main nya */}

            <div className="container mt-24">
                    <main>{children}</main>
            </div>

             {/* untuk footernya */}

                  <Footer />

        </div>
    )
}
