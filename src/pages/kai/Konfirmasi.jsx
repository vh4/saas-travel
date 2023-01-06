import React from "react";
import Layout from "../bookingLayout/BookingLayout";
import KonfirmasiComponent from '../../components/kai/Konfirmasi'

export default function Konfirmasi(){
    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                < KonfirmasiComponent />
            </div>
        </div>
    </Layout>
    )
}