import React, {useEffect} from "react";
import Layout from "../BookingLayout";
import KonfirmasiKereta from "../../components/booking/components/KonfirmasiKereta";
import HeaderTemplateMobileKonfirmasi from './HeaderTemplateMobile'


export default function LanjutPembayaran(){
    useEffect(() => {
        document.title = 'Travel - kereta konfirmasi';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobileKonfirmasi >
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <KonfirmasiKereta />
                        </div>
                    </div>
                </HeaderTemplateMobileKonfirmasi>
            </div>
            <div className="hidden xl:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <KonfirmasiKereta />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}