import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingKai from '../../components/kai/Booking'
import HeaderTemplateMobileBooking from "./HeaderTemplateMobileBooking";

export default function Booking(){

    useEffect(() => {
        document.title = 'Travel - train book';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingKai />
                        </div>
                    </div>
                </HeaderTemplateMobileBooking>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingKai />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}