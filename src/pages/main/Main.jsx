//make create function reactjs

import Layout from "../Layout";
import Plane from "../../components/plane/Plane";
import KAI from "../../components/kai/KAI";
import Sidebar from "../partials/sidebar/desktop/Sidebar"
import SideBarMobile from "../partials/sidebar/mobile/SideBarMobile"
import React, {useState} from "react";
import Carousels from '../../components/carousel/Carousel'
import HotelCarousel from "../../components/carousel/HotelCarousel";
import PesawatCarousel from "../../components/carousel/PesawatCarousel";
import Pelni from "../../components/pelni/Pelni";

export default function MainPage(){

    const [nameMenu, setNameMenu] = useState('plane');
    return(
        <Layout>
        {/* carousel fitur  */}
        <div className="w-full">
            <div className="bg-gradient-to-r xl:from-[#337AFF] xl:to-blue-500">
                <div className="py-4 md:py-8 relative z-10">
                    <Carousels />
                </div>
            </div>
            <div className="mt-0 md:mt-4 xl:-mt-8">
                <div className="relative container mx-auto mb-96">
                    <div className="-mt-4 md:mt-0 z-10 bg-white mx-0 lg:mx-12 xl:mx-32 2xl:mx-64 md:border md:rounded-md md:shadow-lg">
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
                            nameMenu == 'pelni' ? (
                                <Pelni />
                            ) :
                            (<></>)
                            }
                         </div>
                    </div>
                    </div>
                    <div className="-mt-4 md:mt-12 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64">
                        <HotelCarousel />
                    </div>
                    <div className="mt-2  md:mt-12 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64">
                        <PesawatCarousel />
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    )
}
