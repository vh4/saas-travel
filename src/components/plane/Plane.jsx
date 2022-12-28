
import {GiCommercialAirplane} from "react-icons/gi"
import * as React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import {FaPlaneDeparture, FaPlaneArrival} from 'react-icons/fa'
import { Chip } from "@mui/material";

export default function Plane(){
    
    const [age, setAge] = React.useState('');
    const [namapesawat, setNamaPesawat] = React.useState('Nama pesawat');
    const [berangkat, setBerangkat] = React.useState(null);

    const [pesawat, setPesawat] = React.useState({});
    const [pesawatStasiun, setpesawatStasiun] = React.useState({});
    const [adult, setadult] = React.useState(1);

    React.useEffect(() => {

        getPesawatData();
        getPesawatDataStasiun();

    }, []);

    async function getPesawatData(){

        const response = await axios.post('http://localhost:5000/travel/flight/airline', {
            token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),
            product:"PESAWAT"
        });

        setPesawat(response.data);

    }

    async function getPesawatDataStasiun(){

        const response = await axios.post('http://localhost:5000/travel/flight/airport', {
            token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),
            product:"PESAWAT"
        });

        setpesawatStasiun(response.data);

    }


    
    return (
        <>     
            {/* <div className="row mt-12 -mx-8 xl:mx-12 xl:h-16 md:w-auto p-4">
                <div className="grid grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
                    <div className=" mx-3 p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="pulsadata.png" alt="" />
                        <p className="text-xs text-center xl:text-start">Pulsa</p>
                    </div>
                    <div className=" mx-3 p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="transfer.png" alt="" />
                        <p className="text-xs text-center xl:text-start">Tranfer</p>
                    </div>
                    <div className=" mx-3 p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="trfspesial.png" alt="" />
                        <p className="text-xs text-center xl:text-start">Transfer</p>
                    </div>
                    <div className=" mx-3  p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="ecommerce.png" alt="" />
                        <p className="text-xs text-center xl:text-start">E-Commerce</p>
                    </div>
                    <div className=" mx-3  p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="emoney.png" alt="" />
                        <p className="text-xs text-center xl:text-start">E-Money</p>
                    </div>
                    <div className=" mx-3  p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="game.png" alt="" />
                        <p className="text-xs text-center xl:text-start">Game</p>
                    </div>
                    <div className=" mx-3  p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="pln.png" alt="" />
                        <p className="text-xs text-center xl:text-start">PLN</p>
                    </div>
                    <div className=" mx-3  p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="djkm.png" alt="" />
                        <p className="text-xs text-center xl:text-start">MPN</p>
                    </div>
                    <div className=" mx-3  p-4">
                        <img className="w-8 xl:h-16 md:w-auto  object-center" src="pdam.png" alt="" />
                        <p className="text-xs text-center xl:text-start">PDAM</p>
                    </div>
                    <div className=" mx-3 p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="bpjs.png" alt="" />
                        <p className="text-xs text-center xl:text-start">BPJS Kesehatan</p>
                    </div>
                    <div className=" mx-3 p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="telkom.png" alt="" />
                        <p className="text-xs text-center xl:text-start">Telkom</p>
                    </div>
                    <div className=" mx-3 p-4">
                        <img className=" w-8 xl:h-16 md:w-auto  object-center" src="tv.png" alt="" />
                        <p className="text-xs text-center xl:text-start">TV Kabel</p>
                    </div>
                </div>
            </div> */}
            <div className="row mt-6 w-full p-2 pr-0 xl:pr-16 mb-12">
                <div class="w-full p-2 py-4 xl:px-12 xl:py-8 bg-white border border-gray-200 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full ">
                        <div className="space-x-4 items-center hidden xl:flex">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Cari harga tiket pesawat murah & promo di sini</div>
                        </div>
                        <div className="space-x-2 items-center pt-2 flex xl:hidden">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Tiket pesawat</div>
                        </div>
                        <div className="mt-4 xl:mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <FormControl className="col-span-1 xl:col-span-2" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                        <Autocomplete 
                            options={pesawatStasiun.data}
                            renderTags={(value, getTagProps) => (
                                <div style={{ width: "100%" }}>
                                  {value.map((option, index) => (
                                    <Chip
                                      variant="outlined"
                                      label={option}
                                      {...getTagProps({ index })}
                                    />
                                  ))}
                                </div>
                              )}
                            getOptionLabel={(option) => option.bandara + " - " + option.name + " - " + option.code}            
                            renderInput={(params) => <TextField {...params}
                                InputProps={{...params.InputProps, 
                                    startAdornment: <FaPlaneDeparture/> }}
                                placeholder="Bandara keberangkatan"
                                 label="Keberangkatan" />}
                            />
                            <FormHelperText>Stasiun Keberangkatan</FormHelperText>
                        </FormControl>
                         
                        <FormControl className="col-span-1 xl:col-span-2" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                        <Autocomplete 
                            options={pesawatStasiun.data}
                            getOptionLabel={(option) => option.bandara + " - " + option.name + " - " + option.code}            
                            renderInput={(params) => <TextField {...params} 
                            InputProps={{...params.InputProps, 
                                startAdornment: <FaPlaneArrival/>}} 
                                placeholder="Bandara Tujuan"
                            label="Tujuan" />}
                            />
                            <FormHelperText>Stasiun Tujuan</FormHelperText>
                        </FormControl>
                        <FormControl className="col-span-1 xl:col-span-2" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                        <Autocomplete 
                            options={pesawat.data}
                            getOptionLabel={(option) => option.airlineName}            
                            renderInput={(params) => <TextField {...params} label="Nama pesawat" />}
                            />
                            <FormHelperText>Nama Pesawat</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormHelperText>Tanggal keberangkatan</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormHelperText>Tanggal Pulang</FormHelperText>
                        </FormControl>                                                            
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2">
                            <div>
                                <div className="mt-2 w-full items-center ml-4 text-gray-600 flex space-x-2">
                                    <img src={'/adult.svg'} alt="adult" />
                                    <div className="header-number px-3">
                                        <p>Adult </p>
                                    </div>
                                    <button data-action="decrement" class="h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-md">+</span>
                                    </button>
                                    <input className="w-12 h-10 border-b-1 text-gray-600 border-gray-300   border-x-0 border-t-0 outline-none focus:outline-none focus:ring-0"  type="number" value={adult} />
                                    <button data-action="decrement" class=" h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-md">−</span>
                                    </button>                           
                                </div>
                                <div className="mt-2 w-full items-center ml-4 text-gray-600 flex space-x-2">
                                    <img src={'/child.svg'} alt="child" />
                                    <div className="header-number px-3">
                                        <p>Child </p>
                                    </div>
                                    <button data-action="decrement" class="h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-md">+</span>
                                    </button>
                                    <input className="w-12 h-10 border-b-1 text-gray-600 border-gray-300   border-x-0 border-t-0 outline-none focus:outline-none focus:ring-0"  type="number" value={adult} />
                                    <button data-action="decrement" class=" h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-md">−</span>
                                    </button>                           
                                </div>
                                <div className="mt-2 w-full items-center ml-4 text-gray-600 flex space-x-2">
                                    <img src={'/infanct.svg'} alt="infanct" />
                                    <div className="header-number px-2">
                                        <p>Infant</p>
                                    </div>
                                    <button data-action="decrement" class="h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-md">+</span>
                                    </button>
                                    <input className="w-12 h-10 border-b-1 text-gray-600 border-gray-300   border-x-0 border-t-0 outline-none focus:outline-none focus:ring-0"  type="number" value={adult} />
                                    <button data-action="decrement" class=" h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                        <span class="m-auto text-2xl font-md">−</span>
                                    </button>                           
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <button type="button" class="w-40 mt-8 xl:mt-16 h-16 text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                                    <div className="text-white font-bold text-md pl-2">CARI TIKET</div>
                                </button>  
                            </div>                           
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}