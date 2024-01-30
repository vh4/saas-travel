import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoArrowBackOutline, IoArrowForwardOutline, IoSearchCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import { IoMdTimer } from "react-icons/io";
import SearchPlane from "./SearchPlane";
import { Progress } from "rsuite";
import { Space, Spin } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal } from "../../helpers/date";
import { MdManageSearch, MdOutlineLuggage, MdSort } from "react-icons/md";
import { notification, Radio } from "antd";
import Page500 from "../components/500";
import Page400 from "../components/400";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import { createTheme } from "@mui/material";
import moment from "moment";
import { Popover, Whisper } from "rsuite";
import { v4 as uuidv4 } from 'uuid';

export default function Search() {
  const theme = createTheme({
    typography: {
      fontSize: 8,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoadingPilihTiket, setisLoadingPilihTiket] = useState();
  const [percent, setPercent] = useState(0);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );
  const [err, setErr] = useState(false);
  const [Pageerr, setPageErr] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [showHarga, setShowHarga] = useState(false);
  const [showWaktu, setShowWaktu] = useState(false);

  const [waktuFilter, setWaktuFilter] = useState([false, false, false, false]);
  
  const [transit, setTransit] = useState(true);
  const [langsung, setLangsung] = useState(true);


  const [selectedTime, setSelectedTime] = useState([]);

  const btnRefHarga = useRef(null);
  const btnRefWaktu = useRef(null);

  const [uuids, setuuid] = useState(null);

  useEffect(() => {
    const closeFilter = (e) => {
      if (
        e.target !== btnRefHarga.current &&
        e.target !== btnRefWaktu.current
      ) {
        setShowHarga(false);
        setShowWaktu(false);
      }
    };

    document.body.addEventListener("click", closeFilter);

    return () => document.body.removeEventListener("click", closeFilter);
  }, []);

  const [valHargaRange, setHargaRange] = useState([0, 100000000]);
  const handleWaktuFilterChange = (e) => {
    let newWktuFilter = waktuFilter;

    if (e.target.value == "06:00-11:59") {
      newWktuFilter[0] = newWktuFilter[0] ? false : true;
    } else if (e.target.value == "12:00-17:59") {
      newWktuFilter[1] = newWktuFilter[1] ? false : true;
    } else if (e.target.value == "18:00-23:59") {
      newWktuFilter[2] = newWktuFilter[2] ? false : true;
    } else if (e.target.value == "00:00-05:59") {
      newWktuFilter[3] = newWktuFilter[3] ? false : true;
    }

    setWaktuFilter(newWktuFilter);

    const time = e.target.value;
    if (selectedTime.includes(time)) {
      setSelectedTime(selectedTime.filter((t) => t !== time));
    } else {
      setSelectedTime([...selectedTime, time]);
    }
  };

  function hargraRangeChange(e, data) {
    setHargaRange(data);
  }

  const failedNotification = (rd) => {
    api["error"]({
      message: "Error!",
      description:
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
    });
  };

  let departure,
    departureName,
    arrival,
    arrivalName,
    departureDate,
    returnDate,
    isLowestPrice,
    adult,
    child,
    infant,
    maskapai;

  maskapai = searchParams.get("maskapai") ? searchParams.get("maskapai") : null;

  departure = searchParams.get("departure")
    ? searchParams.get("departure")
    : null;

  departureName = searchParams.get("departureName")
    ? searchParams.get("departureName")
    : null;
  arrival = searchParams.get("arrival") ? searchParams.get("arrival") : null;
  arrivalName = searchParams.get("arrivalName")
    ? searchParams.get("arrivalName")
    : null;
  departureDate = searchParams.get("departureDate")
    ? searchParams.get("departureDate")
    : null;
  returnDate = searchParams.get("returnDate")
    ? searchParams.get("returnDate")
    : ""; //khusus return date nya dibilikin ''.
  isLowestPrice = searchParams.get("isLowestPrice")
    ? searchParams.get("isLowestPrice")
    : null;
  adult = searchParams.get("adult") ? searchParams.get("adult") : 0;
  child = searchParams.get("child") ? searchParams.get("child") : 0;
  infant = searchParams.get("infant") ? searchParams.get("infant") : 0;

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    if (
      infant === null ||
      infant === undefined ||
      isNaN(parseInt(infant)) == true
    ) {
      setPageErr(true);
    }

    if (
      child === null ||
      child === undefined ||
      isNaN(parseInt(child)) == true
    ) {
      setPageErr(true);
    }

    if (
      adult === null ||
      adult === undefined ||
      isNaN(parseInt(adult)) == true
    ) {
      setPageErr(true);
    }

    if (isLowestPrice === null || isLowestPrice === undefined) {
      setPageErr(true);
    }

    if (returnDate === null || returnDate === undefined) {
      setPageErr(true);
    }

    if (departureDate === null || departureDate === undefined) {
      setPageErr(true);
    }

    if (arrivalName === null || arrivalName === undefined) {
      setPageErr(true);
    }

    if (arrival === null || arrival === undefined) {
      setPageErr(true);
    }

    if (departureName === null || departureName === undefined) {
      setPageErr(true);
    }

    if (departure === null || departure === undefined) {
      setPageErr(true);
    }

    if (departure === null || departure === undefined) {
      setPageErr(true);
    }

    if (
      parseInt(adult) < parseInt(child) ||
      parseInt(adult) < parseInt(infant)
    ) {
      setPageErr(true);
    }

    if (parseInt(adult) <= 0) {
      setPageErr(true);
    }
  }, [
    token,
    departure,
    departureName,
    arrival,
    arrivalName,
    departureDate,
    returnDate,
    isLowestPrice,
    adult,
    child,
    infant,
    maskapai,
  ]);

  const tanggal_keberangkatan = parseTanggal(departureDate);

  const navigate = useNavigate();
  const [ubahPencarian, setUbahPencarian] = useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [notFound, setError] = React.useState(true);
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [dataSearch, setDataSearch] = React.useState(Array());
  const [detailTiket, setDetailTiket] = React.useState(null);
  const [detailHarga, setDetailHarga] = React.useState(null);
  const [HargaTerendahTinggiPlane, setHargaTerendahTinggiPlane] = useState(false);

  var j =
    '{"TPGA":"GARUDA INDONESIA","TPIP":"PELITA AIR","TPJQ":"JETSTAR","TPJT":"LION AIR","TPMV":"TRANS NUSA","TPQG":"CITILINK","TPQZ":"AIR ASIA","TPSJ":"SRIWIJAYA","TPTN":"TRIGANA AIR","TPTR":"TIGER AIR","TPXN":"XPRESS AIR"}';
  var djremix = JSON.parse(j);

  var keysArray = Object.keys(djremix);

  useEffect(() => {
    handlerSearch();
  }, []);

  const ListKodePesawat =
    maskapai !== null && maskapai !== undefined && maskapai !== ""
      ? maskapai.split("#")
      : keysArray;

  const handlerSearch = async () => {
    setLoading(true);
    var x = 0;

    for (let e of ListKodePesawat) {
      const panjang = ListKodePesawat.length;

      let response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/flight/search`,
        {
          airline: e,
          departure: departure,
          arrival: arrival,
          departureDate: departureDate,
          returnDate: returnDate,
          isLowestPrice: isLowestPrice,
          adult: adult,
          child: child,
          infant: infant,
          token: token,
        }
      );

      setuuid(response.data.uuid);

      if (
        response.data.data &&
        response.data.data !== undefined &&
        response.data.data.length !== 0
      ) {
        x = x + 15; //loading per-15%

        if (panjang >= 2 && panjang <= 4) {
          setPercent(x + 40);
        }

        if (panjang >= 5) {
          setPercent(x + 30);
        }

        setDataSearch((dataSearch) => [...dataSearch, ...response.data.data]);
        setLoading(false);
        setError(false);
        x++;
      }
    }

    setLoading(false);

    if (percent < 90) {
      setPercent(100);
    }
  };

const filteredData = dataSearch
  .filter((d, i) => {
    if (selectedTime.length === 0) {
      return true;
    }
    const departureTime = moment(d.detailTitle[0].depart, "HH:mm").format(
      "HH:mm"
    );
    return selectedTime.some((t) => {
      const [start, end] = t.split("-");
      return moment(departureTime, "HH:mm").isBetween(
        moment(start, "HH:mm"),
        moment(end, "HH:mm")
      );
    });
  })
  .filter((flight, i) => {
    return flight.classes[0].some((harga) => {
      if (harga.price === undefined) {
        return false; // Skip if price is undefined
      }
      return (
        valHargaRange[0] <= harga.price && harga.price <= valHargaRange[1]
      );
    });
  }).filter((flight, i) => {
    if (!transit && !langsung) {
      return true; // No filter, return all flights
    } else if (!transit) {
      return !flight.isTransit; // Only non-transit flights
    } else if (!langsung) {
      return flight.isTransit; // Only transit flights
    } else {
      return true; // Both transit and non-transit flights
    }
  })
  
  .sort((a, b) => {
    if (HargaTerendahTinggiPlane === 1) {
      const priceA = Math.min(...a.classes[0].map((x) => x.price));
      const priceB = Math.min(...b.classes[0].map((x) => x.price));
      return priceA - priceB;
    } else if(HargaTerendahTinggiPlane === 2) {
      const priceA = Math.max(...a.classes[0].map((x) => x.price));
      const priceB = Math.max(...b.classes[0].map((x) => x.price));
      return priceB - priceA;
    }
  });

  const SortingPopoOverPlane = (
    <Popover title="Urutkan Dengan">
      <div className="">
        <Box sx={{ width: 150 }}>
        <Radio.Group className="mt-2" onChange={(e) => setHargaTerendahTinggiPlane(e.target.value)} value={HargaTerendahTinggiPlane}>
          <Space direction="vertical">
            <Radio value={1} className="mt-2">Harga Terendah</Radio>
            <Radio value={2} className="mt-2">Harga Tertinggi</Radio>
          </Space>
        </Radio.Group>
        </Box>
      </div>
    </Popover>
  );

  async function bookingHandlerDetail(i) {
    setisLoadingPilihTiket(`true-${i}`);

    let filterDataSearching = filteredData.filter((_, index) => index === i);

    let detailKereta = {
      airline: filterDataSearching[0].airlineCode,
      departure: filterDataSearching[0].classes[0][0].departure,
      arrival: filterDataSearching[0].classes[0][0].arrival,
      departureDate: filterDataSearching[0].departureDate,
      returnDate: "",
      adult: adult,
      child: child,
      infant: infant,
      token: token,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/flight/fare`,
      detailKereta
    ); //kocak broooWWW

    const forBooking = {
      airline: filterDataSearching[0].airlineCode,
      departure: departure,
      arrival: arrival,
      departureDate: filterDataSearching[0].departureDate,
      returnDate: "",
      adult: adult,
      child: child,
      infant: infant,
      seats: [filterDataSearching[0].classes[0][0].seat],
      isInternational:
        filterDataSearching[0]?.classes[
          filterDataSearching[0]?.classes.length - 1
        ][0]?.isInternational ?? 0,
    };

    if (response.data.rc === "00") {
      const next = [];
      const lenghtArr = filterDataSearching[0].classes.length;

      for (var i = 0; i < lenghtArr; i++) {
        next.push({
          airline: filterDataSearching[0].detailTitle[i].flightCode,
          airlineName: filterDataSearching[0].detailTitle[i].flightName,
          airlineIcon: filterDataSearching[0].detailTitle[i].flightIcon,
          departure: filterDataSearching[0].classes[i][0].departure,
          arrival: filterDataSearching[0].classes[i][0].arrival,
          departureName: filterDataSearching[0].classes[i][0].departureName,
          arrivalName: filterDataSearching[0].classes[i][0].arrivalName,
          departureDate: filterDataSearching[0].classes[i][0].departureDate,
          arrivalDate: filterDataSearching[0].classes[i][0].arrivalDate,
          departureTime: filterDataSearching[0].classes[i][0].departureTime,
          arrivalTime: filterDataSearching[0].classes[i][0].arrivalTime,
          returnDate: "",
          adult: adult,
          child: child,
          infant: infant,
          seats: [filterDataSearching[0].classes[i][0].seat],
          priceTotal: filterDataSearching[0].classes[i][0].price,
        });
      }

      setisLoadingPilihTiket(`false-${i}`);
      const uuid = uuidv4();
      localStorage.setItem(`data:flight/${uuid}`, JSON.stringify(
        {
          _flight: next,
          _flight_forBooking: forBooking,
          uuid: uuids,
        }
      ));

      navigate(`/flight/booking/${uuid}`);
      
      //don't erase!
      // const uuid = await axios.post(
      //   `${process.env.REACT_APP_HOST_API}/travel/pesawat/search/flight`,
      //   {
      //     _flight: next,
      //     _flight_forBooking: forBooking,
      //     uuid: uuids,
      //   }
      // );
      // if (uuid.data.rc == "00") {
      //   navigate(`/flight/booking/${uuid.data.uuid}`);
      // } else {
      //   failedNotification(uuid.data.rd);
      // }

    } else {
      const next = Array();
      const lenghtArr = filterDataSearching[0].classes.length;

      for (var i = 0; i < lenghtArr; i++) {
        next.push({
          airline: filterDataSearching[0].detailTitle[i].flightCode,
          airlineName: filterDataSearching[0].detailTitle[i].flightName,
          airlineIcon: filterDataSearching[0].detailTitle[i].flightIcon,
          departure: filterDataSearching[0].classes[i][0].departure,
          arrival: filterDataSearching[0].classes[i][0].arrival,
          departureName: filterDataSearching[0].classes[i][0].departureName,
          arrivalName: filterDataSearching[0].classes[i][0].arrivalName,
          departureDate: filterDataSearching[0].classes[i][0].departureDate,
          arrivalDate: filterDataSearching[0].classes[i][0].arrivalDate,
          departureTime: filterDataSearching[0].classes[i][0].departureTime,
          arrivalTime: filterDataSearching[0].classes[i][0].arrivalTime,
          returnDate: "",
          adult: adult,
          child: child,
          infant: infant,
          seats: [filterDataSearching[0].classes[i][0].seat],
          priceTotal: filterDataSearching[0].classes[i][0].price,
        });
      }

      setisLoadingPilihTiket(`false-${i}`);
      const uuid = uuidv4();
      localStorage.setItem(`data:flight/${uuid}`, JSON.stringify(
        {
          _flight: next,
          _flight_forBooking: forBooking,
          uuid: uuids,
        }
      ));

      navigate(`/flight/booking/${uuid}`);

      //don't erase!
      // const uuid = await axios.post(
      //   `${process.env.REACT_APP_HOST_API}/travel/pesawat/search/flight`,
      //   {
      //     _flight: next,
      //     _flight_forBooking: forBooking,
      //     uuid: uuids,
      //   }
      // );

      // if (uuid.data.rc == "00") {
      //   navigate(`/flight/booking/${uuid.data.uuid}`);
      // } else {
      //   failedNotification(uuid.data.rd);
      // }
    }
  }

  const hargaPopoOver = (
    <Popover title="Filter Harga">
      <div className="block text-xs px-2">
        <div>
          Range antara Rp.{toRupiah(valHargaRange[0])} - Rp.
          {toRupiah(valHargaRange[1])}
        </div>
        <Slider
          size="small"
          track="inverted"
          aria-labelledby="track-inverted-range-slider"
          onChange={hargraRangeChange}
          value={valHargaRange}
          min={0}
          max={100000000}
        />
      </div>
    </Popover>
  );

  const waktuPopoOver = (
    <Popover title="Filter Waktu">
      <div className="">
        <Box sx={{ width: 120 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={waktuFilter[0]}
                  value="06:00-11:59"
                  onChange={handleWaktuFilterChange}
                  size="small"
                />
              }
              label={<span style={{ fontSize: "12px" }}>06.00 - 12.00</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={waktuFilter[1]}
                  value="12:00-17:59"
                  onChange={handleWaktuFilterChange}
                  size="small"
                />
              }
              label={<span style={{ fontSize: "12px" }}>12.00 - 18.00</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={waktuFilter[2]}
                  value="18:00-23:59"
                  onChange={handleWaktuFilterChange}
                  size="small"
                />
              }
              label={<span style={{ fontSize: "12px" }}>18.00 - 00.00</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={waktuFilter[3]}
                  value="00:00-05:59"
                  onChange={handleWaktuFilterChange}
                  size="small"
                />
              }
              label={<span style={{ fontSize: "12px" }}>00.00 - 06.00</span>}
            />
          </FormGroup>
        </Box>
      </div>
    </Popover>
  );

  const transitPopoOver = (
    <Popover title="Filter Transit">
      <div className="">
        <Box sx={{ width: 120 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={langsung}
                  onChange={() => setLangsung((prev) => !prev)}
                  size="small"
                />
              }
              label={<span style={{ fontSize: "12px" }}>Langsung</span>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={transit}
                  onChange={() => setTransit((prev) => !prev)}
                  size="small"
                />
              }
              label={<span style={{ fontSize: "12px" }}>Transit</span>}
            />
          </FormGroup>
        </Box>
      </div>
    </Popover>
  );
  
  return (
    <>
      {contextHolder}
      {err === true ? (
        <>
          <Page500 />
        </>
      ) : Pageerr === true ? (
        <>
          <Page400 />
        </>
      ) : (
        <>
          <div className="judul-search font-semibold xl:font-bold text-gray-800">
            PILIH JADWAL
          </div>
          <div className="mt-8">
            <div className="block md:flex justify-between">
              <div className="flex items-center justify-center space-x-3 xl:space-x-4 text-center md:text-left">
                <small className="hidden md:block text-xs font-medium xl:font-bold text-gray-800">
                  {departureName} ({departure})
                </small>
                <div className="hidden md:block bg-blue-500 p-1 rounded-full">
                  <IoArrowForwardOutline
                    className="font-bold text-xs text-white"
                    size={16}
                  />
                </div>
                <small className="hidden md:block text-xs font-medium xl:font-bold text-gray-800">
                  {arrivalName} ({arrival})
                </small>
                <div className="hidden md:block font-normal text-gray-800">
                  |
                </div>
                <small className="hidden md:block text-xs font-bold text-gray-800">
                  {tanggal_keberangkatan}
                </small>
                <div className="hidden md:block font-normal text-gray-800">
                  |
                </div>
                <small className="hidden md:block text-xs font-bold text-gray-800">
                  {parseInt(adult) + parseInt(child) + parseInt(infant)}{" "}
                  Penumpang
                </small>
              </div>
              <div className="hidden md:flex mt-4 md:mt-0 space-x-4 md:mr-0 justify-center md:justify-end">
                <Link to="/" className="flex space-x-2 items-center">
                  <IoArrowBackOutline className="text-blue-500" size={16} />
                  <div className="text-blue-500 text-sm font-bold">Kembali</div>
                </Link>
                <button
                  onClick={() => setUbahPencarian((prev) => !prev)}
                  className="block border p-2 px-4 md:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs font-bold"
                >
                  Ubah Pencarian
                </button>
              </div>
            </div>
            <div></div>
          </div>
          <div className="flex justify-between mt-0 md:mt-6">
            <div className="relative flex items-center space-x-2 text-gray-800 text-xs font-medium xl:font-bold">
              <div className="hidden md:block">FILTER : </div>
              <Whisper
                placement="top"
                trigger="active"
                controlId="control-id-active"
                speaker={hargaPopoOver}
                placement="bottomStart"
              >
                <button className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300 font-medium xl:font-bold">
                  HARGA
                </button>
              </Whisper>
              <Whisper
                placement="top"
                trigger="active"
                controlId="control-id-active"
                speaker={waktuPopoOver}
                placement="bottomStart"
              >
                <button className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300 font-medium xl:font-bold">
                  WAKTU
                </button>
              </Whisper>
              <Whisper
                placement="top"
                trigger="active"
                controlId="control-id-active"
                speaker={transitPopoOver}
                placement="bottomStart"
              >
                <button className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300 font-medium xl:font-bold">
                  TRANSIT
                </button>
              </Whisper>
            </div>
            <div className="flex space-x-2.5 items-center">
              <div className="flex md:hidden space-x-4 md:mr-0 justify-center md:justify-end">
                  <div 
                    onClick={() => setUbahPencarian((prev) => !prev)}                
                    className="cursor-pointer">
                    <IoSearchCircle size={28} className="text-blue-500" />
                  </div>
                  {/* <button
                    className="block border p-2 px-4 md:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs font-bold"
                  >
                    Ubah Pencarian
                  </button> */}
              </div>
              <div className="cursor-pointer">
                <Whisper
                    placement="top"
                    trigger="active"
                    controlId="control-id-active"
                    speaker={SortingPopoOverPlane}
                    placement="bottomEnd"
                  >
                <div>
                  <MdSort className="text-blue-500 md:text-gray-800" size={28}/>
                </div>
              </Whisper>
              </div>
            </div>
          </div>
          {ubahPencarian ? (
            <div className="mt-8">
              <SearchPlane />
            </div>
          ) : null}
          {percent === 0 || percent === 100 ? null : (
            <div className="mt-4">
              <Progress.Line
                percent={percent}
                status="active"
                showInfo={false}
              />
              <div className="mt-4 mb-8 md:mb-0">
                <Spin tip="Loading">
                  <div className="content" />
                </Spin>
              </div>
            </div>
            )}
            
             {/* <div className="mt-4 flex md:hidden space-x-4 md:mr-0 justify-center md:justify-end">
                <div 
                  onClick={() => setUbahPencarian((prev) => !prev)}                
                  className="cursor-pointer">
                  <MdManageSearch size={32} />
                </div>
                <button
                  className="block border p-2 px-4 md:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs font-bold"
                >
                  Ubah Pencarian
                </button>
              </div> */}
          <div>
            {isLoading ? (
              skeleton.map(() => (
                <div className="row mt-2 md:mt-8 w-full p-2 pr-0">
                  <Box sx={{ width: "100%" }}>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </Box>
                </div>
              ))
            ) : notFound !== true && dataSearch.length != 0 ? (
              <div className="row mb-24 w-full p-2 pr-0">
                {filteredData.map(
                  (
                    e,
                    index //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                  ) => (
                    <>
                      {e.classes[0][0].price !== 0 ? (
                        <div
                          class={`mt-2 md:mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                            e.classes[0][0].availability > 0 &&
                            e.classes[0][0].availability >=
                              parseInt(child) +
                                parseInt(adult) +
                                parseInt(infant)
                              ? "bg-white "
                              : "bg-gray-100 "
                          }  border border-gray-200 rounded-md shadow-sm hover:border hover:border-gray-100 transition-transform transform hover:scale-105`}
                        >
                          {/* desktop cari */}
                          <div className="hidden xl:block w-full text-gray-800 ">
                            <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-10 gap-4">
                              <div className="col-span-1 md:col-span-2">
                                <h1 className="text-sm font-medium xl:font-bold">
                                  {e.airlineName}{" "}
                                </h1>
                                <div className="text-sm">
                                  {e.classes[0][0].flightCode}
                                </div>
                                <div>
                                  <img
                                    src={e.airlineIcon}
                                    width={60}
                                    alt="image.png"
                                  />
                                </div>
                              </div>
                              <div className="flex">
                                <div className="">
                                  <MdOutlineLuggage size={32} />
                                  <div className="text-xs text-gray-800">
                                    Bagasi
                                  </div>
                                  <div className="text-xs text-gray-800">
                                    20 Kg
                                  </div>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="">
                                  <h1 className="mt-4 xl:mt-0 text-sm font-medium">
                                    {e.detailTitle[0].depart}{" "}
                                    <span className="font-semibold text-xs text-blue-500">
                                      ({e.classes[0][0].departureTimeZoneText})
                                    </span>
                                  </h1>
                                  <small>{departure}</small>
                                </div>
                              </div>
                              <HiOutlineArrowNarrowRight size={24} />
                              <div>
                                <h1 className="text-sm font-medium">
                                  {
                                    e.detailTitle[e.detailTitle.length - 1]
                                      .arrival
                                  }{" "}
                                  <span className="font-semibold text-xs text-blue-500">
                                    (
                                    {
                                      e.classes[e.classes.length - 1][0]
                                        .arrivalTimeZoneText
                                    }
                                    )
                                  </span>
                                </h1>
                                <small>{arrival}</small>
                              </div>
                              <div>
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium">
                                  {e.duration}
                                </h1>
                                <small>
                                  {e.isTransit === true
                                    ? `${e.classes.length - 1}x Transit`
                                    : "Langsung"}
                                </small>
                              </div>
                              <div className="">
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium xl:font-bold text-blue-500">
                                  Rp.{toRupiah(e.classes[0][0].price)}
                                </h1>
                                <small className="text-red-500">
                                  {e.classes[0][0].availability} seat(s) left
                                  {e.classes[0][0].availability > 0 &&
                                  e.classes[0][0].availability >=
                                    parseInt(child) +
                                      parseInt(adult) +
                                      parseInt(infant) ? (
                                    ""
                                  ) : (
                                    <span> (Tiket Habis)</span>
                                  )}
                                </small>
                              </div>
                              <div className="flex justify-center col-span-1 md:col-span-2">
                                {e.classes[0][0].availability > 0 &&
                                e.classes[0][0].availability >=
                                  parseInt(child) +
                                    parseInt(adult) +
                                    parseInt(infant) ? (
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        bookingHandlerDetail(index)
                                      }
                                      class={`${
                                        isLoadingPilihTiket == "true-" + index
                                          ? "py-6 xl:px-16"
                                          : "py-3.5 px-10 md:px-10 xl:px-12 2xl:px-14"
                                      } relative xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-2 rounded-md focus:outline-none focus:ring-blue-500/50 font-medium text-sm  text-center inline-flex items-center  mr-2 mb-2`}
                                    >
                                      {isLoadingPilihTiket ==
                                      "true-" + index ? (
                                        <>
                                          <img
                                            className="absolute right-8"
                                            src="/load.gif"
                                            width={60}
                                            alt="laoding"
                                          />
                                        </>
                                      ) : (
                                        <div className="text-white font-bold">
                                          PILIH
                                        </div>
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-8 justify-center items-center">
                              <div
                                onClick={() =>
                                  detailTiket == `open-${index}`
                                    ? setDetailTiket(`close-${index}`)
                                    : setDetailTiket(`open-${index}`)
                                }
                                className="text-sm text-blue-500 cursor-pointer font-medium xl:font-bold"
                              >
                                Detail Penerbangan
                              </div>
                              <div
                                onClick={() =>
                                  detailHarga == `harga-open-${index}`
                                    ? setDetailHarga(`harga-close-${index}`)
                                    : setDetailHarga(`harga-open-${index}`)
                                }
                                className="text-sm text-blue-500 cursor-pointer font-medium xl:font-bold"
                              >
                                Detail Harga
                              </div>
                            </div>
                          </div>

                          {/* desktop detail tiket */}
                          {detailTiket == `open-${index}` ? (
                            <>
                              {e.isTransit === true ? (
                                e.classes.map((x, i) => (
                                  <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                    <div className="mt-8">
                                      <h1 className="text-sm font-medium xl:font-bold">
                                        {e.detailTitle[i].flightName}{" "}
                                      </h1>
                                      <div className="text-sm">
                                        {e.detailTitle[i].flightCode}
                                      </div>
                                      <div>
                                        <img
                                          src={e.detailTitle[i].flightIcon}
                                          width={60}
                                          alt="image.png"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-col space-y-28 text-gray-800">
                                      <div className="">
                                        <div className="text-sm font-medium xl:font-bold">
                                          {x[0].departureTime}
                                        </div>
                                        <div className="text-xs">
                                          {x[0].departureDate}
                                        </div>
                                      </div>
                                      <div className="">
                                        <div className="text-sm font-medium xl:font-bold">
                                          {x[0].arrivalTime}
                                        </div>
                                        <div className="text-xs">
                                          {x[0].arrivalDate}
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <Timeline
                                        sx={{
                                          [`& .${timelineItemClasses.root}:before`]:
                                            {
                                              flex: 0,
                                              padding: 0,
                                              borderColor:"black"
                                            },
                                        }}
                                      >
                                        <TimelineItem>
                                          <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                          </TimelineSeparator>
                                          <TimelineContent
                                            sx={{ py: "16px", px: 2, color: "black", }}
                                          >
                                            <Typography
                                              sx={{ fontSize: 12 }}
                                              component="span"
                                            >
                                              {x[0].departure}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: 12,
                                                color: "black",
                                              }}
                                            >
                                              {x[0].departureName}
                                            </Typography>
                                          </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                          <TimelineDot
                                            sx={{ backgroundColor: "orange" }}
                                          >
                                            <IoMdTimer />
                                          </TimelineDot>
                                          <TimelineContent
                                            sx={{ py: "12px", px: 2 }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: 12,
                                                color: "black",
                                              }}
                                              component="span"
                                            >
                                              {x[0].duration}
                                            </Typography>
                                          </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                          <TimelineSeparator>
                                            <TimelineConnector />
                                            <TimelineDot />
                                          </TimelineSeparator>
                                          <TimelineContent sx={{ px: 2 }}>
                                            <Typography
                                              sx={{ fontSize: 12 }}
                                              component="span"
                                            >
                                              {x[0].arrival}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: 12,
                                                color: "black",
                                              }}
                                            >
                                              {x[0].arrivalName}
                                            </Typography>
                                          </TimelineContent>
                                        </TimelineItem>
                                      </Timeline>
                                    </div>
                                    <div className="mt-4 text-gray-800">
                                      <div className="items-center">
                                        <div>
                                          <MdOutlineLuggage size={46} />
                                        </div>
                                        <div className="text-xs">
                                          <div>
                                            Berat Bagasi maks.{" "}
                                            <span className="font-medium xl:font-bold">
                                              20 kg
                                            </span>
                                          </div>
                                          <div className="mt-1">
                                            Jika {">"} 20 kg akan dikenakan
                                            biaya.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                  <div className="mt-8">
                                    <h1 className="text-sm font-medium xl:font-bold">
                                      {e.airlineName}{" "}
                                    </h1>
                                    <div className="text-sm">
                                      {e.classes[0][0].flightCode}
                                    </div>
                                    <div>
                                      <img
                                        src={e.airlineIcon}
                                        width={60}
                                        alt="image.png"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col space-y-32 text-gray-800">
                                    <div className="">
                                      <div className="text-sm font-medium xl:font-bold">
                                        {e.classes[0][0].departureTime}
                                      </div>
                                      <div className="text-xs">
                                        {e.classes[0][0].departureDate}
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="text-sm font-medium xl:font-bold">
                                        {e.classes[0][0].arrivalTime}
                                      </div>
                                      <div className="text-xs">
                                        {e.classes[0][0].arrivalDate}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <Timeline
                                      sx={{
                                        [`& .${timelineItemClasses.root}:before`]:
                                          {
                                            flex: 0,
                                            padding: 0,
                                            color:"black",
                                            borderColor:"black"
                                          },
                                      }}
                                    >
                                      <TimelineItem>
                                        <TimelineSeparator>
                                          <TimelineDot />
                                          <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent
                                          sx={{ py: "16px", px: 2, color: "black", }}
                                        >
                                          <Typography
                                            sx={{ fontSize: 12 }}
                                            component="span"
                                          >
                                            {e.classes[0][0].departure}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: 12,
                                              color: "black",
                                            }}
                                          >
                                            {e.classes[0][0].departureName}
                                          </Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                      <TimelineItem>
                                        <TimelineDot
                                          sx={{ backgroundColor: "orange" }}
                                        >
                                          <IoMdTimer />
                                        </TimelineDot>
                                        <TimelineContent
                                          sx={{ py: "12px", px: 2, color: "black", }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 12,
                                              color: "black",
                                            }}
                                            component="span"
                                          >
                                            {e.classes[0][0].duration}
                                          </Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                      <TimelineItem>
                                        <TimelineSeparator>
                                          <TimelineConnector />
                                          <TimelineDot />
                                        </TimelineSeparator>
                                        <TimelineContent sx={{ px: 2, color: "black", }}>
                                          <Typography
                                            sx={{ fontSize: 12, color: "black", }}
                                            component="span"
                                          >
                                            {e.classes[0][0].arrival}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              fontSize: 12,
                                              color: "black",
                                            }}
                                          >
                                            {e.classes[0][0].arrivalName}
                                          </Typography>
                                        </TimelineContent>
                                      </TimelineItem>
                                    </Timeline>
                                  </div>
                                  <div className="mt-4 text-gray-800">
                                    <div className="items-center">
                                      <div>
                                        <MdOutlineLuggage size={46} />
                                      </div>
                                      <div className="text-xs">
                                        <div>
                                          Berat Bagasi maks.{" "}
                                          <span className="font-medium xl:font-bold">
                                            20 kg
                                          </span>
                                        </div>
                                        <div className="mt-1">
                                          Jika {">"} 20 kg akan dikenakan biaya.
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : null}
                          {/* end detail desltop tiket */}

                          {/* desktop detail harga */}
                          {detailHarga == `harga-open-${index}` ? (
                            <>
                              {e.isTransit === true ? (
                                <>
                                  {e.classes.map((z, w) => (
                                    <>
                                      <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                        <div className="mt-8">
                                          <h1 className="text-sm font-medium xl:font-bold">
                                            {e.detailTitle[w].flightName}{" "}
                                          </h1>
                                          <div className="text-sm">
                                            {e.detailTitle[w].flightCode}
                                          </div>
                                          <div>
                                            <img
                                              src={e.detailTitle[w].flightIcon}
                                              width={60}
                                              alt="image.png"
                                            />
                                          </div>
                                        </div>
                                        <div className="mt-8">
                                          <div className="text-xs text-gray-800">
                                            <div className="mt-1 flex space-x-16">
                                              <div>
                                                {" "}
                                                Harga Tiket Adult ({
                                                  adult
                                                }x){" "}
                                              </div>
                                              <div className="pl-1">
                                                {" "}
                                                Rp.
                                                {toRupiah(z[0].price * adult)}
                                              </div>
                                            </div>
                                            {child > 0 ? (
                                              <div className="mt-1 flex space-x-16">
                                                <div>
                                                  {" "}
                                                  Harga Tiket Child ({
                                                    child
                                                  }x){" "}
                                                </div>
                                                <div className="pl-1">
                                                  {" "}
                                                  Tergantung jenis maskapai yang
                                                  dipilih.
                                                </div>
                                              </div>
                                            ) : null}
                                            {infant > 0 ? (
                                              <div className="mt-1 flex space-x-16">
                                                <div>
                                                  Harga Tiket Infant ({infant}x){" "}
                                                </div>
                                                <div>
                                                  Tergantung jenis maskapai yang
                                                  dipilih.
                                                </div>
                                              </div>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ))}
                                </>
                              ) : (
                                <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                  <div className="mt-8">
                                    <h1 className="text-sm font-medium xl:font-bold">
                                      {e.airlineName}{" "}
                                    </h1>
                                    <div className="text-sm">
                                      {e.classes[0][0].flightCode}
                                    </div>
                                    <div>
                                      <img
                                        src={e.airlineIcon}
                                        width={60}
                                        alt="image.png"
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-8">
                                    <div className="text-xs text-gray-800">
                                      <div className="mt-1 flex space-x-16">
                                        <div>
                                          {" "}
                                          Harga Tiket Adult ({adult}x){" "}
                                        </div>
                                        <div className="pl-1">
                                          {" "}
                                          Rp.
                                          {toRupiah(
                                            e.classes[0][0].price * adult
                                          )}
                                        </div>
                                      </div>
                                      {child > 0 ? (
                                        <div className="mt-1 flex space-x-16">
                                          <div>
                                            {" "}
                                            Harga Tiket Child ({child}x){" "}
                                          </div>
                                          <div className="pl-1">
                                            {" "}
                                            Tergantung jenis maskapai yang
                                            dipilih.
                                          </div>
                                        </div>
                                      ) : null}
                                      {infant > 0 ? (
                                        <div className="mt-1 flex space-x-16">
                                          <div>
                                            Harga Tiket Infant ({infant}x){" "}
                                          </div>
                                          <div>
                                            Tergantung jenis maskapai yang
                                            dipilih.
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : null}

                          {/* end desktop detail harga */}

                          {/* mobile cari */}
                          <div className="">
                            <div
                              className="cursor-pointer block xl:hidden w-full text-gray-800"
                            >
                              <div 
                                  type="button"
                                  onClick={(f) => {
                                    e.classes[0][0].availability > 0 &&
                                      e.classes[0][0].availability >=
                                        parseInt(child) +
                                          parseInt(adult) +
                                          parseInt(infant) &&
                                          bookingHandlerDetail(index)
                                  }}
                                  className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7"
                                > 
                                <div className="flex justify-between">
                                  <div className="col-span-1 xl:col-span-2">
                                    <h1 className="text-xs font-medium xl:font-bold">
                                      {e.airlineName}
                                    </h1>
                                    <img
                                      src={e.airlineIcon}
                                      width={60}
                                      alt="image.png"
                                    />
                                  </div>
                                  <div className="text-right">
                                    <h1 className="text-xs font-medium xl:font-bold text-blue-500">
                                      Rp.{toRupiah(e.classes[0][0].price)}
                                    </h1>
                                    <small className="text-red-500">
                                      {e.classes[0][0].availability} seat(s)
                                    </small>
                                    <div>
                                      <small>
                                        {e.isTransit === true
                                          ? `${e.classes.length - 1}x Transit`
                                          : "Langsung"}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <div className="flex space-x-2 items-center">
                                    <div>
                                      <h1 className="mt-4 xl:mt-0 text-sm font-medium">
                                        <div className="">
                                          <span>{e.detailTitle[0].depart}</span>
                                          <div className="font-semibold text-xs text-blue-500">
                                            (
                                            {
                                              e.classes[0][0]
                                                .departureTimeZoneText
                                            }
                                            )
                                          </div>
                                        </div>
                                      </h1>
                                      <small>{e.detailTitle[0].origin}</small>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                      <div className="w-full mt-12 px-4 border-b-2"></div>
                                      <div className="text-xs">
                                        <div className="mt-10 xl:mt-0 text-gray-800">
                                          {e.duration}
                                        </div>
                                      </div>
                                      <div className="w-full mt-12 px-4 border-b-2"></div>
                                    </div>
                                    <div>
                                      <h1 className="mt-4 xl:mt-0 text-sm font-medium">
                                        <div className="">
                                          <div>
                                            {
                                              e.detailTitle[
                                                e.detailTitle.length - 1
                                              ].arrival
                                            }{" "}
                                          </div>
                                          <div className="font-semibold text-xs text-blue-500">
                                            (
                                            {
                                              e.classes[e.classes.length - 1][0]
                                                .arrivalTimeZoneText
                                            }
                                            )
                                          </div>
                                        </div>
                                      </h1>
                                      <small>
                                        {
                                          e.detailTitle[
                                            e.detailTitle.length - 1
                                          ].destination
                                        }
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-8 mb-4">
                                  <div
                                    onClick={(event)  => {
                                      event.stopPropagation();

                                      detailTiket == `open-${index}`
                                        ? setDetailTiket(`close-${index}`)
                                        : setDetailTiket(`open-${index}`)
                                    }
                                  }
                                    className="text-sm text-blue-500 cursor-pointer font-medium xl:font-bold"
                                  >
                                    Detail Penerbangan
                                  </div>
                                  <div
                                    onClick={(event) => {
                                      event.stopPropagation();

                                      detailHarga == `harga-open-${index}`
                                        ? setDetailHarga(`harga-close-${index}`)
                                        : setDetailHarga(`harga-open-${index}`)
                                    }
                                  }
                                    className="text-sm text-blue-500 cursor-pointer font-medium xl:font-bold"
                                  >
                                    Detail Harga
                                  </div>
                                </div>
                              {detailTiket == `open-${index}` ? (
                                <>
                                  {e.isTransit === true ? (
                                    e.classes.map((x, i) => (
                                      <div className="p-4 flex justify-between items-center mt-6 border-t xl:hidden">
                                        <div className="">
                                          <div className="">
                                            <div className="text-sm font-medium xl:font-bold">
                                              {x[0].departureTime}
                                            </div>
                                            <div className="text-xs">
                                              {x[0].departureDate}
                                            </div>
                                          </div>
                                          <div className="mt-4">
                                            <Timeline
                                              sx={{
                                                [`& .${timelineItemClasses.root}:before`]:
                                                  {
                                                    flex: 0,
                                                    padding: 0,
                                                    borderColor:"black"
                                                  },
                                              }}
                                            >
                                              <TimelineItem>
                                                <TimelineSeparator>
                                                  <TimelineDot />
                                                  <TimelineConnector />
                                                </TimelineSeparator>
                                                <TimelineContent
                                                  sx={{ py: "16px", px: 2, color: "black", }}
                                                >
                                                  <Typography
                                                    sx={{ fontSize: 12, color: "black", }}
                                                    component="span"
                                                  >
                                                    {x[0].departure}
                                                  </Typography>
                                                  <Typography
                                                    sx={{
                                                      fontSize: 12,
                                                      color: "black",
                                                    }}
                                                  >
                                                    {x[0].departureName}
                                                  </Typography>
                                                </TimelineContent>
                                              </TimelineItem>
                                              <TimelineItem>
                                                <TimelineDot
                                                  sx={{
                                                    backgroundColor: "orange",
                                                  }}
                                                >
                                                  <IoMdTimer />
                                                </TimelineDot>
                                                <TimelineContent
                                                  sx={{ py: "12px", px: 2, color: "black", }}
                                                >
                                                  <Typography
                                                    sx={{
                                                      fontSize: 12,
                                                      color: "black",
                                                    }}
                                                    component="span"
                                                  >
                                                    {x[0].duration}
                                                  </Typography>
                                                </TimelineContent>
                                              </TimelineItem>
                                              <TimelineItem>
                                                <TimelineSeparator>
                                                  <TimelineConnector />
                                                  <TimelineDot />
                                                </TimelineSeparator>
                                                <TimelineContent sx={{ px: 2, color: "black", }}>
                                                  <Typography
                                                    sx={{ fontSize: 12, color: "black", }}
                                                    component="span"
                                                  >
                                                    {x[0].arrival}
                                                  </Typography>
                                                  <Typography
                                                    sx={{
                                                      fontSize: 12,
                                                      color: "black",
                                                    }}
                                                  >
                                                    {x[0].arrivalName}
                                                  </Typography>
                                                </TimelineContent>
                                              </TimelineItem>
                                            </Timeline>
                                          </div>
                                          <div className="">
                                            <div className="text-sm font-medium xl:font-bold">
                                              {x[0].arrivalTime}
                                            </div>
                                            <div className="text-xs">
                                              {x[0].arrivalDate}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-4 text-gray-800">
                                          <div className="items-center">
                                            <div>
                                              <MdOutlineLuggage size={46} />
                                            </div>
                                            <div className="text-xs">
                                              <div>
                                                Berat Bagasi maks.{" "}
                                                <span className="font-medium xl:font-bold">
                                                  20 kg
                                                </span>
                                              </div>
                                              <div className="mt-1">
                                                Jika {">"} 20 kg akan dikenakan
                                                biaya.
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex justify-between items-center p-4 mt-6 border-t xl:hidden">
                                      <div>
                                        <div className="">
                                          <div className="text-sm font-medium xl:font-bold">
                                            {e.classes[0][0].departureTime}
                                          </div>
                                          <div className="text-xs">
                                            {e.classes[0][0].departureDate}
                                          </div>
                                        </div>
                                        <div className="mt-4">
                                          <Timeline
                                            sx={{
                                              [`& .${timelineItemClasses.root}:before`]:
                                                {
                                                  flex: 0,
                                                  padding: 0,
                                                  borderColor:"black"
                                                },
                                            }}
                                          >
                                            <TimelineItem>
                                              <TimelineSeparator>
                                                <TimelineDot />
                                                <TimelineConnector />
                                              </TimelineSeparator>
                                              <TimelineContent
                                                sx={{ py: "16px", px: 2, color: "black", }}
                                              >
                                                <Typography
                                                  sx={{ fontSize: 12, color: "black", }}
                                                  component="span"
                                                >
                                                  {e.classes[0][0].departure}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: "black",
                                                  }}
                                                >
                                                  {
                                                    e.classes[0][0]
                                                      .departureName
                                                  }
                                                </Typography>
                                              </TimelineContent>
                                            </TimelineItem>
                                            <TimelineItem>
                                              <TimelineDot
                                                sx={{
                                                  backgroundColor: "orange",
                                                }}
                                              >
                                                <IoMdTimer />
                                              </TimelineDot>
                                              <TimelineContent
                                                sx={{ py: "12px", px: 2, color: "black", }}
                                              >
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: "black",
                                                  }}
                                                  component="span"
                                                >
                                                  {e.classes[0][0].duration}
                                                </Typography>
                                              </TimelineContent>
                                            </TimelineItem>
                                            <TimelineItem>
                                              <TimelineSeparator>
                                                <TimelineConnector />
                                                <TimelineDot />
                                              </TimelineSeparator>
                                              <TimelineContent sx={{ px: 2, color: "black", }}>
                                                <Typography
                                                  sx={{ fontSize: 12, color: "black", }}
                                                  component="span"
                                                >
                                                  {e.classes[0][0].arrival}
                                                </Typography>
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: "black",
                                                  }}
                                                >
                                                  {e.classes[0][0].arrivalName}
                                                </Typography>
                                              </TimelineContent>
                                            </TimelineItem>
                                          </Timeline>
                                          <div className="block mt-4">
                                            <div className="text-sm font-medium xl:font-bold">
                                              {e.classes[0][0].arrivalTime}
                                            </div>
                                            <div className="text-xs">
                                              {e.classes[0][0].arrivalDate}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-4 text-gray-800">
                                        <div className="items-center">
                                          <div>
                                            <MdOutlineLuggage size={46} />
                                          </div>
                                          <div className="text-xs">
                                            <div>
                                              Berat Bagasi maks.{" "}
                                              <span className="font-medium xl:font-bold">
                                                20 kg
                                              </span>
                                            </div>
                                            <div className="mt-1">
                                              Jika {">"} 20 kg akan dikenakan
                                              biaya.
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : null}

                              {/* mobile detail harga */}
                              {detailHarga == `harga-open-${index}` ? (
                                <>
                                  {e.isTransit === true ? (
                                    <>
                                      {e.classes.map((z, w) => (
                                        <>
                                          <div className="p-4 flex justify-between items-start mt-6 border-t xl:hidden">
                                            <div className="mt-8">
                                              <h1 className="text-sm font-medium xl:font-bold">
                                                {e.detailTitle[w].flightName}{" "}
                                              </h1>
                                              <div className="text-sm">
                                                {e.detailTitle[w].flightCode}
                                              </div>
                                              <div>
                                                <img
                                                  src={
                                                    e.detailTitle[w].flightIcon
                                                  }
                                                  width={60}
                                                  alt="image.png"
                                                />
                                              </div>
                                            </div>
                                            <div className="mt-8">
                                              <div className="text-xs text-gray-800">
                                                <div className="">
                                                  <div>
                                                    {" "}
                                                    Harga Tiket Adult ({
                                                      adult
                                                    }x){" "}
                                                  </div>
                                                  <div>
                                                    {" "}
                                                    Rp.
                                                    {toRupiah(
                                                      z[0].price * adult
                                                    )}
                                                  </div>
                                                </div>
                                                {child > 0 ? (
                                                  <div className="mt-4">
                                                    <div>
                                                      {" "}
                                                      Harga Tiket Child ({child}
                                                      x){" "}
                                                    </div>
                                                    <div>
                                                      {" "}
                                                      Tergantung jenis maskapai
                                                      yang dipilih.
                                                    </div>
                                                  </div>
                                                ) : null}
                                                {infant > 0 ? (
                                                  <div className="mt-4">
                                                    <div>
                                                      Harga Tiket Infant (
                                                      {infant}x){" "}
                                                    </div>
                                                    <div>
                                                      Tergantung jenis maskapai
                                                      yang dipilih.
                                                    </div>
                                                  </div>
                                                ) : null}
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ))}
                                    </>
                                  ) : (
                                    <div className="p-4 flex justify-between items-start mt-6 border-t xl:hidden">
                                      <div className="mt-4">
                                        <h1 className="text-sm font-medium xl:font-bold">
                                          {e.airlineName}{" "}
                                        </h1>
                                        <div className="text-sm">
                                          {e.classes[0][0].flightCode}
                                        </div>
                                        <div>
                                          <img
                                            src={e.airlineIcon}
                                            width={60}
                                            alt="image.png"
                                          />
                                        </div>
                                      </div>
                                      <div className="mt-4">
                                        <div className="text-xs text-gray-800">
                                          <div className="">
                                            <div>
                                              {" "}
                                              Harga Tiket Adult ({adult}x){" "}
                                            </div>
                                            <div>
                                              {" "}
                                              Rp.
                                              {toRupiah(
                                                e.classes[0][0].price * adult
                                              )}
                                            </div>
                                          </div>
                                          {child > 0 ? (
                                            <div className="mt-4">
                                              <div>
                                                {" "}
                                                Harga Tiket Child ({
                                                  child
                                                }x){" "}
                                              </div>
                                              <div>
                                                {" "}
                                                Tergantung jenis maskapai yang
                                                dipilih.
                                              </div>
                                            </div>
                                          ) : null}
                                          {infant > 0 ? (
                                            <div className="mt-4">
                                              <div>
                                                Harga Tiket Infant ({infant}x){" "}
                                              </div>
                                              <div>
                                                Tergantung jenis maskapai yang
                                                dipilih.
                                              </div>
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : null}

                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  )
                )}
              </div>
            ) : (
              <div className="row mt-12 mb-24 w-full p-2">
                <div className="flex justify-center items-center">
                  <img src={"/nodata.jpg"} className="w-[200px] md:w-[300px]" alt="No data" />
                </div>
                <div className="flex justify-center w-full text-gray-700">
                  <div className="text-gray-800 text-center">
                    <div>
                      <div className="text-sm md:text-md font-medium">
                        Maaf, sepertinya pada rute ini masih belum dibuka kembali.
                      </div>
                      {/* <small>
                        Namun jangan khawatir, masih ada pilihan kendaraan lain
                        yang tetap bisa mengantarkan Anda ke tempat tujuan.
                      </small> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
