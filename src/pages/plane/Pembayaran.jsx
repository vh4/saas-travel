import React, {useState, useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponent from '../../components/plane/Pembayaran'


export default function Pembayaran(){
    useEffect(() => {
        document.title = 'Travel - plane payment';
    }, []);

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