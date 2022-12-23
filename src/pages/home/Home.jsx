//make create function reactjs

import React from "react";
import Layout from "../Layout";

import Carousels from '../../components/home/Carousel'
import Menu from "../../components/home/Menu";

export default function Home(){
    return(
        <Layout>
            <div className="">
                <div className="">
                    <div className="ml-12 mt-20">

                        {/* carousel fitur  */}
                        <Carousels props={"desktop"}/>

                        {/* menu fitur  */}
                        <Menu />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
