//make create function reactjs

import React, {useEffect} from "react";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'
import BookingPelni from "../../components/booking/BookingPelni";

export default function BookingPelniList(){

    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split('  ').join('/');

    useEffect(() =>{
        document.title = 'Travel - list booking kereta';
    }, []);

    return(
        <>
        <Layout>
            <div className="mt-0 mb-24 md:mb-0 md:mt-4 px-4 md:px-12">
                {/* Profile fitur  */}
                < BookingPelni path={path} />
            </div>
        </Layout>
        </>
    )
}
