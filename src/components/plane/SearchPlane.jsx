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
import { Button, Tooltip } from "antd";
import Cookies from "js-cookie";
import { Modal, Placeholder } from "rsuite";
import { CheckboxGroup, Checkbox } from "rsuite";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlineSwap } from "react-icons/ai";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import DateRangeIcon from '@mui/icons-material/DateRange'; // Import the DateRangeIcon


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
  const [adult, setadult] = React.useState(1);
  const [infant, setinfant] = React.useState(0);
  const [child, setChild] = React.useState(0);

  const [openBerangka, SetopenBerangka] = React.useState(false);
  const [openTujuan, setOpenTujuan] = React.useState(false);

  const [pesawatData, setPesawatData] = React.useState([]);
  const loadingBerangkat = openBerangka && pesawatData.length === 0;
  const loadingTujuan = openTujuan && pesawatData.length === 0;

  let depa = Cookies.get("p-depa");
  let arri = Cookies.get("p-arri");

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

  depa = depa?.bandara && depa?.code && depa?.group && depa?.name ? depa : null;
  arri = arri?.bandara && arri?.code && arri?.group && arri?.name ? arri : null;

  //input
  const [keberangkatan, setKeberangkatan] = React.useState(depa);
  const [tujuan, setTujuan] = React.useState(arri);
  const [tanggalKeberangkatan, setTanggalKeberangkatan] = React.useState();
  const [tanggalTujuan, setTanggalTujuan] = React.useState();

  const i = 0;

  const useStyles = makeStyles((theme) => ({
    inputRoot: {
      color: "#6b7280",
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
      },
    },
    root: {
      "& .MuiInputBase-root": {
        "& .MuiInputBase-input": {
          padding: 10,
          borderRadius: 10,
          cursor: "pointer"
        },
        color: "#6b7280",
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
    if (adult >= 4) {
      setadult(4);
    } else {
      setadult(adult + 1);
    }
  }

  function minusAdult(e) {
    e.preventDefault();

    if (adult < 1 || adult === 1) {
      setadult(1);
    } else {
      setadult(adult - 1);
    }
  }

  function plusInfant(e) {
    e.preventDefault();
    if (infant >= 4) {
      setinfant(4);
    } else {
      setinfant(infant + 1);
    }
  }

  function minusInfant(e) {
    e.preventDefault();

    if (infant < 0 || infant === 0) {
      setinfant(0);
    } else {
      setinfant(infant - 1);
    }
  }

  function plusChild(e) {
    e.preventDefault();
    if (child >= 4) {
      setChild(4);
    } else {
      setChild(child + 1);
    }
  }

  function minusChild(e) {
    e.preventDefault();

    if (child < 0 || child === 0) {
      setChild(0);
    } else {
      setChild(child - 1);
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

      var str = "";
      for (var key in params) {
        if (str != "") {
          str += "&";
        }
        str += key + "=" + encodeURIComponent(params[key]);
      }

      window.location = `/flight/search?${str}`;
    });
  }

  const changeStatiun = () => {

    setKeberangkatan(tujuan);
    setTujuan(keberangkatan);

  }

  return (
    <>
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
              <div className="w-64 xl:w-48 mx-0"></div>
              <div className="block xl:flex justify-between">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-6`}
                >
                  <div class="w-full mt-1.5 pl-2 md:pl-0 mx-0">
                    <small className="mb-2 text-gray-500">Pilih Maskapai</small>
                    <Tooltip title="cari maskapai">
                      <Button
                        onClick={() => handleOpen("lg")}
                        size="large"
                        type="default"
                        shape="default" // Use 'default' shape for no rounding
                        className="text-zinc-500 block mt-2 bg-white border-gray-200"
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
                            setKeberangkatan(newValue);
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
                      <FormControl className="" sx={{ m: 1, minWidth: 150 }}>
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
                            setTujuan(newValue);
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
                  <FormControl sx={{ m: 1, minWidth: 160 }}>
                    <small className="mb-2 text-gray-500">
                      Tanggal Berangkat
                    </small>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      style={{ cursor: "pointer" }}
                    >
                      <MobileDatePicker
                        style={{ cursor: "pointer" }}
                        minDate={new Date()}
                        value={tanggalKeberangkatan}
                        className={classes.root}
                        inputFormat="YYYY-MM-DD"
                        onChange={(newValue) => {
                          setTanggalKeberangkatan(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            style={{ cursor: "pointer" }}
                            {...params}
                            InputProps={{
                              // Place the DateRangeIcon here
                              endAdornment: (
                                <DateRangeIcon className="cursor-pointer text-gray-400" />
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 130 }}>
                    <small className="mb-2 text-gray-500">
                      Total Penumpang
                    </small>
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      onClick={handleClick}
                      sx={{ input: { cursor: "pointer" } }}
                      size="medium"
                      classes={classes}
                      id="outlined-basic"
                      value={`${
                        parseInt(adult) + parseInt(infant) + parseInt(child)
                      } Penumpang`}
                      variant="outlined"
                    />
                    <div
                      id="basic-menu"
                      className={`${anchorEl} absolute top-20 z-10 grid w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg`}
                    >
                      <div className="w-full ml-4 block md:mx-0">
                        <div className="mt-4 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number">
                            <p>Adult (Dewasa {">"} 12 thn)</p>
                          </div>
                          <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                            <button
                              onClick={plusAdult}
                              class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none"
                            >
                              <span class="m-auto text-2xl font-thin">+</span>
                            </button>
                            <input
                              type="number"
                              class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none"
                              name="custom-input-number"
                              value={adult}
                            />
                            <button
                              onClick={minusAdult}
                              class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer"
                            >
                              <span class="m-auto text-2xl font-thin">-</span>
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number">
                            <p>Child (Child 2-11 thn)</p>
                          </div>
                          <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                            <button
                              onClick={plusChild}
                              class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none"
                            >
                              <span class="m-auto text-2xl font-thin">+</span>
                            </button>
                            <input
                              type="number"
                              class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none"
                              name="custom-input-number"
                              value={child}
                            />
                            <button
                              onClick={minusChild}
                              class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer"
                            >
                              <span class="m-auto text-2xl font-thin">-</span>
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 w-full items-center text-gray-600">
                          <div className="text-sm text-center header-number">
                            <p>Infant (Infant 0-2 thn)</p>
                          </div>
                          <div class="flex flex-row h-10 w-full rounded-lg relative mt-2">
                            <button
                              onClick={plusInfant}
                              class=" bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-l cursor-pointer outline-none"
                            >
                              <span class="m-auto text-2xl font-thin">+</span>
                            </button>
                            <input
                              type="number"
                              class="focus:outline-none text-center w-full bg-gray-50 font-semibold text-md md:text-basecursor-default flex items-center text-gray-500  outline-none"
                              name="custom-input-number"
                              value={infant}
                            />
                            <button
                              onClick={minusInfant}
                              class="bg-gray-100 text-gray-600 hover:text-gray-500 hover:bg-gray-200 h-full w-20 rounded-r cursor-pointer"
                            >
                              <span class="m-auto text-2xl font-thin">-</span>
                            </button>
                          </div>
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
