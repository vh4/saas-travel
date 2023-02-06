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

export default function Search(){

    const theme = createTheme({
        typography: {
          // In Chinese and Japanese the characters are usually larger,
          // so a smaller fontsize may be appropriate.
          fontSize: 8,
        },
      });
      

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
        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/pelni/search`, {
            origin:origin,
            destination:destination,
            startDate:startDate,
            endDate:endDate,
            token:token
        });

        if(response.data.rc === '00'){
            setDataSearch(response.data.data);
            setLoading(false);
            setError(false);

        }else{
            setLoading(false);
            setError(true);
        }

    }

    function duration(tanggal1, tanggal2) {
        let date1 = new Date(tanggal1);
        let date2 = new Date(tanggal2);
        let diff = date2.getTime() - date1.getTime();
      
        let hours = Math.floor(diff / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
        if (hours > 0) {
          return `${hours} jam ${minutes} menit`;
        } else {
          return `${minutes} menit`;
        }
      }

    return(
        <>
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
                            {startDate}
                        </small>
                        <div className="hidden md:block font-normal text-slate-600">|</div>
                        <small className="hidden md:block text-xs font-bold text-slate-600">
                            {endDate}
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
                        <button className="block border p-2 px-4 md:px-4 mr-0 xl:mr-16 bg-blue-500 text-white rounded-md text-xs font-bold">
                            Ubah Pencarian
                        </button>            
                    </div>
                </div>
            <div>
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
                    {dataSearch.map((e) => ( //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                    <>
                        {e.fares.map((z, i) => (
                            <>
                             {console.log(e.fares[i].AVAILABILITY)}
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