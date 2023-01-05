import React, {useEffect} from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {VscArrowSwap} from 'react-icons/vsc'
import axios from "axios";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {HiOutlineArrowRight, HiOutlineArrowNarrowRight} from 'react-icons/hi'

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
    const child = searchParams.get('child');
    const infant = searchParams.get('infant');

    const token = localStorage.getItem('djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53');
    const navigate = useNavigate();
    
    useEffect(() =>{
        if(token === null || token === undefined){
            alert('Anda harus Login terlebih dahulu!')
            navigate('/train');
        }

        if(origin === null || origin === undefined){
            navigate('/train');
        }

        if(destination === null || destination === undefined){
            navigate('/train');
        }
        
        if(date === null || date === undefined){
            navigate('/train');
        }
        if(productCode === null || productCode === undefined){
            navigate('/train');
        }

        if(kotaBerangkat === null || kotaBerangkat === undefined){
            navigate('/train');
        }
        if(kotaTujuan === null || kotaTujuan === undefined){
            navigate('/train');
        }
        if(stasiunBerangkat === null || stasiunBerangkat === undefined){
            navigate('/train');
        }
        if(stasiunTujuan === null || stasiunTujuan === undefined){
            navigate('/train');
        }

    }, [token, origin, destination, date, productCode, kotaBerangkat, kotaTujuan, stasiunTujuan, stasiunBerangkat]);


    var datee = new Date(date);
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

     const tanggal_keberangkatan_kereta = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;

     const [isLoading, setLoading] = React.useState(false);
     const [notFound, setError] = React.useState(true);
     const skeleton = [1,2,3,4,5,6,7,8,9,10];
     const [dataSearch, setDataSearch] = React.useState([]);

     async function handlerSearch(){
        try {

            setLoading(true);

            const response = await axios.post('http://localhost:5000/travel/train/search', {
                // token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),,
                productCode : "WKAI",
                token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjhkNzNtbmc4OWVkIn0.eyJpc3MiOiJodHRwczpcL1wvYXBpLmZhc3RyYXZlbC5jby5pZCIsImF1ZCI6IkZhc3RyYXZlbEIyQiBDbGllbnQiLCJqdGkiOiI4ZDczbW5nODllZCIsImlhdCI6MTY3MjE5NzI0MywibmJmIjoxNjcyMTk3MzAyLCJleHAiOjE2NzIyMDA4NDIsIm91dGxldElkIjoiRkE0MDMzMjgiLCJwaW4iOiI1MzcyMDEiLCJrZXkiOiJGQVNUUEFZIn0.nMgrQ7qFBMFcdqhABEe8B4x6T5E_Kqb7hQFoXkq-kaA",
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
            child: child,
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
                Pilih Jadwal
            </div>
            <div className="mt-8">
                <div className="block md:flex justify-between">
                    <div className="flex items-center justify-center space-x-3 xl:space-x-8">
                        <div className="text-xs font-bold text-slate-600">
                            {stasiunBerangkat}, {kotaBerangkat}
                        </div>
                        <div className="bg-[#FF9119] p-1 rounded-full">
                            < VscArrowSwap className="font-bold text-white" size={16} />
                        </div>
                        <div className="text-xs font-bold text-slate-600">
                            {stasiunTujuan}, {kotaTujuan}
                        </div>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <div className="hidden md:block text-xs font-bold text-slate-600">
                            {tanggal_keberangkatan_kereta}
                        </div>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <div className="hidden md:block text-xs font-bold text-slate-600">
                            {parseInt(adult) + parseInt(child) + parseInt(infant)} Penumpang
                        </div>
                    </div>
                    <div>
                    <button type="button" class="mt-4 ml-4 md:ml-0 md:mt-0 border border-[#FF9119] focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-2 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                        <div className="text-[#FF9119] text-md font-bold">KEMBALI</div>
                    </button>                         
                    </div>
                </div>
            </div>
            <div>
                {isLoading ? (
                  skeleton.map(() =>(
                    <div className="row mt-6 w-full p-2 pr-0 xl:pr-16">           
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

                    <div className="row mt-6 mb-24 w-full p-2 pr-0 xl:pr-16">           
                    {dataSearch.map((e) => (
                        <div class={`mt-6 w-full p-2 py-4 xl:px-12 xl:py-8 ${ e.seats[0].availability > 0 ? 'bg-white' : 'bg-gray-200' } border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700`}>
        
                        {/* desktop cari */}
        
                        <div className="hidden xl:block w-full text-gray-700">
                            
                            <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                <div className="col-span-1 xl:col-span-2">
                                    <h1 className="text-md font-medium">{e.trainName} </h1>
                                    <small>Class {e.seats[0].class}</small>
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
                                        <h1 className="mt-4 xl:mt-0 text-md font-bold text-[#FF9119]">Rp.{e.seats[0].priceAdult}</h1>
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
    
                        <div className="block xl:hidden w-full text-gray-700">
                            <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                <div className="flex justify-between">
                                    <div className="col-span-1 xl:col-span-2">
                                        <h1 className="text-md font-medium">{e.trainName}</h1>
                                        <small className="text-gray-400">Excecutive class {e.seats[0].class}</small>
                                    </div>
                                    <div className="">
                                        <h1 className="text-md font-medium text-[#FF9119]">Rp. {e.seats[0].priceAdult}</h1>
                                        <small className="text-red-500 ml-2">{e.seats[0].availability} set(s) left</small>
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="flex space-x-2 items-start">
                                        <div>
                                            <h1 className="mt-10 xl:mt-0 text-sm font-medium">{e.departureTime}</h1>
                                            <small className="text-gray-400">{origin}</small>
                                        </div>
                                        <div className="w-full mt-12 px-4 border-b-2"></div>
                                        <div className="text-xs">
                                            <h1 className="mt-10 xl:mt-0 text-gray-400">{e.duration}</h1>
                                            <small className="text-gray-400">Langsung</small>
                                        </div>
                                        <div className="w-full mt-12 px-4 border-b-2"></div>
                                        <div>
                                            <h1 className="mt-10 xl:mt-0 text-sm font-medium">{e.arrivalTime}</h1>
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