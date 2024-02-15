import React from   'react';
import { Link } from "react-router-dom";

export default function HeaderMenu(){
    return(
    <div className="items-center justify-between hidden w-full xl:flex xl:w-auto xl:order-1" id="navbar-sticky">
        <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
        <li className="mt-4">
            <Link className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0" aria-current="page">Home</Link>
        </li>
        <li className="mt-4">
            <Link to='/transaksi' className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Transaksi List</Link>
        </li>
        <li className="mt-4">
            <Link to='/booking' className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Booking List</Link>
        </li>
        <li className="mt-4">
            <Link className="block py-2 pl-3 pr-4 text-black rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  ">Pesan</Link>
        </li>
        </ul>
    </div>
    )
}