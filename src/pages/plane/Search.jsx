import React, { useEffect } from "react";
import SearchComponent from "../../components/plane/Search";
import HeaderTemplateMobileSearch from "./HeaderTemplateMobileSearch";
import BookingLayout from "../BookingLayout";

export default function Search(){
    useEffect(() => {
        document.title = 'Travel - plane searching';
    }, []);

    return(
        // desktop
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
                <BookingLayout>
                    <div className="container">
                        <div className="w-full px-4"> 
                            {/* menu fitur  */}
                            <SearchComponent />
                        </div>
                    </div>
                </BookingLayout>
            </div>
        </>
        
    )
}