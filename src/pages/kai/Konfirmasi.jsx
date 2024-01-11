import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import KonfirmasiComponent from '../../components/kai/Konfirmasi'
import HeaderTemplateMobileKonfirmasi from './HeaderTemplateMobileKonfirmasi'

export default function Konfirmasi(){
    useEffect(() => {
        document.title = 'Travel - train confirmation';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileKonfirmasi>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <KonfirmasiComponent />
                        </div>
                    </div>
                </HeaderTemplateMobileKonfirmasi>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <KonfirmasiComponent />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}