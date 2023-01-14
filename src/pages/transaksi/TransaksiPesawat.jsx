//make create function reactjs

import React from "react";
import TransaksiPesawatComponent from "../../components/transaksi/TransaksiPesawat";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'

export default function TransaksiPesawat(){

    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split('  ').join('/');

    return(
        <Layout>
            <div className="w-full h-screen mt-4 px-4 md:px-12">

                {/* Profile fitur  */}
                < TransaksiPesawatComponent path={path} />
                
            </div>
        </Layout>
    )
}
