//make create function reactjs

import React from "react";

export default function Footer(){
    return(
        <>
            <div className="btm-nav w-full" style={{ position: "fixed", width: "100%", bottom: 0, height: "80px"}}>
                <footer className="footer footer-center py-10 bg-indigo-400 flex justify-center">
                    <div>
                        <p className="text-white font-semibold">Copyright © 2022 - Made with ♥️ by Developer PT. Bimasakti Multi Sinergi</p>
                    </div>
                </footer>
            </div>
        </>

    )
}