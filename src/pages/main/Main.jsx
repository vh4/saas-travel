//make create function reactjs

import Layout from "../Layout";
import Plane from "../../components/plane/Plane";
import KAI from "../../components/kai/KAI";
import Sidebar from "../partials/sidebar/desktop/Sidebar"
import SideBarMobile from "../partials/sidebar/mobile/SideBarMobile"
import React, {useEffect, useState} from "react";
import Carousels from '../../components/carousel/Carousel'
// import PesawatCarousel from "../../components/carousel/PesawatCarousel";
import Pelni from "../../components/pelni/Pelni";
// import Description from "../../components/main/Description";
// import WhyFastravel from "../../components/main/WhyFastravel";
// import { CiLinkedin, CiFacebook, CiTwitter, CiInstagram} from 'react-icons/ci';
export default function MainPage(){

    const [nameMenu, setNameMenu] = useState('plane');
    useEffect(() => {
        document.title = 'Travel kereta, pesawat, dan pelni';
    }, []);
    
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
                <div className="relative container mx-auto mb-24">
                    <div className="-mt-4 md:mt-0 z-10 bg-white mx-0 lg:mx-12 xl:mx-32 2xl:mx-64 md:border md:rounded-md md:shadow-lg">
                    <div className={`block md:flex xl:flex 2xl:flex justify-start`}>
                        <div className="hidden md:flex justify-start px-10">
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
                    {/* <div className="-mt-4 md:mt-12 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64">
                        <HotelCarousel />
                    </div> */}
                    {/* <div className="mt-2  md:mt-12 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64">
                        <PesawatCarousel />
                    </div>
                    <div className="md:mt-24 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64">
                        <Description />
                    </div>
                    <div className="md:mt-24 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64">
                        <WhyFastravel />
                    </div> */}
                    {/* <footer className="mt-24 md:mt-48 border-t hidden md:block">
                        <div className="p-8 md:p-0 mx-0 lg:mx-12 xl:mx-32 2xl:mx-64 bg-white grid grid-cols-1 md:grid-cols-4">
                            <div className="mt-8 md:mt-16 col-span-1">
                            <div className="text-gray-700 font-bold text-lg">DIDUKUNG OLEH</div>
                            <img src={'/logo.png'} width={170}  alt="Company Logo" />
                            <img src={'/speedcash.png'} width={170} alt="Support Logo" />
                        </div>
                        <div className="mt-8 md:mt-16 col-span-1">
                        <div className="text-gray-700 font-bold text-lg">SOSIAL MEDIA</div>
                            <a href="#" target='_blank' className="text-gray-700 hover:text-blue-700 flex space-x-2 items-center mt-2">
                                <CiFacebook size={24} />
                                <div>Facebook</div>
                            </a>
                            <a href="#" target='_blank' className="text-gray-700 hover:text-blue-700 flex space-x-2 items-center mt-2">
                                <CiInstagram size={24} />
                                <div>Instagram</div>
                            </a>
                            <a href="#" target='_blank' className="text-gray-700 hover:text-blue-700 flex space-x-2 items-center mt-2">
                                <CiTwitter size={24} />
                                <div>Twitter</div>
                            </a>
                            <a href="#" target='_blank' className="text-gray-700 hover:text-blue-700 flex space-x-2 items-center mt-2">
                                <CiLinkedin size={24} />
                                <div>Linkedln</div>
                            </a>
                        </div>
                        <div className="mt-8 md:mt-16  col-span-1">
                            <div className="text-gray-700 font-bold text-lg">PRODUK KAMI</div>
                            <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-2 text-gray-700">Tiket Pesawat</div></a>
                            <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-2 text-gray-700">Tiket Kereta Api</div></a>
                            <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-2 text-gray-700">Tiket Kapal</div></a>
                            <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-2 text-gray-700">Tiket Travel</div></a>
                            <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-2 text-gray-700">Penginapan Hotel</div></a>
                        </div>
                        <div className="mt-8 md:mt-16  col-span-1">
                            <div className="text-gray-700 font-bold text-lg">ALAMAT</div>
                            <p className="mt-2 text-gray-700">Jln. Delta Raya Utara Kav, Waru Sidoarjo 61256</p>
                              <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-4 text-gray-700">Tentang Kami</div></a>
                              <a href="#" target='_blank' className="text-gray-700 hover:decoration-gray-700"><div className="mt-2 text-gray-700">Blog</div></a>
                        </div>
                        </div>
                    </footer> */}
                </div>
            </div>
        </div>
        </Layout>
    )
}
