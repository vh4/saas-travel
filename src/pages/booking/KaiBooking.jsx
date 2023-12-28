//make create function reactjs

import React, {useEffect} from "react";
import BookingKaiComponent from "../../components/booking/BookingKai";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'

export default function TransaksiPesawat(){

    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split('  ').join('/');

    useEffect(() =>{
        document.title = 'Travel - list booking kereta';

    }, []);

    return(
        <>
        <Layout>
            <div className="mt-4 px-4 md:px-12">
                {/* Profile fitur  */}
                < BookingKaiComponent path={path} />
            </div>
        </Layout>
        </>
    )
}
