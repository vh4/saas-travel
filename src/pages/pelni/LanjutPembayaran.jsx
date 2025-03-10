import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import HeaderTemplateMobile from "./HeaderTemplateMobile";
import PembayaranPelni from "../../components/booking/components/PembayaranPelni";


export default function LanjutPembayaran(){
    useEffect(() => {
        document.title = 'Travel - plane payment';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobile>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranPelni />
                        </div>
                    </div>
                </HeaderTemplateMobile>
            </div>
            <div className="hidden xl:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranPelni />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}