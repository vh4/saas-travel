import React, {useState, useContext} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {AiOutlineCheckCircle} from "react-icons/ai"
import {RxCrossCircled} from 'react-icons/rx'
import {MdHorizontalRule} from 'react-icons/md'
import { useNavigate, createSearchParams } from "react-router-dom";
import { TiketContext } from "../../App";
import {Button as ButtonAnt, Modal as Modals} from 'antd'
import { notification } from 'antd';
import Marquee from 'react-fast-marquee';
import { Alert } from 'antd';

export default function Pembayaran(){

    const {trainNumber} = useParams();
    const navigate = useNavigate();
    
    const {dispatch} = useContext(TiketContext);
    
    const [isLoading, setIsLoading] = useState(false);
    const passengers = localStorage.getItem(trainNumber + "_passenggers") ? JSON.parse(localStorage.getItem(trainNumber + "_passenggers")) : null;

    const dataBookingTrain = localStorage.getItem(trainNumber + "_booking") ? JSON.parse(localStorage.getItem(trainNumber + "_booking")) : null;
    const dataDetailTrain = localStorage.getItem(trainNumber + "_detailTrain") ? JSON.parse(localStorage.getItem(trainNumber + "_detailTrain")) : null;
    const hasilBooking = JSON.parse(localStorage.getItem(trainNumber + "_hasilBookingdanPilihKursi"));

    const TotalAdult = passengers ? passengers.adults ? passengers.adults.length : 0 :  0;
    const TotalChild = passengers ? passengers.children ? passengers.children.length : 0 : 0;
    const TotalInfant = passengers ? passengers.infants ? passengers.infants.length : 0 : 0;

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
    if(passengers === null || passengers === undefined) {
        err = true;
    }

    if(token === null || token === undefined) {
        err = true;
    }

    if(dataBookingTrain === null || dataBookingTrain === undefined) {
        err = true;
    }

    if(dataDetailTrain === null || dataDetailTrain === undefined) {
        err = true;
    }

    if(hasilBooking === null || hasilBooking === undefined) {
        err = true;
    }

    setTimeout(() =>{ 

        if(hasilBooking && new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()) {

            err = true;

        }

    }, hasilBooking && new Date(hasilBooking.timeLimit).getTime() - new Date().getTime());

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

    async function handlerPembayaran(e){
        e.preventDefault();
        setIsLoading(true);
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
                        url_etiket : response.data.data.url_etiket,
                        nominal_sales: hasilBooking.normalSales,
                        total_dibayar:toRupiah(parseInt(hasilBooking.normalSales) - parseInt(hasilBooking.discount) + parseInt(hasilBooking.nominalAdmin))
                    }
                )
            }

            dispatch({
                type:'PAY_TRAIN'
            });

            setTimeout(() => {
                setIsLoading(false);

                navigate({
                    pathname: "/train/tiket-kai",
                    search: `?${createSearchParams(params)}`  
                })
            }, 1500)

        }else{
            setTimeout(() => {
                failedNotification(response.data.rd);
                setIsLoading(false);
            }, 1000)

        }

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
        localStorage.removeItem(trainNumber + '_booking');
        localStorage.removeItem(trainNumber + '_detailTrain');
        localStorage.removeItem(trainNumber + '_hasilBookingdanPilihKursi'); 
        localStorage.removeItem(trainNumber + '_passenggers');
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
                                    <div className="text-gray-500">NIK</div>
                                    <div className="text-gray-600">{e.idNumber}</div>
                                </div>
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Tanggal Lahir</div>
                                    <div className="text-gray-600">{e.birthdate}</div>
                                </div> 
                                <div className="px-4 py-2 text-sm font-bold">
                                    <div className="text-gray-500">Kursi</div>
                                    <div className="text-gray-600">{hasilBooking.seats[i][0] === 'EKO'  ? 'Ekonomi' : hasilBooking.seats[i][0]} {hasilBooking.seats[i][1]} - {hasilBooking.seats[i][2]} {hasilBooking.seats[i][3]}</div>
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
            <div className="sidebar w-full xl:w-1/2">
                <div className='mt-8 py-2 rounded-md border border-gray-200 shadow-sm'>
                    <div className="px-4 py-2">
                        <div className="text-gray-500 text-xs">Booking ID</div>
                        <div className="mt-1 font-bold text-blue-500 text-xs">{hasilBooking && hasilBooking.bookingCode}</div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">TRAIN DESCRIPTION</div>
                        <div className="mt-3 text-xs text-gray-500">{dataBookingTrain[0].trainName}</div>
                        <div className="mt-1 text-xs text-slate-700 font-bold">{dataDetailTrain[0].berangkat_nama_kota} - {dataDetailTrain[0].tujuan_nama_kota}</div>
                        <div className="mt-3 text-xs text-gray-500">{parseTanggal(dataBookingTrain[0].departureDate)}</div>
                        <div className="mt-1 text-xs text-gray-500">{dataBookingTrain[0].departureTime} - {dataBookingTrain[0].arrivalTime}</div>
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
    <Modals.error
            title="Error!"
            open={true}
            content= 'Terjadi kesalahan, silahkan booking kembali.'
            footer={[
                (
                <div className="flex justify-end mt-4">
                    <ButtonAnt key="submit" type="primary" className='bg-blue-500' onClick={ handleError }>
                         Kembali ke home
                    </ButtonAnt>,
                </div>
                )
              ]}
        >
    </Modals.error>
        )}
        </>
    )
}