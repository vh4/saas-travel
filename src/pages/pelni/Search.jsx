import React, { useEffect } from "react";
import Layout from "../BookingLayout";
import SearchComponent from "../../components/pelni/Search";

export default function Search(){
    useEffect(() => {
        document.title = 'Travel - pelni searching';
    }, []);

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