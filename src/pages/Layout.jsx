//make create function reactjs

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Home({children}){
    return(
        <div className="block">
            {/* untuk navbar */}

                 < Header />

            {/* untuk sidebar */}


            {/* untuk main nya */}

            <div className="container mt-24">
                    <main>{children}</main>
            </div>

             {/* untuk footernya */}

                  <Footer />

        </div>
    )
}
