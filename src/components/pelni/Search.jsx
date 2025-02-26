import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoArrowBackOutline, IoArrowForwardOutline, IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Searchpelni from "./PelniSearch";
import { notification, Spin, Timeline } from "antd";
import Page400 from "../components/400";
import Page500 from "../components/500";
import { duration, durationFull } from "../../helpers/pelni";
import { parseTanggal, parseTanggalPelni } from "../../helpers/date";
import { toRupiah } from "../../helpers/rupiah";
import dayjs from "dayjs";
import { Whisper, Popover } from "rsuite";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { BsArrowDownCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setDataSearchPelni } from "../../features/createSlice";
import { SlArrowDown, SlArrowLeft } from "react-icons/sl";
import { IoIosArrowDown, IoIosMore } from "react-icons/io";
import SearchDrawerMobile from "./components/SearchDrawerMobile";
import FilterMobilePelni from "./components/FilterMobilePelni";
import { MdArrowForwardIos } from "react-icons/md";

export default function Search() {

  const [searchParams, setSearchParams] = useSearchParams();
  const origin = searchParams.get("origin");
  const originName = searchParams.get("originName");
  const dispatch = useDispatch();

  const destination = searchParams.get("destination");
  const destinationName = searchParams.get("destinationName");

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const laki = searchParams.get("laki");
  const wanita = searchParams.get("wanita");
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [uuid, setuuid] =useState(null)

  const navigate = useNavigate();
  const [ubahPencarian, setUbahPencarian] = useState(false);
  const [err, setErr] = useState(false);
  const [pageErr, setPageErr] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const failedNotification = (rd) => {
    api["error"]({
      message: "Error!",
      description:
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
    });
  };

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    if (origin === null || origin === undefined) {
      setPageErr(true);
    }

    if (destination === null || destination === undefined) {
      setPageErr(true);
    }

    if (startDate === null || startDate === undefined) {
      setPageErr(true);
    }
    if (endDate === null || endDate === undefined) {
      setPageErr(true);
    }

    if (originName === null || originName === undefined) {
      setPageErr(true);
    }
    if (destinationName === null || destinationName === undefined) {
      setPageErr(true);
    }

    if (laki === null || laki === undefined || isNaN(parseInt(laki)) === true ) {
      setPageErr(true);
    }

    if (wanita === null || wanita === undefined || isNaN(parseInt(wanita)) === true ) {
      setPageErr(true);
    }

    if(parseInt(wanita) <= 0 && parseInt(laki) <= 0){
        setPageErr(true);
    }

  }, [
    token,
    origin,
    destination,
    startDate,
    endDate,
    laki,
    wanita,
    destinationName,
    originName,
  ]);

  const [isLoading, setLoading] = React.useState(false);
  const [notFound, setError] = React.useState(true);
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [dataSearch, setDataSearch] = React.useState(Array());
  const [filterNamaKapal, setFilterNamaKapal] = React.useState(null);
  const [filterNamaKapalList, setfilterNamaKapalList] = React.useState(null);
  const [openDrawer, setOpenDrawer] = useState(null);
	const toggleDrawer = (index) => () => {
		setOpenDrawer(openDrawer === index ? null : index);
	};


  useEffect(() => {
    handlerSearch();
  }, []);

  const handlerSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/search`,
        {
          origin: origin,
          destination: destination,
          startDate: startDate,
          endDate: endDate,
          token: token,
        }
      );

      if (response.data.rc === "00") {
        const dataParsing = response.data.data;

        setuuid(response.data.uuid);

        for (let k = 0; k < dataParsing.length; k++) {
          const e = dataParsing[k];
          for (let i = 0; i < e.fares.length; i++) {
            const fareResponse = await handleAvailbillity(e, i);
            dataParsing[k].fares[i]["M_available"] = fareResponse.M;
            dataParsing[k].fares[i]["F_available"] = fareResponse.F;
          }
        }

        setDataSearch(dataParsing);

        const dataParsingLength = dataParsing.reduce((unique, item) => {
          if (!unique.find(x => x.SHIP_NAME === item.SHIP_NAME)) {
            unique.push(item);
          }
          return unique;
        }, []);

        setfilterNamaKapalList(dataParsingLength);
        setFilterNamaKapal(dataParsingLength.map(item => `${item.SHIP_NAME}:true`));

        setLoading(false);
        setError(false);
      } else {
        failedNotification(response.data.rd);
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const handleAvailbillity = async (e, i) => {
    const departureDate = e.DEP_DATE.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    );

    const params = {
      origin: origin,
      originCall: e.ORG_CALL,
      destination: destination,
      destinationCall: e.DES_CALL,
      departureDate: departureDate,
      shipNumber: e.SHIP_NO,
      subClass: e.fares[i].SUBCLASS,
      male: 1,
      female: e.fares[i].AVAILABILITY.F,
      uuid:uuid,
      token: token
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/check_availability`,
        params
      );
      const data = response.data.data;

      return {
        M: data.M,
        F: data.F,
      };
    } catch (error) {
      return {
        M: 0, // Handle error case gracefully
        F: 0, // Handle error case gracefully
      };
    }
  };

  const fare = async (e, i) => {
    const departureDate = e.DEP_DATE.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    );

    const params = {
      origin: origin,
      originCall: e.ORG_CALL,
      destination: destination,
      destinationCall: e.DES_CALL,
      departureDate: departureDate,
      shipNumber: e.SHIP_NO,
      token: token,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/fare`,
      params
    );
    const parsing = response.data.data;

    const faresResponseFix = parsing[i];

    return faresResponseFix;
  };

  async function handleSubmit(e, i) {
    const fares = await fare(e, i);
    const departureDate = e.DEP_DATE.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    );
    const arrivalDate = e.ARV_DATE.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

    const params = {
      harga_dewasa: fares.FARE_DETAIL.A.TOTAL,
      harga_anak: "0",
      harga_infant: fares.FARE_DETAIL.I.TOTAL,
      pelabuhan_asal: originName,
      pelabuhan_tujuan: destinationName,
      shipName: e.SHIP_NAME,
      origin: origin,
      originCall: e.ORG_CALL,
      destination: destination,
      destinationCall: e.DES_CALL,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
      departureTime: `${e.DEP_TIME.slice(0, 2)}:${e.DEP_TIME.slice(2)}`,
      arrivalTime: `${e.ARV_TIME.slice(0, 2)}:${e.ARV_TIME.slice(2)}`,
      shipNumber: e.SHIP_NO,
      class: e.fares[i].CLASS,
      subClass: fares.SUBCLASS,
      duration: durationFull(e.DEP_DATE, e.ARV_DATE, e.DEP_TIME, e.ARV_TIME),
      male: laki,
      female: wanita,
      rc: "00",
      rd: "success",
    };

    dispatch(setDataSearchPelni(params));
    
    setTimeout(() => {
      navigate(`/pelni/booking`);
    }, 1000);

  }

  const [pelniStatiun, setPelniStatiun] = useState();
  const [openButton, setOpenButton] = useState(null);

  async function getPelnitDataStasiun() {
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/get_origin`,
      {
        token: token,
      }
    );

    setPelniStatiun(response.data.data);
  }

  useEffect(() => {
    getPelnitDataStasiun();
  }, []);

  //filter unique kapal.

  let shipNameToStatus = {};

  if (Array.isArray(filterNamaKapal)) {
    shipNameToStatus = filterNamaKapal.reduce((acc, item) => {
      const [shipName, status] = item.split(':');
      acc[shipName] = status === 'true';
      return acc;
    }, {});
  } else {
    console.log("filterNamaKapal is undefined or not an array");
    // Handle the undefined case or initialize filterNamaKapal appropriately
  }
  
  // Now, filter dataSearch using the created map.
  const filteredData = dataSearch.filter(pelni => {
    // If filterNamaKapal was undefined, this will default to not filtering anything
    return shipNameToStatus[pelni.SHIP_NAME] !== false;
  });
  

  const handleFilterKapalChange = (nama_ship, index) => {
    const updatedFilterNamaKapalVariable = [...filterNamaKapal];
    const currentStatus = updatedFilterNamaKapalVariable[index].split(':')[1] === 'true';
  
    // Toggle the status
    updatedFilterNamaKapalVariable[index] = `${nama_ship}:${!currentStatus}`;
    setFilterNamaKapal(updatedFilterNamaKapalVariable);
  };
  
  return (
    <>
      {err === true ? (
        <>
          <Page500 />
        </>
      ) : pageErr === true ? (
        <>
          <Page400 />
        </>
      ) : (
        <>
          <>
            {contextHolder}
            <div className="hidden md:block judul-search  text-black">
              PILIH JADWAL
            </div>
            <div className="mt-4 md:mt-8">
              <div className="block md:flex flex-col md:flex-row md:justify-between items-center md:space-x-4">
                <div className="hidden md:flex items-center space-x-3 text-center md:text-left">
                  <small className="text-xs font-normal  text-black">
                    {originName}
                  </small>
                  <div className="hidden md:flex bg-blue-500 p-1 rounded-full">
                    <IoArrowForwardOutline
                      className=" text-xs text-white"
                      size={16}
                    />
                  </div>
                  <small className="hidden md:flex text-xs font-normal  text-black">
                    {destinationName}
                  </small>
                  <div className="hidden md:block font-normal text-black">
                    |
                  </div>
                  <div className="hidden md:flex space-x-4 text-xs  text-black">
                    <div>{parseTanggalPelni(startDate)}</div>
                    <div>s.d</div>
                    <div>{parseTanggalPelni(endDate)}</div>
                  </div>
                  <div className="hidden md:block font-normal text-black">
                    |
                  </div>
                  <small className="hidden md:block text-xs  text-black">
                    {parseInt(laki) + parseInt(wanita)} Penumpang
                  </small>
                </div>
              </div>
                 {/* desktop filter */}
                <div className="hidden xl:flex justify-between mt-4 md:mt-8">
                  <div className="relative flex items-center space-x-2 text-black text-xs font-normal ">
                    <Whisper
                    className="text-black"
                      placement="bottomStart"
                      trigger="active"
                      controlId="control-id-active"
                      speaker={
                        <Popover className="text-black text-xs font-normal" title="Filter Nama Kapal">
                        <div className="block text-xs px-2">
                        <Box sx={{ width: 120 }}>
                          <FormGroup>
                            {!isLoading ? (
                              <>
                                {filterNamaKapalList !== null && filterNamaKapalList.length > 0 ? (
                                  <>
                                    {                                    
                                      filterNamaKapalList.map((x, i) => (
                                      <>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={filterNamaKapal[i].split(':')[1] === 'true'}
                                              onChange={() => handleFilterKapalChange(x.SHIP_NAME, i)}
                                              size="small"
                                            />
                                          }
                                          label={<span style={{ fontSize: "12px" }}>{x.SHIP_NAME}</span>}
                                        />
                                      </>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <div className="text center">
                                        <small>Data tidak ada!.</small>
                                    </div>
                                  </>
                                )}
                            </>
                            ) :
                            (
                            <>
                                <div className="p-4 mt-4 mb-4">
                                  <Spin tip="Loading...">
                                      <div className="content" />
                                  </Spin>
                                </div>                           
                            </>)}
                          </FormGroup>
                        </Box>
                        </div>
                      </Popover>
                      }
                    >
                    <div
                      className="pl-2 flex  space-x-2 items-center cursor-pointer"
                    >
                      <IoSearchOutline className="text-black " size={18} />
                      <div className="text-xs text-black">Nama Kapal</div>
                    </div>
                    </Whisper>

                    <div
                    onClick={() => setUbahPencarian((prev) => !prev)}      
                    className="pl-2 flex md:hidden space-x-2 items-center cursor-pointer"
                    >
                      <SlArrowDown className="text-black " size={16} />
                      <div className="text-xs text-black">Ubah Pencarian</div>
                    </div>
                  </div>
                  <div className="mt-0 block md:flex space-x-0 md:space-x-4 mr-0 md:mr-0 justify-start md:justify-end">
                  <Link
                      to="/"
                      className="hidden md:flex space-x-2 items-center"
                    >
                      <SlArrowLeft className="text-black" size={16} />
                      <div className="text-black text-xs">
                        Kembali
                      </div>
                    </Link>
                    <button
                      onClick={() => setUbahPencarian((prev) => !prev)}
                      className="hidden md:block border p-2 px-4 md:px-4  bg-blue-500 text-white rounded-md text-xs "
                    >
                      Ubah Pencarian
                    </button>
                  </div>
                </div>

                {/* mobile filter */}
              <div className="w-full flex xl:hidden justify-center -mt-10 xl:mt-0">
                <FilterMobilePelni
                    isLoading={isLoading}
                    filterNamaKapalList={filterNamaKapalList}
                    filterNamaKapal={filterNamaKapal}
                    handleFilterKapalChange={handleFilterKapalChange}
                />  
              </div>
            </div>

            {ubahPencarian ? (
              <div className="mt-8">
                <Searchpelni />
              </div>
            ) : null}
            <div>
              {isLoading ? (
                skeleton.map(() => (
                  <div className="row mt-4 w-full p-2">
                    <Box sx={{ width: "100%" }}>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </Box>
                  </div>
                ))
              ) : notFound !== true && filteredData.length !== 0 ? (
                <div className="row w-full p-2">
                  {/* untuk sorting yang  availbility nya tidak habis. */}
                  <div>
                  {filteredData.map(
                    (
                      e,
                      k //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                    ) => (
                      <>
                        {e.fares.map((z, i) => (
                          <>
                          {
                            e.fares[i]["M_available"] != "0" ? (
                            <>
                              <div
                                class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                                  e.fares[i]["M_available"] == "0" &&
                                  e.fares[i]["F_available"] == "0"
                                    ? "bg-gray-200"
                                    : "bg-white"
                                } border-b xl:border xl:border-gray-200 xl:rounded-lg xl:shadow-sm  xl:hover:border transition-transform transform hover:scale-105`}
                              >
                                {/* desktop cari */}
                                <div className="hidden xl:block w-full text-black ">
                                  <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-8 gap-0 md:gap-4">
                                    <div className="col-span-1 xl:col-span-2">
                                      <h1 className="text-sm font-normal ">
                                        {e.SHIP_NAME}{" "}
                                      </h1>
                                      <div>
                                      <small>
                                        Class {e.fares[i].CLASS}{" "}
                                        Subclass ({e.fares[i].SUBCLASS})
                                      </small>
                                      </div>
                                      <div>
                                      <small>
                                        Ship No. {e.SHIP_NO}
                                      </small>
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <div className="">
                                        <h1 className="mt-4 xl:mt-0 text-sm font-normal ">{`${e.DEP_TIME.slice(
                                          0,
                                          2
                                        )}:${e.DEP_TIME.slice(2)}`}</h1>
                                        <small>{originName}</small>
                                      </div>
                                    </div>
                                    <HiOutlineArrowNarrowRight size={24} />
                                    <div>
                                      <h1 className="text-sm font-normal ">{`${e.ARV_TIME.slice(
                                        0,
                                        2
                                      )}:${e.ARV_TIME.slice(2)}`}</h1>
                                      <small>{destinationName}</small>
                                    </div>
                                    <div>
                                      <h1 className="mt-4 xl:mt-0 text-sm font-normal ">
                                        {duration(
                                          e.DEP_DATE,
                                          e.ARV_DATE,
                                          e.DEP_TIME,
                                          e.ARV_TIME
                                        )}
                                      </h1>
                                      <small>Langsung</small>
                                    </div>
                                    <div className="">
                                      <h1 className="mt-4 xl:mt-0 text-sm font-normal  text-blue-500">
                                      Adult Rp.
                                        {toRupiah(e.fares[i].FARE_DETAIL.A.TOTAL)}
                                      </h1>
                                      <small className="text-red-500">
                                        Infant Rp.
                                        {toRupiah(e.fares[i].FARE_DETAIL.I.TOTAL)}
                                      </small>
                                    </div>
                                    <div>
                                      {e.fares[i]["M_available"] == "0" &&
                                      e.fares[i]["F_available"] == "0" ? (
                                        <></>
                                      ) : (
                                        <>
                                          <button
                                            onClick={async () =>
                                              handleSubmit(e, i)
                                            }
                                            type="button"
                                            class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50  rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                                          >
                                            <div className="text-white font-normal ">
                                              PILIH
                                            </div>
                                          </button>
                                        </>
                                      )}
                                      <div className="flex justify-center text-xs mt-2 text-blue-500 cursor-pointer text-center items-center mb-2" 
                                      onClick={() =>
                                        openButton == `open-${k + i}${e.SHIP_NO}`
                                          ? setOpenButton(`close-${k + i}${e.SHIP_NO}`)
                                          : setOpenButton(`open-${k + i}${e.SHIP_NO}`)
                                      }
                                      >
                                        Detail Route
                                      </div>
                                      {/*  */}
                                    </div>
                                  </div>
                                  {openButton === `open-${k + i}${e.SHIP_NO}` ? (
                                    <div className={`hidden xl:block ${openButton === `open-${k + i}${e.SHIP_NO}` ? '' : 'max-h-0'}`}>
                                      <div className="px-4 mt-4">
                                        <div className="mb-2 text-sm font-normal ">
                                          Tanggal Keberangkatan
                                        </div>
                                        <div className="block mb-16">
                                          <div className="text-xs">{parseTanggal(dayjs(e.DEP_DATE, 'YYYYMMDD').format('YYYY-MM-DD'))}</div>
                                        </div>
                                          <div>
                                            <Timeline>
                                              {e.ROUTE.split(/\/\d-/).filter(item => item !== "").map((h) => (
                                                <Timeline.Item key={h}>{pelniStatiun.find((z) => parseInt(z.CODE) === parseInt(h))?.NAME}</Timeline.Item>
                                              ))}
                                            </Timeline>
                                          </div>
                                        <div className="mb-2 text-sm font-normal ">
                                          Tanggal Tujuan
                                        </div>
                                        <div className="flex justify-start items-end">
                                          <div className="block text-xs">{parseTanggal(dayjs(e.ARV_DATE, 'YYYYMMDD').format('YYYY-MM-DD'))}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (<></>)}
                                </div>
                                <div>
                                  {/* mobile cari */}
                                  <div
                                      onClick={async () => e.fares[i]["M_available"] == "0" &&
                                      e.fares[i]["F_available"] == "0" ? "" : handleSubmit(e, i)}

                                      className={`cursor-pointer block xl:hidden w-full text-black`}
                                    >
                                      <div className="bg-white max-w-md">
                                          <div className="flex justify-between">
                                            <div>
                                              <h1 className={`text-black font-bold text-sm`}>{e?.SHIP_NAME?.charAt(0) + e?.SHIP_NAME?.slice(1)?.toLowerCase()}</h1>
                                              <p className="text-gray-500 text-xs">
                                            <small>
                                            Class {e.fares[i].CLASS}{" "}
                                            Subclass ({e.fares[i].SUBCLASS})
                                            </small></p>
                                            </div>
                                            <div className="text-right flex space-x-2 items-center">
                                              <div>Available</div>
                                              <div
                                                  className="flex items-center px-4 py-1 rounded-full bg-gray-100"
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    setOpenDrawer(openDrawer === i ? null : i);
                                                  }}
                                                >
                                                  <IoIosMore size={20} className="text-gray-400" />
                                                </div>  
                                                <MdArrowForwardIos size={20} className="text-black" />                                            
                                            </div>
                                          </div>
                                          {/* search drawer */}
                                            <SearchDrawerMobile
                                            openDetail={openDrawer === i}
                                            toggleDrawerDetail={toggleDrawer(i)}
                                            data={e}
                                            pelniStatiun={pelniStatiun || []}
                                            />

                                          <div className="mt-4 flex items-center space-x-4">
                                            <div className="flex flex-col items-center">
                                              <div className="w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                                              <div className="border-l-2 border-dashed border-gray-300 h-8"></div>
                                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                              <div>
                                                <p className="text-sm font-medium">
                                                    {`${e.DEP_TIME.slice(
                                                      0,
                                                      2
                                                    )}:${e.DEP_TIME.slice(2)}`}
                                                  <span className="font-bold"></span></p>
                                                <p className="text-xs text-gray-500">
                                                      {duration(
                                                        e.DEP_DATE,
                                                        e.ARV_DATE,
                                                        e.DEP_TIME,
                                                        e.ARV_TIME
                                                      )}
                                                </p>
                                              </div>
                                              <div className="mt-1">
                                                <p className="text-sm font-medium">
                                                {`${e.ARV_TIME.slice(
                                                      0,
                                                      2
                                                    )}:${e.ARV_TIME.slice(2)}`}  
                                                <span className="font-bold"></span></p>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mt-5 flex justify-between items-center">
                                            <div className="my-4">
                                            <p className="text-sm font-semibold"> Rp. {toRupiah(
                                                      e.fares[0].FARE_DETAIL.A.TOTAL
                                                    )} <span className="text-sm text-gray-400">{" "}/Dewasa</span></p>
                                                    <p className="text-sm font-semibold"> Rp. {toRupiah(e.fares[i].FARE_DETAIL.I.TOTAL)}
                                                     <span className="text-sm text-gray-400">{" "}/Bayi</span></p>
                                            </div>
                                            <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                              Langsung
                                            </span>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            </>) : (
                            <>
                            </>)
                          }
                          </>
                        ))}
                      </>
                    )
                  )}
                  </div>

                  {/* untuk sorting yang tidak availbility nya habis. */}

                  <div>
                  {filteredData.map(
                    (
                      e, k //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                    ) => (
                      <>
                        {e.fares.map((z, i) => (
                          <>
                          {
                            e.fares[i]["M_available"] == "0" &&
                            e.fares[i]["F_available"] == "0" ? (
                            <>
                              <div
                                class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                                  e.fares[i]["M_available"] == "0" &&
                                  e.fares[i]["F_available"] == "0"
                                    ? "bg-white xl:bg-gray-200"
                                    : "bg-white"
                                } border-b xl:border border-gray-200 rounded-none xl:rounded-lg shadow-none xl:shadow-sm  xl:hover:border transition-transform transform hover:scale-105`}
                              >
                                {/* desktop cari */}
                                <div className="hidden xl:block w-full text-black ">
                                  <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-8 gap-0 md:gap-4">
                                    <div className="col-span-1 xl:col-span-2">
                                      <h1 className="text-sm font-normal ">
                                        {e.SHIP_NAME}{" "}
                                      </h1>
                                      <div>
                                      <small>
                                        Class {e.fares[i].CLASS}{" "}
                                        Subclass ({e.fares[i].SUBCLASS})
                                      </small>
                                      </div>
                                      <div>
                                      <small>
                                        Ship No. {e.SHIP_NO}
                                      </small>
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <div className="">
                                        <h1 className="mt-4 xl:mt-0 text-sm font-normal ">{`${e.DEP_TIME.slice(
                                          0,
                                          2
                                        )}:${e.DEP_TIME.slice(2)}`}</h1>
                                        <small>{originName}</small>
                                      </div>
                                    </div>
                                    <HiOutlineArrowNarrowRight size={24} />
                                    <div>
                                      <h1 className="text-sm font-normal ">{`${e.ARV_TIME.slice(
                                        0,
                                        2
                                      )}:${e.ARV_TIME.slice(2)}`}</h1>
                                      <small>{destinationName}</small>
                                    </div>
                                    <div>
                                      <h1 className="mt-4 xl:mt-0 text-sm font-normal ">
                                        {duration(
                                          e.DEP_DATE,
                                          e.ARV_DATE,
                                          e.DEP_TIME,
                                          e.ARV_TIME
                                        )}
                                      </h1>
                                      <small>Langsung</small>
                                    </div>
                                    <div className="">
                                      <h1 className="mt-4 xl:mt-0 text-sm font-normal  text-blue-500">
                                        Adult Rp.
                                        {toRupiah(e.fares[i].FARE_DETAIL.A.TOTAL)}
                                      </h1>
                                      <small className="text-red-500">
                                        Infant Rp.
                                        {toRupiah(e.fares[i].FARE_DETAIL.I.TOTAL)}
                                      </small>
                                    </div>
                                    <div>
                                      {e.fares[i]["M_available"] == "0" &&
                                      e.fares[i]["F_available"] == "0" ? (
                                        <></>
                                      ) : (
                                        <>
                                          <button
                                            onClick={async (e) =>

                                              handleSubmit(e, i)
                                            }
                                            type="button"
                                            class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50  rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                                          >
                                            <div className="text-white ">
                                              PILIH
                                            </div>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {/* mobile cari */}
                                     <div
                                      className={`cursor-pointer block xl:hidden w-full text-gray-400`}
                                    >
                                      <div className="bg-white max-w-md">
                                          <div className="flex justify-between">
                                            <div>
                                              <h1 className={`text-gray-400 font-bold text-sm`}>{e?.SHIP_NAME?.charAt(0) + e?.SHIP_NAME?.slice(1)?.toLowerCase()}</h1>
                                              <p className="text-gray-500 text-xs">
                                            <small>
                                            Class {e.fares[i].CLASS}{" "}
                                            Subclass ({e.fares[i].SUBCLASS})
                                            </small></p>
                                            </div>
                                            <div className="text-right">
                                              Habis
                                            </div>
                                          </div>

                                          <div className="mt-4 flex items-center space-x-4">
                                            <div className="flex flex-col items-center">
                                              <div className="w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                                              <div className="border-l-2 border-dashed border-gray-300 h-8"></div>
                                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                              <div>
                                                <p className="text-sm font-medium">
                                                    {`${e.DEP_TIME.slice(
                                                      0,
                                                      2
                                                    )}:${e.DEP_TIME.slice(2)}`}
                                                  <span className="font-bold"></span></p>
                                                <p className="text-xs text-gray-500">
                                                      {duration(
                                                        e.DEP_DATE,
                                                        e.ARV_DATE,
                                                        e.DEP_TIME,
                                                        e.ARV_TIME
                                                      )}
                                                </p>
                                              </div>
                                              <div className="mt-1">
                                                <p className="text-sm font-medium">
                                                {`${e.ARV_TIME.slice(
                                                      0,
                                                      2
                                                    )}:${e.ARV_TIME.slice(2)}`}  
                                                <span className="font-bold"></span></p>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="mt-5 flex justify-between items-center">
                                            <div className="my-4">
                                            <p className="text-sm font-semibold"> Rp. {toRupiah(
                                                      e.fares[0].FARE_DETAIL.A.TOTAL
                                                    )} <span className="text-sm text-gray-400">{" "}/Dewasa</span></p>
                                                    <p className="text-sm font-semibold"> Rp. {toRupiah(e.fares[i].FARE_DETAIL.I.TOTAL)}
                                                     <span className="text-sm text-gray-400">{" "}/Bayi</span></p>
                                            </div>
                                            <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                              Langsung
                                            </span>
                                          </div>
                                        </div>
                                    </div>
                                </div>
                              </div>
                            </>) : (
                            <>
                            </>)
                          }
                          </>
                        ))}
                      </>
                    )
                  )}
                  </div>
                </div>
              ) : (
                <div className="row mt-24 mb-24 w-full p-2">
                <div className="flex justify-center items-center">
                  <img src={"/nodata.jpg"} className="w-[200px] md:w-[300px]" alt="No data" />
                </div>
                <div className="flex justify-center w-full text-black">
                  <div className="text-black text-center">
                    <div>
                      <div className="text-sm md:text-md font-normal">
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
        </>
      )}
    </>
  );
}
