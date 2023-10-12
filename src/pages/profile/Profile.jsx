//make create function reactjs

import React, {useEffect} from "react";
import ViewPofile from "../../components/profile/ViewPofile";
import Layout from "../LayoutUser";

export default function Profile(){


    useEffect(() =>{
        document.title = 'Travel - data pengguna';

    }, []);

    return(
        <>
        <Layout>
            <div className="w-full h-screen px-4 md:px-12 mb-16">

                {/* Profile fitur  */}
                < ViewPofile />
                
            </div>
        </Layout>
        </>
    )
}
