import React, {useContext, useEffect, useState} from "react";
import Layout from "../BookingLayout";
import TiketComponent from '../../components/kai/Tiket'
import { TiketContext } from "../../App";
import { useNavigate } from "react-router";

export default function Tiket(){

    const {pay} = useContext(TiketContext);
    const navigate = useNavigate()
    const [isPayed, setIsPayed] = useState(pay.isPayed)

    useEffect(() => {
        document.title = 'Travel - train tiket receipt';
    }, []);

    useEffect(() => {
        if(isPayed !== true){
            navigate('/')
        }
    }, [isPayed]);

    return(
        <Layout>
        <div className="container">
            <div className="w-full px-4"> 
                {/* menu fitur  */}
                < TiketComponent />
            </div>
        </div>
    </Layout>
    )
}