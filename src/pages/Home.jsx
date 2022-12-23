//make create function reactjs

import React from "react";
import Layout from "./Layout";

import Carousel from '../components/Carousel'
import Menu from '../components/Menu'

export default function Home(){
    return(
        <Layout >
            <div className="">
                <div className="grid grid-cols-2 space-x-80">
                    <div className="ml-12 mt-10">

                        {/* carousel fitur  */}
                        <Carousel/>

                        {/* menu fitur  */}

                        <Menu />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
