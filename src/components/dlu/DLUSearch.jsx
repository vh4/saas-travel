import * as React from "react";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Chip, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { Popper } from "@mui/material";
import { IoBoatSharp } from "react-icons/io5";
import { useNavigate, createSearchParams } from "react-router-dom";
import onClickOutside from "react-onclickoutside";
import { makeStyles } from "@mui/styles";
import { DateRangePicker, InputGroup } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Button, DatePicker, Select, message } from "antd";
import Cookies from "js-cookie";
import { AiOutlineSwap } from "react-icons/ai";
import dayjs from "dayjs";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CiBoxList, CiCalendarDate } from "react-icons/ci";
import { HolidaysContext } from "../../App";
import { PickersDay } from "@mui/x-date-pickers/PickersDay/PickersDay";
import { parseTanggalPelni } from "../../helpers/date";
import ModalMui from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { DateCalendar, DayCalendarSkeleton } from "@mui/x-date-pickers";

function DLU() {
  const styleDesktop = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 540,
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
    px: 4,
    pt: 2,
    pb: 4,
  };

  const styleMobile = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 350,
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
    px: 2,
    pt: 2,
    pb: 4,
  };

  const { holidays, dispatchHolidays } = React.useContext(HolidaysContext);

  const [anchorEl, setAnchorEl] = React.useState("hidden");
  const handleClick = () => {
    anchorEl === "hidden" ? setAnchorEl("grid") : setAnchorEl("hidden");
  };

  DLU.handleClickOutside = () => {
    setAnchorEl("hidden");
  };

  const navigate = useNavigate();

  const [isLoading, setLoading] = React.useState(false);
  const [DLUStasiun, setDLUStasiun] = React.useState({});

  const [openBerangka, SetopenBerangka] = React.useState(false);
  const [openTujuan, setOpenTujuan] = React.useState(false);

  const [DLUData, setDLUData] = React.useState([]);
  const loadingBerangkat = openBerangka && DLUData.length === 0;
  const loadingTujuan = openTujuan && DLUData.length === 0;
  const [messageApi, contextHolder] = message.useMessage();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [type_vehicle, settype_vehicle] = useState([]);
  const [class_passengers, setclass_passengers] = useState([]);
  const [type_passanger, settype_passanger] = useState([]);

  const [openDate, setOpenDate] = React.useState(false);
  const handleOpenDate = () => setOpenDate(true);
  const handleCloseDate = () => {
    setOpenDate(false);
  };
  const [currentViewDate, setCurrentViewDate] = useState(dayjs());

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

  function CustomDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;

    const isSunday = day.day() === 0;
    const holidaysStart = holidays.map((obj) => obj.start);
    const isHoliday = holidaysStart.includes(day.format("YYYY-MM-DD"));

    return (
      <PickersDay
        {...other}
        disableMargin
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

  let depa = Cookies.get("dlu-depa");
  let arri = Cookies.get("dlu-arri");
  let adultCookie = parseInt(
    Cookies.get("dlu-adult") ? Cookies.get("dlu-adult") : ""
  );
  let childCookie = parseInt(
    Cookies.get("dlu-child") ? Cookies.get("dlu-child") : ""
  );
  let infantCookie = parseInt(
    Cookies.get("dlu-infant") ? Cookies.get("dlu-infant") : ""
  );

  let dateCookie = Cookies.get("dlu-tanggal")
    ? Cookies.get("dlu-tanggal")
    : dayjs();

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
    dateCookie = dayjs(dateCookie).isValid() ? dateCookie : null;
  } catch (error) {
    dateCookie = null;
  }

  depa =
    depa?.id_pelabuhan && depa?.nama_pelabuhan
      ? depa
      : {
          id_pelabuhan: "3",
          nama_pelabuhan: "Pel.Semayang",
          nama_kota: "Balikpapan",
        };
  arri =
    arri?.id_pelabuhan && arri?.nama_pelabuhan
      ? arri
      : {
          id_pelabuhan: "2",
          nama_pelabuhan: "Pel.Trisakti",
          nama_kota: "Banjarmasin",
        };
  adultCookie = adultCookie ? adultCookie : 1;
  infantCookie = infantCookie ? infantCookie : 0;
  childCookie = childCookie ? childCookie : 0;

  dateCookie = dateCookie ? dayjs(dateCookie) : dayjs();

  // Input
  const [tanggal, setTanggal] = React.useState(dateCookie);

  const [adult, setadult] = React.useState(adultCookie);
  const [infant, setinfant] = React.useState(infantCookie);
  const [child, setChild] = React.useState(childCookie);

  const [keberangkatan, setKeberangkatan] = React.useState(depa);
  const [tujuan, setTujuan] = React.useState(arri);

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
        setDLUData([...DLUStasiun.data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingBerangkat]);

  React.useEffect(() => {
    if (!openBerangka) {
      setDLUData([]);
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
        setDLUData([...DLUStasiun.data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingTujuan]);

  React.useEffect(() => {
    if (!openTujuan) {
      setDLUData([]);
    }
  }, [openTujuan]);

  React.useEffect(() => {
    getDLUtDataStasiun();
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

  function addLeadingZero(num) {
    if (num < 10) {
      return "0" + num;
    } else {
      return "" + num;
    }
  }

  async function getDLUtDataStasiun() {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/ship/ship_harbor`,
      {
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      }
    );

    const type_passangers = response.data.data.type_passanger;
    const type_passangersParsing = type_passangers
      ? type_passangers.map((item) => ({
          value: parseInt(item.id, 10), // Mengubah id menjadi integer
          label: item.name,
        }))
      : [];

    const type_vehicles = response.data.data.type_vehicle;
    const type_vehiclesParsingData = type_vehicles
      ? type_vehicles.map((item) => ({
          value: parseInt(item.id, 10), // Mengubah id menjadi integer
          label: item.name,
        }))
      : [];

    const class_passangerses = response.data.data.class_passanger;
    const class_passangersesParsingData = class_passangerses
      ? class_passangerses.map((item) => ({
          value: parseInt(item.id, 10), // Mengubah id menjadi integer
          label: item.name,
        }))
      : [];

    settype_passanger(type_passangersParsing);
    settype_vehicle(type_vehiclesParsingData);
    setclass_passengers(class_passangersesParsingData);

    let parsing = {};
    parsing["data"] = response.data.data.data_pelabuhan || null;
    setDLUStasiun(parsing || null);
  }

  const jumlahKendaraan = Array.from({ length: 6 }, (_, i) => ({
    label: i + 1,
    value: i + 1,
  }));

  const [pilih, setPilih] = useState({
    value: 0,
    label: "Penumpang dan Kendaraan",
  });
  const [vehicles, setvehicles] = useState({
    value: 4,
    label: "Sepeda Motor 2.A (s.d 249CC)",
  });
  const [classpassengers, setclasspassengers] = useState({
    value: 2,
    label: "Kelas I",
  });
  const [jumlahkendaraan, setJumlahkendaraan] = useState({
    value: 1,
    label: 1,
  });

  function handleSubmitDLU(e) {
    e.preventDefault();
    setLoading(true);

    let tanggalNullFill = new Date();
    tanggalNullFill =
      tanggalNullFill.getFullYear() +
      "-" +
      (parseInt(tanggalNullFill.getMonth()) + 1) +
      "-" +
      tanggalNullFill.getDate();

    const tanggalParse =
      tanggal !== undefined && tanggal !== null
        ? tanggal.$y +
          "-" +
          addLeadingZero(parseInt(tanggal.$M) + 1).toString() +
          "-" +
          addLeadingZero(parseInt(tanggal.$D)).toString()
        : tanggalNullFill;

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
        let count_passangers_custom = "";
        let type_class_custom = 0;
        let type_vehicle_custom = 0;

        let type_class_custom_name = "";
        let type_vehicle_custom_name = "";
        let adult_custom = 0;
        let child_custom = 0;
        let infant_custom = 0;
        let count_passangers_name = 0;

        if (pilih.value === 1) {
          type_class_custom = classpassengers.value;
          type_class_custom_name = classpassengers.label;

          count_passangers_custom = `${adult}#${child}#${infant}#0`;
          adult_custom = adult;
          infant_custom = infant;
          child_custom = child;
        } else if (pilih.value === 2) {
          count_passangers_custom = `0#0#0#${jumlahkendaraan.value}`;

          type_vehicle_custom = vehicles.value;
          type_vehicle_custom_name = vehicles.label;
          count_passangers_name = jumlahkendaraan.value;
        } else {
          count_passangers_custom = `${adult}#${child}#${infant}#${jumlahkendaraan.value}`;
          type_class_custom = classpassengers.value;
          type_vehicle_custom = vehicles.value;

          type_vehicle_custom_name = vehicles.label;
          type_class_custom_name = classpassengers.label;

          adult_custom = adult;
          infant_custom = infant;
          child_custom = child;

          count_passangers_name = jumlahkendaraan.value;
        }

        const params = {
          start_date: tanggalParse,
          end_date: tanggalParse,
          origin_code: keberangkatan.id_pelabuhan,
          origin_name: keberangkatan.nama_pelabuhan,
          destination_code: tujuan.id_pelabuhan,
          destination_name: tujuan.nama_pelabuhan,
          type_ticket: pilih.value,
          type_ticket_name: pilih.label,
          type_class: type_class_custom,
          type_class_name: type_class_custom_name,
          type_vehicle: type_vehicle_custom,
          type_vehicle_name: type_vehicle_custom_name,
          count_passangers: count_passangers_custom,
          count_passangers_name: count_passangers_name,
          adult: adult_custom,
          infant: infant_custom,
          child: child_custom,
        };

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        const cookieOptions = {
          expires: expirationDate,
        };

        Cookies.set("dlu-depa", JSON.stringify(keberangkatan), cookieOptions);
        Cookies.set("dlu-arri", JSON.stringify(tujuan), cookieOptions);
        Cookies.set("dlu-adult", adult, cookieOptions);
        Cookies.set("dlu-child", child, cookieOptions);
        Cookies.set("dlu-infant", infant, cookieOptions);

        Cookies.set("dlu-tanggal", tanggal, cookieOptions);

        var str = "";
        for (var key in params) {
            if (str != "") {
                str += "&";
            }
            str += key + "=" + encodeURIComponent(params[key]);
        } 
        
        window.location = `/dlu/search?${str}`; 
        
      }
    }, 1000);
  }

  const changeStatiun = () => {
    setKeberangkatan(tujuan);
    setTujuan(keberangkatan);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  return (
    <>
      {contextHolder}
      <div className="row bg-white border-t border-gray-200 w-full pr-0">
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
                    <h3>{dayjs(tanggal).format("ddd")},</h3>
                    <h3>
                      {dayjs(tanggal).format("MMM")}{" "}
                      {dayjs(tanggal).format("DD")}
                    </h3>
                  </div>
                </div>
                <div className="flex justify-center">
                  <CiCalendarDate size={60} className="text-gray-400" />
                </div>
              </div>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={tanggal}
                    shouldDisableDate={(current) => {
                      const currentDate = dayjs();
                      const aheadDate = dayjs().add(3, "months");
                      return (
                        current &&
                        (current < currentDate.startOf("day") ||
                          current > aheadDate)
                      );
                    }}
                    onChange={(newValue) => {
                      setTanggal(newValue);
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
              </div>
            </div>
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
                      {dayjs(e.start).format("DD")}.{e.summary}
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
        >
          <Box sx={styleMobile}>
            <div className="">
              <div className="my-4  pl-4">
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
                <div className="flex space-x-4 items-center">
                  <div className="flex justify-start">
                    <div className="text-gray-400">
                      <h5>
                        {dayjs(tanggal).format("ddd")},{" "}
                        {dayjs(tanggal).format("MMM")}{" "}
                        {dayjs(tanggal).format("DD")}
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
                  value={tanggal}
                  shouldDisableDate={(current) => {
                    const currentDate = dayjs();
                    const aheadDate = dayjs().add(3, "months");
                    return (
                      current &&
                      (current < currentDate.startOf("day") ||
                        current > aheadDate)
                    );
                  }}
                  onChange={(newValue) => {
                    setTanggal(newValue);
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
            </div>
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
                      {dayjs(e.start).format("DD")}.{e.summary}
                    </Typography>
                  </div>
                )
              )}
            </div>
          </Box>
          {/* mobile */}
        </ModalMui>
        <div class="w-full px-4 py-4 rounded-lg shadow-xs">
          <form className="w-full">
            <>
              <div className="flex items-center space-x-1.5 text-xs text-black mx-0 xl:mx-6">
                <CiBoxList className="text-black" />
                <p>Pilih rute dan jadwal keberangkatan</p>
              </div>
              <div className="mt-2 mx-0 xl:mx-6 border-b border-gray-200"></div>
              <div className="block xl:flex justify-between mx-0 xl:mx-6 mt-2">
                <div className="grid grid-cols-1 xl:grid-cols-4 mx-0 gap-6 xl:gap-0">
                  <div className="mt-2 w-full col col-span-1 md:col-span-2">
                    <div className="w-full flex items-center">
                      <div className="w-full m-2 xl:m-0 xl:pr-0">
                        <small className="block mb-2 text-black">
                          Pelabuhan Asal
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
                          getOptionLabel={(option) =>
                            `${option.nama_pelabuhan} (${option.nama_kota})`
                          }
                          options={DLUData}
                          value={keberangkatan}
                          onChange={(event, newValue) => {
                            if (
                              newValue == tujuan ||
                              newValue?.id_pelabuhan == tujuan?.id_pelabuhan
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
                          getOptionLabel={(option) =>
                            `${option.nama_pelabuhan} (${option.nama_kota})`
                          }
                          options={DLUData}
                          value={tujuan}
                          onChange={(event, newValue) => {
                            if (
                              newValue == keberangkatan ||
                              newValue?.id_pelabuhan ==
                                keberangkatan?.id_pelabuhan
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
                  <FormControl sx={{ m: 1, minWidth: 160 }}>
                    <small className="mb-2 text-black">Tanggal Berangkat</small>
                    <button
                      type="button"
                      className="border py-[10px] customButtonStyle w-full block text-black"
                      onClick={handleOpenDate}
                    >
                      <div className="flex justify-between mx-4 items-center">
                        <div>{`${parseTanggalPelni(tanggal)} `}</div>
                        <CiCalendarDate size={22} className="text-gray-400" />
                      </div>
                    </button>
                  </FormControl>
                  <FormControl sx={{ m: 1.1, minWidth: 130 }}>
                    <small className="mb-2 text-black">
                      Detail Penumpang / Kendaraan
                    </small>
                    <div className="block w-full">
                      <Select
                        size={"large"}
                        value={pilih.value}
                        onChange={(value) => {
                          const selectedOption = type_passanger.find(
                            (option) => option.value === value
                          );
                          setPilih(selectedOption);
                        }}
                        style={{
                          width: "100%",
                        }}
                        options={type_passanger}
                      />
                    </div>
                  </FormControl>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 mt-6 text-xs text-black mx-0 xl:mx-6">
                <CiBoxList className="text-black" />
                <p>Detail Penumpang dan Kendaraan</p>
              </div>
              <div className="mt-2 mx-0 xl:mx-6 border-b border-gray-200"></div>

              <div className="mx-0 xl:mx-6 mb-4">
                <div className="grid grid-cols-2 xl:grid-cols-4 mx-0">
                  {(pilih.value === 1 || pilih.value === 0) && (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 130 }}>
                        <small className="mt-4 mb-2 text-black">
                          Kelas Kapal
                        </small>
                        <div className="block w-full">
                          <Select
                            size={"large"}
                            value={classpassengers.value}
                            onChange={(value) => {
                              const selectedOption = class_passengers.find(
                                (option) => option.value === value
                              );
                              setclasspassengers(selectedOption);
                            }}
                            style={{
                              width: "100%",
                            }}
                            options={class_passengers}
                          />
                        </div>
                      </FormControl>
                    </>
                  )}
                  {(pilih.value === 2 || pilih.value === 0) && (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 130 }}>
                        <small className="mt-4 mb-2 text-black">
                          Kendaraan Motor
                        </small>
                        <div className="block w-full">
                          <Select
                            size={"large"}
                            value={vehicles.value}
                            onChange={(value) => {
                              const selectedOption = type_vehicle.find(
                                (option) => option.value === value
                              );
                              setvehicles(selectedOption);
                            }}
                            style={{
                              width: "100%",
                            }}
                            options={type_vehicle}
                          />
                        </div>
                      </FormControl>
                    </>
                  )}
                  {(pilih.value === 2 || pilih.value === 0) && (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 130 }}>
                        <small className="mt-4 mb-2 text-black">
                          Jumlah Kendaraan
                        </small>
                        <div className="block w-full">
                          <Select
                            size={"large"}
                            value={jumlahkendaraan.value}
                            onChange={(value) => {
                              const selectedOption = jumlahKendaraan.find(
                                (option) => option.value === value
                              );
                              setJumlahkendaraan(selectedOption);
                            }}
                            style={{
                              width: "100%",
                            }}
                            options={jumlahKendaraan}
                          />
                        </div>
                      </FormControl>
                    </>
                  )}
                  {(pilih.value === 1 || pilih.value === 0) && (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 110 }}>
                        <small className="mt-4 mb-2 text-black">
                          Total Penumpang
                        </small>
                        <div className="hidden md:block"></div>
                        <button
                          type="button"
                          className="border py-[9px] customButtonStyle w-full block text-black -mx-1.5"
                          onClick={handleClick}
                        >
                          {`${
                            parseInt(adult) + parseInt(infant) + parseInt(child)
                          } Penumpang`}
                        </button>
                        <div
                          id="basic-menu"
                          className={`${anchorEl} relative md:absolute top-0 md:top-20 md:z-10 grid w-full md:w-auto px-8 py-4 text-sm bg-white border border-gray-100 rounded-lg`}
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
                    </>
                  )}
                </div>
              </div>
              <div className="mx-0 xl:mx-6 w-full xl:w-1/4 flex justify-end xl:justify-start mt-4 py-0.5 mb-4">
                <Button
                  block
                  size="large"
                  key="submit"
                  type="primary"
                  className="bg-blue-500 mx-2 md:mx-0"
                  loading={isLoading}
                  onClick={handleSubmitDLU}
                >
                  Cari Tiket
                </Button>
              </div>
            </>
          </form>
        </div>
      </div>
    </>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => DLU.handleClickOutside,
};

export default onClickOutside(DLU, clickOutsideConfig);
