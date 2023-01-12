
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
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import onClickOutside from "react-onclickoutside";

function Plane(){

    const [anchorEl, setAnchorEl] = React.useState('hidden');
    const handleClick = () => {
        anchorEl === 'hidden' ? setAnchorEl('grid') : setAnchorEl('hidden');
    }

    Plane.handleClickOutside = () => {
        setAnchorEl('hidden');
      };
    
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
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            product:"PESAWAT"
        });

        setPesawat(response.data);

    }

    async function getPesawatDataStasiun(){

        const response = await axios.post('http://localhost:5000/travel/flight/airport', {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            product:"PESAWAT"
        });

        setpesawatStasiun(response.data);

    }

    return (
        <>     
           <div className="row bg-white border-t border-gray-200 w-full p-2 pr-0">
                <div class="w-full p-4 py-4 xl:px-8 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full">
                        {/* <div className="space-x-2 items-center flex">
                            < GiCommercialAirplane className="text-gray-700" size={20} />
                            <div className="text-sm md:text-md font-bold text-slate-700">AIRLINES</div>
                        </div> */}
                        {pesawatStasiun.data !== undefined ? 
                        (
                        <>
                            <div className="mt-4 xl:mt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mx-0 xl:mx-8">
                            <FormControl className="" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
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
                            
                            <FormControl className="" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
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
                            <FormControl className="" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
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
                            <div onClick={handleClick} className="relative bg-white ml-2 py-4 px-2 cursor-pointer  text-slate-500 w-11/12 h-3/5 rounded-md mt-2 border-b border-gray-300 focus:outline-none hover:bg-gray-100 hover:text-slate-600 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <div
                                    
                                >
                                    <div>1 Adult, 0 Child, 0 Infant</div>
                                </div>
                                <div id="basic-menu" className={`${anchorEl} absolute top-14  z-10 grid w-auto p-4 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-700`}>
                                <div className="ml-4 block  mx-4 md:mx-0">
                                    <div className="mt-2 w-full items-center text-gray-600 flex space-x-2">
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
                                    <div className="mt-2 w-full items-center text-gray-600 flex space-x-2">
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
                                    <div className="mt-2 w-full items-center text-gray-600 flex space-x-2">
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
                            </div>
                                </div>
                            </div>                                                        
                        </>
                            )

                            :

                            (
                                <>
                                 <div className="block w-full mb-4">
                                 <Box>
                                     <Skeleton />
                                     <Skeleton animation="wave" />
                                     <Skeleton animation="wave" />
                                     <Skeleton animation="wave" />
                                     <Skeleton animation={false} />
                                 </Box>                                    
                             </div>
                             </>                            
                            )
                        }
                        <div className="w-full flex justify-end pr-0">
                            <button type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-10 py-3 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                                <div className="text-white text-md font-bold">CARI TIKET</div>
                            </button>  
                        </div>  
                    </form>
                </div>
            </div>
        </>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => Plane.handleClickOutside,
  };
  
export default onClickOutside(Plane, clickOutsideConfig);