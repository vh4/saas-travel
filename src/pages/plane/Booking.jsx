import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingPesawatComponent from "../../components/plane/Booking";
import HeaderTemplateMobile from "./HeaderTemplateMobile";

export default function Booking(){
    useEffect(() => {
        document.title = 'Travel - plane booking';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobile type={'booking'}>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <BookingPesawatComponent />
                        </div>
                    </div>
                </HeaderTemplateMobile>
            </div>
            <div className="hidden xl:block">
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