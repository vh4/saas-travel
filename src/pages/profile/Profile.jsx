//make create function reactjs

import React, {useEffect} from "react";
import ViewPofile from "../../components/profile/ViewPofile";
import Layout from "../LayoutUser";
import { useNavigate } from "react-router-dom";

export default function Profile(){

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
            <div className="w-full h-screen px-4 md:px-12 mb-16">

                {/* Profile fitur  */}
                < ViewPofile />
                
            </div>
        </Layout>
        ) : null}
        </>
    )
}
