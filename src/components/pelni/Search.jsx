import React, {useEffect, useRef, useState} from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {VscArrowSwap} from 'react-icons/vsc'
import axios from "axios";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {HiOutlineArrowNarrowRight} from 'react-icons/hi'
import {IoArrowBackOutline} from "react-icons/io5"
import { Link } from "react-router-dom";
import Searchpelni from './PelniSearch'
import { notification } from 'antd';


export default function Search(){

    const [searchParams, setSearchParams] = useSearchParams();
    const origin = searchParams.get('origin');
    const originName = searchParams.get('originName');

    const destination = searchParams.get('destination');
    const destinationName = searchParams.get('destinationName');

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const laki = searchParams.get('laki');  
    const wanita = searchParams.get('wanita');

    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    const navigate = useNavigate();
    const [ubahPencarian, setUbahPencarian] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    const failedNotification = (rd) => {
        api['error']({
          message: 'Error!',
          description:
          rd.toLowerCase().charAt(0).toUpperCase() + rd.slice(1).toLowerCase() + '',
        });
      };

    useEffect(() =>{
        if(token === null || token === undefined){
            navigate('/');

        }

        if(origin === null || origin === undefined){
            navigate('/');
        }

        if(destination === null || destination === undefined){
            navigate('/');
        }
        
        if(startDate === null || startDate === undefined){
            navigate('/');
        }
        if(endDate === null || endDate === undefined){
            navigate('/');
        }

        if(originName === null || originName === undefined){
            navigate('/');
        }
        if(destinationName === null || destinationName === undefined){
            navigate('/');
        }

        if(laki === null || laki === undefined){
            navigate('/');
        }
        if(wanita === null || wanita === undefined){
            navigate('/');
        }

    }, [token, origin, destination, startDate, endDate, laki, wanita, destinationName, originName]);

    function parseDate(x){

        var datee = new Date(x);
        var tahun = datee.getFullYear();
        var bulan = datee.getMonth();
        var hari = datee.getDay();
        var tanggal = datee.getDate();
    
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

        const tanggalbozqu = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;

        return tanggalbozqu;

           
    }

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

     const [isLoading, setLoading] = React.useState(false);
     const [notFound, setError] = React.useState(true);
     const skeleton = [1,2,3,4,5,6,7,8,9,10];
     const [dataSearch, setDataSearch] = React.useState(Array());

      useEffect(() => {
        handlerSearch();
      }, []);
      
      const handlerSearch = async () => {
        setLoading(true);
        try {
          const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/pelni/search`, {
            origin: origin,
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            token: token,
          });
      
          if (response.data.rc === '00') {
            const dataParsing = response.data.data;
      
            for (let k = 0; k < dataParsing.length; k++) {
              const e = dataParsing[k];
              for (let i = 0; i < e.fares.length; i++) {
                const fareResponse = await handleAvailbillity(e, i);
                dataParsing[k].fares[i]['M_available'] = fareResponse.M;
                dataParsing[k].fares[i]['F_available'] = fareResponse.F;
              }
            }
      
            setDataSearch(dataParsing);
            setLoading(false);
            setError(false);
          } else {
            failedNotification(response.data.rd);
            setLoading(false);
            setError(true);
          }
        } catch (error) {
          setLoading(false);
          setError(true);
          console.error('Error:', error);
        }
      };
      
      const handleAvailbillity = async (e, i) => {
        const departureDate = e.DEP_DATE.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      
        const params = {
          origin: origin,
          originCall: e.ORG_CALL,
          destination: destination,
          destinationCall: e.DES_CALL,
          departureDate: departureDate,
          shipNumber: e.SHIP_NO,
          subClass: e.fares[i].SUBCLASS,
          male: 1,
          female: e.fares[i].AVAILABILITY.F,
          token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
        };
      
        try {
          const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/pelni/check_availability`, params);
          const data = response.data.data;
      
          return {
            M: data.M,
            F: data.F,
          };
        } catch (error) {
          console.error('Error in handleAvailbillity:', error);
          return {
            M: 0, // Handle error case gracefully
            F: 0, // Handle error case gracefully
          };
        }
      };
      


    function duration(tanggal1, tanggal2, time1, time2) {

        const date1 = new Date(`${tanggal1.slice(0, 4)}-${tanggal1.slice(4, 6)}-${tanggal1.slice(6, 8)}T${time1.slice(0, 2)}:${time1.slice(2)}:00`);
        const date2 = new Date(`${tanggal2.slice(0, 4)}-${tanggal2.slice(4, 6)}-${tanggal2.slice(6, 8)}T${time2.slice(0, 2)}:${time2.slice(2)}:00`);
      

        if (isNaN(date1) || isNaN(date2)) {
          return 'Invalid date or time';
        }
      

        const selisihMilidetik = Math.abs(date2 - date1);
      
        const hari = Math.floor(selisihMilidetik / (1000 * 60 * 60 * 24));
        const sisaMilidetik = selisihMilidetik % (1000 * 60 * 60 * 24);
      
        const jam = Math.floor(sisaMilidetik / (1000 * 60 * 60));
        const sisaMilidetikJam = sisaMilidetik % (1000 * 60 * 60);
        const menit = Math.floor(sisaMilidetikJam / (1000 * 60));
      
        let hasil = '';
        if (hari > 0) {
          hasil += `${hari}h `;
        }
        if (jam > 0) {
          hasil += `${jam < 10 ? '0' : ''}${jam}j `;
        }
        if (menit > 0) {
          hasil += `${menit < 10 ? '0' : ''}${menit}m`;
        }
        if (hari === 0 && jam === 0 && menit === 0) {
          hasil = '0m';
        }
      
        return hasil;
      }


      function durationFull(tanggal1, tanggal2, time1, time2) {

        const date1 = new Date(`${tanggal1.slice(0, 4)}-${tanggal1.slice(4, 6)}-${tanggal1.slice(6, 8)}T${time1.slice(0, 2)}:${time1.slice(2)}:00`);
        const date2 = new Date(`${tanggal2.slice(0, 4)}-${tanggal2.slice(4, 6)}-${tanggal2.slice(6, 8)}T${time2.slice(0, 2)}:${time2.slice(2)}:00`);
      

        if (isNaN(date1) || isNaN(date2)) {
          return 'Invalid date or time';
        }
      

        const selisihMilidetik = Math.abs(date2 - date1);
      
        const hari = Math.floor(selisihMilidetik / (1000 * 60 * 60 * 24));
        const sisaMilidetik = selisihMilidetik % (1000 * 60 * 60 * 24);
      
        const jam = Math.floor(sisaMilidetik / (1000 * 60 * 60));
        const sisaMilidetikJam = sisaMilidetik % (1000 * 60 * 60);
        const menit = Math.floor(sisaMilidetikJam / (1000 * 60));
      
        let hasil = '';
        if (hari > 0) {
          hasil += `${hari} Hari `;
        }
        if (jam > 0) {
          hasil += `${jam < 10 ? '0' : ''}${jam} Jam `;
        }
        if (menit > 0) {
          hasil += `${menit < 10 ? '0' : ''}${menit} Menit`;
        }
        if (hari === 0 && jam === 0 && menit === 0) {
          hasil = '0 Menit';
        }
      
        return hasil;
      }

      const fare = async (e, i) => {
        
        const departureDate = e.DEP_DATE.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

        const params =  
        {
            "origin" : origin,
            "originCall" : e.ORG_CALL,
            "destination" : destination,
            "destinationCall" : e.DES_CALL,
            "departureDate" : departureDate,
            "shipNumber" : e.SHIP_NO,
            "token" : JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API))
        };

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/pelni/fare`, params);
        const parsing = response.data.data;

        const faresResponseFix = parsing[i];

        return faresResponseFix;


    }

    

      async function handleSubmit(e, i){

        const fares = await fare(e, i);
        const departureDate = e.DEP_DATE.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        const arrivalDate = e.ARV_DATE.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

        const params = {

            "harga_dewasa" : fares.FARE_DETAIL.A.TOTAL,
            "harga_anak" : "0",
            "harga_infant" : fares.FARE_DETAIL.I.TOTAL,
            "pelabuhan_asal" : originName,
            "pelabuhan_tujuan" : destinationName,
            "shipName" : e.SHIP_NAME,
            "origin" : origin,
            "originCall" : e.ORG_CALL,
            "destination" : destination,
            "destinationCall" : e.DES_CALL,
            "departureDate" : departureDate,
            "arrivalDate" : arrivalDate,
            "departureTime" : `${e.DEP_TIME.slice(0, 2)}:${e.DEP_TIME.slice(2)}`,
            "arrivalTime" : `${e.ARV_TIME.slice(0, 2)}:${e.ARV_TIME.slice(2)}`,
            "shipNumber" : e.SHIP_NO,
            "class": e.fares[i].CLASS,
            "subClass" : fares.SUBCLASS,
            "duration": durationFull(e.DEP_DATE, e.ARV_DATE, e.DEP_TIME, e.ARV_TIME),
            "male" : laki,
            "female" : wanita
        }

        localStorage.setItem('v_ship', JSON.stringify(params));
        navigate('/pelni/booking/');

      }


    return(
        <>
            {contextHolder}
            <div className="judul-search mt-4 font-bold text-slate-600">
                PILIH JADWAL
            </div>
            <div className="mt-8">
                <div className="block md:flex justify-between">
                    <div className="flex items-center justify-center space-x-3 xl:space-x-8">
                        <small className="text-xs font-bold text-slate-600">
                            {originName}
                        </small>
                        <div className="bg-blue-500 p-1 rounded-full">
                            < VscArrowSwap className="font-bold text-xs text-white" size={16} />
                        </div>
                        <small className="text-xs font-bold text-slate-600">
                            {destinationName}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {parseDate(startDate)}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {parseDate(endDate)}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {parseInt(laki) + parseInt(wanita)} Penumpang
                        </small>
                    </div>    
                    <div className="mt-4 md:mt-0 flex space-x-4 mr-0 xl:mr-16"> 
                        <Link to='/' className="flex space-x-2 items-center">
                            <IoArrowBackOutline className="text-blue-500" size={16} />
                            <div className="text-blue-500 text-sm font-bold">Kembali</div>
                        </Link>
                        <button onClick={() => setUbahPencarian(prev => !prev)} className="block border p-2 px-4 md:px-4 mr-0 xl:mr-16 bg-blue-500 text-white rounded-md text-xs font-bold">
                            Ubah Pencarian
                        </button>            
                    </div>
                </div>
            <div>
            </div>
            </div>

            {
                    ubahPencarian ? (
                    <div className="mt-8">
                        <Searchpelni />
                    </div>
                    ) : null
                }

            <div>
                {isLoading ? (
                  skeleton.map(() =>(
                    <div className="row mt-4 w-full p-2 pr-0 xl:pr-16">           
                            <Box sx={{ width: "100%" }}>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </Box>
                    </div>
                    ))
                )

                : 

                notFound !== true ? (

                    <div className="row mb-24 w-full p-2 pr-0 xl:pr-16">           
                    {dataSearch.map((e) => ( //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                    <>
                        {e.fares.map((z, i) => (
                            <>

                                <div class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${ e.fares[i]['M_available'] == "0" &&  e.fares[i]['F_available'] == "0" ? 'bg-gray-200' : 'bg-white' } border border-gray-200 rounded-lg shadow-sm  hover:border transition-transform transform hover:scale-105`}>
                                        
                                        {/* desktop cari */}
                                        <div className="hidden xl:block w-full text-gray-700 ">
                                            
                                            <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-8">
                                                <div className="col-span-1 xl:col-span-2">
                                                    <h1 className="text-sm font-bold">{e.SHIP_NAME} </h1>
                                                    <small>{e.fares[i].CLASS?.substring(0,2) == 'EK' ? 'Ekonomi ' + e.fares[i].CLASS?.substring(2) : e.fares[i].CLASS?.substring(0,2) == 'BI' ? e.fares[i].CLASS : 'Eksekutif '  + e.fares[i].CLASS?.substring(3)} Subclass ({e.fares[i].SUBCLASS})</small>
                                                </div>
                                                <div className="flex">
                                                    <div className="">
                                                        <h1 className="mt-4 xl:mt-0 text-sm font-bold">{`${e.DEP_TIME.slice(0, 2)}:${e.DEP_TIME.slice(2)}`}</h1>
                                                        <small>{originName}</small>
                                                    </div>
                                                </div>
                                                < HiOutlineArrowNarrowRight size={24} />
                                                <div>
                                                    <h1 className="text-sm font-bold">{`${e.ARV_TIME.slice(0, 2)}:${e.ARV_TIME.slice(2)}`}</h1>
                                                    <small>{destinationName}</small>
                                                </div>
                                                <div>
                                                    <h1 className="mt-4 xl:mt-0 text-sm font-bold">{duration(e.DEP_DATE, e.ARV_DATE, e.DEP_TIME, e.ARV_TIME)}</h1>
                                                    <small>Langsung</small>
                                                </div>
                                                <div className="">
                                                        <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">Rp.{toRupiah(e.fares[i].FARE_DETAIL.A.TOTAL)}</h1>
                                                        <small className="text-red-500">Infant Rp.{toRupiah(e.fares[i].FARE_DETAIL.I.TOTAL)}</small>
                                                </div>
                                                <div>
                                                    {
                                                        e.fares[i]['M_available'] == "0" &&  e.fares[i]['F_available'] == "0" ? (
                                                        <></>
                                                        ) : (
                                                            <>
                                                                <button onClick={async () => handleSubmit(e, i)} type="button" class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50 font-bold rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2">
                                                                    <div className="text-white font-bold">PILIH</div>
                                                                </button>
                                                            </>
                                                        )
                                                    }
                                                        
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                 {/* mobile cari */}
                                <div onClick={async () => handleSubmit(e, i)} className="cursor-pointer block xl:hidden w-full text-gray-700">
                                    <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                        <div className="flex justify-between">
                                            <div className="col-span-1 xl:col-span-2">
                                                <h1 className="text-xs font-bold">{e.SHIP_NAME}</h1>
                                                <small>{e.fares[i].CLASS?.substring(0,2) == 'EK' ? 'Ekonomi ' + e.fares[i].CLASS?.substring(2) : e.fares[i].CLASS?.substring(0,2) == 'BI' ? e.fares[i].CLASS : 'Eksekutif '  + e.fares[i].CLASS?.substring(3)} Subclass ({e.fares[i].SUBCLASS})</small>
                                            </div>
                                            <div className="text-right">
                                                <h1 className="text-xs font-bold text-blue-500">Rp.{toRupiah(e.fares[0].FARE_DETAIL.A.TOTAL)}</h1>
                                                <small className="text-red-500">Infant Rp.{toRupiah(e.fares[0].FARE_DETAIL.I.TOTAL)}</small>
                                            </div>
                                        </div>
                                        <div className="flex justify-start">
                                            <div className="flex space-x-2 items-start">
                                                <div>
                                                    <h1 className="mt-10 xl:mt-0 text-xs font-bold">{`${e.DEP_TIME.slice(0, 2)}:${e.DEP_TIME.slice(2)}`}</h1>
                                                    <small className="text-gray-400">{originName}</small>
                                                </div>
                                                <div className="w-full mt-12 px-4 border-b-2"></div>
                                                <div className="text-xs">
                                                    <h1 className="text-xs mt-10 xl:mt-0 text-gray-400">{duration(e.DEP_DATE, e.ARV_DATE, e.DEP_TIME, e.ARV_TIME)}</h1>
                                                    <small className="text-gray-400">Langsung</small>
                                                </div>
                                                <div className="w-full mt-12 px-4 border-b-2"></div>
                                                <div>
                                                    <h1 className="mt-10 xl:mt-0 text-xs font-bold">{`${e.ARV_TIME.slice(0, 2)}:${e.ARV_TIME.slice(2)}`}</h1>
                                                    <small className="text-gray-400">{destinationName}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </>
                        ))}
                    </>
                    ))}
                </div>   

                ) :(
                    <div className="row mt-6 mb-24 w-full p-2 pr-0 xl:pr-16">
                            <div className="flex justify-center">
                                    <img src={'/nodata.jpg'} width={350} alt="nodata" />
                                </div>
                            <div className="flex justify-center w-full text-gray-700">
                                <div className="text-gray-500 text-center">
                                    <div>
                                    <div className="text-xl font-semibold">Maaf, sepertinya rute ini belum dibuka kembali</div>
                                    <small>Namun jangan khawatir, masih ada pilihan kendaraan lain yang tetap bisa mengantarkan Anda ke tempat tujuan.</small>
                                    </div>
                                </div>
                            </div>
                    </div> 
                )
            
            }
            </div>
        </>
    )
}