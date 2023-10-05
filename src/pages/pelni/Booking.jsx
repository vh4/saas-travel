import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import BookingPelniComponent from "../../components/pelni/Booking";

export default function Booking(){

    useEffect(() => {
        document.title = 'Travel - pelni booking';
    }, []);

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