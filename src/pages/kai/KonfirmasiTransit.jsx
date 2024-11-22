import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import KonfirmasiComponentTransit from '../../components/kai/KonfirmasiTransit'
import HeaderTemplateMobileKonfirmasi from './HeaderTemplateMobile'

export default function KonfirmasiTransit(){
    useEffect(() => {
        document.title = 'Travel - train transit confirmation';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileKonfirmasi>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <KonfirmasiComponentTransit />
                        </div>
                    </div>
                </HeaderTemplateMobileKonfirmasi>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <KonfirmasiComponentTransit />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}