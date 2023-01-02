//make create function reactjs

import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useState } from 'react'
import {BsBoxArrowRight} from 'react-icons/bs'
import Login from "../../components/login/Login";
import HeaderMenu from "../../components/header/HeaderMenu";
import {CiSettings} from 'react-icons/ci'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'

export default function Header({toogleSidebar, valueSidebar}){

    const [showModal, setShowModal] = React.useState(false);

    const secret_login_key = 'djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53'

    const navigate = useNavigate();
    const LogoutHandler = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/travel/app/sign_out', {
            token: JSON.parse(localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53")),
        }).then(() => {
            localStorage.removeItem('userDetails');
            localStorage.removeItem(secret_login_key);
            toast.success('Anda berhasil logout!');
            navigate('/')
        });
    }

    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.post('http://localhost:5000/travel/app/account', {
            token: JSON.parse(localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53")),
        }).then((res) => {
            setUser(res.data.data);
        });
    });
    console.log(user);
    
    const userData = async (items) => {
        console.log(items)
        return axios
            .post("http://localhost:5000/travel/app/account", {
                token : items.token,
            })
            .then((data) => {
                console.log(data.data);
            }); 
    }

    const toggleFuction = useCallback( () => {
                toogleSidebar(valueSidebar === "block" ? "hidden" : "block")
          }, [toogleSidebar, valueSidebar]);

    return(
        <nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link to={'/'} className="flex items-center">
            <img src="/logo.png" className="w-40 md:w-42 mr-3" alt="Fastravel Logo" />

        </Link>
        <div className="flex xl:order-2">
        <>

        {/* Untuk Belum login */}
        {!localStorage.getItem('djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53') ? (
        <button onClick={() => setShowModal(true)} type="button" className="text-gray-900 mt-2 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 md:px-6 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 mr-2 mb-2">
            <BsBoxArrowRight size={16} fontSize={"bold"} />
            <div  className="ml-2">Login</div>
        </button>
        ) :

        (        
            <div className="hidden relative group space-x-2 text-gray-900  md:cursor-pointer font-medium rounded-lg text-sm px-5 md:px-6 py-2.5 md:inline-flex group-hover:block items-end ml-2 mb-2">
                <p className="block">{user.namaPemilik}</p>
                < CiSettings size={20} />
            <small className="absolute group-hover top-8 left-4 text-slate-500">Sisa saldo Rp {user.balance}</small>
            <ul class="transition-opacity duration-500 invisible group-hover:visible absolute top-0 mt-8 ml-16 w-48 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <Link to="/profile/view"><li class="hover:bg-gray-200 py-2 px-4 w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">Akun saya</li></Link>
                <li class="hover:bg-gray-200 py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">Lupa password pin</li>
                <li onClick={LogoutHandler} class="hover:bg-gray-200 py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">Logout</li>
            </ul>
            </div>
        )
    
    }

        {/* end Untuk  login */}

      {showModal ? (
             < Login setShowModalComponent = {setShowModal} />
            ) : null}
            </>
            <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center py-2 px-4 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <button onClick={toggleFuction}>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>                </button>
            </button>
        </div>
        < HeaderMenu />
        </div>
        </nav>
    )
}
