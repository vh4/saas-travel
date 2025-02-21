import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/kai/Pembayaran'
import HeaderTemplateMobilDetailBooking from "./HeaderTemplateMobile";

export default function Pembayaran(){
    useEffect(() => {
        document.title = 'Travel - train payment';
    }, []);
    
    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobilDetailBooking type={'bayar'}>
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