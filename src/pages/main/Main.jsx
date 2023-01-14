//make create function reactjs

import Layout from "../Layout";
import Plane from "../../components/plane/Plane";
import KAI from "../../components/kai/KAI";
import Sidebar from "../partials/sidebar/desktop/Sidebar"
import SideBarMobile from "../partials/sidebar/mobile/SideBarMobile"
import React, {useState} from "react";
import Carousels from '../../components/carousel/Carousel'

export default function MainPage(){

    const [nameMenu, setNameMenu] = useState('plane');

    return(
        <Layout>
            {/* carousel fitur  */}
        <div className="w-full">
            <div className="bg-gradient-to-r xl:from-cyan-500 xl:to-blue-500">
                <div className="py-8">
                    <Carousels />
                </div>
            </div>
            <div className="">
                <div className="relative container mx-auto mb-48">
                    <div className="-mt-6 z-10 bg-white mx-0 xl:mx-32 md:border md:rounded-md md:shadow-lg">
                    <div className={`block md:flex xl:flex 2xl:flex justify-center`}>
                        <div className="hidden md:flex justify-center">
                            <Sidebar nameMenu={nameMenu} setNameMenu={setNameMenu}/>
                        </div>
                        <div className="block md:hidden">
                            <SideBarMobile />
                        </div>
                    </div>
                    {/* for desktop */}
                    <div className='hidden md:block mt-2'>                   
                        <div className="w-full"> 
                            {/* menu fitur  */}
                            {nameMenu == 'plane' ? (
                                <Plane />
                            ) : 
                            
                            nameMenu == 'train' ? (
                                <KAI />
                            ) :
                            (<></>)
                            }
                         </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    )
}
