import * as React from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { Popper } from "@mui/material";
import { FaTrain } from "react-icons/fa";
import onClickOutside from "react-onclickoutside";
import { makeStyles } from "@mui/styles";
import { Button, DatePicker, message } from "antd";
import Cookies from "js-cookie";
import { AiOutlineSwap } from "react-icons/ai";
import { InputGroup, InputNumber } from "rsuite";
import dayjs from "dayjs";


function KAI(){

    const useStyles = makeStyles((theme) => ({
        inputRoot: {
            color:"black",
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
              color:"black"
            },
          },
          root: {
              
              "& .MuiInputBase-root": {
                "& .MuiInputBase-input": {
                  padding: 10,
                  borderRadius:10,
                  cursor: "pointer"
                },
                color:"black",
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
    
    let coockie = Cookies.get("v-train");

    let depa = { id_stasiun: "PSE", nama_stasiun: "PASAR SENEN", nama_kota: "JAKARTA", is_active: 1 };
    let arri = { id_stasiun: "SGU", nama_stasiun: "SURABAYA GUBENG", nama_kota: "SURABAYA", is_active: 1 };
    let dateCookie = Cookies.get("v-date") ? Cookies.get("v-date") : dayjs();
    let adultCookie = parseInt(Cookies.get("v-adult") ? Cookies.get("v-adult") : '');
    let infantCookie = parseInt(Cookies.get("v-infant") ? Cookies.get("v-infant") : '');
  
    try {
      coockie = coockie ? JSON.parse(coockie) : null;
      depa = coockie.keberangkatan;
      arri = coockie.tujuan;
    } catch (error) {
      coockie = null;
      depa = { id_stasiun: "PSE", nama_stasiun: "PASAR SENEN", nama_kota: "JAKARTA", is_active: 1 };;
      arri = { id_stasiun: "SGU", nama_stasiun: "SURABAYA GUBENG", nama_kota: "SURABAYA", is_active: 1 };
    }
  
    try {
      dateCookie = dayjs(dateCookie).isValid() ? dateCookie : null;
  
    } catch (error) {
      dateCookie = null;
    }
  
    try {
      adultCookie = !isNaN(adultCookie) ? adultCookie : null;
  
    } catch (error) {
      adultCookie = null;
    }
  
    try {
      infantCookie = !isNaN(infantCookie) ? infantCookie : null;
  
    } catch (error) {
      infantCookie = null;
    }
  
    try {
      depa = depa ? depa : { id_stasiun: "PSE", nama_stasiun: "PASAR SENEN", nama_kota: "JAKARTA", is_active: 1 };
    } catch (error) {
      depa = { id_stasiun: "PSE", nama_stasiun: "PASAR SENEN", nama_kota: "JAKARTA", is_active: 1 };
    }
  
    try {
      arri = arri ? arri : { id_stasiun: "SGU", nama_stasiun: "SURABAYA GUBENG", nama_kota: "SURABAYA", is_active: 1 };
    } catch (error) {
      arri = { id_stasiun: "SGU", nama_stasiun: "SURABAYA GUBENG", nama_kota: "SURABAYA", is_active: 1 };
    }
  
    depa = depa?.id_stasiun && depa?.nama_kota ? depa : null;
    arri = arri?.id_stasiun && arri?.nama_kota ? arri : null;
    dateCookie = dateCookie ? dayjs(dateCookie) : dayjs();
    adultCookie = adultCookie ? adultCookie : 1;
    infantCookie = infantCookie ? infantCookie : 0;

    //input
    const [keberangkatan, setKeberangkatan] = React.useState(depa);
    const [tujuan, setTujuan] = React.useState(arri);
    const [tanggal, setTanggal] = React.useState(dateCookie);
    const [isLoading, setLoading] = React.useState(false);
    const [adult, setadult] = React.useState(adultCookie);
    const [infant, setinfant] = React.useState(infantCookie);

    const [anchorEl, setAnchorEl] = React.useState('hidden');
    const handleClick = () => {
        anchorEl === 'hidden' ? setAnchorEl('grid') : setAnchorEl('hidden');
    }

    const [messageApi, contextHolder] = message.useMessage();

    const errorBerangkat = () => {
      messageApi.open({
        type: 'error',
        content: 'Kota Asal tidak boleh sama dengan Kota Tujuan.',
        duration: 10, // Durasi pesan 5 detik
        top: '50%', // Posisi pesan di tengah layar
        className: 'custom-message', // Tambahkan kelas CSS kustom jika diperlukan
      });
    };
    
  
    const errorTujuan = () => {
      messageApi.open({
        type: 'error',
        content: 'Kota Tujuan tidak boleh sama dengan Kota Asal.',
        duration: 10, // Durasi pesan 5 detik
        top: '50%', // Posisi pesan di tengah layar
        className: 'custom-message', // Tambahkan kelas CSS kustom jika diperlukan
      });
    };

    const messageCustomError = (message) => {
      messageApi.open({
        type: 'error',
        content: message,
        duration: 10, // Durasi pesan 5 detik
        top: '50%', // Posisi pesan di tengah layar
        className: 'custom-message', // Tambahkan kelas CSS kustom jika diperlukan
      });
    };
  

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
    

      function plusAdult(e) {
        e.preventDefault();
        
        if (adult >= 4) {
          setadult(4);
        } else {
          setadult(parseInt(adult) + 1);
        }
      }
    
      function minusAdult(e) {
        e.preventDefault();
    
        if((adult <= infant)){
          setadult(parseInt(adult))
        }else{      
          if (adult < 1 || adult === 1) {
            setadult(1);
          } else {
            setadult(parseInt(adult) - 1);
          }
        }
    
      }
    
      function plusInfant(e) {
        e.preventDefault();
    
        if(adult <= infant){
          setinfant(parseInt(infant));
        }else{
          if (infant >= 4) {
            setinfant(4);
          } else {
            setinfant(parseInt(infant) + 1);
          }
        }
    
      }
    
      function minusInfant(e) {
        e.preventDefault();
    
        if (infant < 0 || infant === 0) {
          setinfant(0);
        } else {
          setinfant(parseInt(infant) - 1);
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
    
            const resSetKai = {
              data: response.data.data.filter(item => item.nama_kota !== "unknown"),
              rc:'00',
              rd:'success'
            };
      
            setKAI(resSetKai);
            
        } catch (error) {
            setKAI([]);
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
        tanggalNullFill = tanggalNullFill.getFullYear() + '-' + (parseInt(tanggalNullFill.getMonth()) + 1) + '-' + tanggalNullFill.getDate();

        const tanggalParse = tanggal !== undefined && tanggal !== null ? tanggal.$y + '-' + (addLeadingZero(parseInt(tanggal.$M) + 1)).toString()  + '-' + addLeadingZero(parseInt(tanggal.$D)).toString() : tanggalNullFill;

        setTimeout(() => {
            e.preventDefault();
            setLoading(false);

            if(keberangkatan === null && tujuan === null){
              messageCustomError('Pilih Kota Asal & Kota Tujuan.')
            }
            else if(keberangkatan === null){
              messageCustomError('Pilih Kota Asal.')
              
            }else if(tujuan === null){
              messageCustomError('Pilih Kota Tujuan.')
      
            }else{

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

              const expirationDate = new Date();
              expirationDate.setHours(expirationDate.getHours() + 1);
  
              const cookieOptions = {
              expires: expirationDate,
              };
  
              Cookies.set('v-train', JSON.stringify({
                  keberangkatan,
                  tujuan,
              }), cookieOptions);

              Cookies.set("v-date", tanggal.toString(), cookieOptions);
              Cookies.set("v-adult", adult, cookieOptions);
              Cookies.set("v-infant", infant, cookieOptions);
  
              var str = "";
              for (var key in params) {
                  if (str != "") {
                      str += "&";
                  }
                  str += key + "=" + encodeURIComponent(params[key]);
              } 
              
              window.location = `search?${str}`;  

            }

        }, 1000);


    }

    const changeStatiun = () => {

        setKeberangkatan(tujuan);
        setTujuan(keberangkatan);
    
      }

    return (
        <>
          {contextHolder}
          <div className="row bg-white border-t border-gray-200 w-full pr-0">
          <div class="w-full py-4 rounded-lg shadow-xs ">
            <form className="w-full">
              <>
                <div className="block xl:flex justify-between">
                  <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 gap-4 md:gap-8">
                  <div className="w-full col col-span-1 md:col-span-2">
                      <div className="w-full flex items-center">
                          <FormControl
                              className=""
                              sx={{ m: 1, minWidth: 150, outline: "none" }}
                          >
                              <small className="mb-2 text-gray-500">Kota Asal</small>
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
                              isOptionEqualToValue={(option, value) =>
                                  option.title === value.title
                              }
                              getOptionLabel={(option) =>
                                  option.nama_stasiun +
                                  " - " +
                                  option.nama_kota +
                                  " - " +
                                  option.id_stasiun
                              }
                              options={kaiData}
                              value={keberangkatan}
                              onChange={(event, newValue) => {
                                if((newValue == tujuan) || (newValue?.id_stasiun == tujuan?.id_stasiun)){
                                  errorBerangkat()
                                  setKeberangkatan(keberangkatan);
                                }else{
                                  setKeberangkatan(newValue);
                                }
                              }}
                              loading={loadingBerangkat}
                              renderInput={(params) => (
                                  <TextField
                                  {...params}
                                  InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                      <FaTrain className="text-gray-400" />
                                      ),
                                      placeholder: "Kota Asal",
                                      endAdornment: (
                                      <React.Fragment>
                                          {loadingBerangkat ? (
                                          <CircularProgress color="inherit" size={20} />
                                          ) : null}
                                          {params.InputProps.endAdornment}
                                      </React.Fragment>
                                      ),
                                  }}
                                  />
                              )}
                              />
                          </FormControl>
                          <div onClick={changeStatiun} className="cursor-pointer mt-4 flex justify-center items-center bg-blue-500 rounded-full p-1">
                              <AiOutlineSwap className="text-white" size={24} />
                          </div>
                          <FormControl
                              className=""
                              sx={{ m: 1, minWidth: 145, outline: "none" }}
                          >
                              <small className="mb-2 text-gray-500">Kota Tujuan</small>
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
                              isOptionEqualToValue={(option, value) =>
                                  option.title === value.title
                              }
                              getOptionLabel={(option) =>
                                  option.nama_stasiun +
                                  " - " +
                                  option.nama_kota +
                                  " - " +
                                  option.id_stasiun
                              }
                              options={kaiData}
                              value={tujuan}
                              onChange={(event, newValue) => {
                                  if((newValue == keberangkatan) || (newValue?.id_stasiun == keberangkatan?.id_stasiun)){
                                    errorTujuan()
                                    setTujuan(tujuan);
                                  }else{
                                    setTujuan(newValue);
                                  }

                              }}
                              loading={loadingTujuan}
                              renderInput={(params) => (
                                  <TextField
                                  {...params}
                                  InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                      <FaTrain className="text-gray-400" />
                                      ),
                                      placeholder: "Kota Asal",
                                      endAdornment: (
                                      <React.Fragment>
                                          {loadingTujuan ? (
                                          <CircularProgress color="inherit" size={20} />
                                          ) : null}
                                          {params.InputProps.endAdornment}
                                      </React.Fragment>
                                      ),
                                  }}
                                  />
                              )}
                              />
                          </FormControl>
                      </div>
                    </div>
                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                      <small className="mb-2 text-gray-500">
                        Tanggal Berangkat
                      </small>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        style={{ cursor: "pointer" }}
                      >
                  <DatePicker
                      style={{ cursor: 'pointer' }}
                      className="border-gray-240 py-2"
                      appearance="subtle"
                      value={tanggal}
                      inputStyle={{ color: 'red' }}
                      format="DD/MM/YYYY"
                      onChange={(value) => {
                        setTanggal(value);
                      }}
                      size="large"
                      disabledDate={(current) => {
                        const currentDate = dayjs();
                        const aheadDate = dayjs().add(3, 'months')
                        return current && (current < currentDate.startOf('day') || current > aheadDate);
                      }}
                    />
                      </LocalizationProvider>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <small className="mb-2 text-gray-500">
                        Total Penumpang
                      </small>
                      <div className="hidden md:block">
                        <TextField
                          readOnly
                          onClick={handleClick}
                          sx={{ input: { cursor: "pointer" } }}
                          size="medium"
                          classes={classes}
                          id="outlined-basic"
                          value={`${parseInt(adult) + parseInt(infant)} Penumpang`}
                          variant="outlined"
                        />
                      </div>
                        <Button className="w-full block md:hidden text-gray-500" size="large" onClick={handleClick}>
                        {`${parseInt(adult) + parseInt(infant)} Penumpang`}
                        </Button>
                      <div
                        id="basic-menu"
                        className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg shadow-md `}
                      >
                        <div className="w-full md:w-48 ml-4 block md:mx-0">
                          <div className="mt-4 w-full items-center text-gray-600">
                            <div className="w-full items-center text-gray-600">
                            <div className="text-sm text-center header-number mb-4">
                              <p>Adult (≥ 3 thn)</p>
                            </div>
                            <InputGroup>
                              <InputGroup.Button onClick={minusAdult}>-</InputGroup.Button>
                                <input type={"number"} className={'block text-center w-full focus:outline-0 selection:border-blue-500'} value={adult} onChange={setadult} min={1} max={4} readOnly/>
                              <InputGroup.Button onClick={plusAdult}>+</InputGroup.Button>
                            </InputGroup>
                          </div>
                          </div>
                          <div className="mt-4 w-full items-center text-gray-600">
                            <div className="mt-4 w-full items-center text-gray-600">
                            <div className="text-sm text-center header-number mb-4">
                                <p>Infant ({`<`} 3 thn) </p>
                            </div>
                            <InputGroup>
                              <InputGroup.Button onClick={minusInfant}>-</InputGroup.Button>
                                <input type={"number"} className={'block text-center w-full focus:outline-0 selection:border-blue-500'} value={infant} onChange={setinfant} min={0} max={4} readOnly/>
                              <InputGroup.Button onClick={plusInfant}>+</InputGroup.Button>
                          </InputGroup>
                          </div>
                          </div>
                        </div>
                      </div>
                    </FormControl>
                  </div>
                  <div className="w-full xl:mr-0 xl:pl-4 xl:w-2/5 flex justify-end xl:justify-start mt-8 py-0.5">
                    <Button
                      block
                      size="large"
                      key="submit"
                      type="primary"
                      className="bg-blue-500 font-semibold"
                      loading={isLoading}
                      onClick={handlerCariKai}
                    >
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