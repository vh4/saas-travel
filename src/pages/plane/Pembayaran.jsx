import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/plane/Pembayaran'
import HeaderTemplateMobile from "./HeaderTemplateMobile";


export default function Pembayaran(){
    useEffect(() => {
        document.title = 'Travel - plane payment';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobile type={'bayar'}>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranComponent />
                        </div>
                    </div>
                </HeaderTemplateMobile>
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