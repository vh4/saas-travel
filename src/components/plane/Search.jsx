import React, {useEffect, useRef, useState} from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import {VscArrowSwap} from 'react-icons/vsc'
import axios from "axios";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {HiOutlineArrowNarrowRight} from 'react-icons/hi'
import {IoArrowBackOutline} from "react-icons/io5"
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { createTheme } from "@mui/material/styles";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp, MdOutlineLuggage} from "react-icons/md"
import moment from "moment"
import Timeline from '@mui/lab/Timeline';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import {IoMdTimer} from 'react-icons/io'

export default function Search(){

    const theme = createTheme({
        typography: {
          // In Chinese and Japanese the characters are usually larger,
          // so a smaller fontsize may be appropriate.
          fontSize: 8,
        },
      });
      

    const [searchParams, setSearchParams] = useSearchParams();
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const isLowestPrice = searchParams.get('isLowestPrice');
    const adult = searchParams.get('adult');  
    const child = searchParams.get('child');
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

        if(departure === null || departure === undefined){
            navigate('/');
        }

        if(arrival === null || arrival === undefined){
            navigate('/');
        }
        
        if(departureDate === null || departureDate === undefined){
            navigate('/');
        }
        if(returnDate === null || returnDate === undefined){
            navigate('/');
        }

        if(isLowestPrice === null || isLowestPrice === undefined){
            navigate('/');
        }
        if(adult === null || adult === undefined){
            navigate('/');
        }
        if(child === null || child === undefined){
            navigate('/');
        }
        if(infant === null || infant === undefined){
            navigate('/');
        }

    }, [token, departure, arrival, departureDate, returnDate, isLowestPrice, adult, child, infant]);


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

    function toRupiah(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
        return rupiah.split('',rupiah.length-1).reverse().join('');
    }

     const tanggal_keberangkatan_kereta = hari + ', ' + tanggal + ' ' + bulan + ' ' + tahun;

     const [isLoading, setLoading] = React.useState(false);
     const [notFound, setError] = React.useState(true);
     const skeleton = [1,2,3,4,5,6,7,8,9,10];
     const [dataSearch, setDataSearch] = React.useState();
     const [detailTiket, setDetailTiket] = React.useState(null);
     const [detailHarga, setDetailHarga] = React.useState(null);

     useEffect(() => {
        handlerSearch();
     }, []);
    const ListKodePesawat = ['TPQZ', 'TPQG', 'TPXN', 'TPGA', 'TPJQ', 'TPKP', 'TPJT', 'TPSJ', 'TPTR', 'TPMV', 'TPTN']

    const handlerSearch = async () => {
        
        let allData = []
        setLoading(true);

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
                allData.push(response.data.data)
            }
        }
        setLoading(false);
        let dataHasilParsing = [].concat(...allData);

        if(dataHasilParsing === null || dataHasilParsing === undefined || dataHasilParsing.length === 0){
            setError(true);
            setLoading(false);
        }else{
            setError(false);
            setDataSearch(dataHasilParsing);
        }
    }

    const [isLoadingPilih, setIsLoadingPilih] = useState(false);


      async function bookingHandlerDetail(e,i){

        e.preventDefault();
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
            "seats" : [
                filterDataSearching[0].classes[0][0].seat
            ],
            "token":token,
        };

        // console.log(JSON.stringify(detailKereta));

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/flight/fare`, detailKereta) 

        if(response.data.rc === '00'){
            const next = {
                "airline" : filterDataSearching[0].airlineCode,
                "airlineName":filterDataSearching[0].airlineName,
                "airlineIcon":filterDataSearching[0].airlineIcon,
                "departure" : filterDataSearching[0].classes[0][0].departure,
                "arrival" : filterDataSearching[0].classes[0][0].arrival,
                "departureName" : filterDataSearching[0].classes[0][0].departureName,
                "arrivalName" : filterDataSearching[0].classes[0][0].arrivalName,
                "departureDate" : filterDataSearching[0].departureDate,
                "arrivalDate" : filterDataSearching[0].arrivalDate,
                "departureTime" : filterDataSearching[0].classes[0][0].departureTime,
                "arrivalTime" : filterDataSearching[0].classes[0][0].arrivalTime,
                "returnDate" :  "",
                "adult" : adult,
                "child" : child,
                "infant" : infant,
                "seats" : [
                    filterDataSearching[0].classes[0][0].seat
                ],
                "priceTotal": response.data.data.price,
                "baggage": response.data.data.baggage,
            }

            let randomNavigateNumber = crypto.randomUUID();
                randomNavigateNumber = randomNavigateNumber.split("-").join("");
            
            localStorage.setItem(randomNavigateNumber + "_flight", JSON.stringify(next));  
            navigate(`/flight/booking/${randomNavigateNumber}`);
        }else{
            console.log(response.data);
        }
    }

    return(
        <>
            <div className="judul-search mt-4 font-bold text-slate-600">
                PILIH JADWAL
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
                    {dataSearch.map((e, index) => ( //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                        <>
                        {e.classes[0][0].price !== 0 ? (
                            <div class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 bg-white border border-gray-200 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:border hover:border-gray-100 transition-transform transform hover:scale-105`}>
                            {/* desktop cari */}
                            <div className="hidden xl:block w-full text-gray-700 ">
                                
                                <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-10 gap-4">
                                    <div className="col-span-1 md:col-span-2">
                                        <h1 className="text-md font-bold">{e.airlineName} </h1>
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
                                            <h1 className="mt-4 xl:mt-0 text-md font-medium">{e.detailTitle[0].depart}</h1>
                                            <small>{e.detailTitle[0].origin}</small>
                                        </div>
                                    </div>
                                    < HiOutlineArrowNarrowRight size={24} />
                                    <div>
                                        <h1 className="text-md font-medium">{e.detailTitle[0].arrival}</h1>
                                        <small>{e.detailTitle[0].destination}</small>
                                    </div>
                                    <div>
                                        <h1 className="mt-4 xl:mt-0 text-md font-medium">{e.detailTitle[0].durationDetail}</h1>
                                        <small>{e.isTransit === true ? `${e.classes.length - 1}x Transit` : 'Langsung'}</small>
                                    </div>
                                    <div className="">
                                            <h1 className="mt-4 xl:mt-0 text-md font-bold text-blue-500">Rp.{toRupiah(e.classes[0][0].price)}</h1>
                                            <small className="text-red-500">{e.classes[0][0].availability} set(s) left</small>
                                    </div>
                                    <div className="flex justify-center col-span-1 md:col-span-2">
                                        {e.classes[0][0].availability > 0 ? (
                                            <div>
                                                <button type="button" onClick={(e) => bookingHandlerDetail(e, index)}  class="xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50 font-medium rounded-sm text-sm px-10 md:px10 xl:px-10 py-3.5 2xl:px-14 text-center inline-flex items-center dark:hover:bg-blue-500/80 dark:focus:ring-blue-500/40 mr-2 mb-2">
                                                    <div className="text-white font-bold">PILIH</div>
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
                                            <h1 className="text-md font-bold">{e.detailTitle[i].flightName} </h1>
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
                                            <h1 className="text-md font-bold">{e.airlineName} </h1>
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
                                            <h1 className="text-md font-bold">{e.detailTitle[w].flightName}  </h1>
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
                                            <h1 className="text-md font-bold">{e.airlineName} </h1>
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
                            <div className="cursor-pointer block xl:hidden w-full text-gray-700">
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
                                                <h1 className="mt-4 xl:mt-0 text-md font-medium">{e.detailTitle[0].depart}</h1>
                                                <small>{e.detailTitle[0].origin}</small>
                                            </div>
                                            <div className="w-full mt-12 px-4 border-b-2"></div>
                                            <div className="text-xs">
                                                <h1 className="mt-10 xl:mt-0 text-gray-400">{e.detailTitle[0].durationDetail}</h1>
                                                <small className="text-gray-400">{e.isTransit}</small>
                                            </div>
                                            <div className="w-full mt-12 px-4 border-b-2"></div>
                                            <div>
                                                <h1 className="text-md font-medium">{e.detailTitle[0].arrival}</h1>
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