//make create function reactjs

import React from "react";
import ViewPofile from "../../components/profile/ViewPofile";
import Layout from "../LayoutUser";


export default function Profile(){
    return(
        <Layout>
            <div className="w-full h-screen px-4 md:px-12 mb-16">

                {/* Profile fitur  */}
                < ViewPofile />
                
            </div>
        </Layout>
    )
}
