
import {Popper } from "@mui/material";
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import {FaPlaneDeparture, FaPlaneArrival} from 'react-icons/fa'
import { Chip } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import onClickOutside from "react-onclickoutside";
import { createSearchParams, useNavigate } from "react-router-dom"
import { makeStyles } from '@mui/styles';
import { Button } from "antd";

function Plane(){

    const [anchorEl, setAnchorEl] = React.useState('hidden');
    const handleClick = () => {
        anchorEl === 'hidden' ? setAnchorEl('grid') : setAnchorEl('hidden');
    }

    Plane.handleClickOutside = () => {
        setAnchorEl('hidden');
      };

    const navigate = useNavigate();
    
    const [isLoading, setLoading] = React.useState(false);
    const [pulang, setPulang] = React.useState(false);
    const [pesawatStasiun, setpesawatStasiun] = React.useState({});
    const [adult, setadult] = React.useState(1);
    const [infant, setinfant] = React.useState(0);
    const [child, setChild] = React.useState(0);

    const [openBerangka, SetopenBerangka] = React.useState(false);
    const [openTujuan, setOpenTujuan] = React.useState(false);

    const [pesawatData, setPesawatData] = React.useState([]);
    const loadingBerangkat = openBerangka && pesawatData.length === 0;
    const loadingTujuan = openTujuan && pesawatData.length === 0;

    //input
    const [keberangkatan, setKeberangkatan] = React.useState();
    const [tujuan, setTujuan] = React.useState();
    const [tanggalKeberangkatan, setTanggalKeberangkatan] = React.useState();
    const [tanggalTujuan, setTanggalTujuan] = React.useState();

    const i = 0;

    const useStyles = makeStyles((theme) => ({
        inputRoot: {
            color:"#6b7280",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e5e7eb"
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e5e7eb"
            },
            "&:Mui-actived .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db"
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db"
            },
            "&&& $input": {
              padding: 1,
            },
          },
          root: {
              
              "& .MuiInputBase-root": {
                "& .MuiInputBase-input": {
                  padding: 9,
                  borderRadius:10
                },
                color:"#6b7280",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb"
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb"
                },
                "&:Mui-actived .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb"
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb"
                },
              }
          }
      }));
    
    const classes = useStyles();

    function sleep(delay = 0) {
        return new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }

      //berangkat
      React.useEffect(() => {
        let active = true;
    
        if (!loadingBerangkat) {
          return undefined;
        }
        
        (async () => {
          await sleep(1e3); // For demo purposes.
    
          if (active) {
            setPesawatData([...pesawatStasiun.data]);
          }
        })();
    
        return () => {
          active = false;
        };
      }, [loadingBerangkat]);
    
      React.useEffect(() => {
        if (!openBerangka) {
          setPesawatData([]);
        }
      }, [openBerangka]);


      //tujuan
      React.useEffect(() => {
        let active = true;
    
        if (!loadingTujuan) {
          return undefined;
        }
        
        (async () => {
          await sleep(1e3); // For demo purposes.
    
          if (active) {
            setPesawatData([...pesawatStasiun.data]);
          }
        })();
    
        return () => {
          active = false;
        };
      }, [loadingTujuan]);
    
      React.useEffect(() => {
        if (!openTujuan) {
          setPesawatData([]);
        }
      }, [openTujuan]);
    


    React.useEffect(() => {
        getPesawatDataStasiun();

    }, []);

    const PopperMy = function (props) {
        return (<Popper {...props} style={{ width: 350 }} placement='bottom-start' />)
    };

     function plusAdult(e){
        e.preventDefault();
        if(adult >= 4){
            setadult(4);
        }else{
            setadult(adult + 1);
        }

    }

    function minusAdult(e){
        e.preventDefault();

        if(adult < 1 || adult === 1){
            setadult(1);
        }
        else{
            setadult(adult - 1);
        }
        
    }


    function plusInfant(e){
        e.preventDefault();
        if(infant >= 4){
            setinfant(4);
        }else{
            setinfant(infant + 1);
        }
    }

    function minusInfant(e){
        e.preventDefault();

        if(infant < 0 || infant === 0){
            setinfant(0);
        }else{
            setinfant(infant - 1);
        }

    }

    function plusChild(e){
        e.preventDefault();
        if(child >= 4){
            setChild(4);
        }else{
            setChild(child + 1);
        }
    }

    function minusChild(e){
        e.preventDefault();

        if(child < 0 || child === 0){
            setChild(0);
        }else{
            setChild(child - 1);
        }

    }

    function addLeadingZero(num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return '' + num;
        }
      }

    async function getPesawatDataStasiun(){

        const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/flight/airport`, {
            token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            product:"PESAWAT"
        });

        setpesawatStasiun(response.data);

    }

    async function handlerCariPesawat(e){

        setLoading(true);

        let tanggalNullFill = new Date();
        tanggalNullFill = tanggalNullFill.getFullYear() + '-' + parseInt(tanggalNullFill.getMonth()  + 1) + '-' + addLeadingZero(parseInt(tanggalNullFill.getDate()));

        const tanggalKeberangkatanParse= tanggalKeberangkatan !== undefined && tanggalKeberangkatan !== null ? tanggalKeberangkatan.$y + '-' + (addLeadingZero(parseInt(tanggalKeberangkatan.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggalKeberangkatan.$D)).toString() : tanggalNullFill;
        const tanggalTujuanParse= tanggalTujuan !== undefined && tanggalTujuan !== null ? tanggalTujuan.$y + '-' + (addLeadingZero(parseInt(tanggalTujuan.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggalTujuan.$D)).toString() : tanggalNullFill;

        console.log('tanggalKeberangkatanParse :' + tanggalKeberangkatanParse);

        setTimeout(() => {
            e.preventDefault();
            setLoading(false);

            const params = {
                departure : keberangkatan.code,
                departureName:keberangkatan.bandara,
                arrival : tujuan.code,
                arrivalName:tujuan.bandara,
                departureDate : tanggalKeberangkatanParse,
                returnDate : pulang ? tanggalTujuanParse : "",
                isLowestPrice : true,
                adult : adult,
                child : child,
                infant : infant,
            }

            localStorage.setItem('v-search', JSON.stringify(params));

            navigate({
                pathname: '/flight/search',
                search: `?${createSearchParams(params)}`,
              });

        }, 1000);

    }


    return (
        <>     
           <div className="pl-4 flex justify-center row bg-white border-t border-gray-200 w-full pr-0">
                <div class="w-full p-4 py-4 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full">
                        <>
                        <div className="w-64 xl:w-48 mx-0">
                            <div class="mx-0 md:mx-12 xl:mx-6">
                            <label class="w-auto flex items-center mr-4 mb-3 cursor-pointer">
                                <input type="checkbox" value={pulang} onChange={() => setPulang(prev => !prev)} id="A3-yes"class="opacity-0 absolute h-2 w-2" />
                                <div class="bg-white border-2 rounded-md border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-gray-500">
                                <svg class={`${pulang ? 'block' : 'hidden'} fill-current w-2 h-2 text-gray-500 pointer-events-none"`} version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" fill-rule="evenodd">
                                    <g transform="translate(-9 -11)" fill="#1F73F1" fill-rule="nonzero">
                                        <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                                    </g>
                                    </g>
                                </svg>
                                </div>
                                <small for="A3-yes" class="select-none text-gray-500">Tanggal pulang</small>
                            </label>
                            </div>                          
                            </div>
                                <div className="block xl:flex justify-between">
                                <div className={`grid grid-cols-1 lg:grid-cols-3 ${pulang ? 'xl:grid-cols-5' : 'xl:grid-cols-4'} mx-0 md:mx-12 xl:mx-4`}>
                            <FormControl className="" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                            <small className="mb-2 text-gray-500">Stasiun Asal</small>
                            <Autocomplete
                                classes={classes}
                                id="asynchronous-demo"
                                disableClearable
                                PopperComponent={PopperMy}
                                open={openBerangka}
                                hiddenLabel={true}
                                onOpen={() => {
                                    SetopenBerangka(true);
                                }}
                                onClose={() => {
                                    SetopenBerangka(false);
                                }}
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
                                isOptionEqualToValue={(option, value) => option.title === value.title}
                                getOptionLabel={(option) => option.bandara + " - " + option.name + " - " + option.code}            
                                options={pesawatData}
                                onChange={(event, newValue) => {
                                    setKeberangkatan(newValue);
                                }}
                                loading={loadingBerangkat}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (<FaPlaneDeparture className="text-gray-400"/>),
                                        placeholder:"Asal",
                                        endAdornment: (
                                        <React.Fragment>
                                            {loadingBerangkat ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                        ),
                                    }}
                                    />
                                )
                            }
                                />
                            </FormControl>
                            <FormControl className="" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                            <small className="mb-2 text-gray-500">Stasiun Tujuan</small>
                            <Autocomplete
                                classes={classes}                            
                                PopperComponent={PopperMy}
                                id="asynchronous-demo"
                                open={openTujuan}
                                hiddenLabel={true}
                                onOpen={() => {
                                    setOpenTujuan(true);
                                }}
                                onClose={() => {
                                    setOpenTujuan(false);
                                }}
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
                                isOptionEqualToValue={(option, value) => option.title === value.title}
                                getOptionLabel={(option) => option.bandara + " - " + option.name + " - " + option.code}            
                                options={pesawatData}
                                onChange={(event, newValue) => {
                                    setTujuan(newValue);
                                }}
                                loading={loadingTujuan}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (<FaPlaneArrival className="text-gray-400"/>),
                                        placeholder:"Tujuan",
                                        endAdornment: (
                                        <React.Fragment>
                                            {loadingTujuan ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                        ),
                                    }}
                                    />
                                )
                            }
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 120 }}> 
                            <small className="mb-2 text-gray-500">Tanggal Berangkat</small>
                            <LocalizationProvider 
                            dateAdapter={AdapterDayjs}>
                                <DatePicker
                                        minDate={new Date()}                               
                                        value={tanggalKeberangkatan}
                                        className={classes.root}
                                        onChange={(newValue) => {
                                        setTanggalKeberangkatan(newValue);
                                        }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            </FormControl>
                    {
                        pulang ? (
                            <FormControl sx={{ m: 1, minWidth: 120 }}> 
                            <small className="mb-2 text-gray-500">Tanggal Pulang</small>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                minDate={new Date()}        
                                value={tanggalTujuan}
                                className={classes.root}
                                onChange={(newValue) => {
                                setTanggalTujuan(newValue);
                                }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            </FormControl>
                        ) : (
                            <>
                            </>
                        )

                    }
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <small className="mb-2 text-gray-500">Total Penumpang</small>
                        <TextField  onClick={ handleClick} sx={{ input: { cursor: 'pointer' } }}  size="medium" classes={classes} id="outlined-basic" value={`${parseInt(adult) + parseInt(infant) + parseInt(child)} Penumpang`} variant="outlined" />       
                            <div id="basic-menu" className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg`}>
                                <div className="w-full ml-4 block md:mx-0">
                                    <div className="mt-4 w-full items-center text-gray-600">
                                        <div className="text-sm text-center header-number">
                                            <p>Adult (Dewasa {'>'} 12 thn)</p>
                                        </div>
                                        <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                                        <button onClick={plusAdult} class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none">
                                            <span class="m-auto text-2xl font-thin">+</span>
                                        </button>
                                            <input type="number" class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none" name="custom-input-number" value={adult} />
                                        <button onClick={minusAdult} class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer">
                                            <span class="m-auto text-2xl font-thin">-</span>
                                        </button>
                                        </div>                          
                                    </div>
                                    <div className="mt-4 w-full items-center text-gray-600">
                                        <div className="text-sm text-center header-number">
                                            <p>Child (Child 2-11 thn)</p>
                                        </div>
                                        <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                                        <button onClick={plusChild} class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none">
                                            <span class="m-auto text-2xl font-thin">+</span>
                                        </button>
                                            <input type="number" class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none" name="custom-input-number" value={child} />
                                        <button onClick={minusChild} class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer">
                                            <span class="m-auto text-2xl font-thin">-</span>
                                        </button>
                                        </div>                          
                                    </div>                        
                                    <div className="mt-4 w-full items-center text-gray-600">
                                        <div className="text-sm text-center header-number">
                                            <p>Infant (Infant 0-2 thn)</p>
                                        </div>
                                        <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                                        <button onClick={plusInfant} class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none">
                                            <span class="m-auto text-2xl font-thin">+</span>
                                        </button>
                                            <input type="number" class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none" name="custom-input-number" value={infant} />
                                        <button onClick={minusInfant} class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer">
                                            <span class="m-auto text-2xl font-thin">-</span>
                                        </button>
                                        </div>                          
                                    </div>                         
                                </div>                         
                            </div>
                    </FormControl>
                            </div>
                            <div className="w-full pr-4 xl:mr-0 xl:w-1/4 flex justify-end xl:justify-start mt-8 py-0.5">
                                <Button block size="large" key="submit"  type="primary" className='bg-blue-500 mx-2 font-semibold' loading={isLoading} onClick={handlerCariPesawat}>
                                    Cari Tiket
                                </Button>
                            </div>  
                        </div>                                                       
                        </>
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