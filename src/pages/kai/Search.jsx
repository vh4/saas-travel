import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import SearchComponent from '../../components/kai/Search'
import HeaderTemplateMobileSearch from "./HeaderTemplateMobileSearch";

export default function Search(){
    useEffect(() => {
        document.title = 'Travel - train searching';
    }, []);

    return(
        <>
            <div className="block md:hidden">
                <HeaderTemplateMobileSearch>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <SearchComponent />
                        </div>
                    </div>
                </HeaderTemplateMobileSearch>
            </div>
            <div className="hidden md:block">
                <Layout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <SearchComponent />
                        </div>
                    </div>
                </Layout>
            </div>
        </>
    )
}