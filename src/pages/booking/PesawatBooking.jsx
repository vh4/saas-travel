//make create function reactjs

import React, {useEffect} from "react";
import BookingPesawatComponent from "../../components/booking/BookingPesawat";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'
import { useNavigate } from "react-router-dom";

export default function TransaksiPesawat(){

    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split('  ').join('/');
    const navigate = useNavigate();

    useEffect(() =>{
        if(!localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)){
            navigate('/');
        }else{
            return;
        }
    }, [navigate]);

    return(
        <>
        {localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API) ? (
        <Layout>
            <div className="mt-4 px-4 md:px-12">

                {/* Profile fitur  */}
                < BookingPesawatComponent path={path} />
                
            </div>
        </Layout>
        ) : null }
        </>
    )
}
