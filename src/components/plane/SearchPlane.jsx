import { ButtonBase, Popper } from "@mui/material";
import * as React from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Autocomplete from "@mui/material/Autocomplete";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { Chip } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import onClickOutside from "react-onclickoutside";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, message, Tooltip } from "antd";
import Cookies from "js-cookie";
import { InputGroup, InputNumber, Modal, Placeholder } from "rsuite";
import { CheckboxGroup, Checkbox } from "rsuite";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlineSwap } from "react-icons/ai";
import dayjs from "dayjs";
import { DatePicker } from "antd";

function Plane() {
  const [anchorEl, setAnchorEl] = React.useState("hidden");

  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const [loadingModal, setLoadingModal] = React.useState(false);

  var j =
    '{"TPGA":"GARUDA INDONESIA","TPIP":"PELITA AIR","TPJQ":"JETSTAR","TPJT":"LION AIR","TPMV":"TRANS NUSA","TPQG":"CITILINK","TPQZ":"AIR ASIA","TPSJ":"SRIWIJAYA","TPTN":"TRIGANA AIR","TPTR":"TIGER AIR","TPXN":"XPRESS AIR"}';
  var djremix = JSON.parse(j);

  let mskplistCookie = Cookies.get("p-mask");

  // Konversi objek menjadi array dari pasangan kunci dan nilai
  let djremixArray = Object.entries(djremix);

  let mskplist = mskplistCookie
    ? Object.keys(Object.fromEntries(
        djremixArray.filter(([key, value]) => JSON.parse(mskplistCookie).includes(key))
      ))
    : Object.keys(djremix);

  const [selectedOptions, setSelectedOptions] = React.useState(mskplist);
  const [isSelectAll, setIsSelectAll] = React.useState(mskplistCookie ? false : true);
  const [messageApi, contextHolder] = message.useMessage();

  const errorBerangkat = () => {
    messageApi.open({
      type: 'error',
      content: 'Stasiun berangkat tidak boleh sama dengan stasiun tujuan.',
      duration: 10, // Durasi pesan 5 detik
      top: '50%', // Posisi pesan di tengah layar
      className: 'custom-message', // Tambahkan kelas CSS kustom jika diperlukan
    });
  };
  

  const errorTujuan = () => {
    messageApi.open({
      type: 'error',
      content: 'Stasiun tujuan tidak boleh sama dengan stasiun berangkat.',
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

  const handleCheckboxChange = (value) => {
    setSelectedOptions(value);
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedOptions([]);
      setIsSelectAll(false);
    } else {
      setSelectedOptions(Object.keys(djremix));
      setIsSelectAll(true);
    }
  };

  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
    setLoadingModal(true);

    setTimeout(() => {
      setLoadingModal(false);
    }, 1000);
  };
  const handleClose = () => setOpen(false);

  const handleClick = () => {
    anchorEl === "hidden" ? setAnchorEl("grid") : setAnchorEl("hidden");
  };

  Plane.handleClickOutside = () => {
    setAnchorEl("hidden");
  };

  const navigate = useNavigate();

  const [isLoading, setLoading] = React.useState(false);
  const [pulang, setPulang] = React.useState(false);
  const [pesawatStasiun, setpesawatStasiun] = React.useState({});

  const [openBerangka, SetopenBerangka] = React.useState(false);
  const [openTujuan, setOpenTujuan] = React.useState(false);

  const [pesawatData, setPesawatData] = React.useState([]);
  const loadingBerangkat = openBerangka && pesawatData.length === 0;
  const loadingTujuan = openTujuan && pesawatData.length === 0;

  let depa = Cookies.get("p-depa");
  let arri = Cookies.get("p-arri");


  let dateCookie = Cookies.get("p-date") ? Cookies.get("p-date") : dayjs();
  let adultCookie = parseInt(Cookies.get("p-adult") ? Cookies.get("p-adult") : '');
  let childCookie = parseInt(Cookies.get("p-child") ? Cookies.get("p-child") : '');
  let infantCookie = parseInt(Cookies.get("p-infant") ? Cookies.get("p-infant") : '');

  try {
    depa = depa ? JSON.parse(depa) : null;

  } catch (error) {
    depa = null;
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
    childCookie = !isNaN(childCookie) ? childCookie : null;

  } catch (error) {
    childCookie = null;
  }

  try {
    arri = arri ? JSON.parse(arri) : null;
  } catch (error) {
    arri = null;
  }

  depa = depa?.bandara && depa?.code && depa?.group && depa?.name ? depa : { code: "CGK", name: "Jakarta (CGK)", bandara: "Soekarno – Hatta", group: "Domestik" };
  arri = arri?.bandara && arri?.code && arri?.group && arri?.name ? arri : { code: "SUB", name: "Surabaya (SUB)", bandara: "Juanda", group: "Domestik" };
  dateCookie = dateCookie ? dayjs(dateCookie) : dayjs();
  adultCookie = adultCookie ? adultCookie : 1;
  infantCookie = infantCookie ? infantCookie : 0;
  childCookie = childCookie ? childCookie : 0;

  //input
  const [keberangkatan, setKeberangkatan] = React.useState(depa);
  const [tujuan, setTujuan] = React.useState(arri);
  const [tanggalKeberangkatan, setTanggalKeberangkatan] = React.useState(dateCookie);
  const [tanggalTujuan, setTanggalTujuan] = React.useState(dateCookie);
  const [adult, setadult] = React.useState(adultCookie);
  const [infant, setinfant] = React.useState(infantCookie);
  const [child, setChild] = React.useState(childCookie);

  const i = 0;

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
          padding: 10,
          borderRadius: 10,
          cursor: "pointer"
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
    return (
      <Popper {...props} style={{ width: 350 }} placement="bottom-start" />
    );
  };

  function plusAdult(e) {
    e.preventDefault();
    if (adult >= 7) {
      setadult(7);
    } else {
      setadult(parseInt(adult) + 1);
    }
  }

  function minusAdult(e) {
    e.preventDefault();

    if((adult <= infant) || (adult <= child)){
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
      if (infant >= 7) {
        setinfant(7);
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

  function plusChild(e) {

    if(adult <= child){
      setChild(infant(child));
    }else{
      e.preventDefault();
      if (child >= 7) {
        setChild(7);
      } else {
        setChild(parseInt(child) + 1);
      }
    }
  }

  function minusChild(e) {
    e.preventDefault();

    if (child < 0 || child === 0) {
      setChild(0);
    } else {
      setChild(parseInt(child) - 1);
    }
  }

  function addLeadingZero(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }

  async function getPesawatDataStasiun() {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/flight/airport`,
      {
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
        product: "PESAWAT",
      }
    );

    setpesawatStasiun(response.data);
  }

  async function handlerCariPesawat(e) {
    setLoading(true);

    let tanggalNullFill = new Date();
    tanggalNullFill =
      tanggalNullFill.getFullYear() +
      "-" +
      parseInt(tanggalNullFill.getMonth() + 1) +
      "-" +
      addLeadingZero(parseInt(tanggalNullFill.getDate()));

    const tanggalKeberangkatanParse =
      tanggalKeberangkatan !== undefined && tanggalKeberangkatan !== null
        ? tanggalKeberangkatan.$y +
          "-" +
          addLeadingZero(parseInt(tanggalKeberangkatan.$M) + 1).toString() +
          "-" +
          addLeadingZero(parseInt(tanggalKeberangkatan.$D)).toString()
        : tanggalNullFill;
    const tanggalTujuanParse =
      tanggalTujuan !== undefined && tanggalTujuan !== null
        ? tanggalTujuan.$y +
          "-" +
          addLeadingZero(parseInt(tanggalTujuan.$M) + 1).toString() +
          "-" +
          addLeadingZero(parseInt(tanggalTujuan.$D)).toString()
        : tanggalNullFill;

    setTimeout(() => {
      e.preventDefault();
      setLoading(false);

      if(keberangkatan === null && tujuan === null){
        messageCustomError('Pilih Stasiun Asal & Stasiun Tujuan.')
      }
      else if(keberangkatan === null){
        messageCustomError('Pilih Stasiun Asal.')
        
      }else if(tujuan === null){
        messageCustomError('Pilih Stasiun Tujuan.')

      }else{
        const params = {
          departure: keberangkatan.code,
          departureName: keberangkatan.bandara,
          arrival: tujuan.code,
          arrivalName: tujuan.bandara,
          departureDate: tanggalKeberangkatanParse,
          returnDate: pulang ? tanggalTujuanParse : "",
          isLowestPrice: true,
          adult: adult,
          child: child,
          infant: infant,
          maskapai: selectedOptions.join("#"),
        };
  
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
  
        const cookieOptions = {
          expires: expirationDate,
        };
  
        Cookies.set("p-depa", JSON.stringify(keberangkatan), cookieOptions);
        Cookies.set("p-arri", JSON.stringify(tujuan), cookieOptions);
        Cookies.set("p-mask", JSON.stringify(selectedOptions), cookieOptions);
        Cookies.set("p-date", tanggalKeberangkatan.toString(), cookieOptions);
        Cookies.set("p-adult", adult, cookieOptions);
        Cookies.set("p-child", child, cookieOptions);
        Cookies.set("p-infant", infant, cookieOptions);
  
        var str = "";
        for (var key in params) {
          if (str != "") {
            str += "&";
          }
          str += key + "=" + encodeURIComponent(params[key]);
        }
  
        window.location = `/flight/search?${str}`;
      }

    });
  }

  const changeStatiun = () => {

    setKeberangkatan(tujuan);
    setTujuan(keberangkatan);

  }

  return (
    <>
    {contextHolder}
      <Modal size={size} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Pilih Maskapai</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingModal === true ? (
            <>
              <Placeholder.Paragraph />
            </>
          ) : (
            <>
              <div className="container">
                <div className="cookierow">
                  <div className="col-4">
                    <Checkbox checked={isSelectAll} onChange={toggleSelectAll}>
                      Select All
                    </Checkbox>
                  </div>
                  {Object.keys(djremix).map((key) => (
                    <div className="col-2" key={key}>
                      <CheckboxGroup
                        inline
                        value={selectedOptions}
                        onChange={handleCheckboxChange}
                      >
                        <Checkbox value={key}>{djremix[key]}</Checkbox>
                      </CheckboxGroup>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="flex justify-center row bg-white border-t border-gray-200 w-full pr-0">
        <div class="w-full py-4 rounded-lg shadow-xs">
          <form className="w-full">
            <>
              <div className="block xl:flex justify-between">
                <div
                  className={`grid grid-cols-1 xl:grid-cols-5 mx-0 gap-4 md:gap-8`}
                >
                  <div class="w-full mt-1.5 pl-2 md:pl-0 mx-0">
                    <small className="mb-2 text-gray-500">Pilih Maskapai</small>
                    <Tooltip title="cari maskapai">
                    <Button
                        onClick={() => handleOpen("lg")}
                        size="large"
                        type="default"
                        shape="default" // Use 'default' shape for no rounding
                        className="text-black block mt-2 bg-white border-gray-200"
                        icon={<SearchOutlined />}
                        >
                        List Maskapai
                        </Button>
                    </Tooltip>
                  </div>
                  <div className="w-full col col-span-1 md:col-span-2">
                    <div className="w-full flex items-center">
                      <FormControl
                        className=""
                        sx={{ m: 1, minWidth: 150, outline: "none" }}
                      >
                        <small className="mb-2 text-gray-500">
                          Stasiun Asal
                        </small>
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
                            option.bandara +
                            " - " +
                            option.name +
                            " - " +
                            option.code
                          }
                          options={pesawatData}
                          value={keberangkatan}
                          onChange={(event, newValue) => {
                            if((newValue == tujuan) || (newValue?.code == tujuan?.code)){
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
                                  <FaPlaneDeparture className="text-gray-400" />
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
                      </FormControl>
                      <div
                        onClick={changeStatiun}
                        className="cursor-pointer mt-4 flex justify-center items-center bg-blue-500 rounded-full p-1"
                      >
                        <AiOutlineSwap className="text-white" size={24} />
                      </div>
                      <FormControl className="" sx={{ m: 1, minWidth: 140 }}>
                        <small className="mb-2 text-gray-500">
                          Stasiun Tujuan
                        </small>
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
                          isOptionEqualToValue={(option, value) =>
                            option.title === value.title
                          }
                          getOptionLabel={(option) =>
                            option.bandara +
                            " - " +
                            option.name +
                            " - " +
                            option.code
                          }
                          options={pesawatData}
                          value={tujuan}
                          onChange={(event, newValue) => {
                            if((newValue == keberangkatan) || (newValue?.code == keberangkatan?.code)){
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
                                  <FaPlaneArrival className="text-gray-400" />
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
                      </FormControl>
                    </div>
                  </div>
                  <FormControl sx={{ m: 1, minWidth: 150 }}>
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
                      value={tanggalKeberangkatan}
                      inputStyle={{ color: 'red' }}
                      format="DD/MM/YYYY"
                      onChange={(value) => {
                        setTanggalKeberangkatan(value);
                      }}
                      size="large"
                      disabledDate={(current) => {
                        const currentDate = dayjs();
                        return current && current < currentDate.startOf('day');
                      }}
                    />
                    </LocalizationProvider>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 130 }}>
                    <small className="mb-2 text-gray-500">
                      Total Penumpang
                    </small>
                    <div className="hidden md:block">
                    <TextField
                    InputProps={{
                        readOnly: true,
                        }}
                      onClick={handleClick}
                      sx={{ input: { cursor: "pointer", } }}
                      size="medium"
                      classes={classes}
                      id="outlined-basic"
                      value={`${
                        parseInt(adult) + parseInt(infant) + parseInt(child)
                      } Penumpang`}
                      variant="outlined"
                    />
                    </div>
                    <Button className="w-full block md:hidden text-gray-500" size="large" onClick={handleClick}>
                    {`${
                        parseInt(adult) + parseInt(infant) + parseInt(child)
                      } Penumpang`}
                    </Button>
                    <div
                      id="basic-menu"
                      className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg`}
                    >
                      <div className="w-full md:w-48 ml-4 block md:mx-0">
                        <div className="w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number mb-4">
                          <p>Adult (12 thn keatas)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusAdult}>-</InputGroup.Button>
                            <InputNumber className={'custom-input-number'} value={adult} onChange={setadult} min={1} max={7} readOnly/>
                            <InputGroup.Button onClick={plusAdult}>+</InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="mt-4 mb-4 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Child (2 - 11 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusChild}>-</InputGroup.Button>
                            <InputNumber className={'custom-input-number'} value={child} onChange={setChild} min={0} max={7} readOnly/>
                            <InputGroup.Button onClick={plusChild}>+</InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="mt-4 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Infant (dibawah 2 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusInfant}>-</InputGroup.Button>
                            <InputNumber className={'custom-input-number'} value={infant} onChange={setinfant} min={0} max={7} readOnly/>
                            <InputGroup.Button onClick={plusInfant}>+</InputGroup.Button>
                          </InputGroup>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                </div>
                <div className="w-full pr-4 xl:mr-0 xl:w-1/4 flex justify-end xl:justify-start mt-8 py-0.5">
                  <Button
                    block
                    size="large"
                    key="submit"
                    type="primary"
                    className="bg-blue-500 mx-2 font-semibold"
                    loading={isLoading}
                    onClick={handlerCariPesawat}
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
  handleClickOutside: () => Plane.handleClickOutside,
};

export default onClickOutside(Plane, clickOutsideConfig);
