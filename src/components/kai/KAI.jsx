
import {GiCommercialAirplane} from "react-icons/gi"
import * as React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {HiOutlineArrowRight} from 'react-icons/hi'

import Autocomplete from '@mui/material/Autocomplete';
import { Popper } from "@mui/material";
import {FaTrain} from 'react-icons/fa'
import { parse } from "postcss";

export default function KAI(){
    
    const [berangkat, setBerangkat] = React.useState(null);
    const [tujuan, setTujuan] = React.useState(null);
    const [tanggal, setTanggal] = React.useState(null);
    const [search, setSearch] = React.useState(false);
    const [error, setError] = React.useState(true);

    const [dataSearch, setDataSearch] = React.useState([]);

    const i = 0;

    const [kai, setKAI] = React.useState({});

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

        const tanggalParse = tanggal.$y + '-' + (parseInt(tanggal.$M) + 1).toString()  + '-' + tanggal.$D;
        
        const response = await axios.post('http://localhost:5000/travel/train/search', {
            token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),
            origin:berangkat.id_stasiun,
            destination:tujuan.id_stasiun,
            date:tanggalParse
        });

        if(response.data.rc === null || response.data.rc === undefined){
            setError(false);
        }
        
        setSearch(true);
        setDataSearch(response.data);

    }


    return (
        <>     
            <div className="row mt-6 w-full p-2 pr-0 xl:pr-16">
                <div class="w-full p-2 py-4 xl:px-12 xl:py-8 bg-white border border-gray-200 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full ">
                        <div className="space-x-4 items-center hidden xl:flex">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Cari Harga Tiket KAI Murah & Promo di Sini</div>
                        </div>
                        <div className="space-x-2 items-center pt-2 flex xl:hidden">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Tiket KAI</div>
                        </div>
                        <div className="mt-4 xl:mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <FormControl sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                        <Autocomplete key={ i + 1}
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
                            getOptionLabel={(option) => option.nama_stasiun + ' ( ' + option.nama_kota + ' ) '}
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
            { (dataSearch.length > 0) && (dataSearch != "undefined") ? (
                <div className="flex text-xl items-center mt-12 ml-4 font-bold text-gray-700 space-x-2">
                    <div>{berangkat.nama_stasiun}</div>
                    < HiOutlineArrowRight />
                    <div>{tujuan.nama_stasiun}</div>
                </div>
            )
            :

            ''
        
        }

        {/* tiket search kereta */}

            { (dataSearch.length > 0) && (dataSearch != "undefined") ? (
            <div className="row mt-6 mb-24 w-full p-2 pr-0 xl:pr-16">
            <div class="w-full p-2 py-4 xl:px-12 xl:py-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div className="w-full text-gray-700">
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7">
                        <div className="col-span-2">
                            <h1 className="text-md font-medium">Argo Lawu </h1>
                            <small>Excecutive class A</small>
                        </div>
                        <div>
                            <h1 className="text-md font-medium">06.00</h1>
                            <small>Jakarta (GMR)</small>
                        </div>
                        <div>
                            <h1 className="text-md font-medium">12.00</h1>
                            <small>Bandung (KAC)</small>
                        </div>
                        <div>
                            <h1 className="text-md font-medium">2j 40m</h1>
                            <small>Langsung</small>
                        </div>
                        <div className="">
                             <h1 className="text-xl font-bold text-[#FF9119]">Rp. 200.000</h1>
                             <small className="text-red-500">30 set(s) left</small>
                        </div>
                        <div>
                            <button type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                            <div className="text-white font-bold">PILIH</div>
                            </button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>                
            )
            :
            error !== true ? (
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
            ) : ''
        }
        </>
    )
}