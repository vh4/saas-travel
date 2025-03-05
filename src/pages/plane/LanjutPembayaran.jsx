import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import HeaderTemplateMobile from "./HeaderTemplateMobile";
import PembayaranPlane from "../../components/booking/components/PembayaranPlane";


export default function LanjutPembayaran(){
    useEffect(() => {
        document.title = 'Travel - plane payment';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobile type={'lanjut_bayar'}>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranPlane />
                        </div>
                    </div>
                </HeaderTemplateMobile>
            </div>
            <div className="hidden xl:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranPlane />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}