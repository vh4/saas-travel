//make create function reactjs

import React, {useEffect} from "react";
import TransaksiKaiComponent from "../../components/transaksi/TransaksiKai";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from 'lodash'
import { useNavigate } from "react-router-dom";

export default function TransaksiKai(){

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
                < TransaksiKaiComponent path={path} />
                
            </div>
        </Layout>
        ) : null }
        </>
    )
}
