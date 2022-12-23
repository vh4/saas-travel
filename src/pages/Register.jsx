//make create function reactjs

import React from "react";
import { Link } from "react-router-dom";

export default function Register(){
    return(
        <div>
            <div className="title">Register</div>
            <Link  className='link-home text-blue-500 underline' to={'/'}>Home</Link>
        </div>
    )
}
