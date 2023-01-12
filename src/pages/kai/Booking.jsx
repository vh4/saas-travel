import React from "react";
import Layout from "../BookingLayout";
import BookingKai from '../../components/kai/Booking'

export default function Booking(){
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