import * as React from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { Popper } from "@mui/material";
import { IoBoatSharp } from "react-icons/io5";
import onClickOutside from "react-onclickoutside";
import { makeStyles } from "@mui/styles";
import { InputGroup } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Button, message, DatePicker } from "antd";
import Cookies from "js-cookie";
import { AiOutlineSwap } from "react-icons/ai";
import dayjs from "dayjs";
import { useState } from "react";

function PELNI() {
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

  const PopperMy = function (props) {
    return (
      <Popper {...props} style={{ width: 350 }} placement="bottom-start" />
    );
  };

  const classes = useStyles();

  const [pelni, setPelni] = React.useState({});
  const [pelniData, setPelniData] = React.useState([]);
  const i = 0;

  const [openBerangka, SetopenBerangka] = React.useState(false);
  const [openTujuan, setOpenTujuan] = React.useState(false);

  const loadingBerangkat = openBerangka && pelniData.length === 0;
  const loadingTujuan = openTujuan && pelniData.length === 0;
  const [messageApi, contextHolder] = message.useMessage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const errorBerangkat = () => {
    messageApi.open({
      type: 'error',
      content: 'Pelabuhan berangkat tidak boleh sama dengan pelabuhan tujuan.',
      duration: 10, // Durasi pesan 5 detik
      top: '50%', // Posisi pesan di tengah layar
      className: 'custom-message', // Tambahkan kelas CSS kustom jika diperlukan
    });
  };

  const errorTujuan = () => {
    messageApi.open({
      type: 'error',
      content: 'Pelabuhan tujuan tidak boleh sama dengan pelabuhan berangkat.',
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

  let depa = Cookies.get('d-depa');
  let arri = Cookies.get('d-arri');
  let lakiCookie = Cookies.get('d-laki');
  let wanitaCookie = Cookies.get('d-wanita');

  const tgl = Cookies.get('d-tanggal');
  
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
  
  depa = depa?.CODE && depa?.NAME ? depa : { CODE: "431", NAME: "TANJUNG PRIOK (JAKARTA)" };
  arri = arri?.CODE && arri?.NAME ? arri : { CODE: "144", NAME: "BELAWAN (MEDAN)" };
  lakiCookie = lakiCookie ? lakiCookie : 1;
  wanitaCookie = wanitaCookie ? wanitaCookie : 0;

  const today = parsedTgl ? dayjs(parsedTgl) : dayjs().startOf('month');


  // Input
  const [tanggal, setTanggal] = React.useState(today);
  const [laki, setLaki] = React.useState(lakiCookie);
  const [wanita, setWanita] = React.useState(wanitaCookie);

  const [keberangkatan, setKeberangkatan] = React.useState(depa);
  const [tujuan, setTujuan] = React.useState(arri);

  //input
  const [isLoading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState("hidden");
  const handleClick = () => {
    anchorEl === "hidden" ? setAnchorEl("grid") : setAnchorEl("hidden");
  };

  PELNI.handleClickOutside = () => {
    setAnchorEl("hidden");
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

  function plusLaki(e) {
    e.preventDefault();
    if (laki >= 4) {
      setLaki(4);
    } else {
      setLaki(parseInt(laki) + 1);
    }
  }

  function minusLaki(e) {
    e.preventDefault();
    if(wanita > 0 && laki > 0){
      setLaki(parseInt(laki) - 1);
    }if(wanita > 0 && laki >= 0){
      setLaki(0);
    }else{
      setLaki(1);
    }
    
  }

  function plusWanita(e) {
    e.preventDefault();
    if (wanita >= 4) {
      setWanita(4);
    } else {
      setWanita(parseInt(wanita) + 1);
    }
  }

  function minusWanita(e) {
    e.preventDefault();

    if (wanita <= 0) {
      setWanita(0);
    }else if (laki <= 0) {
      setWanita(1);
    }  else {
      setWanita(parseInt(wanita) - 1);
    }
  }

  React.useEffect(() => {
    getPelnidata();
  }, []);

  async function getPelnidata() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/get_origin`,
        {
          token: JSON.parse(
            localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
          ),
        }
      );

      setPelni(response.data);
    } catch (error) {
      setPelni({ message: error.message });
    }
  }

  function addLeadingZero(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }

  async function handlerCariPelni(e) {
    setLoading(true);

    const givenDate = dayjs(tanggal, 'YYYY-MM');
    const daynow = dayjs();
  
    let startDate = givenDate.startOf('month').format('YYYY-MM-DD');
    let endDate = givenDate.endOf('month').format('YYYY-MM-DD');
  
    if (dayjs(startDate).isBefore(daynow)) {
      startDate = daynow.format('YYYY-MM-DD');
    }
  
    if (dayjs(endDate).isBefore(daynow)) {
      endDate = daynow.format('YYYY-MM-DD');
    }
  

    setTimeout(() => {
      e.preventDefault();
      setLoading(false);


      if(keberangkatan === null && tujuan === null){
        messageCustomError('Pilih Pelabuhan Asal & Pelabuhan Tujuan.')
      }
      else if(keberangkatan === null){
        messageCustomError('Pilih Pelabuhan Asal.')
        
      }else if(tujuan === null){
        messageCustomError('Pilih Pelabuhan Tujuan.')

      }else{

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
  
        Cookies.set('d-depa', JSON.stringify(keberangkatan), cookieOptions);
        Cookies.set('d-arri', JSON.stringify(tujuan), cookieOptions);
        Cookies.set('d-laki', laki, cookieOptions);
        Cookies.set('d-wanita', wanita, cookieOptions);
        Cookies.set('d-tanggal', tanggal, cookieOptions);
  
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

  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day');
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center row bg-white border-t border-gray-200 w-full pr-0">
        <div class="w-full px-4 py-4 rounded-lg shadow-xs">
          <form className="w-full">
            <>
              <div className="block xl:flex justify-between mx-0 xl:mx-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 gap-6 xl:gap-0">
                  <div className="mt-2 w-full col col-span-1 md:col-span-2">
                    <div className="w-full flex items-center">
                      <div className="w-full m-2 xl:m-0 xl:pr-0">
                        <small className="block mb-2 text-black">
                          Kota Asal
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
                        className="cursor-pointer mt-6 flex justify-center items-center bg-blue-500 rounded-full p-1"
                      >
                        <AiOutlineSwap className="text-white" size={24} />
                      </div>
                      <div className="w-full m-2 xl:m-0 xl:pr-0">
                        <small className="mb-2 text-black">
                          Pelabuhan Tujuan
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
                  <FormControl sx={{ m: 1, minWidth: 145 }}>
                    <small className="mb-2 text-black">Range Tanggal</small>
                    <div className="w-full cursor-pointer">
                      <DatePicker
                        value={tanggal}
                        open={isDatePickerOpen} // Pass the state to the open prop
                        inputReadOnly={true}
                        onOpenChange={(status) => setIsDatePickerOpen(status)} // Update the state when the panel opens or closes
                        className="w-full cursor-pointer text-black py-[8px] text-md border-gray-200"
                        size="large"
                        onChange={(e) => setTanggal(e)}
                        picker="month"
                        disabledDate={disabledDate}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <small className="mb-2 text-black">
                      Total Penumpang
                    </small>
                    <div className="hidden md:block w-full">
                      <TextField
                        onClick={handleClick}
                        sx={{ input: { cursor: "pointer" } }}
                        variant="outlined"
                        size="small"
                        classes={classes}
                        id="outlined-basic"
                        value={`${parseInt(laki) + parseInt(wanita)} Penumpang`}
                      />
                    </div>
                    <Button
                      className="w-full block md:hidden text-black"
                      size="large"
                      onClick={handleClick}
                    >
                      {`${parseInt(laki) + parseInt(wanita)} Penumpang`}
                    </Button>
                    <div
                      id="basic-menu"
                      className={`${anchorEl} relative md:absolute top-0 md:top-20 md:z-10 grid w-full md:w-auto px-8 text-sm bg-white border border-gray-100 rounded-lg shadow-md `}
                    >
                      <div className="w-full md:w-48 block md:mx-0">
                        <div className="mt-4 w-full items-center text-black">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Laki-laki ({"≥"} 2 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusLaki}>
                              -
                            </InputGroup.Button>
                            <input
                              type={"number"}
                              className={
                                "block text-center w-full focus:outline-0 selection:border-blue-500"
                              }
                              value={laki}
                              onChange={setLaki}
                              min={0}
                              max={4}
                              readOnly
                            />
                            <InputGroup.Button onClick={plusLaki}>
                              +
                            </InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="mt-4 mb-8 w-full items-center text-black">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Perempuan ({"≥"} 2 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusWanita}>
                              -
                            </InputGroup.Button>
                            <input
                              type={"number"}
                              className={
                                "block text-center w-full focus:outline-0 selection:border-blue-500"
                              }
                              value={wanita}
                              onChange={setWanita}
                              min={0}
                              max={4}
                              readOnly
                            />
                            <InputGroup.Button onClick={plusWanita}>
                              +
                            </InputGroup.Button>
                          </InputGroup>
                        </div>
                      </div>
                    </div>
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
                    onClick={handlerCariPelni}
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

const clickOutsideConfig = {
  handleClickOutside: () => PELNI.handleClickOutside,
};

export default onClickOutside(PELNI, clickOutsideConfig);
