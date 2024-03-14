import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingDLUComponent from "../../components/dlu/Booking";
import HeaderTemplateMobileBooking from "./HeaderTemplateMobileBooking";

export default function Booking(){

    useEffect(() => {
        document.title = 'Travel - DLU booking';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingDLUComponent />
                        </div>
                    </div>
                </HeaderTemplateMobileBooking>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingDLUComponent />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}