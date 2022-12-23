//make create function reactjs

import React from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";

export default function Home(){
    return(
        <Layout >
            <div className="flex justify-center bg-red-500">
                <div className="title">Home</div>
                <Link className='link-register text-blue-500 underline' to={'/register'}>Register</Link>
            </div>
        </Layout>
    )
}
