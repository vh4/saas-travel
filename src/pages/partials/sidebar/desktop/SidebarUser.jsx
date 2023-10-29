import React, {useState, useEffect} from 'react'
import {FaUserCircle, FaListAlt} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp} from "react-icons/md"
import axios from 'axios'

export default function SidebarUser({pathSidebar}) {
    
    const [dropdownTransaksi, setDropdownTransaksi] = useState(false);
    const [dropdownBooking, setDropdownBooking] = useState(false);

    const user = localStorage.getItem('v_') != 'undefined' && localStorage.getItem('v_') !== null ? JSON.parse(localStorage.getItem('v_')) : null;
    const [usr, setUsr] = useState();

    useEffect(() =>  {
        if(user === null || user === undefined){
            userProfile()
        }
    }, [user]);

    const x = user ? user.namaPemilik.split(' ') : usr ? usr.namaPemilik.split(' ') : null;
    const nd = x ? x[0] ? x[0] : 'Unknown' : 'Unknown';
    const nb =  x ? x[1] ? x[1] : 'User' : 'User'
    
    const avatar_nd = nd !== '' && nd !== undefined ? nd.substring(0,1).toUpperCase() : 'U';
    const avatar_nb = nb !== '' && nb !== undefined ? nb.substring(0,1).toUpperCase() : 'S';
    const userProfile = async () =>  {
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        });

        if(response.data && response.data.rc == '00'){

            setUsr(response.data.data)
            localStorage.setItem('v_', JSON.stringify({
                namaPemilik:response.data.data.namaPemilik,
                balance:response.data.data.balance
            }))

        }

    }

    return (
        <aside className="mt-8 hidden md:block w-full md:w-full xl:w-72 border rounded-xl shadow-sm" aria-label="Sidebar">
            <div className="flex mb-8 justify-center overflow-y-auto py-4 px-3 rounded  h-full " >
                <ul className="mt-8 md:mt-0 space-y-2 relative">
                    <li className='hidden md:block mb-4'>
                        <div className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg `}>
                            <div className='hidden xl:block w-full text-xs xl:text-md text-gray-500 font-bold xl:py-6 xl:px-7 shadow-sm border rounded-full'><div>{avatar_nb} {avatar_nd}</div></div>
                            <span className="text-sm font-bold text-gray-500 flex-1 ml-3 whitespace-nowrap">{nb} {nd}</span>
                        </div>
                    </li> 
                    <Link to='/profile/view'>
                    <li className='ml-4'>
                        <div  className={`flex cursor-pointer ${ pathSidebar === '/profile/view' ? 'bg-cyan-100' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg  hover:bg-cyan-100 `}>
                            <FaUserCircle className='text-orange-500' size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
                        </div>
                    </li>
                    </Link>
                    <li className='ml-4'>
                        <div onClick={(e) => dropdownTransaksi === true ? setDropdownTransaksi(false) : setDropdownTransaksi(true)}  className={`flex justify-between cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                                <FaListAlt className="text-cyan-500" size={18} />
                                <span className="flex-1 ml-3 whitespace-nowrap">List Transaksi</span>
                            </div>
                            { dropdownTransaksi ? <MdOutlineKeyboardArrowDown className='text-gray-500' size={18} /> : <MdOutlineKeyboardArrowUp className='text-gray-500' size={18} />}
                        </div>
                        <div
                        className={`${!dropdownTransaksi ? 'block' : 'hidden'}`}
                        >
                            <Link to='/transaksi/kai' className={`${ pathSidebar === '/transaksi/kai' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}>
                                <div className=''>
                                    Transaksi Kai
                                </div>
                            </Link>
                            <Link to='/transaksi/pesawat' className={`${ pathSidebar === '/transaksi/pesawat' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}>
                                <div className=' '>
                                    Transaksi Pesawat
                                </div>
                            </Link>
                        </div>
                    </li>
                    <li className='ml-4'>
                        <div onClick={(e) => dropdownBooking === true ? setDropdownBooking(false) : setDropdownBooking(true)}  className={`flex justify-between cursor-pointer ${ pathSidebar === 'booking' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                                <FaListAlt className="text-blue-500" size={18} />
                                <span className="flex-1 ml-3 whitespace-nowrap">List Booking</span>
                            </div>
                            { dropdownBooking ? <MdOutlineKeyboardArrowDown className='text-gray-500' size={18} /> : <MdOutlineKeyboardArrowUp className='text-gray-500' size={18} />}
                        </div>
                        <div
                        className={`${!dropdownBooking ? 'block' : 'hidden'}`}

                        >
                            <Link to='/booking/kai' className={`${ pathSidebar === '/booking/kai' ? 'bg-cyan-100' : ''} block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}>
                                <div className=''>
                                Booking Kai
                                </div>
                            </Link>
                            <Link to='/booking/pesawat' className={`${ pathSidebar === '/booking/pesawat' ? 'bg-cyan-100' : ''} block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}>
                                <div className=' '>
                                    Booking Pesawat
                                </div>
                            </Link>
                            <Link to='/booking/pelni' className={`${ pathSidebar === '/booking/pelni' ? 'bg-cyan-100' : ''} block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}>
                                <div className=' '>
                                    Booking Pelni
                                </div>
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}