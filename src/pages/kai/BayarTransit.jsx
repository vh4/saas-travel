import React, {useEffect} from "react";
import Layout from "../BookingLayout";
import PembayaranComponentTransit from '../../components/kai/PembayaranTransit'
import HeaderTemplateMobilDetailBooking from "./HeaderTemplateMobile";

export default function BayarTransit(){
    useEffect(() => {
        document.title = 'Travel - train payment transit';
    }, []);
    
    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobilDetailBooking>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranComponentTransit />
                        </div>
                    </div>
                </HeaderTemplateMobilDetailBooking>
            </div>
            <div className="hidden xl:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <PembayaranComponentTransit />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}