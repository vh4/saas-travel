import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import {
  IoArrowForwardOutline,
  IoSearchCircle,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import { IoIosMore, IoMdTimer } from "react-icons/io";
import SearchPlane from "./SearchPlane";
import { Flex, Progress, Space, Spin } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal } from "../../helpers/date";
import { MdArrowForwardIos, MdSort } from "react-icons/md";
import { notification, Radio } from "antd";
import Page500 from "../components/500";
import Page400 from "../components/400";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";
import { Popover, Whisper } from "rsuite";
import { useDispatch } from "react-redux";
import { setDataSearchPesawat } from "../../features/createSlice";
import { IoIosArrowDown } from "react-icons/io";
import SearchDrawerMobile from "./components/SearchDrawerMobile";
import { SlArrowLeft } from "react-icons/sl";
import FilterMobilePlane from "./components/FilterMobilePlane";

export default function Search() {
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
  const dispatch = useDispatch();

  const [openDrawer, setOpenDrawer] = useState(null);
	const toggleDrawer = (index) => () => {
		setOpenDrawer(openDrawer === index ? null : index);
	};

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

  const [valHargaRange, setHargaRange] = useState([0, 30000000]);
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
  const [HargaTerendahTinggiPlane, setHargaTerendahTinggiPlane] =
    useState(false);

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

  let filteredData = dataSearch
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
      return flight.classes.some((harga) => {

        const price = flight.classes.reduce((sum, item) => sum + item[0].price, 0);
        if (price === undefined) {
          return false; // Skip if price is undefined
        }
        return (
          valHargaRange[0] <= price && price <= valHargaRange[1]
        );
      });
    })
    .filter((flight, i) => {
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
      const priceA = a.classes.reduce((sum, item) => sum + (item[0]?.price || 0), 0);
      const priceB = b.classes.reduce((sum, item) => sum + (item[0]?.price || 0), 0);
      
      return HargaTerendahTinggiPlane === 2 ? priceB - priceA : priceA - priceB;
    });

  const SortingPopoOverPlane = (
    <Popover className="text-black" title="Urutkan Dengan">
      <div className="">
        <Box sx={{ width: 150 }}>
          <Radio.Group
            className="mt-2"
            onChange={(e) => setHargaTerendahTinggiPlane(e.target.value)}
            value={HargaTerendahTinggiPlane}
          >
            <Space direction="vertical">
              <Radio value={1} className="mt-2">
                Harga Terendah
              </Radio>
              <Radio value={2} className="mt-2">
                Harga Tertinggi
              </Radio>
            </Space>
          </Radio.Group>
        </Box>
      </div>
    </Popover>
  );

  async function bookingHandlerDetail(i) {
    setisLoadingPilihTiket(`true-${i}`);

    let filterDataSearching = filteredData.filter((_, index) => index === i);
    const lenghtArr = filterDataSearching[0].classes.length;

    const seat = [];
    let priceTotalWithoutFare = 0;

    for (var i = 0; i < lenghtArr; i++) {
      seat.push(filterDataSearching[0].classes[i][0].seat);

      priceTotalWithoutFare += parseInt(
        filterDataSearching[0].classes[i][0].price
      );
    }

    if (filterDataSearching[0].airlineCode === "TPGA") {
      const next = Array();

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
          seats: seat,
          priceTotal: filterDataSearching[0].classes[i][0].price,
        });
      }

      const forBooking = {
        airline: filterDataSearching[0].airlineCode,
        departure: departure,
        arrival: arrival,
        departureDate: filterDataSearching[0].departureDate,
        returnDate: "",
        adult: adult,
        child: child,
        infant: infant,
        seats: seat,
        priceTotal: priceTotalWithoutFare,
        isInternational:
          filterDataSearching[0]?.classes[
            filterDataSearching[0]?.classes.length - 1
          ][0]?.isInternational ?? 0,
      };

      const resp = {
        _flight: next,
        _flight_forBooking: forBooking,
      };

      dispatch(setDataSearchPesawat(resp));

      setisLoadingPilihTiket(`false-${i}`);
      navigate(`/flight/booking`);
    }

    // fare selain TPGA.

    let detailFlight = {
      airline: filterDataSearching[0].airlineCode,
      departure: departure,
      arrival: arrival,
      departureDate: filterDataSearching[0].departureDate,
      returnDate: "",
      adult: adult,
      child: child,
      infant: infant,
      seats: seat,
      token: token,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/flight/fare`,
      detailFlight
    ); //kocak broooWWW

    if (response.data.rc === "00") {
      //update price;
      filterDataSearching[0].classes[0][0]["price"] =
        response.data?.data?.price;
      const priceTotalWithFare = response.data?.data?.price;

      const forBooking = {
        airline: filterDataSearching[0].airlineCode,
        departure: departure,
        arrival: arrival,
        departureDate: filterDataSearching[0].departureDate,
        returnDate: "",
        adult: adult,
        child: child,
        infant: infant,
        seats: seat,
        priceTotal: priceTotalWithFare,
        isInternational:
          filterDataSearching[0]?.classes[
            filterDataSearching[0]?.classes.length - 1
          ][0]?.isInternational ?? 0,
      };

      const next = [];

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
          seats: seat,
          priceTotal: filterDataSearching[0].classes[i][0].price,
        });
      }

      setisLoadingPilihTiket(`false-${i}`);
      const resp = {
        _flight: next,
        _flight_forBooking: forBooking,
      };

      dispatch(setDataSearchPesawat(resp));
      navigate(`/flight/booking`);
    } else {
      setisLoadingPilihTiket(`false-${i}`);
      failedNotification(response.data.rd);
    }
  }

  const hargaPopoOver = (
    <Popover className="text-black" title="Filter Harga">
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
          max={30000000}
        />
      </div>
    </Popover>
  );

  const waktuPopoOver = (
    <Popover className="text-black" title="Filter Waktu Keberangkatan">
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
    <Popover className="text-black" title="Filter Transit">
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
          <div className="hidden xl:block judul-search text-black">
            PILIH JADWAL
          </div>
          <div className="mt-4 xl:mt-8">
            <div className="block xl:flex justify-between">
              <div className="flex items-center justify-center space-x-3 xl:space-x-4 text-center xl:text-left">
                <small className="hidden xl:block text-xs text-black">
                  {departureName} ({departure})
                </small>
                <div className="hidden xl:block bg-blue-500 p-1 rounded-full">
                  <IoArrowForwardOutline
                    className=" text-xs text-white"
                    size={16}
                  />
                </div>
                <small className="hidden xl:block text-xs text-black">
                  {arrivalName} ({arrival})
                </small>
                <div className="hidden xl:block text-black">|</div>
                <small className="hidden xl:block text-xs text-black">
                  {tanggal_keberangkatan}
                </small>
                <div className="hidden xl:block text-black">|</div>
                <small className="hidden xl:block text-xs text-black">
                  {parseInt(adult) + parseInt(child) + parseInt(infant)}{" "}
                  Penumpang
                </small>
              </div>
              <div className="hidden xl:flex mt-4 xl:mt-0 space-x-4 xl:mr-0 justify-center xl:justify-end">
                <Link to="/" className="hidden xl:flex space-x-2 items-center">
                  <SlArrowLeft className="text-black" size={16} />
                  <div className="text-black text-xs">Kembali</div>
                </Link>
                <button
                  onClick={() => setUbahPencarian((prev) => !prev)}
                  className="block border p-2 px-4 xl:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs "
                >
                  Ubah Pencarian
                </button>
              </div>
            </div>
            <div></div>
          </div>

          {/* desktop filter*/}
          <div className="hidden xl:flex justify-between mt-0 xl:mt-6">
            <div className="flex items-center space-x-2 text-black text-xs font-medium ">
              <div className="hidden xl:block">FILTER : </div>
              <Whisper
                placement="top"
                trigger="active"
                controlId="control-id-active"
                speaker={hargaPopoOver}
                placement="bottomStart"
              >
                <button className="text-black block border rounded-full py-2 px-4 xl:px-4 focus:ring-1 focus:ring-gray-300 font-medium ">
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
                <button className="text-black block border rounded-full py-2 px-4 xl:px-4 focus:ring-1 focus:ring-gray-300 font-medium ">
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
                <button className="text-black block border rounded-full py-2 px-4 xl:px-4 focus:ring-1 focus:ring-gray-300 font-medium ">
                  TRANSIT
                </button>
              </Whisper>
            </div>
            <div className="flex space-x-2.5 items-center">
              <div className="flex xl:hidden space-x-4 xl:mr-0 justify-center xl:justify-end">
                <div
                  onClick={() => setUbahPencarian((prev) => !prev)}
                  className="cursor-pointer"
                >
                  <IoSearchCircle size={28} className="text-blue-500" />
                </div>
                {/* <button
                    className="block border p-2 px-4 xl:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs "
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
                    <MdSort className="text-blue-500 xl:text-black" size={28} />
                  </div>
                </Whisper>
              </div>
            </div>
          </div>
         
          {/* mobile filter*/}
          <div className="w-full flex xl:hidden justify-center">
            <FilterMobilePlane 
            	langsung={langsung} setLangsung={setLangsung} transit={transit} setTransit={setTransit}
              waktuFilter={waktuFilter} handleWaktuFilterChange={handleWaktuFilterChange}
              valHargaRange={valHargaRange} 
              hargraRangeChange={hargraRangeChange}
              HargaTerendahTinggiPlane={HargaTerendahTinggiPlane} 
              setHargaTerendahTinggiPlane={setHargaTerendahTinggiPlane} 
            />
          </div>

          {ubahPencarian ? (
            <div className="mt-8">
              <SearchPlane />
            </div>
          ) : null}
          {percent === 0 || percent === 100 ? null : (
            <div className="w-full mt-0 xl:mt-4 z-40">
              <Flex gap="small" className="z-50" vertical>
                <Progress
                  className="z-50"
                  percent={percent}
                  percentPosition={{
                    align: 'center',
                    type: 'inner',
                  }}
                />
              </Flex>
              <div className="hidden xl:block mt-0 xl:mt-4 mb-8 xl:mb-0 w-full">
                <Spin>
                  <div className="content w-full" />
                </Spin>
              </div>
            </div>
          )}

          {/* <div className="mt-4 flex xl:hidden space-x-4 xl:mr-0 justify-center xl:justify-end">
                <div 
                  onClick={() => setUbahPencarian((prev) => !prev)}                
                  className="cursor-pointer">
                  <MdManageSearch size={32} />
                </div>
                <button
                  className="block border p-2 px-4 xl:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs "
                >
                  Ubah Pencarian
                </button>
              </div> */}
          <div>
            {isLoading ? (
              skeleton.map(() => (
                <div className="row mt-2 xl:mt-8 w-full p-2 pr-0">
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
              <div className="row mb-0 xl:mb-24 w-full p-2 pr-0 -mt-8 xl:mt-0">
                {filteredData.map(
                  (
                    e,
                    index //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                  ) => (
                    <>
                      {e.classes[0][0].price !== 0 ? (
                        <div
                          class={`mt-0 xl:mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                            e.classes[0][0].availability > 0 &&
                            e.classes[0][0].availability >=
                              parseInt(child) +
                                parseInt(adult) +
                                parseInt(infant)
                              ? "bg-white "
                              : "bg-gray-100 "
                          }  border-b xl:border xl:border-gray-200 rounded-none xl:rounded-md xl:shadow-sm hover:border hover:border-gray-100 transition-transform transform hover:scale-105`}
                        >
                          {/* desktop cari */}
                          <div className="hidden xl:block w-full text-black ">
                            <div className="px-4 xl:px-0 2xl:px-8 mt-4 grid grid-cols-1 xl:grid-cols-7 gap-4">
                              <div className="col-span-1">
                                <h1 className="text-black text-sm font-medium ">
                                  {e.airlineName}{" "}
                                </h1>
                                <div className="text-black text-sm">
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
                              {/* <div className="flex">
                                <div className="">
                                  <CiRollingSuitcase className="text-black" size={32} />
                                  <div className="text-xs text-black">
                                    Bagasi
                                  </div>
                                  <div className="text-xs text-black">
                                    20 Kg
                                  </div>
                                </div>
                              </div> */}
                              <div className="flex">
                                <div className="">
                                  <h1 className="mt-4 xl:mt-0 text-sm font-medium">
                                    {e.detailTitle[0].depart}{" "}
                                    <span className=" text-xs text-black">
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
                                  <span className="text-xs text-black">
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
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium  text-black">
                                  {
                                      e.isTransit === true
                                          ? (<>Rp. {toRupiah(e.classes.reduce((sum, item) => sum + item[0].price, 0))}</>)
                                          : (<>Rp. {toRupiah(e.classes[0][0].price)}</>)
                                  }
                                </h1>
                                <small className="text-gray-500">
                                  Available
                                  {/* {e.classes[0][0].availability} seat(s) left
                                  {e.classes[0][0].availability > 0 &&
                                  e.classes[0][0].availability >=
                                    parseInt(child) +
                                      parseInt(adult) +
                                      parseInt(infant) ? (
                                    ""
                                  ) : (
                                    <span> (Tiket Habis)</span>
                                  )} */}
                                </small>
                              </div>
                              <div className="flex justify-center col-span-1">
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
                                          : "py-3.5 px-10 xl:px-12 2xl:px-14"
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
                                        <div className="text-white ">PILIH</div>
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
                                className="text-sm text-blue-500 cursor-pointer font-medium "
                              >
                                Detail Penerbangan
                              </div>
                              <div
                                onClick={() =>
                                  detailHarga == `harga-open-${index}`
                                    ? setDetailHarga(`harga-close-${index}`)
                                    : setDetailHarga(`harga-open-${index}`)
                                }
                                className="text-sm text-blue-500 cursor-pointer font-medium "
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
                                      <h1 className="text-black text-sm font-medium ">
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
                                    <div className="flex flex-col space-y-28 text-black">
                                      <div className="">
                                        <div className="text-sm font-medium ">
                                          {x[0].departureTime}
                                        </div>
                                        <div className="text-xs">
                                          {x[0].departureDate}
                                        </div>
                                      </div>
                                      <div className="">
                                        <div className="text-sm font-medium ">
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
                                              borderColor: "black",
                                            },
                                        }}
                                      >
                                        <TimelineItem>
                                          <TimelineSeparator>
                                            <TimelineDot />
                                            <TimelineConnector />
                                          </TimelineSeparator>
                                          <TimelineContent
                                            sx={{
                                              py: "16px",
                                              px: 2,
                                              color: "black",
                                            }}
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
                                    {/* <div className="mt-4 text-black">
                                      <div className="items-center">
                                        <div>
                                          <CiRollingSuitcase size={32} />
                                        </div>
                                        <div className="text-xs">
                                          <div>
                                            Berat Bagasi maks.{" "}
                                            <span className="font-medium ">
                                              20 kg
                                            </span>
                                          </div>
                                          <div className="mt-1">
                                            Jika {">"} 20 kg akan dikenakan
                                            biaya.
                                          </div>
                                        </div>
                                      </div>
                                    </div> */}
                                  </div>
                                ))
                              ) : (
                                <div className="hidden xl:flex xl:items-center xl:space-x-16 xl:mt-6 border-t">
                                  <div className="mt-8">
                                    <h1 className="text-black text-sm font-medium ">
                                      {e.airlineName}{" "}
                                    </h1>
                                    <div className="text-black text-sm">
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
                                  <div className="flex flex-col space-y-32 text-black">
                                    <div className="">
                                      <div className="text-sm font-medium ">
                                        {e.classes[0][0].departureTime}
                                      </div>
                                      <div className="text-xs">
                                        {e.classes[0][0].departureDate}
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="text-sm font-medium ">
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
                                            color: "black",
                                            borderColor: "black",
                                          },
                                      }}
                                    >
                                      <TimelineItem>
                                        <TimelineSeparator>
                                          <TimelineDot />
                                          <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent
                                          sx={{
                                            py: "16px",
                                            px: 2,
                                            color: "black",
                                          }}
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
                                          sx={{
                                            py: "12px",
                                            px: 2,
                                            color: "black",
                                          }}
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
                                        <TimelineContent
                                          sx={{ px: 2, color: "black" }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 12,
                                              color: "black",
                                            }}
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
                                  {/* <div className="mt-4 text-black">
                                    <div className="items-center">
                                      <div>
                                        <CiRollingSuitcase size={32} />
                                      </div>
                                      <div className="text-xs">
                                        <div>
                                          Berat Bagasi maks.{" "}
                                          <span className="font-medium ">
                                            20 kg
                                          </span>
                                        </div>
                                        <div className="mt-1">
                                          Jika {">"} 20 kg akan dikenakan biaya.
                                        </div>
                                      </div>
                                    </div>
                                  </div> */}
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
                                          <h1 className="text-sm font-medium ">
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
                                          <div className="text-xs text-black">
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
                                                {toRupiah(e.classes.reduce((sum, item) => sum + item[0].price, 0) * adult)}
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
                                    <h1 className="text-black text-sm font-medium ">
                                      {e.airlineName}{" "}
                                    </h1>
                                    <div className="text-black text-sm">
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
                                    <div className="text-xs text-black">
                                      <div className="mt-1 flex space-x-16">
                                        <div>
                                          {" "}
                                          Harga Tiket Adult ({adult}x){" "}
                                        </div>
                                        <div className="pl-1">
                                          {" "}
                                          Rp.
                                          {toRupiah(
                                            e.classes.reduce((sum, item) => sum + item[0].price, 0) * adult
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
                          {/* search drawer */}
                            <SearchDrawerMobile
                            openDetail={openDrawer === index}
                            toggleDrawerDetail={toggleDrawer(index)}
                            data={e}
                            infant={infant}
                            child={child}
                            adult={adult}
                            detailTiket={detailTiket}
                            index={index}
                            />
                          <div className="">
                            <div className="cursor-pointer block xl:hidden w-full text-black">
                              <div
                                type="button"
                                onClick={(f) => {
                                  e.classes[0][0].availability > 0 &&
                                    e.classes[0][0].availability >=
                                      parseInt(child) +
                                        parseInt(adult) +
                                        parseInt(infant) &&
                                    bookingHandlerDetail(index);
                                }}
                                className="text-black px-2 mt-4 grid grid-cols-1"
                              >
                                <div className="flex justify-between">
                                  <div className="flex space-x-2 items-center">
                                    <img
                                      src={e.airlineIcon}
                                      width={30}
                                      alt="image.png"
                                    />
                                    <h1 className="text-black text-xs font-bold">
                                      {e.airlineName}
                                    </h1>
                                  </div>
                                  <div className="flex space-x-2 items-center">
                                  <div
                                    className="flex items-center px-4 py-1 rounded-full bg-gray-100"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setOpenDrawer(openDrawer === index ? null : index);
                                    }}
                                    // onClick={(event) => {
                                      
                                    //   event.stopPropagation();

                                    //   detailTiket == `open-${index}`
                                    //     ? setDetailTiket(`close-${index}`)
                                    //     : setDetailTiket(`open-${index}`);
                                    // }}
                                  >
                                    <IoIosMore size={20} className="text-black" />
                                    {/* <div className="text-xs cursor-pointer font-medium ">
                                      Detail
                                    </div> */}
                                  </div>
                                    <MdArrowForwardIos size={20} className="text-black" />
                                  </div>
                                </div>
                                <div className="flex justify-start mt-6">
                                  <div class="w-full grid grid-cols-7 gap-4">
                                    <div className="col-span-2 text-[12px]">
                                      <div className="font-bold">
                                        <span>{e.detailTitle[0].depart}</span>
                                      </div>
                                      <small className="">
                                        {e.detailTitle[0].origin} (
                                        {e.classes[0][0].departureTimeZoneText})
                                      </small>
                                    </div>
                                    <div className="col-span-3">
                                      <div className="flex space-x-2 items-center">
                                        <div className="w-full px-1 border-b-2"></div>
                                        <div className="text-[12px]">
                                          <div className="text-black">
                                            {e.duration}
                                          </div>
                                          <small className="text-[12px]">
                                      {e.isTransit === true
                                        ? `Transit`
                                        : "Langsung"}
                                    </small>
                                        </div>
                                        <div className="w-full px-1 border-b-2"></div>
                                      </div>
                                    </div>
                                    <div className="col-span-2 text-[12px]">
                                      <div className="col-span-2 text-[12px]">
                                        <div className="font-bold">
                                          <span>
                                            {
                                              e.detailTitle[
                                                e.detailTitle.length - 1
                                              ].arrival
                                            }{" "}
                                          </span>
                                        </div>
                                        <small className="">
                                          {" "}
                                          {
                                            e.detailTitle[
                                              e.detailTitle.length - 1
                                            ].destination
                                          }
                                          (
                                          {
                                            e.classes[e.classes.length - 1][0]
                                              .arrivalTimeZoneText
                                          }
                                          )
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-6 mb-2 flex justify-between">
                                  <div className="text-md font-bold  text-black mt-1">
                                    {
                                        e.isTransit === true
                                            ? (<>Rp. {toRupiah(e.classes.reduce((sum, item) => sum + item[0].price, 0))}</>)
                                            : (<>Rp. {toRupiah(e.classes[0][0].price)}</>)
                                    } <span className="text-xs text-gray-400"> / org</span>
                                  </div>
                                  <small className="bg-blue-100 px-2 py-1.5 text-blue-500 text-xs rounded-full">
                                      Gratis Biaya Layanan
                                  </small>
                                </div>
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
              <div className="row mt-24 mb-24 w-full p-2">
                <div className="flex justify-center items-center">
                  <img
                    src={"/nodata.jpg"}
                    className="w-[200px] xl:w-[300px]"
                    alt="No data"
                  />
                </div>
                <div className="flex justify-center w-full text-black">
                  <div className="text-black text-center">
                    <div>
                      <div className="text-sm xl:text-md font-medium">
                        Maaf, sepertinya pada rute ini masih belum dibuka
                        kembali.
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
