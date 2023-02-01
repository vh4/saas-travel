//make create function reactjs

import React from "react";
import Header from "./partials/Header";

import _ from 'lodash'

export default function BookingLayout({children}){

    return(
        <div className="block">
            < Header/>
            <div className="mt-8">
                <div className="container mx-auto px-0 xl:px-36">                   
                    <main>{children}</main>
                </div>
            </div>

            {/* <Footer/> */}
            <footer class="border-t text-sm text-gray-500 py-6">
        <div class="container mx-auto flex flex-wrap items-center">
            <div class="w-full text-center">
            <p class="text-sm">© 2015-2023 PT. Bimasakti Multisinergi. All Rights Reserved.</p>
            </div>
        </div>
        </footer>
        </div>
    )
}