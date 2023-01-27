
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { Chip } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import {Popper } from "@mui/material";
import {IoBoatSharp} from 'react-icons/io5'
import { useNavigate, createSearchParams } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { makeStyles } from '@mui/styles';
import { DateRangePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";

function Pelni(){

    const [anchorEl, setAnchorEl] = React.useState('hidden');
    const handleClick = () => {
        anchorEl === 'hidden' ? setAnchorEl('grid') : setAnchorEl('hidden');
    }

    Pelni.handleClickOutside = () => {
        setAnchorEl('hidden');
      };

    const navigate = useNavigate();
    
    const [isLoading, setLoading] = React.useState(false);
    const [pelniStasiun, setpelniStasiun] = React.useState({});
    const [laki, setLaki] = React.useState(1);
    const [wanita, setWanita] = React.useState(0);

    const [openBerangka, SetopenBerangka] = React.useState(false);
    const [openTujuan, setOpenTujuan] = React.useState(false);

    const [pelniData, setPelniData] = React.useState([]);
    const loadingBerangkat = openBerangka && pelniData.length === 0;
    const loadingTujuan = openTujuan && pelniData.length === 0;

    //input
    const [keberangkatan, setKeberangkatan] = React.useState();
    const [tujuan, setTujuan] = React.useState();
    const [tanggal, setTanggal] = React.useState();

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
                setPelniData([...pelniStasiun.data]);
            }
            })();

            return () => {
            active = false;
            };
        }, [loadingBerangkat]);

        React.useEffect(() => {
            if (!openBerangka) {
            setPelniData([]);
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
                setPelniData([...pelniStasiun.data]);
            }
            })();

            return () => {
            active = false;
            };
        }, [loadingTujuan]);

        React.useEffect(() => {
            if (!openTujuan) {
            setPelniData([]);
            }
        }, [openTujuan]);



        React.useEffect(() => {
            getPelnitDataStasiun();

        }, []);

        const PopperMy = function (props) {
            return (<Popper {...props} style={{ width: 350 }} placement='bottom-start' />)
        };

        function plusLaki(e){
            e.preventDefault();
            if(laki >= 4){
                setLaki(4);
            }else{
                setLaki(laki + 1);
            }

        }

        function minusLaki(e){
            e.preventDefault();

            if(laki < 1 || laki === 1){
                setLaki(1);
            }
            else{
                setLaki(laki - 1);
            }
            
        }

        function plusWanita(e){
            e.preventDefault();
            if(wanita >= 4){
                setWanita(4);
            }else{
                setWanita(wanita + 1);
            }
        }

        function minusWanita(e){
            e.preventDefault();

            if(wanita < 0 || wanita === 0){
                setWanita(0);
            }else{
                setWanita(wanita - 1);
            }

        }

        function addLeadingZero(num) {
            if (num < 10) {
            return '0' + num;
            } else {
            return '' + num;
            }
        }

        async function getPelnitDataStasiun(){
            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/pelni/get_origin`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            });

            setpelniStasiun(response.data);

        }

        function handleSubmitPelni(e){
            e.preventDefault();
            setLoading(true);

            let startDate= new Date(tanggal[0] ? tanggal[0] : null);
                startDate= startDate.getFullYear()+'-'+addLeadingZero(parseInt(startDate.getMonth()) + 1)+'-'+addLeadingZero(parseInt(startDate.getDate()) + 1);
            let endDate= new Date(tanggal[1] ? tanggal[1] : null);
                endDate= endDate.getFullYear()+'-'+addLeadingZero(parseInt(endDate.getMonth()) + 1)+'-'+addLeadingZero(parseInt(endDate.getDate()) + 1);

            setTimeout(() => {
                e.preventDefault();
                setLoading(false);
    
                const params = {
                    origin: keberangkatan.CODE,
                    destination: tujuan.CODE,
                    originName:keberangkatan.NAME,
                    destinationName:tujuan.NAME,
                    startDate: startDate,
                    endDate: endDate,
                    laki:laki,
                    wanita:wanita
                };
    
                navigate({
                    pathname: '/pelni/search',
                    search: `?${createSearchParams(params)}`,
                  });
    
            }, 1000);

        }


    return (
        <>     
            <div className="row bg-white border-t border-gray-200 w-full p-2 pr-0">
                <div class="w-full p-4 py-4 xl:px-8 rounded-lg shadow-xs dark:bg-gray-800 dark:border-gray-700">
                    <form className="w-full">
                        {/* <div className="space-x-2 items-center flex">
                            < BiTrain className="text-gray-600" size={24} />
                            <div className="text-sm md:text-md font-bold text-slate-700">TRAINS</div>
                        </div> */}
                            <>
                            <div className='block xl:flex justify-between'>
                                <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 md:mx-12 xl:mx-6">
                                <FormControl className="" sx={{ m: 1, minWidth: 120, outline: 'none' }} >
                                    <small className="mb-2 text-gray-500">Pelabuhan Asal</small>
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
                                        getOptionLabel={(option) => option.NAME}
                                        options={pelniData}
                                        onChange={(event, newValue) => {
                                            setKeberangkatan(newValue);
                                        }}
                                        loading={loadingBerangkat}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (<IoBoatSharp className="text-gray-400"/>),
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
                                    <small className="mb-2 text-gray-500">Pelabuhan Tujuan</small>
                                    <Autocomplete
                                        classes={classes}
                                        id="asynchronous-demo"
                                        disableClearable
                                        PopperComponent={PopperMy}
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
                                        getOptionLabel={(option) => option.NAME}
                                        options={pelniData}
                                        onChange={(event, newValue) => {
                                            setTujuan(newValue);
                                        }}
                                        loading={loadingTujuan}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (<IoBoatSharp className="text-gray-400"/>),
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
                                <small className="mb-2 text-gray-500">Range Tanggal</small>
                                <div className='w-full'>
                                    <DateRangePicker onChange={(e) => setTanggal(e)} size="lg" sx={{width:'100%'}} placeholder='yyyy-mm-dd yyyy-mm-dd' className='text-gray-300'/>
                                </div>
                                </FormControl>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <small className="mb-2 text-gray-500">Total Penumpang</small>
                                <TextField onClick={ handleClick} sx={{ input: { cursor: 'pointer' } }} variant="outlined" size="small" classes={classes} id="outlined-basic" value={`${parseInt(laki) + parseInt(wanita)} Penumpang`} variant="outlined" />       
                                    <div id="basic-menu" className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 text-sm bg-white border border-gray-100 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-700`}>
                                        <div className="w-full ml-4 block md:mx-0">
                                            <div className="mt-4 w-full items-center text-gray-600">
                                                <div className="text-sm text-center header-number">
                                                    <p>laki (Laki-laki {'>'} 12 thn)</p>
                                                </div>
                                                <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                                                <button onClick={plusLaki} class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none">
                                                    <span class="m-auto text-2xl font-thin">+</span>
                                                </button>
                                                    <input type="number" class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none" name="custom-input-number" value={laki} />
                                                <button onClick={minusLaki} class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer">
                                                    <span class="m-auto text-2xl font-thin">-</span>
                                                </button>
                                                </div>                          
                                            </div>                       
                                            <div className="mt-4 mb-8 w-full items-center text-gray-600">
                                                <div className="text-sm text-center header-number">
                                                    <p>Wanita (Wanita {'>'} 12 thn)</p>
                                                </div>
                                                <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                                                <button onClick={plusWanita} class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none">
                                                    <span class="m-auto text-2xl font-thin">+</span>
                                                </button>
                                                    <input type="number" class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none" name="custom-input-number" value={wanita} />
                                                <button onClick={minusWanita} class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer">
                                                    <span class="m-auto text-2xl font-thin">-</span>
                                                </button>
                                                </div>                          
                                            </div>                         
                                        </div>                         
                                    </div>
                                </FormControl>                                                         
                                </div>
                                <div className="w-full pr-4 xl:mr-0 xl:pl-4 xl:w-1/4 flex justify-end xl:justify-start mt-8 py-0.5">
                                <button onClick={handleSubmitPelni} type="button" class="text-white bg-blue-500 space-x-2 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm px-6 py-3 xl:py-0 text-center inline-flex items-center mb-2">
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
                                    <div className="text-white text-md font-bold">CARI TIKET</div>
                                )
                                }
                                </button>  
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
    handleClickOutside: () => Pelni.handleClickOutside,
  };
  
export default onClickOutside(Pelni, clickOutsideConfig);