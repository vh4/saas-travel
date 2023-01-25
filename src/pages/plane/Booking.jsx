import React from "react";
import Layout from "../BookingLayout";
import BookingPesawatComponent from "../../components/plane/Booking";

export default function Booking(){
    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                <BookingPesawatComponent />
            </div>
        </div>
    </Layout>
    )
}