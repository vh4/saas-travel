
import {GiCommercialAirplane} from "react-icons/gi"
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {CiSearch} from 'react-icons/ci'


export default function Menu(){
    
    const [age, setAge] = React.useState('');
    const [value, setValue] = React.useState(null);

    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value);
    };

    
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
            <div className="row mt-6 w-full p-2">
                <div class="w-full p-2 xl:p-12 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full ">
                        <div className="space-x-4 items-center hidden xl:flex">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">Cari harga tiket pesawat murah & promo di sini</div>
                        </div>
                        <div className="space-x-2 items-center pt-2 flex xl:hidden">
                            < GiCommercialAirplane className="text-gray-600" size={24} />
                            <div className="text-xl font-medium text-gray-600">tiket pesawat</div>
                        </div>
                        <div className="mt-4 xl:mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            displayEmpty
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            >
                            <MenuItem disabled value="">
                                <em>Keberangkatan</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <FormHelperText>Lokasi keberangkatan anda</FormHelperText>
                        </FormControl> 
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            displayEmpty
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            >
                             <MenuItem disabled value="">
                                <em>Tujuan</em>
                            </MenuItem>                               
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <FormHelperText>Lokasi tujuan anda</FormHelperText>
                        </FormControl> 
                        <FormControl sx={{ m: 1, minWidth: 120 }}> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={value}
                                onChange={(newValue) => {
                                setValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormHelperText>Tanggal keberangkatan</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}> 
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={value}
                                onChange={(newValue) => {
                                setValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <FormHelperText>Tanggal Pulang</FormHelperText>
                        </FormControl>                                                                            
                        </div>
                        <div className="mt-0 md:mt-4 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-8">
                        <FormControl className="col-span-2" sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            displayEmpty
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            >
                             <MenuItem disabled value="">
                                <em>Nama pesawat</em>
                            </MenuItem>                               
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <FormHelperText>Nama Pesawat</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            displayEmpty
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            >
                             <MenuItem disabled value="">
                                <em>Adult</em>
                            </MenuItem>                               
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <FormHelperText>Adult</FormHelperText>
                        </FormControl> 
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            displayEmpty
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            >
                             <MenuItem disabled value="">
                                <em>Child</em>
                            </MenuItem>                               
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <FormHelperText>Child</FormHelperText>
                        </FormControl> 
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                            displayEmpty
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                            >
                             <MenuItem disabled value="">
                                <em>Infant</em>
                            </MenuItem>                               
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            <FormHelperText>Infant</FormHelperText>
                        </FormControl> 
                        </div>
                        <div className="w-full flex justify-end">
                        <button type="button" class="mt-8 flex  text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-12 py-4 text-center  space-x-2 items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 mr-2 mb-2">
                         <div className="text-gray-600">Cari Tiket</div>
                         < CiSearch className="text-gray-600" size={24} />
                        </button>  
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}