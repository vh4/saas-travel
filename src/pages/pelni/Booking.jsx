import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingPelniComponent from "../../components/pelni/Booking";
import HeaderTemplateMobileBooking from "./HeaderTemplateMobile";

export default function Booking(){

    useEffect(() => {
        document.title = 'Travel - pelni booking';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobileBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingPelniComponent />
                        </div>
                    </div>
                </HeaderTemplateMobileBooking>
            </div>
            <div className="hidden xl:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingPelniComponent />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}