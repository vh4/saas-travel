import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingKai from '../../components/kai/Booking'

export default function Booking(){

    useEffect(() => {
        document.title = 'Travel - train book';
    }, []);

    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                <BookingKai />
            </div>
        </div>
    </Layout>
    )
}