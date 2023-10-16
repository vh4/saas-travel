import React, {useState, useEffect} from 'react';
import {AiOutlineHome} from 'react-icons/ai';
import {BsArrowRightShort} from "react-icons/bs";
import {MdOutlineTrain} from 'react-icons/md';
import axios from "axios";
import { useNavigate } from "react-router";
import { toRupiah } from '../../helpers/rupiah';
import Page500 from '../components/500';

export default function ViewTransaksi({path}) {

    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [err, setErr] = useState(false);
    const [errPage, setErrPage] = useState(false);
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));

    useEffect(() => {

        if(token === undefined || token === null) {
            setErr(true)
        }

    }, [token]);

    useEffect(() => {
        getTransaksiList();
    },[]);

    const getTransaksiList = async () =>{
        setIsLoading(true);

        try{
            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/transaction_list`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
                product:"KERETA"
            });

            if(response.data.rc !== '00' && response.data.rc !== '33'){
                setErrPage(true);
            }
    
            const datas = response.data;
            setData(datas.data);
            setIsLoading(false);

        }catch(err){
            setIsLoading(false);
            setErrPage(true);
        }
    }

    return (
        <>
            <div className='w-full mt-8'>
                <div className="w-full rounded-md shadow-sm border profile-header">
                    <div className="text-gray-500 p-4 flex space-x-2 items-center">
                        < AiOutlineHome size={20} /> <span>Home</span> <span>/</span> <span>{path}</span>
                    </div>
                </div>   
            </div>

            {err === true ? (<><Page500 /></>) : errPage === true  ? (<><Page500 /></>) : (
                <>
                {isLoading === false ? (
                    <>
                        {data !== null && data !== undefined && data.length !== undefined && data.length !== 0 ? (
                        <>
                            {data.map((e) => (
                                <div className='w-full mt-6'>
                                    <div className="w-full rounded-md shadow-sm border profile-header">
                                        <div className='p-4'>
                                            <div className='flex justify-between items-end'>
                                                <div className='flex space-x-2  items-end'>
                                                    <div className='text-xs text-gray-500'>ID Transaksi</div>
                                                    <div className='text-sm text-blue-500 font-bold'>{e.id_transaksi}</div>
                                                </div>
                                                <div className='text-sm text-slate-500 font-bold '>
                                                    Rp. {toRupiah(e.nominal)}
                                                </div>
                                            </div>
                                            <div className='border-t mt-2'>
                                                <div className='flex space-x-2 mt-4 text-sm font-bold text-gray-500'>
                                                    <MdOutlineTrain className='text-orange-500' size={20} />
                                                    <div className='flex space-x-2 items-center'><div>{e.origin.toLowerCase()}</div><BsArrowRightShort /><div>{e.destination.toLowerCase()}</div></div>
                                                </div>
                                                <div className='pl-1'>
                                                    <div className='mt-4 text-xs  text-gray-500'>
                                                        Date
                                                    </div>
                                                    <div className='mt-1 text-sm font-bold text-gray-500'>
                                                        {e.tanggal_transaksi}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='mt-4 border-t block md:flex md:justify-between  md:items-center'>
                                                <div className='mt-2 flex space-x-2 items-end'>
                                                    <div className='mt-1 text-xs  text-gray-500'>
                                                        Kode Booking
                                                    </div>
                                                    <div className='mt-1 text-sm font-bold text-gray-500'>
                                                        {/* {e.kode_booking} */}  - 
                                                    </div>
                                                </div>
                                                <div className='flex space-x-2  items-center pt-4'>
                                                    <div className='text-xs py-1 px-3 rounded-full bg-green-500 text-white'>Transaksi sukses</div>
                                                    <div className='text-blue-500 font-bold text-xs'>lihat detail</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                                </div>
                            ))}
                        </>) : (
                        <>
                            <div className='flex justify-center items-center'>
                                <div className='text-center'>
                                    <img className='block mx-auto' width={270} src="/emptyy.png" alt="empty.png" />
                                    <div className='text-slate-600 font-bold text-center'>Data Tidak Ditemukan</div>
                                    <div className='mt-2 text-center text-gray-500 text-sm'>
                                        Maaf, History Data Transaksi Tidak ditemukan. Lakukan transaksi terlebih dahulu.
                                    </div>
                                </div>
                            </div>
                        </>)}
                    </>
                )
                :
                (
                    <>
                        <div className='w-full mt-12 flex justify-center items-center'>
                        <div class="text-center">
                            <div role="status">
                                    <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin  fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </>
                )
                }
                </>
            )}
        </>
    );
};