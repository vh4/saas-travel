import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/pelni/Pembayaran'
import HeaderTemplateMobilDetailBooking from "./HeaderTemplateMobilDetailBooking";


export default function Pembayaran(){
    useEffect(() => {
        document.title = 'Travel - pelni booking';
    }, []);
    
    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobilDetailBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranComponent />
                        </div>
                    </div>
                </HeaderTemplateMobilDetailBooking>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranComponent />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}