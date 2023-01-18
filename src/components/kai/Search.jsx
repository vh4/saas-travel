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
import {MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp} from "react-icons/md"
import KAISearch from "./KAISearch";
import moment from "moment"

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
    const [showHarga, setShowHarga] = React.useState(false);
    const [showWaktu, setShowWaktu] = React.useState(false);
    const [showKelas, setShowKelas] = React.useState(false);
    const [gradeFilter, setGradeFilter] = useState([false, false, false]);
    const [waktuFilter, setWaktuFilter] = useState([false, false, false, false]);
    const [selectedTime, setSelectedTime] = useState([]);

    const [ubahPencarian, setUbahPencarian] = useState(false);

    const handleGradeFilterChange = (e) => {
        let newGradeFilter = [...gradeFilter];
        newGradeFilter[e.target.value] = e.target.checked;
        setGradeFilter(newGradeFilter);
      }

      const handleWaktuFilterChange = (e) => {
        let newWktuFilter = waktuFilter;

        if(e.target.value == '06:00-12:00'){
            newWktuFilter[0] = newWktuFilter[0] ? false : true;
        }
        else if(e.target.value == '12:00-18:00'){
            newWktuFilter[1] = newWktuFilter[1] ? false : true;
        }
        else if(e.target.value == '18:00-00:00'){
            newWktuFilter[2] =  newWktuFilter[2] ? false : true;
        }
        else if(e.target.value == '00:00-06:00'){
            newWktuFilter[3] =  newWktuFilter[3] ? false : true;
        }
        setWaktuFilter(newWktuFilter);

        const time = e.target.value;
        if (selectedTime.includes(time)) {
            setSelectedTime(selectedTime.filter((t) => t !== time));
        } else {
            setSelectedTime([...selectedTime, time]);
        }
    };

    const btnRefHarga = useRef();
    const btnRefWaktu= useRef();
    const btnRefKelas= useRef();

    useEffect(() => {
        const closeFilter = e => {
           if(e.path[0] !== btnRefHarga.current){
            setShowHarga(false);
           }
           if(e.path[0] !== btnRefWaktu.current){
            setShowWaktu(false);
           }
           if(e.path[0] !== btnRefKelas.current){
            setShowKelas(false);
           }
        }
        document.body.addEventListener('click', closeFilter);

        return() =>  document.body.removeEventListener('click', closeFilter);

    }, [])

    const [valHargaRange, setHargaRange] = useState([0, 1000000])
      
    function hargraRangeChange(e, data){
        setHargaRange(data);

    }


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



     const filteredData = dataSearch.filter(train => {
        if (!gradeFilter.some(filter => filter)) {
          return true;
        } else {
          return train.seats.some(seat => {
            return gradeFilter[['K','E','B'].indexOf(seat.grade)];
          });
        }
      }).filter((d) => {
        if (selectedTime.length === 0) {
            return true;
        }
        const departureTime = moment(d.departureTime, "HH:mm").format("HH:mm");
        return selectedTime.some((t) => {
            const [start, end] = t.split("-");

            return moment(departureTime, "HH:mm").isBetween(moment(start, "HH:mm"), moment(end, "HH:mm"));

        });
      })
      .filter(train => {
        return train.seats.some(seat => {
          return valHargaRange[0] <= seat.priceAdult && seat.priceAdult <= valHargaRange[1]
        });
      });

      
    
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
                    <div className="mt-4 md:mt-0 flex space-x-4 mr-0 xl:mr-16"> 
                        <Link to='/' className="flex space-x-2 items-center">
                            <IoArrowBackOutline className="text-[#FF9119]" size={16} />
                            <div className="text-[#FF9119] text-sm font-bold">Kembali</div>
                        </Link>
                        <button onClick={() => setUbahPencarian(prev => !prev)} className="block border p-2 px-4 md:px-4 mr-0 xl:mr-16 bg-[#FF9119] text-white rounded-md text-xs font-bold">
                            Ubah Pencarian
                        </button>            
                    </div>
                </div>
                {
                    ubahPencarian ? (
                    <div className="mt-8">
                        <KAISearch />
                    </div>
                    ) : null
                }
                <div className="flex justify-between mt-6">
                    <div className="relative flex items-center space-x-2 text-slate-600 text-xs font-bold">
                        <div className="hidden md:block">FILTER : </div>
                        <button ref={btnRefHarga} onClick={() => setShowHarga(prev => !prev)} className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300">
                            HARGA
                        </button>
                        <button ref={btnRefWaktu} onClick={() => setShowWaktu(prev => !prev)} className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300">
                            WAKTU
                        </button>
                        <button ref={btnRefKelas} onClick={() => setShowKelas(prev => !prev)} className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300">
                            KELAS
                        </button>
                        {
                            showHarga ? (
                            <div className="w-auto absolute top-10 z-50 opacity-100 bg-white p-4 text-xs">
                                <Box sx={{ width: 200,}}>
                                    <Typography theme={theme} id="track-inverted-slider" gutterBottom>
                                    Range antara Rp.{toRupiah(valHargaRange[0])} - Rp.{toRupiah(valHargaRange[1])}
                                    </Typography>
                                    <Slider
                                        size="small"
                                        track="inverted"
                                        aria-labelledby="track-inverted-range-slider"
                                        onChange={hargraRangeChange}
                                        value={valHargaRange}
                                        min={0}
                                        max={1500000}
                                    />
                                </Box>
                            </div>  
                            ) : null
                        }{
                            showWaktu ? (
                                <div className="w-auto absolute top-10 left-28 z-50 opacity-100 bg-white p-4 text-xs">
                                <Box sx={{ width: 120,}}>
                                    <FormGroup>
                                        <FormControlLabel  control={<Checkbox  checked={waktuFilter[0]} value="06:00-12:00"  onChange={handleWaktuFilterChange} size="small"  />} label={<span style={{ fontSize: '12px' }}>06.00 - 12.00</span>} />
                                        <FormControlLabel  control={<Checkbox  checked={waktuFilter[1]} value="12:00-18:00" onChange={handleWaktuFilterChange} size="small" />}  label={<span style={{ fontSize: '12px' }}>12.00 - 18.00</span>} />
                                        <FormControlLabel  control={<Checkbox  checked={waktuFilter[2]} value="18:00-00:00" onChange={handleWaktuFilterChange} size="small" />} label={<span style={{ fontSize: '12px' }}>18.00 - 00.00</span>} />
                                        <FormControlLabel  control={<Checkbox  checked={waktuFilter[3]} value="00:00-06:00" onChange={handleWaktuFilterChange} size="small" />} label={<span style={{ fontSize: '12px' }}>00.00 - 06.00</span>} />
                                    </FormGroup> 
                                </Box>                                                         
                            </div> 
                            ) : null
                        }           
                        {
                            showKelas ? (
                                <div className="w-auto absolute top-10 left-48 z-50 opacity-100 bg-white p-4 text-xs">
                                <Box sx={{ width: 120,}}>
                                    <FormGroup>
                                        <FormControlLabel  control={<Checkbox checked={gradeFilter[0]} value={0} onChange={handleGradeFilterChange}  size="small"  />} label={<span style={{ fontSize: '12px' }}>Ekonomi</span>} />
                                        <FormControlLabel  control={<Checkbox checked={gradeFilter[1]} value={1} onChange={handleGradeFilterChange}   size="small"  />} label={<span style={{ fontSize: '12px' }}>Eksekutif</span>} />
                                        <FormControlLabel  control={<Checkbox checked={gradeFilter[2]} value={2} onChange={handleGradeFilterChange}   size="small"  />} label={<span style={{ fontSize: '12px' }}>Bisnis</span>} />
                                    </FormGroup> 
                                </Box>                                                         
                            </div> 
                            ) : null
                        }                        
                    </div>
                    <div>
                        <div className="flex space-x-2 items-center p-4 px-4 md:px-4 mr-0 xl:mr-16 text-gray-500 rounded-md text-xs font-bold">
                            <div>URUTKAN</div>
                            <MdOutlineKeyboardArrowDown />
                        </div>
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
                    {filteredData.map((e) => ( //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
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
                                        <button type="button" onClick={() => bookingHandlerDetail(e.trainNumber)} class="mt-4 xl:mt-0 text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
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
                                        <small>{e.seats[0].grade === 'E' ? 'Eksekutif' : e.seats[0].grade === 'B' ? 'Bisnis' : 'Ekonomi'} Class ({e.seats[0].class})</small>
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