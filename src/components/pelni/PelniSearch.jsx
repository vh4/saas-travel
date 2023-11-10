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
import { DateRangePicker, InputGroup, InputNumber } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Button, message } from "antd";
import Cookies from "js-cookie";
import { AiOutlineSwap } from "react-icons/ai";

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
        color:"black"
      },
    },
    root: {
      "& .MuiInputBase-root": {
        "& .MuiInputBase-input": {
          padding: 9,
          borderRadius: 10,
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
    parsedTgl = tgl ? JSON.parse(tgl) : null;
    if (Array.isArray(parsedTgl) && parsedTgl.length === 2) {
      const isValidDate = parsedTgl.every(dateStr =>
        !isNaN(new Date(dateStr).getTime())
      );
      parsedTgl = isValidDate ? parsedTgl : null;
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

  const today = parsedTgl ? new Date(parsedTgl[0]) : new Date();
  let nextMonth;
  
  if (parsedTgl !== null) {
    nextMonth = new Date(parsedTgl[1]);
  } else {
    nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
  }
  
  // Input
  const [tanggal, setTanggal] = React.useState([today, nextMonth]);
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

    if (laki < 1 || laki === 1) {
      setLaki(1);
    } else {
      setLaki(parseInt(laki) - 1);
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

    if (wanita < 0 || wanita === 0) {
      setWanita(0);
    } else {
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

  function formatDate(date) {
    return (
      date.getFullYear() +
      "-" +
      addLeadingZero(date.getMonth() + 1) +
      "-" +
      addLeadingZero(date.getDate())
    );
  }

  async function handlerCariPelni(e) {
    setLoading(true);

    let startDate = new Date((tanggal && tanggal[0]) || new Date());
    let endDate = new Date((tanggal && tanggal[1]) || new Date());

    startDate = formatDate(startDate);
    endDate = formatDate(endDate);

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
        Cookies.set('d-tanggal', JSON.stringify(tanggal), cookieOptions);
  
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


  const { allowedMaxDays, beforeToday, combine } = DateRangePicker;

  const disabledDateRule = combine(
    allowedMaxDays(30), // Menonaktifkan tanggal lebih dari 7 hari dari tanggal saat ini
    beforeToday() // Menonaktifkan tanggal yang kurang dari tanggal saat ini
  );

  return (
    <>
    {contextHolder}
      <div className="row bg-white border-t border-gray-200 w-full p-2 ">
        <div class="w-full rounded-lg shadow-xs">
          <form className="w-full">
            {/* <div className="space-x-2 items-center flex">
                    < BiTrain className="text-gray-600" size={24} />
                    <div className="text-sm md:text-md font-bold text-slate-700">TRAINS</div>
                </div> */}
          <form className="w-full">
            {/* <div className="space-x-2 items-center flex">
                  < BiTrain className="text-gray-600" size={24} />
                  <div className="text-sm md:text-md font-bold text-slate-700">TRAINS</div>
               </div> */}
            <>
              <div className="block xl:flex justify-between">
                <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 gap-4 md:gap-6">
                <div className="w-full col col-span-1 md:col-span-2">
                    <div className="w-full flex items-center">
                  <FormControl
                    className=""
                    sx={{ m: 1, minWidth: 145, outline: "none" }}
                  >
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
                      isOptionEqualToValue={(option, value) =>
                        option.title === value.title
                      }
                      getOptionLabel={(option) => option.NAME}
                      options={pelniData}
                      value={keberangkatan}
                      onChange={(event, newValue) => {
                        if((newValue == tujuan) || (newValue?.CODE == tujuan?.CODE)){
                          errorBerangkat();
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
                              <IoBoatSharp className="text-gray-400" />
                            ),
                            placeholder: "Asal",
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
                  <div
                        onClick={changeStatiun}
                        className="cursor-pointer mt-4 flex justify-center items-center bg-blue-500 rounded-full p-1"
                      >
                        <AiOutlineSwap className="text-white" size={24} />
                  </div>
                  <FormControl
                    className=""
                    sx={{ m: 1, minWidth: 145, outline: "none" }}
                  >
                    <small className="mb-2 text-gray-500">
                      Pelabuhan Tujuan
                    </small>
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
                      getOptionLabel={(option) => option.NAME}
                      options={pelniData}
                      value={tujuan}
                      onChange={(event, newValue) => {
                        if((newValue == keberangkatan) || (newValue?.CODE == keberangkatan?.CODE)){
                          errorTujuan();
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
                              <IoBoatSharp className="text-gray-400" />
                            ),
                            placeholder: "Tujuan",
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
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <small className="mb-2 text-gray-500">Range Tanggal</small>
                    <div className="w-full">
                    <DateRangePicker
                        block
                        onChange={(e) => setTanggal(e)}
                        size="lg"
                        sx={{ width: "100%", color:"black !important" }}
                        placeholder="dd/mm/yyyy dd-mm-yyyy"
                        className="cursor-pointer text-black"
                        disabledDate={disabledDateRule}
                        value={tanggal}
                        format="dd/MM/yyyy"
                        style={{ color: "black !important" }}
                      />

                    </div>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <small className="mb-2 text-gray-500">
                      Total Penumpang
                    </small>
                    <div className="hidden md:block">  
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
                    <Button className="w-full block md:hidden text-gray-500" size="large" onClick={handleClick}>
                      {`${parseInt(laki) + parseInt(wanita)} Penumpang`}
                    </Button>
                    <div
                      id="basic-menu"
                      className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 text-sm bg-white border border-gray-100 rounded-lg shadow-md `}
                    >
                     <div className="w-full md:w-48 ml-4 block md:mx-0">
                        <div className="mt-4 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number mb-4">
                            <p>laki (Laki-laki {">"} 12 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusLaki}>-</InputGroup.Button>
                              <input type={"number"} className={'block text-center w-full focus:outline-0 selection:border-blue-500'} value={laki} onChange={setLaki} min={0} max={4} readOnly/>
                            <InputGroup.Button onClick={plusLaki}>+</InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="mt-4 mb-8 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Wanita (Wanita {">"} 12 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusWanita}>-</InputGroup.Button>
                              <input type={"number"} className={'block text-center w-full focus:outline-0 selection:border-blue-500'} value={wanita} onChange={setWanita} min={0} max={4} readOnly/>
                            <InputGroup.Button onClick={plusWanita}>+</InputGroup.Button>
                          </InputGroup>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                </div>
                <div className="w-full pr-4 xl:mr-0 xl:pl-4 xl:w-1/4 flex justify-end xl:justify-start mt-8 py-0.5">
                  <Button
                    block
                    size="large"
                    key="submit"
                    type="primary"
                    className="bg-blue-500 mx-2 font-semibold"
                    loading={isLoading}
                    onClick={handlerCariPelni}
                  >
                    Cari Tiket
                  </Button>
                </div>
              </div>
            </>
          </form>
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
