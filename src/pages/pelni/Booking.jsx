import React from "react";
import Layout from "../BookingLayout";
import BookingPelniComponent from "../../components/pelni/Booking";

export default function Booking(){
    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                <BookingPelniComponent />
            </div>
        </div>
    </Layout>
    )
}