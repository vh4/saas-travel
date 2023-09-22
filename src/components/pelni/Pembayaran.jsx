import React, {useState, useContext} from "react";
import axios from "axios";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule} from 'react-icons/md'
import { useNavigate, createSearchParams } from "react-router-dom";
import { TiketContext } from "../../App";
import {Button as ButtonAnt, Modal as Modals, Result} from 'antd'
import { notification } from 'antd';
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';
import {TbArrowsLeftRight} from 'react-icons/tb'

export default function Pembayaran(){

    const navigate = useNavigate();
    
    const {dispatch} = useContext(TiketContext);
    const [isLoading, setIsLoading] = useState(false);

	const book = JSON.parse(localStorage.getItem('v_pelnibook'));
    const book_info  = JSON.parse(localStorage.getItem('v_infopelnibook'));
    const passengers  = JSON.parse(localStorage.getItem('v_passengers'));

	console.log(book);
	console.log(book_info);

    const TotalAdult = passengers ? parseInt(passengers.adult) : 0;
    const TotalInfant = passengers ? parseInt(passengers.infant) : 0;	

    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    const [api, contextHolder] = notification.useNotification();

    const failedNotification = (rd) => {
        api['error']({
          message: 'Error!',
          description:
          rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + '',
        });
      };

	const successNotification = (rd) => {
	api['success']({
		message: 'Success!',
		description:
		"Successfully, pindah kursi anda sudah berhasil!.",
		duration:7,
	});
	};

    var err = false;

    if(token === null || token === undefined){
        err = true
    }

    if(book === null || book === undefined){
        err = true
    }

    if(passengers === null || passengers === undefined){
        err = true
    }   

    if(book_info === null || book_info === undefined){
        err = true
    }

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    async function handlerPembayaran(e){
        e.preventDefault();

    }

    function parseTanggal(d){
        var date =  new Date(d);
        var tahun = date.getFullYear();
        var bulan = date.getMonth();
        var hari =  date.getDay();
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
    
       const tanggal_keberangkatan = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;
       return tanggal_keberangkatan;
    }

    function handleError(){
        
        window.location = '/';
        localStorage.removeItem('v_pelnibook');
        localStorage.removeItem('v_infopelnibook');
        localStorage.removeItem('v_passengers'); 

    }

    return(
        <>
        {/* for message */}
        {contextHolder}

        {err !== true ? (
            <>
        {/* header kai flow */}
        <div className='flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center'>
            <div className='flex space-x-2 items-center'>
                <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                <div className='hidden xl:flex text-slate-500'>Detail pesanan</div>
                <div className='block xl:hidden text-slate-500'>Detail</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='hidden xl:flex text-gray-500' />
            </div>
            <div className='flex space-x-2 items-center'>
                <AiOutlineCheckCircle className='text-slate-500'  size={20} />
                <div className='hidden xl:flex text-slate-500 font-bold'>Konfirmasi pesanan</div>
                <div className='block xl:hidden text-slate-500  font-bold'>Konfirmasi</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
            </div>
            <div className='flex space-x-2 items-center'>
                <div className='hidden xl:block text-blue-500'>Pembayaran tiket</div>
                <div className='block xl:hidden text-blue-500'>Payment</div>
            </div>
            <div>
                <MdHorizontalRule size={20} className='text-gray-500 hidden xl:flex' />
            </div>
            <div className='flex space-x-2 items-center'>
                <RxCrossCircled size={20} className='text-slate-500' />
                <div className='text-slate-500'>E-Tiket</div>
            </div>
        </div>
        <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
            <div className="mt-4 w-full mx-0 2xl:mx-4">
            {/* adult and infant */}
            { book_info.PAX_LIST.length > 0 ? book_info.PAX_LIST.map((e, i) =>(
                <>
                    <div className='p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm'>
                        <div className="p-2">
                            <div className="px-2 xl:px-4 py-2 text-gray-600 border-b border-gray-200 text-sm font-bold">
								{book_info.PAX_LIST[i][0]} ({book_info.PAX_LIST[i][6] == 'N/A' ? 'INFANT' : 'ADULT'})
                            </div>
                            <div className="mt-2 block md:flex md:space-x-8">
                                {/* <div className="px-2 md:px-4 py-2 text-sm">
                                    <div className="text-gray-500">NIK</div>
                                    <div className="font-bold text-xs text-gray-600">{book_info.PAX_LIST[i][1]}</div>
                                </div> */}
                                <div className="px-2 md:px-4 py-2">
                                    <div className="text-gray-500 text-sm">Nomor HP</div>
                                    <div className="font-bold text-xs text-gray-600">{book_info.CALLER}</div>
                                </div> 
                                <div className="px-2 md:px-4 py-2">
                                    <div className="text-gray-500 text-sm">Kursi</div>
									<div className="font-bold text-xs text-gray-600">{book_info.PAX_LIST[i][6] == 'N/A' ? ' Non Seats' : `${book_info.PAX_LIST[i][2] + '/' + book_info.PAX_LIST[i][5] + '-' + book_info.PAX_LIST[i][4]}`}</div>
                                </div>
                                <div className="px-2 md:px-4 py-2">
                                    <div className="text-sm text-gray-500">Kelas</div>
									<div className="font-bold text-xs text-gray-600">{book_info.CLASS} / Subclass ({book_info.SUBCLASS})</div>
                                </div>
                            </div>
                        </div>
                    </div>                                      
                </>
            )) : ''}
                <div className='p-2 mt-2 w-full rounded-md border border-gray-200 shadow-sm'>
                    <div className="p-4">
                        <div className="text-xs text-gray-600 font-bold flex justify-between">
                            <div>
                            {book_info && book_info.SHIP_NAME} {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ''} { TotalInfant > 0 ? `(Infant) x${TotalInfant}` : ''}
                            </div>
                            <div>
                                Rp. {book && toRupiah(book.normalSales)}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 font-bold flex justify-between">
                            <div>
                                Biaya Admin (Fee) x{TotalAdult + TotalInfant}
                            </div>
                            <div>
                                Rp. {book && toRupiah(book.nominal_admin * (TotalAdult + TotalInfant))}
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 font-bold flex justify-between">
                            <div>
                                Diskon (Rp.)
                            </div>
                            <div>
                                Rp. {book && book.discount}
                            </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-gray-600 font-bold flex justify-between">
                            <div>
                                Total Harga
                            </div>
                            <div>
                                Rp. {book && toRupiah(parseInt(book.normalSales) - parseInt(book.discount) + parseInt(book.nominal_admin * (TotalAdult + TotalInfant)))}
                            </div>
                        </div>
                    </div>
                </div>     
            </div> 
            {/* desktop sidebar */}
            <div className="sidebar w-full xl:w-1/2">
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    <div className="px-4 py-2">
                        <div className="text-gray-500 text-xs">Status Booking</div>
                        <div className="mt-1 font-bold text-blue-500 text-xs">{book_info && book_info.STATUS}</div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">PELNI DESCRIPTION</div>
                        <div className="mt-3 text-xs text-gray-500">{book.SHIP_NAME}</div>
                        <div className="flex space-x-4">
                            <div className="mt-1 text-xs text-slate-700 font-bold">{passengers.pelabuhan_asal}</div>
                            < TbArrowsLeftRight className='text-gray-500' size={18} />
                            <div className="mt-1 text-xs text-slate-700 font-bold">{passengers.pelabuhan_tujuan}</div>  
                        </div>
                        <div className="mt-3 text-xs text-gray-500">{parseTanggal(passengers.departureDate)} - {parseTanggal(book.arrivalDate)}</div>
                        <div className="mt-1 text-xs text-gray-500">{book.departureTime} - {book.arrivalTime}</div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">LIST PASSENGERS</div>
                        {passengers.passengers.adults && passengers.passengers.adults.length > 0 && 
                            passengers.passengers.adults.map((e, i) => (
                                <div className="mt-3 text-xs text-slate-700 font-bold">{e.name} (Adult)</div>
                            ))
                        }                     
                         {passengers.passengers.infants && passengers.passengers.infants.length > 0 && 
                            passengers.passengers.infants.map((e, i) => (
                                <div className="mt-3 text-xs text-slate-700 font-bold">{e.name} (Infants)</div>
                            ))
                        }         
                    </div>
                </div>
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    {/* <div className="px-8 py-4 text-sm text-gray-500">
                        Tekan tombol <span className="text-blue-500">bayar langsung</span> untuk melakukan pembayaran secara tunai.
                    </div> */}

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

                    <div className="px-8 py-4 text-sm text-gray-500">
                        Tekan tombol <span className="text-blue-500">bayar langsung</span> untuk melakukan pembayaran secara tunai.
                    </div> 
                    
                    <div className="flex justify-center">
                    <ButtonAnt onClick={handlerPembayaran}  size="large" key="submit"  type="primary" className='bg-blue-500 mx-2 font-semibold mt-4' loading={isLoading} disabled>
                        Langsung Bayar
                    </ButtonAnt>
                    </div>  
                </div>
            </div>
        </div>
            </>
        ) : (
        <Result
            status="500"
            title="Error!"
            subTitle="Silahkan Anda login terlebih dahulu."
            style={{ color: 'white' }} // Ini akan memastikan warna teks menjadi putih
            extra={
                <ButtonAnt
                    style={{ color: 'white' }} // Ini akan memastikan warna teks menjadi putih
                    className="bg-blue-600 text-white hover:text-gray-100 focus:text-gray-100 active:text-gray-200"
                    onClick={() => window.location = '/'}
                >Back Home</ButtonAnt>
            }
        />
        )}
        </>
    )
}