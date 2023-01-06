//make create function reactjs

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ViewTransaksi from "../../components/transaksi/ViewTransaksi";
import Layout from "../LayoutUser";
import { toast } from 'react-toastify';
import axios from "axios";

export default function Transaksi(){

    const navigate = useNavigate();
    const [data, setData] = useState({});

   
    useEffect(() =>{
        if(!localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)){
            navigate('/');
        }else{
            return;
        }
    }, [navigate, toast]);


    useEffect(() => {
        getTransaksiList();
    },[]);

    const getTransaksiList = async (product = '') =>{
        const response = await axios.post('http://localhost:5000/travel/app/transaction_list', {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            product:product
        });

        const datas = response.data;
        setData(datas.data);

    }


    return(
        <Layout>
            <div className="px-8 md:px-12">

                {/* Profile fitur  */}
                < ViewTransaksi dataTransaksi={data} />
                
            </div>
        </Layout>
    )
}
