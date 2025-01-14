import React from "react";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {MdHorizontalRule} from 'react-icons/md'
import {AiOutlineDownload} from "react-icons/ai"
import { MdVerified } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";

export default function Tiket({data}){

    return(
        <>
        {/* header kai flow */}
        <div className='hidden md:block bg-white border-b rounded-lg p-4 md:p-8 lg:p-6 max-w-4xl mx-auto relative'>
            <div className='flex text-black justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center'>
                <div className='flex space-x-2 items-center'>
                    <IoMdCheckmarkCircle className="text-green-500" size={20} />
                    <div className="hidden xl:flex text-green-500">
                        Detail pesanan
                    </div>
                    {/* <div className='block xl:hidden text-black'>Detail</div> */}
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-black hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <IoMdCheckmarkCircle className="text-green-500" size={20} />
                    <div className="hidden xl:flex text-green-500">
                        Konfirmasi
                    </div>
                    {/* <div className='block xl:hidden text-black'>Payment</div> */}
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-black hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <IoMdCheckmarkCircle className="text-green-500" size={20} />
                    <div className="hidden xl:flex text-green-500">
                        Pembayaran Tiket
                    </div>
                    {/* <div className='block xl:hidden text-black'>Payment</div> */}
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-black hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                <IoMdCheckmarkCircle className="text-green-500" size={20} />
                    <div className="hidden xl:flex text-green-500">
                        E-Tiket
                    </div>
                    <div className='block xl:hidden text-black'>E-tiket</div>
                </div>
            </div>
            <MdVerified size={32} className="text-green-400 absolute right-6 top-4" />
        </div>

        <div className="bg-white text-black border-b rounded-lg p-4 md:p-8 lg:p-12 max-w-4xl mx-auto my-8">
            <header className="flex justify-between items-center border-b pb-4">
                <h1 className="font-medium text-2xl">Invoice</h1>
                <div>
                    <p className="text-sm">Invoice #<span className="font-medium">{data.booking_id}</span></p>
                    <p className="text-sm">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                </div>
            </header>
            
            <div className="mt-8">
                <h2 className="font-medium text-xl mb-8">Payment Details</h2>
                <div className="grid grid-cols-2 gap-y-6 md:gap-y-4 text-sm">
                    <p>Type of Payment:</p>
                    <p className="font-medium">TUNAI</p>
                    <p>Phone Number:</p>
                    <p className="font-medium">{data.nomor_hp_booking}</p>
                    <p>Transaction ID:</p>
                    <p className="font-medium">{data.id_transaksi}</p>
                    <p className="hidden md:block pt-2 border-t border-gray-200 col-span-full"></p> {/* Divider */}
                    <p>Total Paid:</p>
                    <p className="font-medium">{data.total_dibayar}</p>
                </div>
            </div>


            <div className="mt-8 flex justify-end">
                <a href={data.url_etiket} target="_blank" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 hover:text-white focus:text-white">
                    <AiOutlineDownload className="text-lg mr-2" />
                    Download Ticket
                </a>
            </div>
        </div>
        </>
    )
}