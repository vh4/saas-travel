//make create function reactjs

import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
    return(
        <div>
            <div className="title">Home</div>
            <Link  className='link-register text-blue-500 underline' to={'/register'}>Register</Link>
        </div>
    )
}
