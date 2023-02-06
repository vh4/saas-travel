import React, {useState, useEffect} from 'react';
import {AiOutlineHome} from 'react-icons/ai';
import {BsArrowRightShort} from "react-icons/bs";
import {MdOutlineTrain} from 'react-icons/md';
import axios from "axios";
import { Placeholder } from 'rsuite';
import {HiOutlineArrowNarrowRight} from 'react-icons/hi'
import { Button, Modal, message } from 'antd';

export default function ViewBooking({path}) {

    const [data, setData] = useState();
    const [byrdata, setByrData] = useState();
    const [showModal, setShowModal] = React.useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadBayar, setloadBayar] = useState(true);
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    function success(){
        messageApi.open({
          type: 'success',
          content: 'Pembayaran anda berhasil, silahkan check tiket anda di menu transaksi.',
          duration: 7,
        });
      };

      function gagal(rd){
        messageApi.open({
          type: 'error',
          content: 'Failed, ' + rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + ' .!',
          duration: 7,
        });
      };

    useEffect(() => {
        getTransaksiList();
    },[]);

    const getTransaksiList = async () =>{
        setIsLoading(true);
        
        try{
            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/transaction_book_list`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
                product:"KERETA"
            });
    
            const datas = response.data;
            setData(datas.data);
            setIsLoading(false);
        }catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }


    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    function remainingTime(targetDate) {
            
        let currentDate = new Date();
        let timeDifference = new Date(targetDate) - currentDate;
        
        let hours = Math.floor(timeDifference / (1000 * 60 * 60));
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        if(hours === 0){
            return ` ${minutes} menit ${seconds} detik`;

        }else if(hours ===0 && minutes === 0){
            return ` ${seconds} detik`;

        }else{
            return ` ${hours} jam ${minutes} menit ${seconds} detik`;

        }    
    }

    function openModalBayar(e, i){
        let filterDataSearching = data.filter((_, index) => index === i);
        setByrData(filterDataSearching[0]);
        e.preventDefault();        
        handleOpen()
        setShowModal(true);
        setTimeout(() => {
            setloadBayar(false);
        }, 1000)
    }

    const handleBayar = async () => {
        setLoading(true);

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/payment`, 
        {
            productCode : "WKAI",
            bookingCode : byrdata.kode_booking,
            transactionId : byrdata.id_transaksi,
            nominal : byrdata.nominal,
            nominal_admin : byrdata.nominal_admin,
            discount : 0,
            pay_type : "TUNAI",
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API))
        });
        setTimeout(() => {
          setLoading(false);
          setOpen(false);
        }, 1000);

        if(response.data.rc !== "00"){
            gagal(response.data.rd);
            handleClose();
        }else{
            success();
            handleClose();
        }

      };

    return (
        <>
        
        {/* meessage bayar */}
        {contextHolder}

        <Modal  width={1000}
            open={showModal}
            onOk={handleClose}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                Cancel
                </Button>,
                <Button key="submit" type="primary" className='bg-blue-500' loading={loading} onClick={handleBayar}>
                Bayar Langsung
                </Button>,
            ]}
        >
        {loadBayar !== true ? (
            <div className='mt-4 mb-12'>
                <div className='mt-4 mb-4 font-bold text-lg'>
                    <div>Passengers</div>
                </div>
                {byrdata.penumpang.map((e) => (
                    <>
                        <div className=' border rounded-md p-4 grid grid-cols-1 md:grid-cols-5 gap-2 mt-4'>
                            <div className=''>
                                <div className='font-semibold'>Nama</div>
                                <div>
                                {e.nama}
                                </div>
                            </div>
                            <div className=''>
                                <div className='font-semibold'>Nik</div>
                                <div>
                                {e.nomor_identitas !== '' ? e.nomor_identitas : '-' }
                                </div>
                            </div>
                            <div className=''>
                                    <div className='font-semibold'>No. HP</div>
                                    <div>
                                    {e.telepon !== '' ? e.telepon : '-' }
                                </div>
                            </div>
                            <div className=''>
                                    <div className='font-semibold'>No. Kursi</div>
                                    <div>
                                    {e.kursi !== '' ? e.kursi : '-' }
                                </div>
                            </div>
                        </div> 
                    </>
                ))}

                <div className='mt-4 mb-4 font-bold text-lg'>
                    <div>Description</div>
                </div>
                {/* desktop */}
                <div className="p-4 w-full hidden mt-4 xl:gap-4 lg:grid lg:grid-cols-10">
                    <div className="col-span-2">
                        <h1 className="text-sm font-bold">{byrdata.nama_kereta} </h1>
                        <small>{byrdata.class === 'EKS' ? 'Eksekutif' : byrdata.class === 'EKO' ? 'Ekonomi' : 'Bisnis'} {byrdata.kode_kereta.substring(4,5)} - ({byrdata.kode_kereta.split('/')[1]})</small>
                    </div>
                    <div className="col-span-2">
                        <h1 className="text-sm font-bold">{new Date(byrdata.tanggal_keberangkatan.slice(0, 4), parseInt(byrdata.tanggal_keberangkatan.slice(4, 6)) - 1, byrdata.tanggal_keberangkatan.slice(6, 8)).toLocaleDateString("id-ID", {weekday: "long", year: "numeric", month: "long", day: "numeric"})} </h1>
                        <small>Tanggal Keberangkatan</small>
                    </div>
                    <div className="flex col-span-2">
                        <div className="">
                            <h1 className="mt-4 xl:mt-0 text-sm font-bold">{byrdata.jam_keberangkatan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</h1>
                            <small>{byrdata.origin}</small>
                        </div>
                        < HiOutlineArrowNarrowRight size={24} />
                    </div>
                    <div className='col-span-2'>
                        <h1 className="text-sm font-bold">{byrdata.jam_kedatangan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</h1>
                        <small>{byrdata.destination}</small>
                    </div>
                    <div className="col-span-2">
                            <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">Rp. {toRupiah(parseInt(byrdata.nominal) + parseInt(byrdata.nominal_admin))}</h1>
                            <small>Total (Admin Rp. {toRupiah(byrdata.nominal_admin)})</small>
                    </div>
                </div>
                {/* mobile */}
                <div className="p-4 w-full block mt-4 lg:hidden">
                    <div className="">
                        <h1 className="text-sm font-bold">{byrdata.nama_kereta} </h1>
                        <small>{byrdata.class === 'EKS' ? 'Eksekutif' : byrdata.class === 'EKO' ? 'Ekonomi' : 'Bisnis'} {byrdata.kode_kereta.substring(4,5)} - ({byrdata.kode_kereta.split('/')[1]})</small>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-sm font-bold">{new Date(byrdata.tanggal_keberangkatan.slice(0, 4), parseInt(byrdata.tanggal_keberangkatan.slice(4, 6)) - 1, byrdata.tanggal_keberangkatan.slice(6, 8)).toLocaleDateString("id-ID", {weekday: "long", year: "numeric", month: "long", day: "numeric"})} </h1>
                        <small>Tanggal Keberangkatan</small>
                    </div>
                    <div className='flex space-x-4 items-center'>
                        <div className="">
                            <div className="">
                                <h1 className="mt-4 xl:mt-0 text-sm font-bold">{byrdata.jam_keberangkatan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</h1>
                                <small>{byrdata.origin}</small>
                            </div>
                        </div>
                        < HiOutlineArrowNarrowRight size={24} />
                        <div className=''>
                            <div>
                                <h1 className="mt-4  text-sm font-bold">{byrdata.jam_kedatangan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</h1>
                                <small>{byrdata.destination}</small>
                            </div>
                        </div>
                    </div>
                    <div className="">
                            <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">Rp. {toRupiah(parseInt(byrdata.nominal) + parseInt(byrdata.nominal_admin))}</h1>
                            <small>Total (Admin Rp. {toRupiah(byrdata.nominal_admin)})</small>
                    </div>
                </div>
            </div>
        ) : 

        (
            <>
                <div className='mt-2'>
                    <Placeholder.Paragraph />
                </div>
            </>
        )

        }
        </Modal>
        <div className=''>
            <div className='w-full mt-8'>
                <div className="w-full rounded-md shadow-sm border profile-header">
                    <div className="text-gray-500 p-4 flex space-x-2 items-center">
                        < AiOutlineHome size={20} /> <span>Home</span> <span>/</span> <span>{path}</span>
                    </div>
                </div>   
            </div>
            {isLoading === false ? (
                <>
                    {data !== null && data !== undefined && data.length !== undefined ? (
                    <div className='mt-6'>
                        {data.map((e, i) => (
                            <div className='w-full mb-6'>
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
                                                <MdOutlineTrain className='text-blue-500' size={16} />
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
                                        <div className='mt-4 border-t block lg:flex lg:justify-between  lg:items-center'>
                                            <div className='mt-2 flex space-x-2 items-end'>
                                                <div className='mt-1 text-xs  text-gray-500'>
                                                    Kode Booking
                                                </div>
                                                <div className='mt-1 text-sm font-bold text-gray-500'>
                                                    {e.kode_booking}
                                                </div>
                                            </div>
                                            <div className='flex space-x-2  items-center pt-4'>
                                                <div className='text-xs py-1 px-3 rounded-full bg-blue-500 text-white'>sisa waktu 
                                    
                                                 {remainingTime(e.expiredDate)}</div>
                                                <div onClick={(e) => openModalBayar(e, i)} className='cursor-pointer text-blue-500 font-bold text-xs'>lanjut bayar</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        ))}
                   </div>) : (
                    <>
                        <div className='flex justify-center items-center'>
                            <div className='text-center'>
                                <img className='block mx-auto' width={270} src="/emptyy.png" alt="empty.png" />
                                <div className='text-slate-600 font-bold text-center'>Data Tidak Ditemukan</div>
                                <div className='mt-2 text-center text-gray-500 text-sm'>
                                    Maaf, History Data Booking Tidak ditemukan. Lakukan Booking terlebih dahulu.
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
                                <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>
        </>
    );
};