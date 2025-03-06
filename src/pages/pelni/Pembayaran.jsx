import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/pelni/Pembayaran'
import HeaderTemplateMobilDetailBooking from "./HeaderTemplateMobile";

export default function Pembayaran(){
    useEffect(() => {
        document.title = 'Travel - pelni booking';
    }, []);
    
    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobilDetailBooking type={'bayar'}>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranComponent />
                        </div>
                    </div>
                </HeaderTemplateMobilDetailBooking>
            </div>
            <div className="hidden xl:block">
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