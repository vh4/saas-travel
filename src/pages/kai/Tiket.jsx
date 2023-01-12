import React from "react";
import Layout from "../BookingLayout";
import TiketComponent from '../../components/kai/Tiket'

export default function Tiket(){
    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                < TiketComponent />
            </div>
        </div>
    </Layout>
    )
}