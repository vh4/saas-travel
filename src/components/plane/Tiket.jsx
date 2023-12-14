import React, {useState, useEffect} from "react";
import axios from "axios";
import {useSearchParams } from "react-router-dom";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule, MdOutlineAirlineSeatReclineExtra} from 'react-icons/md'
import { useNavigate } from "react-router-dom";
import {BsFillCheckCircleFill} from "react-icons/bs"
import {AiOutlineDownload} from "react-icons/ai"

export default function Konfirmasi(){

    const navigate = useNavigate();
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    useEffect(() =>{
        if(token === null || token === undefined){
            navigate('/');
        }
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const data = searchParams.get('success') ? JSON.parse(searchParams.get('success')) : [];
    return(
        <>
        {token !== null && token !== undefined ? (
            <>
                        {/* header kai flow */}
                <div className='flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center'>
                        <div className='flex space-x-2 items-center'>
                            <AiOutlineCheckCircle className='text-slate-500' size={20} />
                            <div className='hidden xl:flex text-slate-500'>Detail pesanan</div>
                            <div className='block xl:hidden text-slate-500'>Detail</div>
                        </div>
                        <div>
                            <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                            <div className='hidden xl:flex text-slate-500'>Pembayaran tiket</div>
                            <div className='block xl:hidden text-slate-500'>Payment</div>
                        </div>
                        {/* <div>
                            <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                            <div className='text-slate-500'>E-Tiket</div>
                        </div> */}
                </div>
                <div className="w-full mt-8 xl:px-28 mb-16">
                    <div className="border rounded-md pb-12">
                        <div className="text-center md:py-16 px-4 md:px-12 xl:px-24">
                            <div className="flex justify-center">
                                <div>
                                    <div className="text-center flex justify-center"> <BsFillCheckCircleFill className="text-green-400" size={28} /></div>
                                    <div className="mt-2 text-sm xl:text-xl text-green-400">Pembayaran sukses</div>
                                </div>
                            </div>
                            <div className="mt-8 text-gray-500 flex justify-between">
                                <div>Booking ID</div>
                                <div>{data.booking_id}</div>
                            </div>
                            <div className="mt-2 text-gray-500 flex justify-between">
                                <div>Tipe Pembayaran</div>
                                <div>{data.tipe_pembayaran}</div>
                            </div>
                            <div className="mt-2 text-gray-500 flex justify-between">
                                <div>Nomor HP Booking</div>
                                <div>{data.nomor_hp_booking}</div>
                            </div>
                            <div className="mt-2 text-gray-500 flex justify-between">
                                <div>Transaksi ID</div>
                                <div className="text-[18px]">{data.id_transaksi}</div>
                            </div>
                            <div className="mt-8 text-gray-500 font-bold flex justify-between">
                                <div>Total Dibayar</div>
                                <div>Rp. {data.total_dibayar}</div>
                            </div>
                        </div>
                        <div className="hidden md:flex text-gray-500 font-bold justify-between pr-4">
                                <div className="px-4 md:px-12 xl:px-16">
                                    <div class="flex p-2 mb-4 text-sm text-yellow-700 " role="alert">
                                        <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                        <span class="sr-only">Info</span>
                                        <div>
                                            <span class="font-medium">Penting! </span>Cek dimenu transaksi.
                                        </div>
                                    </div>
                                </div>
                                <a href={data.url_etiket} target="_blank" class="py-2.5 px-5 mr-8 mb-2 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 ">
                                    <div className="flex space-x-2">
                                        <AiOutlineDownload className="text-gray-500" size={20} />
                                        <div className="text-gray-500 font-bold">Download tiket</div>
                                    </div>
                                </a>
                            </div>
                            {/* mobile */}
                            <div className="block mt-4 md:hidden text-gray-500 font-bold justify-between pr-4">
                                <div className="px-4 md:px-12 xl:px-16">
                                    <div class="flex p-2 mb-4 text-sm text-yellow-700 " role="alert">
                                        <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                                        <span class="sr-only">Info</span>
                                        <div>
                                            <span class="font-medium">Penting! </span>Cek dimenu transaksi.
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                <button href={data.url_etiket} target="_blank" class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-800 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 ">
                                    <div className="flex space-x-2">
                                        <AiOutlineDownload className="text-gray-500" size={20} />
                                        <div className="text-gray-500 font-bold">Download tiket</div>
                                    </div>
                                </button>
                                </div>
                            </div>
                    </div>
                </div>
            
            </>
        ) : ''}
        </>
    )
}