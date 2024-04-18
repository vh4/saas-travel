import { Popper, Slide, createTheme } from "@mui/material";
import * as React from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { Chip, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import onClickOutside from "react-onclickoutside";
import { createSearchParams, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, message, Tooltip } from "antd";
import Cookies from "js-cookie";
import { Modal, Placeholder } from "rsuite";
import { CheckboxGroup, Checkbox } from "rsuite";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlineSwap } from "react-icons/ai";
import { InputGroup } from "rsuite";
import dayjs from "dayjs";
import { useState } from "react";
import { parseTanggalPelni } from "../../helpers/date";
import { PickersDay } from "@mui/x-date-pickers/PickersDay/PickersDay";
import Typography from "@mui/material/Typography";
import ModalMui from "@mui/material/Modal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { HolidaysContext } from "../../App";
import { CiCalendarDate } from "react-icons/ci";
import { DateCalendar, DayCalendarSkeleton } from "@mui/x-date-pickers";
import { Calendar } from 'react-multi-date-picker';
import 'dayjs/locale/id'; // mengimpor locale Bahasa Indonesia

dayjs.locale('id'); // mengatur locale global ke Bahasa Indonesia

function Plane() {
  const styleDesktop = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 750,
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
    px: 4,
    pt: 2,
    pb: 4,
  };

  const styleMobile = {
    position: "absolute",
    left: "50%",
    top: "50%",
    borderRadius:5,
    width: 350,
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
    px: 2,
    pt: 2,
    pb: 4,
  };

  const [anchorEl, setAnchorEl] = React.useState("hidden");

  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState();
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [openDate, setOpenDate] = React.useState(false);
  const handleOpenDate = () => setOpenDate(true);
  const handleCloseDate = () => {
    setOpenDate(false);
  };
  const [currentViewDate, setCurrentViewDate] = useState(dayjs());
  const { holidays, dispatchHolidays } = React.useContext(HolidaysContext);
  const currentDate = dayjs();
  const aheadDate = dayjs().add(6, "months");


  const findHolidayDescriptionsForMonth = (date) => {
    const month = date.month(); // Bulan dari tanggal yang sedang dilihat
    const year = date.year(); // Bulan dari tanggal yang sedang dilihat

    const holidaysInMonth = holidays.filter(
      (holiday) =>
        dayjs(holiday.start).month() === month &&
        dayjs(holiday.start).year() === year
    );
    return holidaysInMonth.map((holiday) => holiday);
  };


  const [currentViewDateDesktop, setCurrentViewDateDesktop] = useState(dayjs().format('YYYY-MM'));


  const findHolidayDescriptionsForMonthDesktop = (date) => {
    const startDate = dayjs(date);
    const monthStart = startDate.month();
    const year = startDate.year();
  
    // Tambahkan 1 bulan ke startDate untuk mendapatkan bulan kedua dalam rentang
    const endDate = startDate.add(1, 'month');
    const monthEnd = endDate.month();
  
    const holidaysInMonth = holidays.filter(
      (holiday) => {
        const holidayMonth = dayjs(holiday.start).month();
        const holidayYear = dayjs(holiday.start).year();
  
        // Cek jika liburan berada dalam rentang dua bulan dan tahun yang sama
        return ((holidayMonth === monthStart || holidayMonth === monthEnd) && holidayYear === year);
      }
    );
  
    return holidaysInMonth;
    
  };

  function CustomDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;

    const isSunday = day.day() === 0;
    const holidaysStart = holidays.map((obj) => obj.start);
    const isHoliday = holidaysStart.includes(day.format("YYYY-MM-DD"));

    return (
      <PickersDay
        {...other}
        // disableMargin
        day={day}
        sx={{
          color:
            (isSunday || isHoliday) && !outsideCurrentMonth ? "red" : "inherit",
          backgroundColor: isHoliday ? "#ffecb3" : "inherit", // Opsional: tambah warna latar untuk hari libur
        }}
      />
    );
  }

  const errorBerangkat = () => {
    messageApi.open({
      type: "error",
      content: "Kota Asal tidak boleh sama dengan Kota Tujuan.",
      duration: 10, // Durasi pesan 5 detik
      top: "50%", // Posisi pesan di tengah layar
      className: "custom-message", // Tambahkan kelas CSS kustom jika diperlukan
    });
  };

  const errorTujuan = () => {
    messageApi.open({
      type: "error",
      content: "Kota Tujuan tidak boleh sama dengan Kota Asal.",
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

  var j =
    '{"TPGA":"GARUDA INDONESIA","TPIP":"PELITA AIR","TPJQ":"JETSTAR","TPJT":"LION AIR","TPMV":"TRANS NUSA","TPQG":"CITILINK","TPQZ":"AIR ASIA","TPSJ":"SRIWIJAYA","TPTN":"TRIGANA AIR","TPTR":"TIGER AIR","TPXN":"XPRESS AIR"}';
  var djremix = JSON.parse(j);

  let mskplistCookie = Cookies.get("p-mask");

  // Konversi objek menjadi array dari pasangan kunci dan nilai
  let djremixArray = Object.entries(djremix);

  let mskplist = mskplistCookie
    ? Object.keys(
        Object.fromEntries(
          djremixArray.filter(([key, value]) =>
            JSON.parse(mskplistCookie).includes(key)
          )
        )
      )
    : Object.keys(djremix);

  const [selectedOptions, setSelectedOptions] = React.useState(mskplist);
  const [isSelectAll, setIsSelectAll] = React.useState(
    mskplistCookie ? false : true
  );

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
  let adultCookie = parseInt(
    Cookies.get("p-adult") ? Cookies.get("p-adult") : ""
  );
  let childCookie = parseInt(
    Cookies.get("p-child") ? Cookies.get("p-child") : ""
  );
  let infantCookie = parseInt(
    Cookies.get("p-infant") ? Cookies.get("p-infant") : ""
  );

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

  depa =
    depa?.bandara && depa?.code && depa?.group && depa?.name
      ? depa
      : {
          code: "CGK",
          name: "Jakarta (CGK)",
          bandara: "Soekarno – Hatta",
          group: "Domestik",
        };
  arri =
    arri?.bandara && arri?.code && arri?.group && arri?.name
      ? arri
      : {
          code: "SUB",
          name: "Surabaya (SUB)",
          bandara: "Juanda",
          group: "Domestik",
        };
  dateCookie = dateCookie ? dayjs(dateCookie) : dayjs();
  adultCookie = adultCookie ? adultCookie : 1;
  infantCookie = infantCookie ? infantCookie : 0;
  childCookie = childCookie ? childCookie : 0;

  //input
  const [keberangkatan, setKeberangkatan] = React.useState(depa);
  const [tujuan, setTujuan] = React.useState(arri);
  const [tanggalKeberangkatan, setTanggalKeberangkatan] =
    React.useState(dateCookie);
  const [tanggalTujuan, setTanggalTujuan] = React.useState(dateCookie);
  const [adult, setadult] = React.useState(adultCookie);
  const [infant, setinfant] = React.useState(infantCookie);
  const [child, setChild] = React.useState(childCookie);

  const i = 0;

  const useStyles = makeStyles((theme) => ({
    inputRoot: {
      color: "black", // Ubah warna teks
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e5e7eb", // Ubah warna border
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e5e7eb", // Ubah warna border
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e5e7eb", // Ubah warna border
      },
      "&&& $input": {
        padding: 1,
        width: "50%",
        color: "black", // Ubah warna teks
      },
    },
    root: {
      "& .MuiInputBase-root": {
        "& .MuiInputBase-input": {
          padding: 10,
          borderRadius: 16,
          color: "black", // Ubah warna teks
          cursor: "pointer",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb", // Ubah warna border
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb", // Ubah warna border
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e5e7eb", // Ubah warna border
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

    if (adult <= infant || adult <= child) {
      setadult(parseInt(adult));
    } else {
      if (adult < 1 || adult === 1) {
        setadult(1);
      } else {
        setadult(parseInt(adult) - 1);
      }
    }
  }

  function plusInfant(e) {
    e.preventDefault();

    if (adult <= infant) {
      setinfant(parseInt(infant));
    } else {
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
    if (adult <= child) {
      setChild(infant(child));
    } else {
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

      if (keberangkatan === null && tujuan === null) {
        messageCustomError("Pilih Kota Asal & Kota Tujuan.");
      } else if (keberangkatan === null) {
        messageCustomError("Pilih Kota Asal.");
      } else if (tujuan === null) {
        messageCustomError("Pilih Kota Tujuan.");
      } else {
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
        expirationDate.setDate(expirationDate.getDate() + 7);

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

        navigate({
          pathname: "/flight/search",
          search: `?${createSearchParams(params)}`,
        });
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
                <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-0 md:gap-6">
                  <div className="">
                    <Checkbox
                      className="block -ml-2.5 md:-ml-0"
                      checked={isSelectAll}
                      onChange={toggleSelectAll}
                    >
                      Select All
                    </Checkbox>
                  </div>
                  {Object.keys(djremix).map((key) => (
                    <div className="col-2" key={key}>
                      <CheckboxGroup
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
          <div className="flex space-x-4 justify-end">
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
            <Button onClick={handleClose} appearance="primary">
              Ok
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* desktop */}
      <ModalMui
        className="hidden md:block"
        open={openDate}
        onClose={handleCloseDate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* desktop */}
        <Box sx={styleDesktop}>
          <div className="flex justify-between">
            <div className="grid grid-rows-3 grid-flow-col mt-4">
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
              <div className=" flex justify-center">
                <div className="pl-4 text-gray-400">
                  <h3>{dayjs(tanggalKeberangkatan).format("ddd")},</h3>
                  <h3>
                    {dayjs(tanggalKeberangkatan).format("MMM")}{" "}
                    {dayjs(tanggalKeberangkatan).format("DD")}
                  </h3>
                </div>
              </div>
              <div className="flex justify-center">
                <CiCalendarDate size={60} className="text-gray-400" />
              </div>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Calendar
                  value={tanggalKeberangkatan}
                  onChange={(e) => {setTanggalKeberangkatan(dayjs(e)); handleCloseDate()}}
                  onMonthChange={(newViewDate) => {
                    setCurrentViewDateDesktop(dayjs(newViewDate).format('YYYY-MM'));
                  }}
                  format={"YYYY/MM/DD"}
                  numberOfMonths={2}
                  mapDays={({ date }) => {
                    const dayjsDate = dayjs(date);
            
                    const isSunday = dayjsDate.day() === 0;
                    const isHoliday = holidays.some(holiday => dayjsDate.format("YYYY-MM-DD") === holiday.start);
            
                    if (isSunday || isHoliday) {
                      return {
                        className: "specialDay",
                        style: { color: "red", boxShadow: "none" }, // Sesuaikan dengan kebutuhan
                        title: isHoliday ? holidays.find(holiday => dayjsDate.format("YYYY-MM-DD") === holiday.start).summary : "Sunday",
                      };
                    }
                  }}
                  minDate={currentDate.toDate()}
                  maxDate={aheadDate.toDate()}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div
            style={{ overflowX: "scroll", display: "flex", gap: "8px" }}
            className="hidennscroll mt-2 z-50"
          >
            {findHolidayDescriptionsForMonthDesktop(currentViewDateDesktop)?.map(
              (e, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md px-4 py-1 flex-shrink-0 z-50"
                >
                  <Typography
                    variant="caption"
                    display="block"
                    style={{ fontSize: "10px" }}
                  >
                    <span className="text-red-500">{dayjs(e.start).format("DD MMM")}</span>. {e.summary}
                  </Typography>
                </div>
              )
            )}
          </div>
        </Box>
        {/* mobile */}
      </ModalMui>

      {/* mobile */}
      <ModalMui
        className="block md:hidden"
        open={openDate}
        onClose={handleCloseDate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition // Menutup modal setelah transisi selesai
        TransitionComponent={Slide} // Menggunakan Slide sebagai komponen transisi
        TransitionProps={{ direction: "up" }} // Animasi slide dari bawah ke atas
      >
        <Box sx={styleMobile}>
          <div className="">
            <div className="mt-4 pl-6">
              <div className="flex space-x-4 items-center">
                <div className="flex justify-start">
                  <div className="text-gray-400">
                    <h5>
                      {dayjs(tanggalKeberangkatan).format("ddd")},{" "}
                      {dayjs(tanggalKeberangkatan).format("MMM")}{" "}
                      {dayjs(tanggalKeberangkatan).format("DD")}
                    </h5>
                  </div>
                </div>
                <div className="">
                  <CiCalendarDate size={32} className="text-gray-400" />
                </div>
              </div>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={tanggalKeberangkatan}
                shouldDisableDate={(current) => {
                  const currentDate = dayjs();
                  const aheadDate = dayjs().add(6, "months");
                  return (
                    current &&
                    (current < currentDate.startOf("day") ||
                      current > aheadDate)
                  );
                }}
                onChange={(newValue) => {
                  setTanggalKeberangkatan(newValue);
                  handleCloseDate();
                }}
                onMonthChange={(newViewDate) => {
                  setCurrentViewDate(newViewDate);
                }}
                renderLoading={() => <DayCalendarSkeleton />}
                slots={{
                  day: CustomDay,
                }}
                slotProps={{
                  day: {},
                }}
              />
            </LocalizationProvider>
            <div
              style={{ overflowX: "scroll", display: "flex", gap: "8px" }}
              className="hidennscroll mt-2 z-50"
            >
              {findHolidayDescriptionsForMonth(currentViewDate)?.map(
                (e, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md px-4 py-1 flex-shrink-0 z-50"
                  >
                    <Typography
                      variant="caption"
                      display="block"
                      style={{ fontSize: "10px" }}
                    >
                    <span className="text-red-500">{dayjs(e.start).format("DD MMM")}</span>. {e.summary}
                    </Typography>
                  </div>
                )
              )}
            </div>
          </div>
        </Box>
        {/* mobile */}
      </ModalMui>

      <div className="flex justify-center row bg-white border-t border-gray-200 w-full pr-0">
        <div class="w-full px-4 py-4 rounded-lg shadow-xs">
          <form className="w-full">
            <>
              <div className="w-64 xl:w-48 mx-0"></div>
              <div className="block xl:flex justify-between">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-2`}
                >
                  <div class="w-full mt-1.5 pl-2 md:pl-0 mx-0">
                    <small className="mb-2 text-black">Pilih Maskapai</small>
                    <Tooltip>
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
                  <div className="mt-2 w-full col col-span-1 md:col-span-2">
                    <div className="w-full flex items-center">
                      <div>
                        <div className="w-full m-2 xl:m-0 pr-4 xl:pr-0">
                          <small className="block mb-2 text-black">
                            Kota Asal
                          </small>
                          <Autocomplete
                            classes={classes}
                            className="mt-1.5"
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
                              if (
                                newValue == tujuan ||
                                newValue?.code == tujuan?.code
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
                        </div>
                      </div>
                      <div
                        onClick={changeStatiun}
                        className="cursor-pointer mt-6 flex justify-center items-center bg-blue-500 rounded-full p-1"
                      >
                        <AiOutlineSwap className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="w-full m-2 xl:m-0 pr-4 xl:pr-0">
                          <small className="block mb-2 text-black">
                            Kota Tujuan
                          </small>
                          <Autocomplete
                            classes={classes}
                            className="mt-1.5"
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
                              if (
                                keberangkatan == newValue ||
                                keberangkatan?.code == newValue?.code
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
                        </div>
                      </div>
                    </div>
                  </div>
                  <FormControl sx={{ m: 1, minWidth: 160 }}>
                    <small className="mb-2 text-black">Tanggal Berangkat</small>
                    <button
                      type="button"
                      className="border py-[10px] customButtonStyle w-full block text-black"
                      onClick={handleOpenDate}
                    >
                      <div className="flex justify-between px-2 items-center">
                        <div>
                          {`${parseTanggalPelni(tanggalKeberangkatan)} `}
                        </div>
                        <CiCalendarDate size={22} className="text-gray-400" />
                      </div>
                    </button>
                  </FormControl>

                  <FormControl sx={{ m: 1, minWidth: 130 }}>
                    <small className="mb-2 text-black">Total Penumpang</small>
                    <div className="hidden md:block"></div>
                    <button
                      type="button"
                      className="border py-[11px] customButtonStyle w-full block text-black -mx-1.5"
                      onClick={handleClick}
                    >
                      {`${
                        parseInt(adult) + parseInt(infant) + parseInt(child)
                      } Penumpang`}
                    </button>
                    <div
                      id="basic-menu"
                      className={`${anchorEl} relative md:absolute top-0 md:z-10 grid w-full md:w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg`}
                    >
                      <div className="w-full md:w-48 block md:mx-0">
                        <div className="w-full items-center text-black">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Adult (12 thn keatas)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusAdult}>
                              -
                            </InputGroup.Button>
                            <input
                              type={"number"}
                              className={
                                "block text-center w-full focus:outline-0 selection:border-blue-500"
                              }
                              value={adult}
                              onChange={setadult}
                              min={1}
                              max={7}
                              readOnly
                            />
                            <InputGroup.Button onClick={plusAdult}>
                              +
                            </InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="mt-4 mb-4 w-full items-center text-black">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Child (2 - 11 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusChild}>
                              -
                            </InputGroup.Button>
                            <input
                              type={"number"}
                              className={
                                "block text-center w-full focus:outline-0 selection:border-blue-500"
                              }
                              value={child}
                              onChange={setChild}
                              min={0}
                              max={7}
                              readOnly
                            />
                            <InputGroup.Button onClick={plusChild}>
                              +
                            </InputGroup.Button>
                          </InputGroup>
                        </div>
                        <div className="mt-4 w-full items-center text-black">
                          <div className="text-sm text-center header-number mb-4">
                            <p>Infant (dibawah 2 thn)</p>
                          </div>
                          <InputGroup>
                            <InputGroup.Button onClick={minusInfant}>
                              -
                            </InputGroup.Button>
                            <input
                              type={"number"}
                              className={
                                "block text-center w-full focus:outline-0 selection:border-blue-500"
                              }
                              value={infant}
                              onChange={setinfant}
                              min={0}
                              max={7}
                              readOnly
                            />
                            <InputGroup.Button onClick={plusInfant}>
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
