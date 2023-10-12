//make create function reactjs

import React, {useEffect} from "react";
import TransaksiKaiComponent from "../../components/transaksi/TransaksiKai";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'

export default function TransaksiKai(){

    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split('  ').join('/');

    useEffect(() =>{

        document.title = 'Travel - list transaksi kereta';

    }, []);

    return(
        <>
        <Layout>
            <div className="mt-4 px-4 md:px-12">
                {/* Profile fitur  */}
                < TransaksiKaiComponent path={path} />
                
            </div>
        </Layout>
        </>
    )
}
