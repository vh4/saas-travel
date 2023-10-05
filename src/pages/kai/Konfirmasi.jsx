import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import KonfirmasiComponent from '../../components/kai/Konfirmasi'

export default function Konfirmasi(){
    useEffect(() => {
        document.title = 'Travel - train confirmation';
    }, []);

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