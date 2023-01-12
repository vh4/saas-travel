import React from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/kai/Pembayaran'


export default function Pembayaran(){

    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                <PembayaranComponent />
            </div>
        </div>
    </Layout>
    )
}