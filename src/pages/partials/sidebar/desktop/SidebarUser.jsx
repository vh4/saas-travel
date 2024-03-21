import React, {useState, useEffect} from 'react'
import {FaUserCircle, FaListAlt} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp} from "react-icons/md"
import axios from 'axios'
import {IoGridOutline} from 'react-icons/io5'
import { IoTrainOutline, IoAirplaneOutline, IoBoatOutline } from "react-icons/io5";
import { GiBattleship } from "react-icons/gi";


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

    const nd = localStorage.getItem('c_name') ? localStorage.getItem('c_name')[0] ? localStorage.getItem('c_name')[0] : 'Unknown' : 'Unknown';
    const avatar_nd = nd !== '' && nd !== undefined ? nd.substring(0,1).toUpperCase() : 'U';

    const userProfile = async () =>  {
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/account`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        });

        if(response.data && response.data.rc == '00'){

            setUsr(response.data.data)
            localStorage.setItem('v_', JSON.stringify({
                namaPemilik:response.data.data.namaPemilik,
                // balance:response.data.data.balance
            }))

        }

    }

    return (
        <aside className="mt-8 hidden md:block w-full md:w-full xl:w-72 border-r " aria-label="Sidebar">
            <div className='px-8 py-4 flex space-x-4 items-center text-black'>
                <IoGridOutline size={24} className='text-black' />
                <div>List Transaksi</div>
            </div>
            <div className="flex mb-8 justify-start overflow-y-auto py-4 rounded  h-full " >
                <ul className="px-8 md:mt-0 space-y-2 relative">
                    {/* <li className='hidden md:block mb-4'>
                        <div className={`flex items-center p-2 text-base font-normal text-black rounded-lg `}>
                            <div><Avatar size={48} icon={<UserOutlined />} /></div>
                            <span className="text-sm font-bold text-black flex-1 ml-3 whitespace-nowrap">{localStorage.getItem('c_name')
                              ? localStorage.getItem('c_name').charAt(0).toUpperCase() + localStorage.getItem('c_name').slice(1)
                              : 'Rb Travell'}</span>
                        </div>
                    </li>  */}

                    <li className=''>
                        <Link to="/transaksi/pesawat">
                        <div onClick={(e) => dropdownTransaksi === true ? setDropdownTransaksi(false) : setDropdownTransaksi(true)}  className={`${ pathSidebar === '/transaksi/pesawat' ? 'bg-cyan-100' : ''} flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                                <IoAirplaneOutline className="text-back" size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap text-sm">Pesawat</span>
                            </div>
                            {/* { dropdownTransaksi ? <MdOutlineKeyboardArrowDown className='text-black' size={18} /> : <MdOutlineKeyboardArrowUp className='text-black' size={18} />} */}
                        </div>
                        </Link>
                    </li>
                    <li className=''>
                        <Link to="/transaksi/kai">
                        <div onClick={(e) => dropdownTransaksi === true ? setDropdownTransaksi(false) : setDropdownTransaksi(true)}  className={`${ pathSidebar === '/transaksi/kai' ? 'bg-cyan-100' : ''} flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                                <IoTrainOutline className="text-black" size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap text-sm">Kereta</span>
                            </div>
                            {/* { dropdownTransaksi ? <MdOutlineKeyboardArrowDown className='text-black' size={18} /> : <MdOutlineKeyboardArrowUp className='text-black' size={18} />} */}
                        </div>
                        </Link>
                    </li>
                    <li className=''>
                        <Link to="/transaksi/pelni">
                        <div onClick={(e) => dropdownTransaksi === true ? setDropdownTransaksi(false) : setDropdownTransaksi(true)}  className={`${ pathSidebar === '/transaksi/pelni' ? 'bg-cyan-100' : ''} flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                                <IoBoatOutline className="text-black" size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap text-sm">Kapal Pelni</span>
                            </div>
                            {/* { dropdownTransaksi ? <MdOutlineKeyboardArrowDown className='text-black' size={18} /> : <MdOutlineKeyboardArrowUp className='text-black' size={18} />} */}
                        </div>
                        </Link>
                    </li>
                    {/* <li className=''>
                        <Link to="/transaksi/dlu">
                        <div onClick={(e) => dropdownTransaksi === true ? setDropdownTransaksi(false) : setDropdownTransaksi(true)}  className={`${ pathSidebar === '/transaksi/dlu' ? 'bg-cyan-100' : ''} flex justify-between cursor-pointer items-center p-2 text-base font-normal text-black rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                               <GiBattleship className="text-black" size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap text-sm">DLU</span>
                            </div>
                        </div>
                        </Link>
                    </li> */}
                    {/* <div
                    className={`${!dropdownTransaksi ? 'block' : 'hidden'}`}
                    >
                        <Link to='/transaksi/kai' className={`${ pathSidebar === '/transaksi/kai' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                            <div className=''>
                                Kereta
                            </div>
                        </Link>
                        <Link to='/transaksi/pesawat' className={`${ pathSidebar === '/transaksi/pesawat' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                            <div className=' '>
                                Pesawat
                            </div>
                        </Link>
                        <Link to='/transaksi/pelni' className={`${ pathSidebar === '/transaksi/pelni' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                            <div className=' '>
                                Kapal Pelni
                            </div>
                        </Link>
                        <Link to='/transaksi/dlu' className={`${ pathSidebar === '/transaksi/pelni' ? 'bg-cyan-100' : ''} block px-8 cursor-pointer rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                            <div className=' '>
                                Kapal DLU
                            </div>
                        </Link>
                    </div> */}
                    {/* <li className='ml-4'>
                        <div onClick={(e) => dropdownBooking === true ? setDropdownBooking(false) : setDropdownBooking(true)}  className={`flex justify-between cursor-pointer ${ pathSidebar === 'booking' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-black rounded-lg  hover:bg-cyan-100 `}>
                            <div className='flex items-center'>
                                <FaListAlt className="text-blue-500" size={18} />
                                <span className="flex-1 ml-3 whitespace-nowrap">List Booking</span>
                            </div>
                            { dropdownBooking ? <MdOutlineKeyboardArrowDown className='text-black' size={18} /> : <MdOutlineKeyboardArrowUp className='text-black' size={18} />}
                        </div>
                        <div
                        className={`${!dropdownBooking ? 'block' : 'hidden'}`}

                        >
                            <Link to='/booking/kai' className={`${ pathSidebar === '/booking/kai' ? 'bg-cyan-100' : ''} block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                                <div className=''>
                                Booking Kai
                                </div>
                            </Link>
                            <Link to='/booking/pesawat' className={`${ pathSidebar === '/booking/pesawat' ? 'bg-cyan-100' : ''} block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                                <div className=' '>
                                    Booking Pesawat
                                </div>
                            </Link>
                            <Link to='/booking/pelni' className={`${ pathSidebar === '/booking/pelni' ? 'bg-cyan-100' : ''} block px-8 rounded-lg hover:bg-cyan-100 py-2.5 text-black`}>
                                <div className=' '>
                                    Booking Pelni
                                </div>
                            </Link>
                        </div>
                    </li> */}
                </ul>
            </div>
        </aside>
    )
}