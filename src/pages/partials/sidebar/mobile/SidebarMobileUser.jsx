import React, {useState} from 'react'
import {FaUserCircle, FaListAlt, FaInbox} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp} from "react-icons/md"

export default function SidebarMobileUser({pathSidebar}) {
    
    const [dropdownTransaksi, setDropdownTransaksi] = useState(false);
    const [dropdownBooking, setDropdownBooking] = useState(false);

    return (
        <aside className="w-full" aria-label="Sidebar">
            <div className="flex justify-center overflow-y-auto dark:bg-gray-800 h-full" >
                <ul className="mt-0 space-y-2 relative">
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
                    <Link to='/pesan'>
                        <li>
                            <div className={`mt-2 flex cursor-pointer ${ pathSidebar === '/pesan/view' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-500 rounded-lg dark:text-white hover:bg-cyan-100 dark:hover:bg-gray-700`}>
                                <div className='flex'>
                                   <FaInbox className="text-green-500" size={20} />
                                   <span className="flex-1 ml-3 whitespace-nowrap">Pesan</span>
                                </div>
                            </div>
                        </li>
                    </Link>
                </ul>
            </div>
        </aside>
    )
}