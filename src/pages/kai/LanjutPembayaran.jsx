import React, {useEffect} from "react";
import Layout from "../BookingLayout";
import HeaderTemplateMobilDetailBooking from "./HeaderTemplateMobile";
import PembayaranKereta from "../../components/booking/components/PembayaranKereta";


export default function LanjutPembayaran(){
    useEffect(() => {
        document.title = 'Travel - kereta payment';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobilDetailBooking >
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranKereta />
                        </div>
                    </div>
                </HeaderTemplateMobilDetailBooking>
            </div>
            <div className="hidden xl:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranKereta />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}