//make create function reactjs

import React from "react";
import Layout from "../Layout";

import Carouselmage from '../../components/home/Carouselmage'
import Menu from "../../components/home/Menu";

export default function Home(){
    return(
        <Layout >
            <div className="">
                <div className="grid grid-cols-1 px-0 xl:px-80 space-x-80">
                    <div className="px-4 md:px-12 mt-24">

                        {/* carousel fitur  */}
                        <Carouselmage/>
                        
                        {/* menu fitur  */}

                        <Menu />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
