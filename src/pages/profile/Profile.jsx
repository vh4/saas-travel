//make create function reactjs

import React from "react";
import ViewPofile from "../../components/profile/ViewPofile";
import Layout from "../LayoutUser";


export default function Profile(){
    return(
        <Layout>
            <div className="px-8 md:px-12">

                {/* Profile fitur  */}
                < ViewPofile />
                
            </div>
        </Layout>
    )
}
