import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule, MdOutlineAirlineSeatReclineExtra} from 'react-icons/md'
import { useNavigate, createSearchParams } from "react-router-dom";
import Swal from 'sweetalert2'
import { KaiContext } from "../../App";

export default function Pembayaran(){

    const {trainNumber} = useParams();
    const navigate = useNavigate();
    
    const {dispatch} = useContext(KaiContext);
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const passengers = searchParams.get('passengers') ? JSON.parse(searchParams.get('passengers')) : [];

    const dataBookingTrain = JSON.parse(localStorage.getItem(trainNumber + "_booking"));
    const hasilBooking = JSON.parse(localStorage.getItem(trainNumber + "_hasilBookingdanPilihKursi"));

    const TotalAdult = passengers.adults ? passengers.adults.length : 0;
    const TotalChild = passengers.children ? passengers.children.length : 0;
    const TotalInfant = passengers.infants ? passengers.infants.length : 0;

    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    useEffect(() =>{
        if(token === null || token === undefined){
            navigate('/');
        }
    });

    useEffect(() =>{
        if(hasilBooking === null || dataBookingTrain === null){
            navigate('/')
        }   
    }, [hasilBooking, dataBookingTrain])

    useEffect(() =>{
        if(hasilBooking &&  new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()) {
            Swal.fire({
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                  },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                  },
                icon: 'error',
                title: 'Oops...',
                text: 'Maaf, Waktu Booking sudah habis!',
                confirmButtonText: '<a href="/">Kembali</a>'
              });
              
              localStorage.removeItem(trainNumber + '_booking');
              localStorage.removeItem(trainNumber + '_detailTrain');
              localStorage.removeItem(trainNumber + '_hasilBookingdanPilihKursi');
              
         }

     })

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    async function handlerPembayaran(){

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/payment`, 
        {
            "productCode" : "WKAI",
            "bookingCode" : hasilBooking.bookingCode,
            "transactionId" : hasilBooking.transactionId,
            "nominal" : hasilBooking.normalSales,
            "nominal_admin" : hasilBooking.nominalAdmin,
            "discount" : hasilBooking.discount,
            "simulateSuccess":process.env.REACT_APP_SIMUATION_PAYMENT,
            "pay_type" : "TUNAI",
            "token" : JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API))
        }
        );
        
        if(response.data.rc === '00'){
            const params = {
                success: JSON.stringify(
                    {
                        booking_id: hasilBooking.bookingCode,
                        tipe_pembayaran:"TUNAI",
                        nomor_hp_booking:passengers.adults[0].phone,
                        id_transaksi:hasilBooking.transactionId,
                        nominal_admin: hasilBooking.nominalAdmin,
                        discount: hasilBooking.discount,
                        nominal_sales: hasilBooking.normalSales,
                        total_dibayar:toRupiah(parseInt(hasilBooking.normalSales) - parseInt(hasilBooking.discount) + parseInt(hasilBooking.nominalAdmin))
                    }
                )
            }

            dispatch({
                type:'PAY_TRAIN'
            });

            navigate({
                pathname: "/train/tiket-kai",
                search: `?${createSearchParams(params)}`  
            })


        }else{
            alert(response.data.rd);
        }

    }

    return(
        <>
        {token !== undefined && token !== null ? (
            <>
                            {/* header kai flow */}
        <div className='flex justify-start jalur-payment-booking text-xs xl:text-md space-x-2 xl:space-x-8 items-center'>
            <div className='flex space-x-2 items-center'>
                <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                <div className='hidden xl:flex text-slate-500'>Detail pesanan</div>
                <div className='block xl:hidden text-slate-500'>Detail</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
            </div>
            <div className='flex space-x-2 items-center'>
                <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                <div className='hidden xl:flex text-slate-500'>Konfirmasi pesanan</div>
                <div className='block xl:hidden text-slate-500'>Konfirmasi</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
            </div>
            <div className='flex space-x-2 items-center'>
                <div className='hidden xl:flex text-[#ff8400] font-bold'>Pembayaran tiket</div>
                <div className='block xl:hidden text-[#ff8400] font-bold'>Payment</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
            </div>
            <div className='flex space-x-2 items-center'>
                <RxCrossCircled size={20} className='text-slate-500' />
                <div className='text-slate-500'>E-Tiket</div>
            </div>
        </div>
        <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
            <div className="mt-4 w-full mx-0 2xl:mx-4">
            {/* adult */}
            { passengers.adults.length > 0 ? passengers.adults.map((e, i) =>(
                <>
                    <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-2">
                            <div className="px-2 xl:px-4 py-2 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                {e.name}
                            </div>
                            <div className="mt-2 block md:flex md:space-x-8">
                                <div className="px-2 md:px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">NIK</div>
                                    <div className="text-gray-600">{e.idNumber}</div>
                                </div>
                                <div className="px-2 md:px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Nomor HP</div>
                                    <div className="text-gray-600">{e.phone}</div>
                                </div> 
                                <div className="px-2 md:px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Kursi</div>
                                    <div className="text-gray-600">{hasilBooking !== null ? hasilBooking.seats[i][0] === 'EKO'  ? 'Ekonomi' : hasilBooking.seats[i][0] === 'BIS' ? 'Bisnis' : 'Eksekutif' : '' } {hasilBooking !== null ? hasilBooking.seats[i][1] : ''} - {hasilBooking !== null ? hasilBooking.seats[i][2] : ''}{hasilBooking !== null ? hasilBooking.seats[i][3] : ''}</div>
                                </div>
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}


            {/* infants */}
            { passengers.infants.length > 0 ? passengers.infants.map((e, i) =>(
                <>
                    <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-4">
                            <div className="p-4 text-gray-500 border-b border-gray-200 text-sm font-bold">
                                {e.name}
                            </div>
                            <div className="mt-2 flex space-x-8">
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Tanggal Lahir</div>
                                    <div className="text-gray-600">{e.idNumber}</div>
                                </div>
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Tanggal Lahir</div>
                                    <div className="text-gray-600">{e.birthdate}</div>
                                </div> 
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Kursi</div>
                                    <div className="text-gray-600">{hasilBooking.seats[i][0] === 'EKO'  ? 'EKONOMI' : hasilBooking.seats[i][0]} {hasilBooking.seats[i][1]} - {hasilBooking.seats[i][2]} {hasilBooking.seats[i][3]}</div>
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
                            {dataBookingTrain && dataBookingTrain[0].trainName} {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ''} { TotalChild > 0 ? `(Adult) x${TotalChild}` : ''} { TotalInfant > 0 ? `(Adult) x${TotalInfant}` : ''}
                            </div>
                            <div>
                                Rp. {hasilBooking && toRupiah(hasilBooking.normalSales * TotalAdult)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                                Biaya Admin (Fee)
                            </div>
                            <div>
                                Rp. {hasilBooking && toRupiah(hasilBooking.nominalAdmin)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
                            <div>
                                Diskon (Rp.)
                            </div>
                            <div>
                                Rp. {hasilBooking && hasilBooking.discount}
                            </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-slate-500 font-bold flex justify-between">
                            <div>
                                Total Harga
                            </div>
                            <div>
                                Rp. {hasilBooking && toRupiah(parseInt(hasilBooking.normalSales * TotalAdult) - parseInt(hasilBooking.discount) + parseInt(hasilBooking.nominalAdmin))}
                            </div>
                        </div>
                    </div>
                </div>     
            </div> 
            {/* desktop sidebar */}
            <div className="sidebar w-full xl:w-2/3">
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    <div className="px-4 py-2">
                        <div className="text-gray-500 text-xs">Booking ID</div>
                        <div className="mt-1 font-bold text-[#ff8400] text-xs">{hasilBooking && hasilBooking.bookingCode}</div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">TRAIN DESCRIPTION</div>
                        <div className="mt-3 text-xs text-gray-500">Pasundan</div>
                        <div className="mt-1 text-xs text-slate-700 font-bold">Solo - Bandung</div>
                        <div className="mt-3 text-xs text-gray-500">Kamus, 24 Oktober 2022</div>
                        <div className="mt-1 text-xs text-gray-500">22.00 - 21.00</div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">LIST PASSENGERS</div>
                        {passengers.adults && passengers.adults.length > 0 && 
                            passengers.adults.map((e, i) => (
                                <div className="mt-3 text-xs text-slate-700 font-bold">{e.name} (Adult)</div>
                            ))
                        }
                         {passengers.children && passengers.children.length > 0 && 
                            passengers.children.map((e, i) => (
                                <div className="mt-3 text-xs text-slate-700 font-bold">{e.name} (Children)</div>
                            ))
                        }                       
                         {passengers.infants && passengers.infants.length > 0 && 
                            passengers.infants.map((e, i) => (
                                <div className="mt-3 text-xs text-slate-700 font-bold">{e.name} (Infants)</div>
                            ))
                        }         
                    </div>
                </div>
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    <div className="px-8 py-4 text-sm text-gray-500">
                        Tekan tombol <span className="text-blue-500">bayar langsung</span> untuk melakukan pembayaran secara tunai.
                    </div>
                    <div className="flex justify-center">
                        <button onClick={handlerPembayaran} type="button" class="block justify-center text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-3 text-center items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                        {isLoading ? (
                        <div className="flex space-x-2 items-center">
                            <svg aria-hidden="true" class="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <div class="">Loading...</div>
                        </div>
                        )
                        :
                        (
                            <div className="text-white text-MD font-bold">BAYAR LANGSUNG</div>
                        )
                        }
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