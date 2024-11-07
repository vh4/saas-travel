import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingPesawatComponent from "../../components/plane/Booking";
import HeaderTemplateMobileBooking from "./HeaderTemplateMobileBooking";

export default function Booking(){
    useEffect(() => {
        document.title = 'Travel - plane booking';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingPesawatComponent />
                        </div>
                    </div>
                </HeaderTemplateMobileBooking>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingPesawatComponent />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}