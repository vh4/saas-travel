import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/dlu/Pembayaran'
import HeaderTemplateMobilDetailBooking from "./HeaderTemplateMobilDetailBooking";


export default function Pembayaran(){
    useEffect(() => {
        document.title = 'Travel - pelni booking';
    }, []);
    
    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobilDetailBooking>
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