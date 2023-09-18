import React, {useEffect, useRef, useState} from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {VscArrowSwap} from 'react-icons/vsc'
import axios from "axios";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {HiOutlineArrowNarrowRight} from 'react-icons/hi'
import {IoArrowBackOutline} from "react-icons/io5"
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { createTheme } from "@mui/material/styles";
import { MdOutlineLuggage} from "react-icons/md"
import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import {IoMdTimer} from 'react-icons/io'
import SearchPlane from "./SearchPlane";
import { Progress } from 'rsuite';
import { Alert, Space, Spin } from 'antd';
import {Modal, Button} from 'antd'

export default function Search(){

    let v_search = localStorage.getItem('v-search') ? JSON.parse(localStorage.getItem('v-search')) : null;
    v_search = v_search !== undefined && v_search !== null ? v_search : null;
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoadingPilihTiket, setisLoadingPilihTiket] = useState();
    const [percent, setPercent] = useState(0);
    const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API));
    const [err, setErr] = useState(false);

    useEffect(() => {
        if(token === null || token === undefined){
            setErr(true);
        }

        if(v_search == null || v_search == undefined){
            setErr(true);
        }

    }, [token, v_search]);

    let departure, departureName, arrival, arrivalName, departureDate, returnDate, 
    isLowestPrice, adult, child, infant;

    if(v_search){

        departure = v_search.departure ?  v_search.departure : null;
        departureName = v_search.departureName ? v_search.departureName : null;
   
        arrival = v_search.arrival ? v_search.arrival : null;
        arrivalName = v_search.arrivalName ? v_search.arrivalName : null;
   
        departureDate = v_search.departureDate ? v_search.departureDate : null;
        returnDate = v_search.returnDate ? v_search.returnDate : null;
        isLowestPrice = v_search.isLowestPrice ? v_search.isLowestPrice : null;
        adult = v_search.adult ? v_search.adult : 0;
        child = v_search.child ? v_search.child : 0;
        infant = v_search.infant ? v_search.infant : 0;

    }else{

     departure = searchParams.get('departure') ?  searchParams.get('departure') : null;
     departureName = searchParams.get('departureName') ? searchParams.get('departureName') : null;

     arrival = searchParams.get('arrival') ? searchParams.get('arrival') : null;
     arrivalName = searchParams.get('arrivalName') ? searchParams.get('arrivalName') : null;

     departureDate = searchParams.get('departureDate') ?  searchParams.get('departureDate') : null;
     returnDate = searchParams.get('returnDate') ? searchParams.get('returnDate') : null;
     isLowestPrice = searchParams.get('isLowestPrice') ? searchParams.get('isLowestPrice') : null;
     adult = searchParams.get('adult') ? searchParams.get('adult') : 0;  
     child = searchParams.get('child') ? searchParams.get('child') : 0;
     infant = searchParams.get('infant') ? searchParams.get('infant') : 0;

    }

    const navigate = useNavigate();

    const [ubahPencarian, setUbahPencarian] = useState(false);

    var datee = new Date(departureDate);
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

    const tanggal_keberangkatan = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;


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
     const [detailTiket, setDetailTiket] = React.useState(null);
     const [detailHarga, setDetailHarga] = React.useState(null);

     useEffect(() => {
        handlerSearch();
     }, []);
    const ListKodePesawat = ['TPQZ', 'TPQG', 'TPXN', 'TPGA', 'TPJQ', 'TPKP', 'TPJT', 'TPSJ', 'TPTR', 'TPMV', 'TPTN']

    const handlerSearch = async () => {
        
        let allData = []
        setLoading(true);
        var x = 0;

        for (let e of ListKodePesawat) {
        
        let response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/flight/search`, {
            airline: e,
            departure: departure,
            arrival: arrival,
            departureDate: departureDate,
            returnDate: returnDate,
            isLowestPrice: isLowestPrice,
            adult: adult,
            child: child,
            infant: infant,
            token: token
        })
        
        if(response.data.data !== undefined){
            x = x + 15;
            setTimeout(() => {
                setPercent(x + 30);
            });
            setDataSearch(dataSearch => [...dataSearch, ...response.data.data]);
            setLoading(false);
            setError(false);
            x++;

        }

    }

    setLoading(false);

    if(percent < 90){
        setPercent(100);
    }

}


      const [isLoadingPilih, setIsLoadingPilih] = useState(false);


      async function bookingHandlerDetail(e,i){

        e.preventDefault();
        setisLoadingPilihTiket(`true-${i}`);

        let filterDataSearching = dataSearch.filter((_, index) => index === i);

        let detailKereta = {
            "airline" : filterDataSearching[0].airlineCode,
            "departure" : filterDataSearching[0].classes[0][0].departure,
            "arrival" : filterDataSearching[0].classes[0][0].arrival,
            "departureDate" : filterDataSearching[0].departureDate,
            "returnDate" :  "",
            "adult" : adult,
            "child" : child,
            "infant" : infant,
            "token":token,
        };

        // console.log(JSON.stringify(detailKereta));

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/flight/fare`, detailKereta) 

        const forBooking = {
            "airline" : filterDataSearching[0].airlineCode,
            "departure" : departure,
            "arrival" : arrival,
            "departureDate" : filterDataSearching[0].departureDate,
            "returnDate" :  "",
            "adult" : adult,
            "child" : child,
            "infant" : infant,
            "seats" : [
                filterDataSearching[0].classes[0][0].seat
            ],
        }

        if(response.data.rc === '00'){
            const next = [];
            const lenghtArr = filterDataSearching[0].classes.length;

        
            for(var i=0; i<lenghtArr; i++){
                                  
                next.push({
                    "airline" : filterDataSearching[0].detailTitle[i].flightCode,
                    "airlineName":filterDataSearching[0].detailTitle[i].flightName,
                    "airlineIcon":filterDataSearching[0].detailTitle[i].flightIcon,
                    "departure" : filterDataSearching[0].classes[i][0].departure,
                    "arrival" : filterDataSearching[0].classes[i][0].arrival,
                    "departureName" : filterDataSearching[0].classes[i][0].departureName,
                    "arrivalName" : filterDataSearching[0].classes[i][0].arrivalName,
                    "departureDate" : filterDataSearching[0].classes[i][0].departureDate,
                    "arrivalDate" : filterDataSearching[0].classes[i][0].arrivalDate,
                    "departureTime" : filterDataSearching[0].classes[i][0].departureTime,
                    "arrivalTime" : filterDataSearching[0].classes[i][0].arrivalTime,
                    "returnDate" :  "",
                    "adult" : adult,
                    "child" : child,
                    "infant" : infant,
                    "seats" : [
                        filterDataSearching[0].classes[i][0].seat
                    ],
                    "priceTotal": filterDataSearching[0].classes[i][0].price,
                })
            }

            let randomNavigateNumber = window.crypto.randomUUID();
                randomNavigateNumber = randomNavigateNumber.split("-").join("");
            
            setisLoadingPilihTiket(`false-${i}`);


            localStorage.setItem(randomNavigateNumber + "_flight", JSON.stringify(next));
            localStorage.setItem(randomNavigateNumber + "_flight_forBooking", JSON.stringify(forBooking));  

            navigate(`/flight/booking/${randomNavigateNumber}`);

        }else{
            const next = Array();
            const lenghtArr = filterDataSearching[0].classes.length;

            for(var i=0; i<lenghtArr; i++){
                next.push({
                    "airline" : filterDataSearching[0].detailTitle[i].flightCode,
                    "airlineName":filterDataSearching[0].detailTitle[i].flightName,
                    "airlineIcon":filterDataSearching[0].detailTitle[i].flightIcon,
                    "departure" : filterDataSearching[0].classes[i][0].departure,
                    "arrival" : filterDataSearching[0].classes[i][0].arrival,
                    "departureName" : filterDataSearching[0].classes[i][0].departureName,
                    "arrivalName" : filterDataSearching[0].classes[i][0].arrivalName,
                    "departureDate" : filterDataSearching[0].classes[i][0].departureDate,
                    "arrivalDate" : filterDataSearching[0].classes[i][0].arrivalDate,
                    "departureTime" : filterDataSearching[0].classes[i][0].departureTime,
                    "arrivalTime" : filterDataSearching[0].classes[i][0].arrivalTime,
                    "returnDate" :  "",
                    "adult" : adult,
                    "child" : child,
                    "infant" : infant,
                    "seats" : [
                        filterDataSearching[0].classes[i][0].seat
                    ],
                    "priceTotal": filterDataSearching[0].classes[i][0].price,
                })
            }

            let randomNavigateNumber = window.crypto.randomUUID();
            randomNavigateNumber = randomNavigateNumber.split("-").join("");

            setisLoadingPilihTiket(`false-${i}`);

            localStorage.setItem(randomNavigateNumber + "_flight", JSON.stringify(next)); 
            localStorage.setItem(randomNavigateNumber + "_flight_forBooking", JSON.stringify(forBooking));   
            navigate(`/flight/booking/${randomNavigateNumber}`);
        
        }
    }

    return(
        <>
        {err !== true ? (
            <>
            <div className="judul-search mt-4 font-bold text-slate-600">
                PILIH JADWAL
            </div>
                <div className="mt-8">
                <div className="block md:flex justify-between">
                    <div className="flex items-center justify-start space-x-3 xl:space-x-4">
                        <small className="text-xs font-bold text-slate-600">
                            {departureName} ({departure})
                        </small>
                        <div className="bg-blue-500 p-1 rounded-full">
                            < VscArrowSwap className="font-bold text-xs text-white" size={16} />
                        </div>
                        <small className="text-xs font-bold text-slate-600">
                            {arrivalName} ({arrival})
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {tanggal_keberangkatan}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {parseInt(adult) + parseInt(child) + parseInt(infant)} Penumpang
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
            {percent === 0 || percent === 100 ?  null :
            (
            <div className="mt-4">
                <Progress.Line percent={percent} status="active" showInfo={false} />
                <div className="mt-8">
                    <Spin tip="Loading">
                        <div className="content" />
                    </Spin>
                </div>
            </div>
            )
                
        }
            {
                    ubahPencarian ? (
                    <div className="mt-8">
                        <SearchPlane />
                    </div>
                    ) : null
                }
            <div>
                {isLoading ? (
                  skeleton.map(() =>(
                    <div className="row mt-8 w-full p-2 pr-0 xl:pr-16">           
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

                    <div className="row mb-24 w-full p-2 pr-0">              
                    {dataSearch.map((e, index) => ( //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                        <>
                        {e.classes[0][0].price !== 0 ? (
                            <div class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 bg-white border border-gray-200 rounded-md shadow-sm hover:border hover:border-gray-100 transition-transform transform hover:scale-105`}>
                            {/* desktop cari */}
                            <div className="hidden xl:block w-full text-gray-700 ">
                                
                                <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-10 gap-4">
                                    <div className="col-span-1 md:col-span-2">
                                        <h1 className="text-sm font-bold">{e.airlineName} </h1>
                                        <div className="text-sm">
                                            {e.classes[0][0].flightCode}
                                        </div>
                                        <div>
                                            <img src={e.airlineIcon} width={60} alt="image.png" />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="">
                                            <MdOutlineLuggage size={32} />
                                            <div className="text-xs text-gray-500">Bagasi</div>
                                            <div className="text-xs text-gray-500">20 Kg</div>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="">
                                            <h1 className="mt-4 xl:mt-0 text-sm font-medium">{e.detailTitle[0].depart}</h1>
                                            <small>{departure}</small>
                                        </div>
                                    </div>
                                    < HiOutlineArrowNarrowRight size={24} />
                                    <div>
                                        <h1 className="text-sm font-medium">{e.detailTitle[0].arrival}</h1>
                                        <small>{arrival}</small>
                                    </div>
                                    <div>
                                        <h1 className="mt-4 xl:mt-0 text-sm font-medium">{e.duration}</h1>
                                        <small>{e.isTransit === true ? `${e.classes.length - 1}x Transit` : 'Langsung'}</small>
                                    </div>
                                    <div className="">
                                            <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">Rp.{toRupiah(e.classes[0][0].price)}</h1>
                                            <small className="text-red-500">{e.classes[0][0].availability} set(s) left</small>
                                    </div>
                                    <div className="flex justify-center col-span-1 md:col-span-2">
                                        {e.classes[0][0].availability > 0 ? (
                                            <div>
                                                <button type="button" onClick={(e) => bookingHandlerDetail(e, index)}  class={`${isLoadingPilihTiket == 'true-' + index   ? 'py-6 xl:px-16' : 'py-3.5 px-10 md:px-10 xl:px-12 2xl:px-14'} relative xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-2 rounded-md focus:outline-none focus:ring-blue-500/50 font-medium text-sm  text-center inline-flex items-center  mr-2 mb-2`}>
                                                    {isLoadingPilihTiket == 'true-' + index ? (
                                                        <>
                                                            <img className="absolute right-8" src="/load.gif"  width={60} alt="laoding"/>
                                                        </>
                                                    ) : (
                                                        <div className="text-white font-bold">PILIH</div>
                                                    )}
                                                </button>
                                            </div>
                                            
                                        ) : ''}
                                    </div>
                                </div>
                                <div className="flex space-x-8 justify-center items-center">
                                        <div onClick={() => detailTiket == `open-${index}` ? setDetailTiket(`close-${index}`) : setDetailTiket(`open-${index}`)} className="text-sm text-blue-500 cursor-pointer font-bold">Detail Penerbangan</div>
                                        <div onClick={() => detailHarga == `harga-open-${index}` ? setDetailHarga(`harga-close-${index}`) : setDetailHarga(`harga-open-${index}`)} className="text-sm text-blue-500 cursor-pointer font-bold">Detail Harga</div>
                                </div>
                            </div>

                            {/* desktop detail tiket */}

                            {detailTiket == `open-${index}` ? (
                                <>
                                {e.isTransit === true ? e.classes.map((x, i) => (
                                    <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                    <div className="mt-8">
                                            <h1 className="text-sm font-bold">{e.detailTitle[i].flightName} </h1>
                                            <div className="text-sm">
                                                {e.detailTitle[i].flightCode}
                                            </div>
                                            <div>
                                                <img src={e.detailTitle[i].flightIcon} width={60} alt="image.png" />
                                            </div>
                                    </div>
                                    <div className="flex flex-col space-y-28 text-gray-500">
                                        <div className="">
                                            <div className="text-sm font-bold">{x[0].departureTime}</div>
                                            <div className="text-xs">{x[0].departureDate}</div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm font-bold">{x.arrivalTime}</div>
                                            <div className="text-xs">{x[0].arrivalDate}</div>
                                        </div>
                                    </div>
                                    <div>
                                    <Timeline
                                        sx={{
                                            [`& .${timelineItemClasses.root}:before`]: {
                                            flex: 0,
                                            padding: 0,
                                            },
                                        }}
                                    >
                                        <TimelineItem>
                                            <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent sx={{ py: '16px', px: 2 }}>
                                            <Typography sx={{fontSize:12}} component="span">
                                                {x[0].departure}
                                            </Typography>
                                            <Typography sx={{fontSize:12, color:"#6b7280"}}>{x[0].departureName}</Typography>
                                            </TimelineContent>                                     
                                            </TimelineItem>
                                        <TimelineItem>
                                            <TimelineDot sx={{backgroundColor:"orange"}}>
                                                <IoMdTimer />
                                            </TimelineDot>
                                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                            <Typography sx={{fontSize:12, color:"#6b7280"}} component="span">
                                                {x[0].duration}
                                            </Typography>
                                            </TimelineContent>                                    
                                            </TimelineItem>
                                        <TimelineItem>
                                        <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot />
                                        </TimelineSeparator>
                                            <TimelineContent sx={{  px: 2 }}>
                                            <Typography sx={{fontSize:12}} component="span">
                                            {x[0].arrival}
                                            </Typography>
                                            <Typography sx={{fontSize:12, color:"#6b7280"}}>{x[0].arrivalName}</Typography>
                                            </TimelineContent>                                     
                                            </TimelineItem>
                                        </Timeline>
                                    </div>
                                        <div className="mt-4 text-gray-500">
                                            <div className="items-center">
                                                <div><MdOutlineLuggage size={46} /></div>
                                                <div className="text-xs"><div>Berat Bagasi maks. <span className="font-bold">20 kg</span></div><div className="mt-1">Jika {">"} 20 kg akan dikenakan biaya.</div></div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                    <div className="mt-8">
                                            <h1 className="text-sm font-bold">{e.airlineName} </h1>
                                            <div className="text-sm">
                                                {e.classes[0][0].flightCode}
                                            </div>
                                            <div>
                                                <img src={e.airlineIcon} width={60} alt="image.png" />
                                            </div>
                                    </div>
                                    <div className="flex flex-col space-y-32 text-gray-500">
                                        <div className="">
                                            <div className="text-sm font-bold">{e.classes[0][0].departureTime}</div>
                                            <div className="text-xs">{e.classes[0][0].departureDate}</div>
                                        </div>
                                        <div className="">
                                            <div className="text-sm font-bold">{e.classes[0][0].arrivalTime}</div>
                                            <div className="text-xs">{e.classes[0][0].arrivalDate}</div>
                                        </div>
                                    </div>
                                    <div>
                                    <Timeline
                                        sx={{
                                            [`& .${timelineItemClasses.root}:before`]: {
                                            flex: 0,
                                            padding: 0,
                                            },
                                        }}
                                    >
                                        <TimelineItem>
                                            <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent sx={{ py: '16px', px: 2 }}>
                                            <Typography sx={{fontSize:12}} component="span">
                                                {e.classes[0][0].departure}
                                            </Typography>
                                            <Typography sx={{fontSize:12, color:"#6b7280"}}>{e.classes[0][0].departureName}</Typography>
                                            </TimelineContent>                                     
                                            </TimelineItem>
                                        <TimelineItem>
                                            <TimelineDot sx={{backgroundColor:"orange"}}>
                                                <IoMdTimer />
                                            </TimelineDot>
                                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                            <Typography sx={{fontSize:12, color:"#6b7280"}} component="span">
                                                {e.classes[0][0].duration}
                                            </Typography>
                                            </TimelineContent>                                    
                                            </TimelineItem>
                                        <TimelineItem>
                                        <TimelineSeparator>
                                        <TimelineConnector />
                                        <TimelineDot />
                                        </TimelineSeparator>
                                            <TimelineContent sx={{  px: 2 }}>
                                            <Typography sx={{fontSize:12}} component="span">
                                            {e.classes[0][0].arrival}
                                            </Typography>
                                            <Typography sx={{fontSize:12, color:"#6b7280"}}>{e.classes[0][0].arrivalName}</Typography>
                                            </TimelineContent>                                     
                                            </TimelineItem>
                                        </Timeline>
                                    </div>
                                        <div className="mt-4 text-gray-500">
                                            <div className="items-center">
                                                <div><MdOutlineLuggage size={46} /></div>
                                                <div className="text-xs"><div>Berat Bagasi maks. <span className="font-bold">20 kg</span></div><div className="mt-1">Jika {">"} 20 kg akan dikenakan biaya.</div></div>
                                            </div>
                                        </div>
                                    </div>                         
                                )}
                                </>
                            ) : null}
                            {/* end detail desltop tiket */}

                            {/* desktop detail harga */}
                            {detailHarga == `harga-open-${index}` ? (
                                <>
                                { e.isTransit === true ? (
                                <>
                                {e.classes.map((z, w) => (
                                    <>
                                    
                                    <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                    <div className="mt-8">
                                            <h1 className="text-sm font-bold">{e.detailTitle[w].flightName}  </h1>
                                            <div className="text-sm">
                                            {e.detailTitle[w].flightCode} 
                                            </div>
                                            <div>
                                                <img src={e.detailTitle[w].flightIcon}  width={60} alt="image.png" />
                                            </div>
                                    </div>
                                        <div className="mt-8">
                                            <div className="text-xs text-gray-500">
                                                <div className="mt-1 flex space-x-16">
                                                    <div>  Harga Tiket Adult  ({adult}x) </div>
                                                    <div className="pl-1">  Rp.{toRupiah(z[0].price*adult)}</div>
                                                </div>
                                                {child > 0 ? (
                                                <div className="mt-1 flex space-x-16">
                                                    <div>  Harga Tiket Child  ({child}x) </div>
                                                    <div className="pl-1">  Tergantung jenis maskapai yang dipilih.</div>
                                                </div>
                                                ) : null}
                                                    {infant > 0 ? (
                                                <div className="mt-1 flex space-x-16">
                                                    <div>Harga Tiket Infant ({infant}x) </div>
                                                    <div>Tergantung jenis maskapai yang dipilih.</div>
                                                </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                ))}
                                </>
                            ) : (
                                <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                    <div className="mt-8">
                                            <h1 className="text-sm font-bold">{e.airlineName} </h1>
                                            <div className="text-sm">
                                                {e.classes[0][0].flightCode}
                                            </div>
                                            <div>
                                                <img src={e.airlineIcon} width={60} alt="image.png" />
                                            </div>
                                    </div>
                                    <div className="mt-8">
                                        <div className="text-xs text-gray-500">
                                            <div className="mt-1 flex space-x-16">
                                                <div>  Harga Tiket Adult  ({adult}x) </div>
                                                <div className="pl-1">  Rp.{toRupiah(e.classes[0][0].price*adult)}</div>
                                            </div>
                                            {child > 0 ? (
                                            <div className="mt-1 flex space-x-16">
                                                <div>  Harga Tiket Child  ({child}x) </div>
                                                <div className="pl-1">  Tergantung jenis maskapai yang dipilih.</div>
                                            </div>
                                            ) : null}
                                                {infant > 0 ? (
                                            <div className="mt-1 flex space-x-16">
                                                <div>Harga Tiket Infant ({infant}x) </div>
                                                <div>Tergantung jenis maskapai yang dipilih.</div>
                                            </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) }
                                </>
                            ) : null}

                            {/* end desktop detail harga */}

                            <div>

                            {/* mobile cari */}
                            <div type="button" onClick={(e) => bookingHandlerDetail(e, index)}  className="cursor-pointer block xl:hidden w-full text-gray-700">
                                <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                    <div className="flex justify-between">
                                        <div className="col-span-1 xl:col-span-2">
                                            <h1 className="text-xs font-bold">{e.airlineName}</h1>
                                            <img src={e.airlineIcon} width={60} alt="image.png" />
                                        </div>
                                        <div className="text-right">
                                            <h1 className="text-xs font-bold text-blue-500">Rp.{toRupiah(e.classes[0][0].price)}</h1>
                                            <small className="text-red-500">{e.classes[0][0].availability} set(s)</small>
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="flex space-x-2 items-start">
                                            <div>
                                                <h1 className="mt-4 xl:mt-0 text-sm font-medium">{e.detailTitle[0].depart}</h1>
                                                <small>{e.detailTitle[0].origin}</small>
                                            </div>
                                            <div className="w-full mt-12 px-4 border-b-2"></div>
                                            <div className="text-xs">
                                                <div className="mt-10  xl:mt-0 text-gray-400">{e.detailTitle[0].durationDetail}</div>
                                                <small className="text-gray-400">{e.isTransit}</small>
                                            </div>
                                            <div className="w-full mt-12 px-4 border-b-2"></div>
                                            <div>
                                                <h1 className="mt-4 xl:mt-0 text-sm font-medium">{e.detailTitle[0].arrival}</h1>
                                                <small>{e.detailTitle[0].destination}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                        ) : null}
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
                                    <div className="text-lg font-bold">Maaf, sepertinya rute ini belum dibuka kembali</div>
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
        :
        (
    <Modal.error
            title="Error!"
            open={true}
            content= 'Silahkan anda login terlebih dahulu.'
            footer={[
                (
                <div className="flex justify-end mt-4">
                    <Button key="submit" type="primary" className='bg-blue-500' onClick={() => window.location = '/'}>
                         Kembali ke home
                    </Button>,
                </div>
                )
              ]}
        >
    </Modal.error>
        )
    }
    </>
    )
}