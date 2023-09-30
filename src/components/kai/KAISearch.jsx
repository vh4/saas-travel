
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Chip } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import {Popper } from "@mui/material";
import {FaTrain} from 'react-icons/fa'
import onClickOutside from "react-onclickoutside";
import { makeStyles } from '@mui/styles';
import { Button } from 'antd';

function KAI(){

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
    
    const [kai, setKAI] = React.useState({});
    const [kaiData, setKAIData] = React.useState([]);
    const i = 0;

    const [openBerangka, SetopenBerangka] = React.useState(false);
    const [openTujuan, setOpenTujuan] = React.useState(false);
    

    const loadingBerangkat = openBerangka && kaiData.length === 0;
    const loadingTujuan = openTujuan && kaiData.length === 0;

    //input
    const [keberangkatan, setKeberangkatan] = React.useState();
    const [tujuan, setTujuan] = React.useState();
    const [tanggal, setTanggal] = React.useState();
    const [isLoading, setLoading] = React.useState(false);
    const [adult, setadult] = React.useState(1);
    const [infant, setinfant] = React.useState(0);

    const [anchorEl, setAnchorEl] = React.useState('hidden');
    const handleClick = () => {
        anchorEl === 'hidden' ? setAnchorEl('grid') : setAnchorEl('hidden');
    }

    KAI.handleClickOutside = () =>{
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
          await sleep(1e3);
    
          if (active) {
            setKAIData([...kai.data]);
          }
        })();
    
        return () => {
          active = false;
        };
      }, [loadingBerangkat]);
    
      React.useEffect(() => {
        if (!openBerangka) {
            setKAIData([]);
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
            setKAIData([...kai.data]);
          }
        })();
    
        return () => {
          active = false;
        };
      }, [loadingTujuan]);
    
      React.useEffect(() => {
        if (!openTujuan) {
            setKAIData([]);
        }
      }, [openTujuan]);
    

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

    React.useEffect(() => {

        getKAIdata();

    }, []);

    async function getKAIdata(){

        try {

            const response = await axios.post(`${process.env.REACT_APP_HOST_API}/travel/train/station`, {
                token: JSON.parse(localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)),
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

        let tanggalNullFill = new Date();
        tanggalNullFill = tanggalNullFill.getFullYear() + '-' + parseInt(tanggalNullFill.getMonth()) + 1 + '-' + tanggalNullFill.getDate();

        const tanggalParse = tanggal !== undefined && tanggal !== null ? tanggal.$y + '-' + (addLeadingZero(parseInt(tanggal.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggal.$D)).toString() : tanggalNullFill;

        setTimeout(() => {
            e.preventDefault();
            setLoading(false);

            const params = {
                origin: keberangkatan.id_stasiun,
                destination:tujuan.id_stasiun,
                productCode: 'WKAI',
                date:tanggalParse,
                kotaBerangkat:keberangkatan.nama_kota,
                kotaTujuan:tujuan.nama_kota,
                stasiunBerangkat:keberangkatan.nama_stasiun,
                stasiunTujuan:tujuan.nama_stasiun,
                adult:adult,
                infant:infant,
                ubah:'cari'
            }

            var str = "";
            for (var key in params) {
                if (str != "") {
                    str += "&";
                }
                str += key + "=" + encodeURIComponent(params[key]);
            } 
            
            window.location = `search?${str}`;  

        }, 1000);


    }

    return (
        <>     
            <div className="row bg-white border-t border-gray-200 w-full p-2 pr-0">
                <div class="w-full p-4 py-4 xl:px-8 rounded-lg shadow-xs ">
                    <form className="w-full">
                        {/* <div className="space-x-2 items-center flex">
                            < BiTrain className="text-gray-600" size={24} />
                            <div className="text-sm md:text-sm font-bold text-slate-700">TRAINS</div>
                        </div> */}
                            <>
                            <div className='block xl:flex justify-between'>
                                <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 md:mx-12 xl:mx-6">
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
                                        getOptionLabel={(option) => option.nama_stasiun + ' - ' + option.nama_kota + ' - ' + option.id_stasiun}
                                        options={kaiData}
                                        onChange={(event, newValue) => {
                                            setKeberangkatan(newValue);
                                        }}
                                        loading={loadingBerangkat}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (<FaTrain className="text-gray-400"/>),
                                                placeholder:"Stasiun Asal",
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
                                        getOptionLabel={(option) => option.nama_stasiun + ' - ' + option.nama_kota + ' - ' + option.id_stasiun}
                                        options={kaiData}
                                        onChange={(event, newValue) => {
                                            setTujuan(newValue);
                                        }}
                                        loading={loadingTujuan}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (<FaTrain className="text-gray-400"/>),
                                                placeholder:"Stasiun Asal",
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
                                            value={tanggal}
                                            className={classes.root}
                                            onChange={(newValue) => {
                                            setTanggal(newValue);
                                            }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                </FormControl>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <small className="mb-2 text-gray-500">Total Penumpang</small>
                                <TextField onClick={ handleClick} sx={{ input: { cursor: 'pointer' } }} size="medium" classes={classes} id="outlined-basic" value={`${parseInt(adult) + parseInt(infant)} Penumpang`} variant="outlined" />       
                                    <div id="basic-menu" className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg shadow-md `}>
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
                                <div className="w-full pr-4 xl:mr-0 xl:pl-4 xl:w-1/4 flex justify-end xl:justify-start mt-8 py-0.5">
                                
                                <Button block size="large" key="submit"  type="primary" className='bg-blue-500 font-semibold' loading={isLoading} onClick={handlerCariKai}>
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
    handleClickOutside: () => KAI.handleClickOutside,
  };
  
export default onClickOutside(KAI, clickOutsideConfig);