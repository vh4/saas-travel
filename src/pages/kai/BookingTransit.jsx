import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import HeaderTemplateMobileBooking from "./HeaderTemplateMobile";
import BookingKaiTransit from "../../components/kai/BookingKaiTransit";

export default function BookingTransit(){

    useEffect(() => {
        document.title = 'Travel - train book transit';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingKaiTransit />
                        </div>
                    </div>
                </HeaderTemplateMobileBooking>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingKaiTransit />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}