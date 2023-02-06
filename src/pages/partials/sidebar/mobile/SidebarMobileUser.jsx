import React, {useState, useEffect} from 'react'
import {FaUserCircle, FaListAlt, FaInbox} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp} from "react-icons/md"
import axios from 'axios'
import { Button } from 'antd';
import {MdOutlineTrain} from 'react-icons/md' 
import {GiCommercialAirplane} from 'react-icons/gi'
import {IoBoatOutline} from 'react-icons/io5'

export default function SidebarMobileUser({pathSidebar}) {
    
    const [dropdownTransaksi, setDropdownTransaksi] = useState(false);
    const [dropdownBooking, setDropdownBooking] = useState(false);
    const [loading, setIsLoading] = useState(false);

    const user = localStorage.getItem('v_') != 'undefined' && localStorage.getItem('v_') !== null ? JSON.parse(localStorage.getItem('v_')) : null;
    const [usr, setUsr] = useState();

    useEffect(() =>  {
        if(user === null || user === undefined){
            userProfile()
        }
    }, [user]);

    const x = user ? user.namaPemilik.split(' ') : usr ? usr.namaPemilik.split(' ') : null;
    const nd = x ? x[0] ? x[0] : '' : '';
    const nb =  x ? x[1] ? x[1] : '' : ''
    
    const avatar_nd = nd !== '' && nd !== undefined ? nd.substring(0,1).toUpperCase() : 'X';
    const avatar_nb = nb !== '' && nb !== undefined ? nb.substring(0,1).toUpperCase() : 'X';
    const userProfile = async () =>  {
        setIsLoading(true);
        try{
            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            });
            setUsr(response.data.data)
            setIsLoading(false);
            localStorage.setItem('v_', JSON.stringify(response.data.data))
        }catch(e){
            console.log(e);
            setIsLoading(false);
        }
        setIsLoading(false);
    }


    return (
        <aside className="w-full" aria-label="Sidebar">
            <div className="flex justify-center overflow-y-auto dark:bg-gray-800 h-full" >
                <ul className="mt-0 space-y-2 relative">
                    {loading ? (<></>)
                        : (
                            <>
                                {
                                    usr === null || usr === undefined  ? (
                                        <>
                                        <div className='text-xs text-gray-500 font-semibold'>
                                            <div className='mt-2 mb-2'>Anda harus Login terlebih dahulu</div>
                                            <Button type="primary" className='bg-blue-500 text-white mb-4'  block>Login</Button>
                                        </div>
                                        </>
                                    ) : (
                                        <>
                                            <li className='mt-2 mb-2'>
                                                <div className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg `}>
                                                    <div className=' w-full text-xs xl:text-md text-gray-500 font-bold py-6 px-5 xl:py-5 xl:px-5 shadow-sm border rounded-full'><div>{'F'} {'W'}</div></div>
                                                    <span className="text-sm font-bold text-gray-500 flex-1 ml-3 whitespace-nowrap">{'Fathoni'} {'Waseso'}</span>
                                                </div>
                                            </li> 
                                            <Link to='/profile/view'>
                                                <li>
                                                    <div className={`flex cursor-pointer ${ pathSidebar === '/profile/view' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
                                                        <div className='flex'>
                                                        <FaUserCircle className="text-orange-500" size={20} />
                                                        <span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            </Link>
                                            <li>
                                                <div onClick={(e) => dropdownTransaksi === true ? setDropdownTransaksi(false) : setDropdownTransaksi(true)}  className={`flex justify-between cursor-pointer items-center p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
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
                                                        <div className='text-left text-base font-normal'>
                                                            Transaksi Kai
                                                        </div>
                                                    </Link>
                                                    <Link to='/transaksi/pesawat' className={`${ pathSidebar === '/transaksi/pesawat' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500`}>
                                                        <div className='text-left text-base font-normal'>
                                                            Transaksi Pesawat
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                            <li>
                                                <div onClick={(e) => dropdownBooking === true ? setDropdownBooking(false) : setDropdownBooking(true)}  className={`flex justify-between cursor-pointer ${ pathSidebar === 'booking' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
                                                    <div className='flex items-center'>
                                                        <FaListAlt className="text-blue-500" size={18} />
                                                        <span className="flex-1 ml-3 whitespace-nowrap">List Booking</span>
                                                    </div>
                                                    { dropdownBooking ? <MdOutlineKeyboardArrowDown className='text-gray-500' size={18} /> : <MdOutlineKeyboardArrowUp className='text-gray-500' size={18} />}
                                                </div>
                                                <div
                                                className={`${!dropdownBooking ? 'block' : 'hidden'}`}
                        
                                                >
                                                    <Link to='/booking/kai' className='block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500'>
                                                        <div className='text-left text-base font-normal'>
                                                        Booking Kai
                                                        </div>
                                                    </Link>
                                                    <Link to='/booking/pesawat' className='block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-gray-500'>
                                                        <div className='text-left text-base font-normal'>
                                                            Booking Pesawat
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                    <Link to='/kai'>
                        <li className='mt-2 mb-2'>
                            <div className={`flex cursor-pointer ${ pathSidebar === '/kai' ? 'bg-gray-200' : ''} items-center p-1 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
                                <div className='flex'>
                                <MdOutlineTrain className="text-fuchsia-500" size={24} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Kereta</span>
                                </div>
                            </div>
                        </li>
                    </Link>
                    <Link to='/pesawat'>
                        <li className='mt-2 mb-2'>
                            <div className={`flex cursor-pointer ${ pathSidebar === '/pesawat' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
                                <div className='flex'>
                                <GiCommercialAirplane className="text-blue-500" size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Pesawat</span>
                                </div>
                            </div>
                        </li>
                    </Link>
                    <Link to='/pelni'>
                        <li className='mt-2 mb-2'>
                            <div className={`flex cursor-pointer ${ pathSidebar === '/pelni' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
                                <div className='flex'>
                                <IoBoatOutline className="text-red-500" size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Kapal</span>
                                </div>
                            </div>
                        </li>
                    </Link>
                </ul>
            </div>
        </aside>
    )
}