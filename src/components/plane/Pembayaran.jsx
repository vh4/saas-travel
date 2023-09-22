import React, {useState, useContext} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule} from 'react-icons/md'
import { useNavigate, createSearchParams } from "react-router-dom";
import { TiketContext } from "../../App";
import {BsArrowRightShort} from "react-icons/bs"
import { Button, Result, message } from 'antd';
import { Modal } from 'antd';
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';

export default function Pembayaran(){

    const {PesawatNumber} = useParams();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const {dispatch} = useContext(TiketContext);
    const [isLoading, setIsLoading] = useState(false);

    const dataDetail = JSON.parse(localStorage.getItem(PesawatNumber + "_flight"));
    const dataDetailPassenger = JSON.parse(localStorage.getItem(PesawatNumber + "_DetailPassenger"));
    const hasilBooking = JSON.parse(localStorage.getItem(PesawatNumber + "_Bookingflight"));
    const dataDetailForBooking  = JSON.parse(localStorage.getItem(PesawatNumber + '_flight_forBooking'));

    const TotalAdult = dataDetail ? parseInt(dataDetail[0].adult) : 0;
    const TotalChild = dataDetail ? parseInt(dataDetail[0].child) : 0;
    const TotalInfant = dataDetail ? parseInt(dataDetail[0].infant) : 0;
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));

    var err = false

      function gagal(rd){
        messageApi.open({
          type: 'error',
          content: 'Failed, ' + rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + '',
          duration: 5,
        });
      };

    if(token === null || token === undefined){
        err = true
    }

    if(dataDetail === null || dataDetail === undefined){
        err = true
    }

    if(dataDetailPassenger === null || dataDetailPassenger === undefined){
        err = true
    }   

    if(hasilBooking === null || hasilBooking === undefined){
        err = true
    }

    if(dataDetailForBooking === null || dataDetailForBooking === undefined){
        err = true
    }  
    
    function tanggalParse(x){

        var date = new Date(x);
        var tahun = date.getFullYear();
        var bulan = date.getMonth();
        var hari = date.getDay();
        var tanggal = date.getDate();
    
        switch(hari) {
            case 0: hari = "Minggu"; break;
            case 1: hari = "Senin"; break;
            case 2: hari = "Selasa"; break;
            case 3: hari = "Rabu"; break;
            case 4: hari = "Kamis"; break;
            case 5: hari = "Jum'at"; break;
            case 6: hari = "Sabtu"; break;
         }
    
         switch(bulan) {
            case 0: bulan = "Januari"; break;
            case 1: bulan = "Februari"; break;
            case 2: bulan = "Maret"; break;
            case 3: bulan = "April"; break;
            case 4: bulan = "Mei"; break;
            case 5: bulan = "Juni"; break;
            case 6: bulan = "Juli"; break;
            case 7: bulan = "Agustus"; break;
            case 8: bulan = "September"; break;
            case 9: bulan = "Oktober"; break;
            case 10: bulan = "November"; break;
            case 11: bulan = "Desember"; break;
           }
    
         const result = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;
         return result
    }


    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    setTimeout(() =>{ 

        if(hasilBooking && new Date(hasilBooking.timeLimitYMD).getTime() < new Date().getTime()) {

            navigate('/');
            localStorage.removeItem(PesawatNumber + '_flight');
            localStorage.removeItem(PesawatNumber + '_DetailPassenger');
            localStorage.removeItem(PesawatNumber + '_Bookingflight');

        }

    }, hasilBooking && new Date(hasilBooking.timeLimit).getTime() - new Date().getTime());

    async function handlerPembayaran(e){
        e.preventDefault();
        setIsLoading(true);

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/flight/payment`, 
        {
            airline : dataDetailForBooking.airline,
            transactionId : hasilBooking.transactionId,
            bookingCode : hasilBooking.bookingCode,
            simulateSuccess: process.env.REACT_APP_SIMUATION_PAYMENT,
            paymentCode : "",
            token:token
        });

        if(response.data.rc === '00'){
            const params = {
                success: JSON.stringify(
                    {
                        airline:dataDetail.airline,
                        booking_id: hasilBooking.bookingCode,
                        nomor_hp_booking:dataDetailPassenger.adults[0].nomor,
                        id_transaksi:hasilBooking.transactionId,
                        nominal_admin: hasilBooking.nominalAdmin,
                        url_etiket : response.data.data.url_etiket,
                        nominal_sales: response.data.data.nominal,
                        total_dibayar:toRupiah(parseInt(hasilBooking.nominal) + parseInt(hasilBooking.nominalAdmin))
                    }
                )
            }

            dispatch({
                type:'PAY_FLIGHT'
            });

            navigate({
                pathname: "/flight/tiket-pesawat",
                search: `?${createSearchParams(params)}`  
            })
            setIsLoading(false);

        }else{

            setTimeout(() => {
                setIsLoading(false);
                gagal(response.data.rd)

            }, 1000)

        }
    }

    return(
        <>

        {/* meessage bayar */}
        {contextHolder}        
        {err === true ? (<>
            <Result
                    status="500"
                    title="Error!"
                    subTitle="Silahkan Anda login terlebih dahulu."
                    style={{ color: 'white' }} // Ini akan memastikan warna teks menjadi putih
                    extra={
                        <Button
                            style={{ color: 'white' }} // Ini akan memastikan warna teks menjadi putih
                            className="bg-blue-600 text-white hover:text-gray-100 focus:text-gray-100 active:text-gray-200"
                            onClick={() => window.location = '/'}
                        >Back Home</Button>
                    }
                />
        
        </>) :
        
        (
            <>
            {/* header kai flow */}
            <div className='flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center'>
                <div className='flex space-x-2 items-center'>
                    <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                    <div className='hidden xl:flex text-slate-500'>Detail pesanan</div>
                    <div className='block xl:hidden text-slate-500'>Detail</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <div className='hidden xl:flex text-blue-500 font-bold'>Pembayaran tiket</div>
                    <div className='block xl:hidden text-blue-500 font-bold'>Payment</div>
                </div>
                <div>
                    <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
                </div>
                <div className='flex space-x-2 items-center'>
                    <RxCrossCircled size={20} className='text-slate-500' />
                    <div className='text-slate-500'>E-Tiket</div>
                </div>
            </div>
    
            <div className="block xl:flex xl:justify-around mb-24 xl:space-x-12 xl:mx-12">
                <div className="mt-4 w-full mx-0 2xl:mx-4">
                {/* adult */}
                { dataDetailPassenger && dataDetailPassenger.adults.length > 0 ? dataDetailPassenger.adults.map((e, i) =>(
                    <>
                        <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                            <div className="p-2">
                                <div className="px-2 xl:px-4 py-2 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                    {e.nama_depan} {e.nama_belakang}
                                </div>
                                <div className="mt-2 block md:flex md:space-x-8">
                                    <div className="px-2 md:px-4 py-2 text-sm">
                                        <div className="text-gray-500 font-medium">NIK</div>
                                        <div className="text-gray-500">{e.idNumber}</div>
                                    </div>
                                    <div className="px-2 md:px-4 py-2 text-sm">
                                        <div className="text-gray-500  font-medium">Nomor HP</div>
                                        <div className="text-gray-500">{e.nomor}</div>
                                    </div> 
                                    <div className="px-2 md:px-4 py-2 text-sm">
                                        <div className="text-gray-500  font-medium">Email</div>
                                        <div className="text-gray-500">{e.email}</div>
                                    </div>
                                </div>
                                <div className="px-2 md:px-4 py-2 text-sm">
                                        <div className="text-gray-500 font-medium">Tanggal Lahir</div>
                                        <div className="text-gray-500">{e.birthdate}</div>
                                </div>
                            </div>
                        </div>                                      
                    </>
                )) : ''}
    
                {/* Childs */}
                { dataDetailPassenger && dataDetailPassenger.children.length > 0 ? dataDetailPassenger.children.map((e, i) =>(
                    <>
                        <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                            <div className="p-2">
                                <div className="p-4 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                    {e.nama_depan} {e.nama_belakang}
                                </div>
                                <div className="mt-2 flex space-x-8">
                                    <div className="px-4 py-2 text-sm">
                                        <div className="text-gray-500 font-medium">NIK/ No.Ktp</div>
                                        <div className="text-gray-600">{e.idNumber}</div>
                                    </div>
                                    <div className="px-4 py-2 text-sm">
                                        <div className="text-gray-500 font-medium">Tanggal Lahir</div>
                                        <div className="text-gray-600">{e.birthdate}</div>
                                    </div> 
                                </div>
                            </div>
                        </div>                                      
                    </>
                )) : ''}
    
                {/* infants */}
                { dataDetailPassenger && dataDetailPassenger.infants.length > 0 ? dataDetailPassenger.infants.map((e, i) =>(
                    <>
                        <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                            <div className="p-4">
                                <div className="p-4 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                    {e.nama_depan} {e.nama_belakang}
                                </div>
                                <div className="mt-2 flex space-x-8">
                                    <div className="px-4 py-2 text-sm">
                                        <div className="text-gray-500">NIK/ No.Ktp</div>
                                        <div className="text-gray-600">{e.idNumber}</div>
                                    </div>
                                    <div className="px-4 py-2 text-sm">
                                        <div className="text-gray-500">Tanggal Lahir</div>
                                        <div className="text-gray-600">{e.birthdate}</div>
                                    </div> 
                                </div>
                            </div>
                        </div>                                      
                    </>
                )) : ''}
                    <div className='p-2 mt-2 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-4">
                            <div className="text-xs text-slate-500 font-bold flex justify-between">
                                <div>
                                {dataDetail && dataDetail.airlineName} {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ''} { TotalChild > 0 ? `(Childen) x${TotalChild}` : ''} { TotalInfant > 0 ? `(Infants) x${TotalInfant}` : ''}
                                </div>
                                <div>
                                    Rp. {toRupiah(hasilBooking && hasilBooking.nominal)}
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                                <div>
                                    Biaya Admin (Fee)
                                </div>
                                <div>
                                    Rp. {toRupiah(hasilBooking && hasilBooking.nominalAdmin)}
                                </div>
                            </div>  
                            <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-slate-500 font-bold flex justify-between">
                                <div>
                                    Total Harga
                                </div>
                                <div>
                                    Rp. {toRupiah(parseInt(hasilBooking && hasilBooking.nominal) + parseInt(hasilBooking && hasilBooking.nominalAdmin))}
                                </div>
                            </div>
                        </div>
                    </div>     
                </div> 
                {/* desktop sidebar */}
                <div className="sidebar w-full xl:w-1/2">
                    <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                        <div className="px-4 py-2">
                            <div className="text-gray-500 text-xs">Booking ID</div>
                            <div className="mt-1 font-bold text-blue-500 text-xs">{hasilBooking && hasilBooking.bookingCode}</div>
                        </div>
                        <div className="p-4 border-t">
                            <div className="text-xs text-gray-500">PESAWAT DESCRIPTION</div>
                            {dataDetail && dataDetail.map((dataDetail) => (
                                <>
                                    <div className="mt-2 mb-2 flex items-center space-x-2">
                                        <div><img src={dataDetail.airlineIcon} width={50} alt="logo.png" /></div>
                                        <div className="mt-3 text-xs text-gray-500">{dataDetail.airlineName}</div>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1 text-xs text-slate-700 font-bold"><div>{dataDetail.departureName}</div> <BsArrowRightShort /> <div>{dataDetail.arrivalName}</div></div>
                                        <div className="mt-3 text-xs text-gray-500">{tanggalParse(dataDetail.departureDate)}</div>
                                    <div className="mt-1 text-xs text-gray-500">{dataDetail.departureTime} - {dataDetail.arrivalTime}</div>    
                                </>
                            ))}
    
                       </div>
                        <div className="p-4 border-t">
                            <div className="text-xs text-gray-500">LIST PASSENGERS</div>
                            {dataDetailPassenger.adults && dataDetailPassenger.adults.length > 0 && 
                                dataDetailPassenger.adults.map((e, i) => (
                                    <div className="mt-3 text-xs text-slate-700 font-bold">{e.nama_depan} {e.nama_belakang} (Adult)</div>
                                ))
                            }
                             {dataDetailPassenger.children && dataDetailPassenger.children.length > 0 && 
                                dataDetailPassenger.children.map((e, i) => (
                                    <div className="mt-3 text-xs text-slate-700 font-bold">{e.nama_depan} {e.nama_belakang} (Children)</div>
                                ))
                            }                       
                             {dataDetailPassenger.infants && dataDetailPassenger.infants.length > 0 && 
                                dataDetailPassenger.infants.map((e, i) => (
                                    <div className="mt-3 text-xs text-slate-700 font-bold">{e.nama_depan} {e.nama_belakang} (Infants)</div>
                                ))
                            }         
                        </div>
                        {/* <div className="p-4 border-t">
                            <div>
                                < Timer />
                            </div>
                        </div> */}
                    </div>
                    <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                            <div className="px-4 py-2 text-sm text-gray-500">
                                <Alert
                                    banner
                                    message={
                                    <Marquee pauseOnHover gradient={false}>
                                        <span>Untuk menu pembayaran, masih dalam proses pengembangan. </span>
                                    </Marquee>              
                                    }
                                />
                            </div>
                        <div className="flex justify-center">
                            <div className="flex justify-center px-8 py-4 text-sm text-gray-500">
                                <div className="">
                                    Tekan tombol <span className="text-center text-blue-500">bayar langsung</span> untuk melakukan pembayaran secara tunai.
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mb-4" >
                            <Button key="submit" size="large" type="primary" className='bg-blue-500' loading={isLoading} onClick={handlerPembayaran} disabled>
                                Bayar Langsung
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
                </>
        )
        
        }
        </>
    )
}