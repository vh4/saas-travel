import React, {useEffect} from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {VscArrowSwap} from 'react-icons/vsc'
import axios from "axios";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {HiOutlineArrowRight, HiOutlineArrowNarrowRight} from 'react-icons/hi'
import {IoArrowBackOutline} from "react-icons/io5"
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

export default function Search(){

    const [searchParams, setSearchParams] = useSearchParams();
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const productCode = searchParams.get('productCode');
    const kotaBerangkat = searchParams.get('kotaBerangkat');
    const kotaTujuan = searchParams.get('kotaTujuan');
    const stasiunBerangkat = searchParams.get('stasiunBerangkat');  
    const stasiunTujuan = searchParams.get('stasiunTujuan');
    const adult = searchParams.get('adult');
    const infant = searchParams.get('infant');

    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    const navigate = useNavigate();

    
    useEffect(() =>{
        if(token === null || token === undefined){
            Swal.fire({
                
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                  },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                  },
                icon: 'error',
                title: 'Oops...',
                text: 'Anda harus login terlebih dahulu!',
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: 'Kembali'
              }).then(() => navigate('/'));
        }

        if(origin === null || origin === undefined){
            navigate('/');
        }

        if(destination === null || destination === undefined){
            navigate('/');
        }
        
        if(date === null || date === undefined){
            navigate('/');
        }
        if(productCode === null || productCode === undefined){
            navigate('/');
        }

        if(kotaBerangkat === null || kotaBerangkat === undefined){
            navigate('/');
        }
        if(kotaTujuan === null || kotaTujuan === undefined){
            navigate('/');
        }
        if(stasiunBerangkat === null || stasiunBerangkat === undefined){
            navigate('/');
        }
        if(stasiunTujuan === null || stasiunTujuan === undefined){
            navigate('/');
        }

    }, [token, origin, destination, date, productCode, kotaBerangkat, kotaTujuan, stasiunTujuan, stasiunBerangkat]);


    var datee = new Date(date);
    var tahun = datee.getFullYear();
    var bulan = datee.getMonth();
    var hari = datee.getDay();
    var tanggal = datee.getDate();

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }


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

     const tanggal_keberangkatan_kereta = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;

     const [isLoading, setLoading] = React.useState(false);
     const [notFound, setError] = React.useState(true);
     const skeleton = [1,2,3,4,5,6,7,8,9,10];
     const [dataSearch, setDataSearch] = React.useState([]);

     async function handlerSearch(){
        try {

            setLoading(true);

            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/search`, {
                // token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),,
                productCode : "WKAI",
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
                origin:origin,
                destination:destination,
                date:date
            });

            if(response.data.rc.length < 1){
                setError(true);
                setLoading(false);
                console.log("benarrrr")
            }
    
            else if(response.data.rc !== "00" || response.data.rc === undefined){
                setError(true);
                setLoading(false);
            }

            else if(response.data === undefined){
                setError(true);
                setLoading(false);
            }
            
            else{

                setError(false);
                setDataSearch(response.data.data);
                setLoading(false);
            }
            
        } catch (error) {
            console.log(error);
            setError(true);
            setLoading(false);
        }

    }

    function bookingHandlerDetail(trainNumber){
        const detailBooking = dataSearch.filter(e => e.trainNumber === trainNumber);

        console.log(detailBooking);

        const detailKereta = [{
            berangkat_id_station: origin,
            tujuan_id_station: destination,
            berangkat_nama_kota: kotaBerangkat,
            tujuan_nama_kota: kotaTujuan,
            adult: adult,
            infant:infant,
            stasiunBerangkat:stasiunBerangkat,
            stasiunTujuan:stasiunTujuan,
        }];

        localStorage.setItem(trainNumber + "_booking", JSON.stringify(detailBooking));
        localStorage.setItem(trainNumber + "_detailTrain", JSON.stringify(detailKereta));

         navigate('/train/booking/' + trainNumber)
        
    }

    useEffect(() =>{
        handlerSearch();
     }, []);


    return(
        <>
            <div className="judul-search mt-4 font-bold text-slate-600">
                PILIH JADWAL
            </div>
            <div className="mt-8">
                <div className="block md:flex justify-between">
                    <div className="flex items-center justify-center space-x-3 xl:space-x-8">
                        <small className="text-xs font-bold text-slate-600">
                            {stasiunBerangkat}, {kotaBerangkat}
                        </small>
                        <div className="bg-[#FF9119] p-1 rounded-full">
                            < VscArrowSwap className="font-bold text-xs text-white" size={16} />
                        </div>
                        <small className="text-xs font-bold text-slate-600">
                            {stasiunTujuan}, {kotaTujuan}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {tanggal_keberangkatan_kereta}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {parseInt(adult) + parseInt(infant)} Penumpang
                        </small>
                    </div>    
                    <div> 
                    <Link to='/' className="flex space-x-2 items-center mr-0 xl:mr-16">
                        <IoArrowBackOutline className="text-[#FF9119]" size={16} />
                        <div className="text-[#FF9119] text-sm font-bold">Kembali</div>
                    </Link>                 
                    </div>
                </div>
                <div className="flex justify-between mt-6">
                    <div className="flex items-center space-x-2 text-slate-600 text-xs font-bold">
                        <div className="hidden md:block">FILTER : </div>
                        <button className="block border p-2 px-2 md:px-4">
                            HARGA
                        </button>
                        <button className="block border p-2 px-2 md:px-4">
                            WAKTU
                        </button>
                        <button className="block border p-2 px-2 md:px-4">
                            KELAS
                        </button>
                    </div>
                    <div>
                        <button className="block border p-2 px-2 md:px-4 mr-0 xl:mr-16 text-slate-600 text-xs font-bold">
                            URUTKAN
                        </button>
                    </div>
                </div>
            </div>
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
                    {dataSearch.map((e) => (
                        <div class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${ e.seats[0].availability > 0 ? 'bg-white' : 'bg-gray-200' } border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 hover:border hover:border-black transition-transform transform hover:scale-105`}>
        
                        {/* desktop cari */}
        
                        <div className="hidden xl:block w-full text-gray-700 ">
                            
                            <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                <div className="col-span-1 xl:col-span-2">
                                    <h1 className="text-md font-medium">{e.trainName} </h1>
                                    <small>{e.seats[0].grade === 'E' ? 'Eksekutif' : e.seats[0].grade === 'B' ? 'Bisnis' : 'Ekonomi'} Class ({e.seats[0].class})</small>
                                </div>
                                <div className="flex">
                                    <div className="">
                                        <h1 className="mt-4 xl:mt-0 text-md font-medium">{e.departureTime}</h1>
                                        <small>{kotaBerangkat} ({origin})</small>
                                    </div>
                                    < HiOutlineArrowNarrowRight size={24} />
                                </div>
                                <div>
                                    <h1 className="text-md font-medium">{e.arrivalTime}</h1>
                                    <small>{kotaTujuan} ({destination})</small>
                                </div>
                                <div>
                                    <h1 className="mt-4 xl:mt-0 text-md font-medium">{e.duration}</h1>
                                    <small>Langsung</small>
                                </div>
                                <div className="">
                                        <h1 className="mt-4 xl:mt-0 text-md font-bold text-[#FF9119]">Rp.{toRupiah(e.seats[0].priceAdult)}</h1>
                                        <small className="text-red-500">{e.seats[0].availability} set(s) left</small>
                                </div>
                                <div>
                                    {e.seats[0].availability > 0 ? (
                                        <button type="button" onClick={() => bookingHandlerDetail(e.trainNumber)} class="mt-4 xl:mt-0 text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                                            <div className="text-white font-bold">PILIH</div></button>
                                        
                                    ) : ''}
                                </div>
                            </div>
                        </div>
    
                        <div>
    
                        {/* mobile cari */}
    
                        <div onClick={() => bookingHandlerDetail(e.trainNumber)} className="cursor-pointer block xl:hidden w-full text-gray-700">
                            <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                <div className="flex justify-between">
                                    <div className="col-span-1 xl:col-span-2">
                                        <h1 className="text-xs font-bold">{e.trainName}</h1>
                                        <small className="text-gray-400">Excecutive class {e.seats[0].class}</small>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-xs font-bold text-[#FF9119]">Rp. {toRupiah(e.seats[0].priceAdult)}</h1>
                                        <small className="text-red-500">{e.seats[0].availability} set(s)</small>
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="flex space-x-2 items-start">
                                        <div>
                                            <h1 className="mt-10 xl:mt-0 text-xs font-bold">{e.departureTime}</h1>
                                            <small className="text-gray-400">{origin}</small>
                                        </div>
                                        <div className="w-full mt-12 px-4 border-b-2"></div>
                                        <div className="text-xs">
                                            <h1 className="mt-10 xl:mt-0 text-gray-400">{e.duration}</h1>
                                            <small className="text-gray-400">Langsung</small>
                                        </div>
                                        <div className="w-full mt-12 px-4 border-b-2"></div>
                                        <div>
                                            <h1 className="mt-10 xl:mt-0 text-xs font-bold">{e.arrivalTime}</h1>
                                            <small className="text-gray-400">{destination}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
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
                                    <h1>Maaf, sepertinya rute ini belum dibuka kembali</h1>
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