import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import SearchComponent from "../../components/dlu/Search";
import HeaderTemplateMobileSearch from "./HeaderTemplateMobileSearch";

export default function Search(){
    useEffect(() => {
        document.title = 'Travel - DLU ship searching';
    }, []);

    return(
        <>
            <div className="block xl:hidden">
                <HeaderTemplateMobileSearch>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <SearchComponent />
                        </div>
                    </div>
                </HeaderTemplateMobileSearch>
            </div>
            <div className="hidden xl:block">
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