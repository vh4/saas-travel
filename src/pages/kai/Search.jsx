import React from "react";
import Layout from "../BookingLayout";
import SearchComponent from '../../components/kai/Search'

export default function Search(){
    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                <SearchComponent />
            </div>
        </div>
    </Layout>
    )
}