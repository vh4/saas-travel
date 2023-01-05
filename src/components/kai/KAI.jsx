
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
import { Popper } from "@mui/material";
import {FaTrain} from 'react-icons/fa'
import {BiTrain} from 'react-icons/bi'
import { useNavigate, createSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function KAI(){

    console.log(process.env.REACT_APP_HOST_API);
    
    const [berangkat, setBerangkat] = React.useState();
    const [tujuan, setTujuan] = React.useState();
    const [tanggal, setTanggal] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const [adult, setadult] = React.useState(1);
    const [child, setchild] = React.useState(0);
    const [infant, setinfant] = React.useState(0);

    const navigate = useNavigate();


    function plusAdult(e){
        e.preventDefault();

        setadult(adult + 1);
    }

    function minusAdult(e){
        e.preventDefault();

        if(adult < 0 || adult === 0){
            setadult(0);
        }else{
            setadult(adult - 1);
        }
        
    }

    function plusChild(e){
        e.preventDefault();

        setchild(child + 1);
    }

    function minusChild(e){
        e.preventDefault();

        if(child < 0 || child === 0){
            setchild(0);
        }else{
            setchild(child - 1);
        }

    }

    function plusInfant(e){
        e.preventDefault();
        setinfant(infant + 1);
    }

    function minusInfant(e){
        e.preventDefault();

        if(infant < 0 || infant === 0){
            setinfant(0);
        }else{
            setinfant(infant - 1);
        }

    }


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

            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/station`, {
                token: localStorage.getItem("djkfghdfkghydo8e893745yv345vj34h35vu3vjh35v345v3v53"),
            });
    
            setKAI(response.data);
            
        } catch (error) {
            setKAI({message: error.message});
        }

    }

    function addLeadingZero(num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return '' + num;
        }
      }

    async function handlerCariKai(e){

        setLoading(true);

        const tanggalParse = tanggal.$y + '-' + (addLeadingZero(parseInt(tanggal.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggal.$D)).toString();
        
        setTimeout(() => {
            e.preventDefault();
            setLoading(false);

            const params = {
                origin: berangkat.id_stasiun,
                destination:tujuan.id_stasiun,
                productCode: 'WKAI',
                date:tanggalParse,
                kotaBerangkat:berangkat.nama_kota,
                kotaTujuan:tujuan.nama_kota,
                stasiunBerangkat:berangkat.nama_stasiun,
                stasiunTujuan:tujuan.nama_stasiun,
                adult:adult,
                child:child,
                infant:infant,
            }

            navigate({
                pathname: '/train/search',
                search: `?${createSearchParams(params)}`,
              });

        }, 1000);

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
                        {kai.data !== undefined ? 
                        (
                            <>
                                <div className="mt-4 xl:mt-12 grid grid-cols-1 2xl:grid-cols-3 gap-4">
                                <FormControl sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                                <Autocomplete key={ i + 1}
                                    PopperComponent={PopperMy}
                                    disableClearable
                                    options={kai.data}
                                    getOptionLabel={(option) => option.nama_stasiun + ' - ' + option.nama_kota + ' - ' + option.id_stasiun}
                                    value={berangkat}
                                    onChange={(event, newValue) => {
                                        setBerangkat(newValue);
                                    }}

                                    renderInput={(params) => <TextField {...params}
                                    InputProps={{...params.InputProps, 
                                            startAdornment: <FaTrain/> }}
                                    placeholder={kai.data === undefined ? 'Loading...'  : 'Stasiun keberangkatan'}
                                    label="Keberangkatan" />}                            
                                    
                                    />
                                    <FormHelperText>Stasiun Keberangkatan</FormHelperText>
                                </FormControl>
                                <FormControl sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                                <Autocomplete  key={ i + 1}
                                    PopperComponent={PopperMy}
                                    disableClearable
                                    options={kai.data}
                                    getOptionLabel={(option) => option.nama_stasiun + ' - ' + option.nama_kota + ' - ' + option.id_stasiun}
                                    value={tujuan}
                                    onChange={(event, newValue) => {
                                        setTujuan(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params}
                                    InputProps={{...params.InputProps, 
                                            startAdornment: <FaTrain/> }}
                                    placeholder={kai.data === undefined ? 'Loading...'  : 'Stasiun Tujuan'}
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
                                    <div className="block 2xl:flex 2xl:space-x-8">
                                        <div className="mt-2 w-full items-center ml-4 text-gray-600 flex space-x-2">
                                            <img src={'/adult.svg'} alt="adult" />
                                            <div className="header-number px-3">
                                                <p>Adult </p>
                                            </div>
                                            <button onClick={plusAdult} data-action="decrement" class="h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                                <span class="m-auto text-2xl font-md">+</span>
                                            </button>
                                            <input className="w-12 h-10 border-b-1 text-gray-600 border-gray-300   border-x-0 border-t-0 outline-none focus:outline-none focus:ring-0"  type="number" value={adult} onChange={(e) => setadult(e.target.value)} />
                                            <button onClick={minusAdult} data-action="decrement" class=" h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                                <span class="m-auto text-2xl font-md">−</span>
                                            </button>                           
                                        </div>
                                        <div className="mt-2 w-full items-center ml-4 text-gray-600 flex space-x-2">
                                            <img src={'/child.svg'} alt="child" />
                                            <div className="header-number px-3">
                                                <p>Child </p>
                                            </div>
                                            <button onClick={plusChild} data-action="decrement" class="h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                                <span class="m-auto text-2xl font-md">+</span>
                                            </button>
                                            <input className="w-12 h-10 border-b-1 text-gray-600 border-gray-300   border-x-0 border-t-0 outline-none focus:outline-none focus:ring-0"  type="number" value={child} onChange={(e) => setchild(e.target.value)} />
                                            <button onClick={minusChild} data-action="decrement" class=" h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                                <span class="m-auto text-2xl font-md">−</span>
                                            </button>                           
                                        </div>
                                        <div className="mt-2 w-full items-center ml-4 text-gray-600 flex space-x-2">
                                            <img src={'/infanct.svg'} alt="infanct" />
                                            <div className="header-number px-2">
                                                <p>Infant</p>
                                            </div>
                                            <button onClick={plusInfant} data-action="decrement" class="h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                                <span class="m-auto text-2xl font-md">+</span>
                                            </button>
                                            <input className="w-12 h-10 border-b-1 text-gray-600 border-gray-300   border-x-0 border-t-0 outline-none focus:outline-none focus:ring-0"  type="number" value={infant}  onChange={(e) => setinfant(e.target.value)}/>
                                            <button onClick={minusInfant} data-action="decrement" class=" h-10 w-10  text-blue-600 rounded-l cursor-pointer outline-none">
                                                <span class="m-auto text-2xl font-md">−</span>
                                            </button>                           
                                        </div>
                                    </div>                                                                
                                </div>
                            </>
                        ) :
                        
                        (
                            <>
                            <div className="mt-12 mb-4">
                            <Box sx={{ width: 1000 }}>
                                <Skeleton />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation={false} />
                                </Box>
                            </div>                            
                            </>
                        )

                    }
                        <div className="w-full mt-4 flex justify-end">
                        <button onClick={handlerCariKai} type="button" class="text-white bg-[#FF9119] space-x-2 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-8 py-4 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                            {isLoading ? (
                            <div className="flex space-x-2 items-center">
                                <svg aria-hidden="true" class="mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <div class="">Loading...</div>
                            </div>
                            )
                        :
                        (
                            <div className="text-white text-MD font-bold">CARI TIKET</div>
                        )
                        }
                        </button>  
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}