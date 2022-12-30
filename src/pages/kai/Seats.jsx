import React from "react";
import Layout from "../bookingLayout/BookingLayout";
import SeatsComponent from '../../components/kai/Seats'

export default function Seats(){
    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                < SeatsComponent />
            </div>
        </div>
    </Layout>
    )
}