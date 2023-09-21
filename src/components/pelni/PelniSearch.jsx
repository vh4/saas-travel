
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { Chip } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import {Popper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { makeStyles } from '@mui/styles';
import { Button } from 'antd';
import {IoBoatSharp} from 'react-icons/io5'
import { DateRangePicker } from 'rsuite';

function PELNI(){

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


    const PopperMy = function (props) {
        return (<Popper {...props} style={{ width: 350 }} placement='bottom-start' />)
    };
    
    const classes = useStyles();
    
    const [pelni, setPelni] = React.useState({});
    const [pelniData, setPelniData] = React.useState([]);
    const i = 0;

    const [openBerangka, SetopenBerangka] = React.useState(false);
    const [openTujuan, setOpenTujuan] = React.useState(false);
    
    const loadingBerangkat = openBerangka && pelniData.length === 0;
    const loadingTujuan = openTujuan && pelniData.length === 0;

    //input
    const [keberangkatan, setKeberangkatan] = React.useState();
    const [tujuan, setTujuan] = React.useState();
    const [tanggal, setTanggal] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const [laki, setLaki] = React.useState(1);
    const [wanita, setWanita] = React.useState(0);

    const [anchorEl, setAnchorEl] = React.useState('hidden');
    const handleClick = () => {
        anchorEl === 'hidden' ? setAnchorEl('grid') : setAnchorEl('hidden');
    }

    PELNI.handleClickOutside = () =>{
        setAnchorEl('hidden');
      };


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
            setPelniData([...pelni.data]);
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
            setPelniData([...pelni.data]);
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
    

    const navigate = useNavigate();


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

    React.useEffect(() => {

        getPelnidata();

    }, []);

    async function getPelnidata(){

        try {

            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/pelni/get_origin`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
            });
    
            setPelni(response.data);
            
        } catch (error) {
            setPelni({message: error.message});
        }

    }

    function addLeadingZero(num) {
        if (num < 10) {
          return '0' + num;
        } else {
          return '' + num;
        }
      }

    function formatDate(date) {
        return date.getFullYear() + '-' + addLeadingZero(date.getMonth() + 1) + '-' + addLeadingZero(date.getDate());
    }

    async function handlerCariPelni(e){

        setLoading(true);

        let startDate = new Date(tanggal && tanggal[0] || new Date());
        let endDate = new Date(tanggal && tanggal[1] || new Date());
        
        startDate = formatDate(startDate);
        endDate = formatDate(endDate);
        
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

            var str = "";
            for (var key in params) {
                if (str != "") {
                    str += "&";
                }
                str += key + "=" + encodeURIComponent(params[key]);
            } 
            
            localStorage.setItem('p_search', JSON.stringify(params))

            window.location = `search?${str}`;  

        }, 1000);


    }

    const { allowedMaxDays, beforeToday, combine } = DateRangePicker;

    const disabledDateRule = combine(
        allowedMaxDays(30), // Menonaktifkan tanggal lebih dari 7 hari dari tanggal saat ini
        beforeToday()      // Menonaktifkan tanggal yang kurang dari tanggal saat ini
      );

    return (
        <>     
            <div className="row bg-white border-t border-gray-200 w-full p-2 pr-0">
                <div class="w-full p-4 py-4 xl:px-8 rounded-lg shadow-xs">
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
                                    <DateRangePicker block onChange={(e) => setTanggal(e)} size="lg" sx={{width:'100%'}} placeholder='yyyy-mm-dd yyyy-mm-dd' className='text-gray-300' disabledDate={disabledDateRule}/>
                                </div>
                                </FormControl>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <small className="mb-2 text-gray-500">Total Penumpang</small>
                                <TextField onClick={ handleClick} sx={{ input: { cursor: 'pointer' } }} variant="outlined" size="small" classes={classes} id="outlined-basic" value={`${parseInt(laki) + parseInt(wanita)} Penumpang`} variant="outlined" />       
                                    <div id="basic-menu" className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 text-sm bg-white border border-gray-100 rounded-lg shadow-md `}>
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
                                <Button block size="large" key="submit"  type="primary" className='bg-blue-500 mx-2 font-semibold' loading={isLoading} onClick={handlerCariPelni}>
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
    handleClickOutside: () => PELNI.handleClickOutside,
  };
  
export default onClickOutside(PELNI, clickOutsideConfig);