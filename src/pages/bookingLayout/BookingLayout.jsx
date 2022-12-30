//make create function reactjs

import React from "react";
import Header from "../partials/Header";

import _ from 'lodash'

export default function BookingLayout({children}){

    return(
        <div className="block">
            < Header/>
            <div className="mt-40">
                <div className="container mx-auto px-0 xl:px-40">                   
                    <main>{children}</main>
                </div>
            </div>

            {/* <Footer/> */}
        </div>
    )
}