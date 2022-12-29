
import {GiCommercialAirplane} from "react-icons/gi"
import * as React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {HiOutlineArrowRight, HiOutlineArrowNarrowRight} from 'react-icons/hi'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Autocomplete from '@mui/material/Autocomplete';
import { Popper } from "@mui/material";
import {FaTrain} from 'react-icons/fa'
import {BiTrain} from 'react-icons/bi'
import { useNavigate } from "react-router";

export default function KAI(){
    
    const [berangkat, setBerangkat] = React.useState();
    const [tujuan, setTujuan] = React.useState();
    const [tanggal, setTanggal] = React.useState();
    const [notFound, setError] = React.useState(true);
    const [isLoading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const skeleton = [1,2,3,4,5,6,7,8,9,10];

    const [dataSearch, setDataSearch] = React.useState([]);

    const i = 0;
    const [kai, setKAI] = React.useState({});


    function bookingHandlerDetail(trainNumber){
        const detailBooking = dataSearch.filter(e => e.trainNumber === trainNumber);

        const detailKereta = [{
            berangkat_id_station: berangkat.id_stasiun,
            tujuan_id_station: tujuan.id_stasiun,
            berangkat_nama_kota: berangkat.nama_kota,
            tujuan_nama_kota: tujuan.nama_kota
        }];

        localStorage.setItem(trainNumber + "_booking", JSON.stringify(detailBooking));
        localStorage.setItem(trainNumber + "_detailTrain", JSON.stringify(detailKereta));

         navigate('/train/booking/' + trainNumber)
        
    }

    const PopperMy = function (props) {
        return <Popper {...props} style={styles.popper} placement="bottom-start" />;
     };

     const styles = (theme) => ({
        popper: {
           minWidth:'400px'
        }
     });

    React.useEffect(() => {

        getKAIdata();

    }, []);

    async function getKAIdata(){

        try {

            const response = await axios.post('http://localhost:5000/travel/train/station', {
                token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),
            });
    
            setKAI(response.data);
            
        } catch (error) {
            setKAI({message: error.message});
        }

    }

    async function handlerCariKai(e){
        e.preventDefault();
        setLoading(true);

        try {

            const tanggalParse = tanggal.$y + '-' + (parseInt(tanggal.$M) + 1).toString()  + '-' + tanggal.$D;
        
            const response = await axios.post('http://localhost:5000/travel/train/search', {
                // token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),,
                productCode : "WKAI",
                token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjhkNzNtbmc4OWVkIn0.eyJpc3MiOiJodHRwczpcL1wvYXBpLmZhc3RyYXZlbC5jby5pZCIsImF1ZCI6IkZhc3RyYXZlbEIyQiBDbGllbnQiLCJqdGkiOiI4ZDczbW5nODllZCIsImlhdCI6MTY3MjE5NzI0MywibmJmIjoxNjcyMTk3MzAyLCJleHAiOjE2NzIyMDA4NDIsIm91dGxldElkIjoiRkE0MDMzMjgiLCJwaW4iOiI1MzcyMDEiLCJrZXkiOiJGQVNUUEFZIn0.nMgrQ7qFBMFcdqhABEe8B4x6T5E_Kqb7hQFoXkq-kaA",
                origin:berangkat.id_stasiun,
                destination:tujuan.id_stasiun,
                date:tanggalParse
            });
    
            if(response.data.rc !== "00" || response.data.rc === undefined){
                setError(true);
                setLoading(false);
            }

            if(response.data === undefined){
                setError(true);
                setLoading(false);
            }
    
            setError(false);
            setDataSearch(response.data.data);
            setLoading(false);

            
            
        } catch (error) {
            console.log(error);
            setError(true);
            setLoading(false);
        }

    }

    return (
        <>     
            <div className="row mt-6 w-full p-2 pr-0 xl:pr-16">
                <div class="w-full p-2 py-4 xl:px-12 xl:py-8 bg-white border border-gray-200 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full ">
                        <div className="space-x-4 items-center hidden xl:flex">
                            < BiTrain className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Cari harga tiket KAI murah meriah</div>
                        </div>
                        <div className="space-x-2 items-center pt-2 flex xl:hidden">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Tiket KAI</div>
                        </div>
                        <div className="mt-4 xl:mt-12 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4">
                        <FormControl sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                        <Autocomplete key={ i + 1}
                            PopperComponent={PopperMy}
                            options={kai.data}
                            getOptionLabel={(option) => option.nama_stasiun + ' - ' + option.nama_kota + ' - ' + option.id_stasiun}
                            value={berangkat}
                            onChange={(event, newValue) => {
                                setBerangkat(newValue);
                              }}

                              renderInput={(params) => <TextField {...params}
                              InputProps={{...params.InputProps, 
                                    startAdornment: <FaTrain/> }}
                              placeholder="Stasiun keberangkatan"
                              label="Keberangkatan" />}                            
                               
                               />
                            <FormHelperText>Stasiun Keberangkatan</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                        <Autocomplete  key={ i + 1}
                            PopperComponent={PopperMy}
                            options={kai.data}
                            getOptionLabel={(option) => option.nama_stasiun + ' - ' + option.nama_kota + ' - ' + option.id_stasiun}
                            value={tujuan}
                            onChange={(event, newValue) => {
                                setTujuan(newValue);
                              }}
                              renderInput={(params) => <TextField {...params}
                              InputProps={{...params.InputProps, 
                                    startAdornment: <FaTrain/> }}
                              placeholder="Stasiun Tujuan"
                              label="Tujuan" />}
                            />
                            <FormHelperText>Stasiun Tujuan</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker key={ i + 1}
                                value={tanggal}
                                onChange={(newValue) => {
                                setTanggal(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormHelperText>Tanggal keberangkatan</FormHelperText>
                        </FormControl>                                                                 
                        </div>
                        <div className="w-full mt-4 flex justify-end">
                        <button onClick={handlerCariKai} type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                         <div className="text-white text-MD font-bold">CARI TIKET</div>
                        </button>  
                        </div>
                    </form>
                </div>
            </div>
            { (dataSearch !== "undefined") && notFound === false  && berangkat !== null && tujuan !== null ? (
                <div className="flex text-xl items-center mt-12 ml-4 font-bold text-gray-700 space-x-2">
                    <div>{berangkat.nama_stasiun}</div>
                    < HiOutlineArrowRight />
                    <div>{tujuan.nama_stasiun}</div>
                </div>
            )
            : ''
        
        }
            {isLoading ? 
            <div className="flex text-xl items-center mt-12 ml-4 font-bold text-gray-700 space-x-2">
                <Box sx={{ width: 350 }}>
                    <Skeleton />
                </Box>
            </div>
        : ''}

        {/* tiket search kereta */}
            {isLoading ? 
                skeleton.map((e) =>(
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
            : ''}

            {(dataSearch !== undefined ) && berangkat !== null && tujuan !== null ?  (notFound === false ) ?  ( //ganti
            <div className="row mt-6 mb-24 w-full p-2 pr-0 xl:pr-16">           
                {dataSearch.map((e) => (
                    <div class={`mt-6 w-full p-2 py-4 xl:px-12 xl:py-8 ${ e.seats[0].availability > 0 ? 'bg-white' : 'bg-gray-200' } border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700`}>
    
                    {/* desktop cari */}
    
                    <div className="hidden xl:block w-full text-gray-700">
                        
                        <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                            <div className="col-span-1 xl:col-span-2">
                                <h1 className="text-md font-medium">{e.trainName} </h1>
                                <small>Eksekutif class {e.seats[0].class}</small>
                            </div>
                            <div className="flex">
                                <div className="">
                                    <h1 className="mt-4 xl:mt-0 text-md font-medium">{e.departureTime}</h1>
                                    <small>{berangkat.nama_kota} ({berangkat.id_stasiun})</small>
                                </div>
                                < HiOutlineArrowNarrowRight size={24} />
                            </div>
                            <div>
                                <h1 className="text-md font-medium">{e.arrivalTime}</h1>
                                <small>{tujuan.nama_kota} ({tujuan.id_stasiun})</small>
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
                                        <small className="text-gray-400">{berangkat.id_stasiun}</small>
                                    </div>
                                    <div className="w-full mt-12 px-4 border-b-2"></div>
                                    <div className="text-xs">
                                        <h1 className="mt-10 xl:mt-0 text-gray-400">{e.duration}</h1>
                                        <small className="text-gray-400">Langsung</small>
                                    </div>
                                    <div className="w-full mt-12 px-4 border-b-2"></div>
                                    <div>
                                        <h1 className="mt-10 xl:mt-0 text-sm font-medium">{e.arrivalTime}</h1>
                                        <small className="text-gray-400">{tujuan.id_stasiun}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>   
         

            )
            : '' : 

            (
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
        </>
    )
}