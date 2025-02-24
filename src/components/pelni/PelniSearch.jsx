import * as React from "react";
import { Drawer, Popper, SwipeableDrawer, Button as ButtonMui } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Box, Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { IoBoatSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { InputGroup } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Button,  message } from "antd";
import Cookies from "js-cookie";
import { AiOutlineSwap } from "react-icons/ai";
import dayjs from "dayjs";
import { useState } from "react";
import ModalMui from "@mui/material/Modal";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { parseTanggalPelniMonth } from "../../helpers/date";
import { CiCalendarDate } from "react-icons/ci";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { makeStyles } from "@mui/styles";
import PelniMobile from "./components/PelniMobile";
import { LuUsers } from "react-icons/lu";



function Pelni() {
  const [anchorEl, setAnchorEl] = React.useState("hidden");
  const handleClick = () => {
    anchorEl === "hidden" ? setAnchorEl("grid") : setAnchorEl("hidden");
  };
  
  Pelni.handleClickOutside = () => {
    setAnchorEl("hidden");
  };
  
  const [openDate, setOpenDate] = React.useState(false);
  const [openMonth, setopenMonth] = React.useState(false);
  const [openYear, setopenYear] = React.useState(true);
  
  const handleOpenDate = () => setOpenDate(true);
  const handleCloseDate = () => {
    const maxYear = dayjs().add(2, 'year').year();
    const currentMonth = dayjs().month();
  
    if ((tanggal.year() === maxYear && tanggal.month() > currentMonth) || 
        (tanggal.year() === dayjs().year() && tanggal.month() < dayjs().month())
    ) {
      setTanggal(dayjs().set('year', maxYear).set('month', currentMonth));
    } 
  
    setOpenDate(false);
    setopenYear(true);
    setopenMonth(false);
  };
  
  const styleDesktop = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 400,
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
    px: 2,
    pt: 2,
  };
  
  const navigate = useNavigate();
  
  const [isLoading, setLoading] = React.useState(false);
  const [pelniStasiun, setpelniStasiun] = React.useState({});
  
  const [openBerangka, SetopenBerangka] = React.useState(false);
  const [openTujuan, setOpenTujuan] = React.useState(false);

  const [pelniData, setPelniData] = React.useState([]);
  const loadingBerangkat = openBerangka && pelniData.length === 0;
  const loadingTujuan = openTujuan && pelniData.length === 0;
  const [messageApi, contextHolder] = message.useMessage();
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = (newOpen, cancel = false, type="cancel") => () => {
    setOpenDrawer(newOpen);
    if(type ==='simpan'){
        setLaki(lakiTemp)
        setWanita(wanitaTemp)
    }
    else if(type ==='buka'){
      setLakiTemp(laki)
      setWanitaTemp(wanita)
  }
  };
  
  const useStylesDate = makeStyles({
    hideCalendarHeader: {
      '& .MuiPickersCalendarHeader-root': {
        display: 'none',
      },
    },
  });

  const classesDate = useStylesDate();
  

  const errorBerangkat = () => {
    messageApi.open({
      type: "error",
      content: "Pelabuhan Asal tidak boleh sama dengan Pelabuhan Tujuan.",
      duration: 10, // Durasi pesan 5 detik
      top: "50%", // Posisi pesan di tengah layar
      className: "custom-message", // Tambahkan kelas CSS kustom jika diperlukan
    });
  };

  const errorTujuan = () => {
    messageApi.open({
      type: "error",
      content: "Pelabuhan Tujuan tidak boleh sama dengan Pelabuhan Asal.",
      duration: 10, // Durasi pesan 5 detik
      top: "50%", // Posisi pesan di tengah layar
      className: "custom-message", // Tambahkan kelas CSS kustom jika diperlukan
    });
  };

  const messageCustomError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
      duration: 10, // Durasi pesan 5 detik
      top: "50%", // Posisi pesan di tengah layar
      className: "custom-message", // Tambahkan kelas CSS kustom jika diperlukan
    });
  };

  let depa = Cookies.get("d-depa");
  let arri = Cookies.get("d-arri");
  let lakiCookie = Cookies.get("d-laki");
  let wanitaCookie = Cookies.get("d-wanita");

  const tgl = Cookies.get("d-tanggal");

  let parsedTgl = null;

  try {
    lakiCookie = !isNaN(lakiCookie) ? lakiCookie : null;
  } catch (error) {
    lakiCookie = null;
  }

  try {
    wanitaCookie = !isNaN(wanitaCookie) ? wanitaCookie : null;
  } catch (error) {
    wanitaCookie = null;
  }

  try {
    depa = depa ? JSON.parse(depa) : null;
  } catch (error) {
    depa = null;
  }

  try {
    arri = arri ? JSON.parse(arri) : null;
  } catch (error) {
    arri = null;
  }

  try {
    parsedTgl = tgl ? tgl : null;
    if (!isNaN(dayjs(parsedTgl))) {
      parsedTgl = parsedTgl ? parsedTgl : null;
    } else {
      parsedTgl = null;
    }
  } catch (error) {
    parsedTgl = null;
  }

  depa =
    depa?.CODE && depa?.NAME
      ? depa
      : { CODE: "431", NAME: "TANJUNG PRIOK (JAKARTA)" };
  arri =
    arri?.CODE && arri?.NAME ? arri : { CODE: "144", NAME: "BELAWAN (MEDAN)" };
  lakiCookie = lakiCookie ? lakiCookie : 1;
  wanitaCookie = wanitaCookie ? wanitaCookie : 0;

  const today = parsedTgl ? dayjs(parsedTgl) : dayjs().startOf("month");

  // Input
  const [tanggal, setTanggal] = React.useState(today);

  const [laki, setLaki] = React.useState(lakiCookie);
  const [wanita, setWanita] = React.useState(wanitaCookie);

  const [lakiTemp, setLakiTemp] = React.useState(laki);
  const [wanitaTemp, setWanitaTemp] = React.useState(wanita);


  const [keberangkatan, setKeberangkatan] = React.useState(depa);
  const [tujuan, setTujuan] = React.useState(arri);

  const useStyles = makeStyles((theme) => ({
    inputRoot: {
      color: "black",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e5e7eb",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e5e7eb",
      },
      "&:Mui-actived .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d1d5db",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d1d5db",
      },
      "&&& $input": {
        padding: 1,
        color: "black",
        width: "50%",
      },
    },
    root: {
      "& .MuiInputBase-root": {
        "& .MuiInputBase-input": {
          padding: 10,
          borderRadius: 10,
          cursor: "pointer",
        },
        color: "black",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
        "&:Mui-actived .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb",
        },
      },
    },
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
    return (
      <Popper {...props} style={{ width: 350 }} placement="bottom-start" />
    );
  };

  function plusLaki(e) {
    e.preventDefault();
    if (lakiTemp >= 4) {
      setLakiTemp(4);
    } else {
      setLakiTemp(parseInt(lakiTemp) + 1);
    }
  }

  function minusLaki(e) {
    e.preventDefault();
    if(wanitaTemp > 0 && lakiTemp > 0){
      setLakiTemp(parseInt(lakiTemp) - 1);
    }if(wanitaTemp > 0 && lakiTemp >= 0){
      setLakiTemp(0);
    }else{
      setLakiTemp(1);
    }
    
  }

  function plusWanita(e) {
    e.preventDefault();
    if (wanitaTemp >= 4) {
      setWanitaTemp(4);
    } else {
      setWanitaTemp(parseInt(wanitaTemp) + 1);
    }
  }

  function minusWanita(e) {
    e.preventDefault();

    if (wanitaTemp <= 0) {
      setWanitaTemp(0);
    }else if (lakiTemp <= 0) {
      setWanitaTemp(1);
    }  else {
      setWanitaTemp(parseInt(wanitaTemp) - 1);
    }
  }

  async function getPelnitDataStasiun() {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/get_origin`,
      {
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      }
    );

    setpelniStasiun(response.data);
  }

  function handleSubmitPelni(e) {
    e.preventDefault();
    setLoading(true);

    const givenDate = dayjs(tanggal, "YYYY-MM");
    const daynow = dayjs();

    let startDate = givenDate.startOf("month").format("YYYY-MM-DD");
    let endDate = givenDate.endOf("month").format("YYYY-MM-DD");

    if (dayjs(startDate).isBefore(daynow)) {
      startDate = daynow.format("YYYY-MM-DD");
    }

    if (dayjs(endDate).isBefore(daynow)) {
      endDate = daynow.format("YYYY-MM-DD");
    }

    setTimeout(() => {
      e.preventDefault();
      setLoading(false);

      if (keberangkatan === null && tujuan === null) {
        messageCustomError("Pilih Pelabuhan Asal & Pelabuhan Tujuan.");
      } else if (keberangkatan === null) {
        messageCustomError("Pilih Pelabuhan Asal.");
      } else if (tujuan === null) {
        messageCustomError("Pilih Pelabuhan Tujuan.");
      } else {
        const params = {
          origin: keberangkatan.CODE,
          destination: tujuan.CODE,
          originName: keberangkatan.NAME,
          destinationName: tujuan.NAME,
          startDate: startDate,
          endDate: endDate,
          laki: laki,
          wanita: wanita,
        };

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        const cookieOptions = {
          expires: expirationDate,
        };

        Cookies.set("d-depa", JSON.stringify(keberangkatan), cookieOptions);
        Cookies.set("d-arri", JSON.stringify(tujuan), cookieOptions);
        Cookies.set("d-laki", laki, cookieOptions);
        Cookies.set("d-wanita", wanita, cookieOptions);
        Cookies.set("d-tanggal", tanggal, cookieOptions);

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
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center row bg-white border-t border-gray-200 w-full pr-0">
      <ModalMui
          className=""
          open={openDate}
          onClose={handleCloseDate}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <Box sx={styleDesktop}>
            <div className="block">
            <div className="pl-12 my-4">
                <div
                  style={{
                    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    lineHeight: 2.66,
                    letterSpacing: "0.08333em",
                    color: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  PILIH TANGGAL
                </div>
                <div className="flex space-x-2  items-center">
                <div className="flex justify-start">
                  <div className=" text-gray-400">
                    <h4>
                      {dayjs(tanggal).format("MMM")}{" "}
                      {dayjs(tanggal).format("YYYY")}
                    </h4>
                  </div>
                </div>
                <div className="flex justify-center">
                  <CiCalendarDate size={28} className="text-gray-400" />
                </div>
                </div>
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className={openMonth ? `block mt-6` : `hidden`}>
                  <DateCalendar
                    className={classesDate.hideCalendarHeader}
                    value={
                      (tanggal.year() === dayjs().add(2, 'year').year() && tanggal.month() > dayjs().month()) ||
                      (tanggal.year() === dayjs().year() && tanggal.month() < dayjs().month())
                      ? dayjs().set('year', tanggal.year()).set('month', dayjs().month()) 
                      : tanggal
                    }
                    onChange={(e) => {
                      const maxYear = dayjs().add(2, 'year').year();
                      const currentMonth = dayjs().month();
                    
                      if ((e.year() === maxYear && e.month() > currentMonth) || 
                         (e.year() === dayjs().year() && e.month() < dayjs().month())
                      ) {
                        setTanggal(dayjs().set('year', maxYear).set('month', currentMonth));
                      } else {
                        setTanggal(e);
                      }
                    
                      setopenYear(true);
                      setopenMonth(false);
                      handleCloseDate();
                    }}
                    disablePast={true}
                    shouldDisableMonth={(date) => {
                      const currentMonth = dayjs().month();
                      const maxYear = dayjs().add(2, 'year').year();
                  
                        if (date.year() === maxYear) {

                          return date.month() > currentMonth;
                        }
                      
                    }}
                    views={['month']}
                    openTo="month"
                  />
              </div>
              <div className={openYear ? `block mt-8 md:mt-8` : `hidden`}>
                <DateCalendar
                  value={tanggal}
                  onChange={(e) => {
                    setTanggal(e);
                    setopenYear(false);
                    setopenMonth(true);
                  }}
                  shouldDisableYear={(date) => {
                    const currentYear = dayjs().year(); 
                    const maxYear = dayjs().add(2, 'year').year();
                
                    return date.year() < currentYear || date.year() > maxYear;
                  }}
                  views={[ 'year']}
                  openTo="year"
                />
              </div>
              </LocalizationProvider>
            </div>
          </Box>
      </ModalMui>
        <div class="w-full px-4 py-4 rounded-lg shadow-xs">
          <form className="w-full">
            <>
              <div className="block xl:flex justify-between mx-0 xl:mx-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 gap-2 xl:gap-0">

                  {/* desktop pencarian asal dan tujuan*/}
                  <div className="mt-2 w-full col col-span-1 md:col-span-2 hidden xl:block">
                  <div className="w-full flex flex-col xl:flex-row items-center px-2 xl:px-0">
                      <div className="w-full m-2 xl:m-0 xl:pr-0">
                        <small className="block mb-2 text-black">
                          Dari
                        </small>
                        <Autocomplete
                          classes={classes}
                          id="asynchronous-demo"
                          disableClearable
                          className="mt-1.5"
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
                            <div style={{ width: "90%" }}>
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
                          getOptionLabel={(option) => option.NAME}
                          options={pelniData}
                          value={keberangkatan}
                          onChange={(event, newValue) => {
                            if (
                              newValue == tujuan ||
                              newValue?.CODE == tujuan?.CODE
                            ) {
                              errorBerangkat();
                              setKeberangkatan(keberangkatan);
                            } else {
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
                                  <IoBoatSharp className="text-gray-400" />
                                ),
                                placeholder: "Asal",
                                endAdornment: (
                                  <React.Fragment>
                                    {loadingBerangkat ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      </div>
                      <div
                          onClick={changeStatiun}
                              className="w-8 h-8 cursor-pointer flex justify-center mt-2 xl:mt-6 items-center bg-blue-500 rounded-full p-1 flex-shrink-0"
                              >
                              <AiOutlineSwap className="text-white w-10 h-10" />
                          </div>
                      <div className="w-full m-2 xl:m-0 xl:pr-0">
                        <small className="mb-2 text-black">
                          Tujuan
                        </small>
                        <Autocomplete
                          classes={classes}
                          id="asynchronous-demo"
                          className="mt-1.5"
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
                            <div style={{ width: "90%" }}>
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
                          getOptionLabel={(option) => option.NAME}
                          options={pelniData}
                          value={tujuan}
                          onChange={(event, newValue) => {
                            if (
                              newValue == keberangkatan ||
                              newValue?.CODE == keberangkatan?.CODE
                            ) {
                              errorTujuan();
                              setTujuan(tujuan);
                            } else {
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
                                  <IoBoatSharp className="text-gray-400" />
                                ),
                                placeholder: "Tujuan",
                                endAdornment: (
                                  <React.Fragment>
                                    {loadingTujuan ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* mobile pencarian asal dan tujuan*/}
                  <div className="block xl:hidden">
                    <PelniMobile
                      pelniData={pelniStasiun.data || []}
                      keberangkatan={keberangkatan}     
                      setKeberangkatan={setKeberangkatan}
                      setTujuan={setTujuan}
                      tujuan={tujuan}
                      changeStatiun={changeStatiun}
                    />
                  </div>

                  <FormControl sx={{ m: 1, minWidth: 160 }}>
                    <small className="mb-2 text-black">
                      Tanggal
                    </small>
                    <button type="button" className="border py-[10px] customButtonStyle w-full block text-black" onClick={handleOpenDate}>
                      <div className="flex justify-between mx-4 items-center">
                        <div>
                        {`${
                            parseTanggalPelniMonth(tanggal)
                      } `}
                        </div>
                        <CiCalendarDate size={22} className="text-gray-400" />
                      </div>
                    </button>
                  </FormControl>

                  <FormControl sx={{ m: 1, minWidth: 130 }}>
                    <small className="mb-2 text-black">Total Penumpang</small>
                    <div className="hidden md:block"></div>
                    <div
                      className="cursor-pointer border py-[10px] rounded-md px-2 w-full text-black flex items-center space-x-2"
                      onClick={toggleDrawer(true, false, "buka")}
                    >
                        <LuUsers size={21} className="text-gray-400"  />
                      <div>
                      {`${parseInt(laki) + parseInt(wanita)} Penumpang`}                         
                      </div>
                    </div>
                    <SwipeableDrawer anchor="bottom" PaperProps={{ sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30 } }} open={openDrawer} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                      <div className="p-4 mt-2 xl:container xl:px-64">
                        
                        <h2 className="text-lg font-semibold py-4">Pilih Jumlah Penumpang</h2>
                        {[{ label: "LAKI-LAKI", age: "(≥ 2 thn)", value: lakiTemp, setValue: setLakiTemp, min: 0, max:4, plus:plusLaki, minus:minusLaki },
                          { label: "WANITA",age: "(<2 thn)", value: wanitaTemp, setValue: setWanitaTemp, min: 0, max:4, plus:plusWanita, minus:minusWanita }]
                          .map(({ label, age, value, setValue, min, max, plus, minus }) => (
                            <div key={label} className="mt-4 px-4 py-1">
                              <div className="grid grid-cols-12">
                                <div className="col-span-8">
                                  <div className="flex items-center space-x-2">
                                    <div className="font-bold text-gray-800">{label}</div>
                                    <div className="text-xs text-gray-400">{age}</div>
                                  </div>
                                </div>
                                <div className="col-span-4">
                                  <InputGroup>
                                    <InputGroup.Button onClick={minus}>-</InputGroup.Button>
                                    <input type="number" min={min} max={max} className="block text-center w-full focus:outline-0" value={value} readOnly />
                                    <InputGroup.Button className="bg-gray-300 text-black hover:bg-blue-500 hover:text-white" onClick={plus}>+</InputGroup.Button>
                                  </InputGroup>
                                </div>
                              </div>
                            </div>
                          ))}
                        <div className="flex justify-end space-x-2 my-8 px-4">
                          <ButtonMui className="w-32" variant="outlined" color="secondary" onClick={toggleDrawer(false)}>
                            Cancel
                          </ButtonMui>
                          <ButtonMui className="w-52" variant="contained"  onClick={toggleDrawer(false, true, "simpan")}>
                            Simpan
                          </ButtonMui>
                        </div>
                      </div>
                    </SwipeableDrawer>
                  </FormControl>
                </div>
                <div className="w-full xl:w-1/4 flex justify-end xl:justify-start mt-8 py-0.5">
                  <Button
                    block
                    size="large"
                    key="submit"
                    type="primary"
                    className="bg-blue-500 mx-2 md:mx-0 font-semibold"
                    loading={isLoading}
                    onClick={handleSubmitPelni}
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
  );
}

export default Pelni
