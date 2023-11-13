import React, { useState, useEffect } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { BsArrowRightShort } from 'react-icons/bs';
import axios from 'axios';
import {  Modal, message } from 'antd';
import { toRupiah } from '../../helpers/rupiah';
import { remainingTime } from '../../helpers/date';
import Page500 from '../components/500';
import { IoBoatSharp } from "react-icons/io5";
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { Placeholder } from "rsuite";

export default function ViewBooking({ path }) {
  const [data, setData] = useState([]);
  const [byrdata, setByrData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadBayar, setLoadBayar] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);

  useEffect(() => {

    if(token == null || token == undefined) {
        setErr(true);
    }

  }, [token]);

  function success() {
    messageApi.open({
      type: 'success',
      content: 'Pembayaran anda berhasil, silahkan check tiket anda di menu transaksi.',
      duration: 7,
    });
  }

  function gagal(rd) {
    messageApi.open({
      type: 'error',
      content: `Failed, ${rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase()}`,
      duration: 7,
    });
  }

  useEffect(() => {
    getTransaksiList();
  }, []);

  const getTransaksiList = async () => {
    setIsLoading(true);

    try {
     
      const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/app/transaction_book_list`, {
        token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        product: "KAPAL",
      });

      if(response.data.rc !== '00' && response.data.rc !== '33'){
        setErrPage(true);
      }

      const datas = response.data;

      setData(datas.data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setErrPage(true);
    }
  };

  function openModalBayar(e, i) {
    let filterDataSearching = data.filter((_, index) => index === i);
    setByrData(filterDataSearching[0]);
    e.preventDefault();
    setShowModal(true);
    setTimeout(() => {
      setLoadBayar(false);
    }, 1000);
  }

  const handleBayar = async () => {
    setLoading(true);

  };

  const intervalRef = React.useRef(null);

  const [remainingTimes, setRemainingTimes] = useState([]);

  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      const y = [];
  
      data.forEach((x, i) => {
        const res = x?.expiredDate;
        y.push(res);
      });
  
      setRemainingTimes(y);
    }
  }, [data]);
  
  // Cleanup interval when component unmounts
  useEffect(() => {
    if (data !== undefined  && data.length > 0) {
      intervalRef.current = setInterval(() => {
        const updatedRemainingTimes = remainingTimes.map((time) => {
          time = new Date(time).getTime();
          const timenow = new Date().getTime();

          if (time > timenow) {
            time = time - 1;
            return time;
          }
          return 0;
        });
  
        setRemainingTimes(updatedRemainingTimes);
      }, 1000);
    }else{
      setRemainingTimes([]);
    }
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, remainingTimes]);

  return (
    <>

      {contextHolder}
      <div className=''>
  
     {/* meessage bayar */}
     <Modal
        width={1000}
        open={showModal}
        onOk={handleClose}
        onCancel={handleClose}
        footer={[
          // <Button key="back" onClick={handleClose}>
          //   Cancel
          // </Button>,
          // <Button key="submit" type="primary" className='bg-blue-500' loading={loading} disabled>
          //   Bayar Langsung
          // </Button>,
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
                </div>
              </>
            ))}

            <div className='mt-4 mb-4 font-bold text-lg'>
              <div>Description</div>
            </div>
            {/* desktop */}
            <div className="p-4 w-full hidden mt-4 xl:gap-4 lg:grid lg:grid-cols-12">
              <div className="col-span-2">
                <h1 className="text-sm font-bold">{byrdata.nama_kapal} </h1>
                <small>Subclass {byrdata.subClass}</small>
              </div>
              <div className="col-span-2">
                <h1 className="text-sm font-bold">{new Date(byrdata.tanggal_keberangkatan.slice(0, 4), parseInt(byrdata.tanggal_keberangkatan.slice(4, 6)) - 1, byrdata.tanggal_keberangkatan.slice(6, 8)).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} </h1>
                <small>Tanggal Keberangkatan</small>
              </div>
              <div className="flex col-span-2">
                <div className="">
                  <h1 className="mt-4 xl:mt-0 text-sm font-bold">{byrdata.jam_keberangkatan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</h1>
                  <small>{byrdata.origin}</small>
                </div>
                < HiOutlineArrowNarrowRight size={24} />
              </div>
              <div className="col-span-2">
                <h1 className="text-sm font-bold">{new Date(byrdata.tanggal_kedatangan.slice(0, 4), parseInt(byrdata.tanggal_kedatangan.slice(4, 6)) - 1, byrdata.tanggal_kedatangan.slice(6, 8)).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} </h1>
                <small>Tanggal Kedatangan</small>
              </div>
              <div className='col-span-2'>
                <h1 className="text-sm font-bold">{byrdata.jam_kedatangan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}</h1>
                <small>{byrdata.destination}</small>
              </div>
              <div className="col-span-2">
                <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">Rp. {((parseInt(byrdata.nominal) || 0) + (parseInt(byrdata.nominal_admin) || 0)).toLocaleString('id-ID')}</h1>
                <small>Total (Admin Rp. {(toRupiah(byrdata.nominal_admin ? byrdata.nominal_admin : 0)) ?? 0})</small>
              </div>
            </div>
            {/* mobile */}
            <div className="p-4 w-full block mt-4 lg:hidden">
              <div className="">
                <h1 className="text-sm font-bold">{byrdata.nama_kapal}  </h1>
                <small>Subclass {byrdata.subClass}</small>
              </div>
              <div className="mt-4">
                <h1 className="text-sm font-bold">{new Date(byrdata.tanggal_keberangkatan.slice(0, 4), parseInt(byrdata.tanggal_keberangkatan.slice(4, 6)) - 1, byrdata.tanggal_keberangkatan.slice(6, 8)).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} </h1>
                <small>Tanggal Keberangkatan</small>
              </div>
              <div className="mt-4">
                <h1 className="text-sm font-bold">{new Date(byrdata.tanggal_kedatangan.slice(0, 4), parseInt(byrdata.tanggal_kedatangan.slice(4, 6)) - 1, byrdata.tanggal_kedatangan.slice(6, 8)).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} </h1>
                <small>Tanggal Kedatangan</small>
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
              <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">Rp. {((parseInt(byrdata.nominal) || 0) + (parseInt(byrdata.nominal_admin) || 0)).toLocaleString('id-ID')}</h1>
                <small>Total (Admin Rp. {(toRupiah(byrdata.nominal_admin ? byrdata.nominal_admin : 0)) ?? 0})</small>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='mt-2'>
              <Placeholder.Paragraph />
            </div>
          </>
        )}
      </Modal>
      <div className='w-full mt-2 md:mt-8'>
        <div className="w-full rounded-md shadow-sm border profile-header">
          <div className="text-gray-500 p-4 flex space-x-2 items-center">
            < AiOutlineHome size={20} /> <span>Home</span> <span>/</span> <span>{path}</span>
          </div>
        </div>
      </div>
      {err === true ? (
      <>
          <Page500 />
      </>
      ) : errPage === true ? (
        <>
          <Page500 />
        </>
      ) : (
      <>
          {isLoading === false ? (
            <>
              {data !== null && data !== undefined && data.length !== undefined && data.length !== 0 ? (
                <div className='mt-6'>
                  {data.map((e, i) => (
                    <div className='w-full mb-6'>
                      <div className="w-full rounded-lg shadow-sm border profile-header">
                        <div className='p-8'>
                          <div className='flex justify-between items-end'>
                            <div className='flex space-x-2  items-end'>
                              <div className='text-xs text-gray-500'>ID Transaksi</div>
                              <div className='text-sm text-blue-500 font-bold'>{e.id_transaksi}</div>
                            </div>
                            <div className='text-sm text-slate-500 font-bold '>
                              Rp. {e.nominal ? toRupiah(e.nominal) : '-' }
                            </div>
                          </div>
                          <div className='border-t mt-8'>
                            <div className='flex space-x-2 mt-6 text-sm font-bold text-gray-500'>
                              <IoBoatSharp className='text-blue-500' size={16} />
                              <div className='flex space-x-2 items-center'><div>{e.origin.toUpperCase()}</div><BsArrowRightShort /><div>{e.destination.toUpperCase()}</div></div>
                            </div>
                            <div className='pl-1'>
                              <div className='mt-4 text-xs  text-gray-500'>
                                Tanggal Transaksi
                              </div>
                              <div className='mt-1 text-sm font-bold text-gray-500'>
                                {e.tanggal_transaksi}
                              </div>
                            </div>
                          </div>
                          <div className='mt-6 border-t block lg:flex lg:justify-between  lg:items-center'>
                            {/* <div className='mt-2 flex space-x-2 items-end'>
                              <div className='mt-1 text-xs  text-gray-500'>
                                Kode Booking
                              </div>
                              <div className='mt-1 text-sm font-bold text-gray-500'>
                                - 
                              </div>
                            </div> */}
                            <div className='block md:flex space-x-2 items-center pt-8'>
                                <div className="text-xs font-bold py-1 px-3 rounded-full bg-blue-500 text-white inline-block">
                                  sisa waktu{" "}
                                  {remainingTimes[i] && (new Date(e.expiredDate).getTime() > new Date().getTime()) ? remainingTime(remainingTimes[i])  : ' habis.'}
                                </div>
                                <div
                                  onClick={(e) => openModalBayar(e, i)}
                                  type="button"
                                  className="mt-4 md:mt-0 cursor-pointer text-blue-500 font-bold text-xs"
                                >
                                  Lihat Detail
                                </div>
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
                    <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.8130 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            </>
          )}
      </>)}
      </div>
    </>
  );
}
