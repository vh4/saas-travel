import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { createTheme } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import KAISearch from "./KAISearch";
import moment from "moment";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal } from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import { notification } from "antd";

export default function Search() {
  const theme = createTheme({
    typography: {
      fontSize: 8,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [uuids, setuuid] = useState(null);

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const kotaBerangkat = searchParams.get("kotaBerangkat");
  const kotaTujuan = searchParams.get("kotaTujuan");
  const stasiunBerangkat = searchParams.get("stasiunBerangkat");
  const stasiunTujuan = searchParams.get("stasiunTujuan");
  const adult = searchParams.get("adult");
  const infant = searchParams.get("infant");

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );
  const navigate = useNavigate();

  const [showHarga, setShowHarga] = useState(false);
  const [showWaktu, setShowWaktu] = useState(false);
  const [showKelas, setShowKelas] = useState(false);

  const btnRefHarga = useRef(null);
  const btnRefWaktu = useRef(null);
  const btnRefKelas = useRef(null);

  useEffect(() => {
    const closeFilter = (e) => {
      if (
        e.target !== btnRefHarga.current &&
        e.target !== btnRefWaktu.current &&
        e.target !== btnRefKelas.current
      ) {
        setShowHarga(false);
        setShowWaktu(false);
        setShowKelas(false);
      }
    };

    document.body.addEventListener("click", closeFilter);

    return () => document.body.removeEventListener("click", closeFilter);
  }, []);

  const [gradeFilter, setGradeFilter] = useState([false, false, false]);
  const [waktuFilter, setWaktuFilter] = useState([false, false, false, false]);
  const [selectedTime, setSelectedTime] = useState([]);
  const [ubahPencarian, setUbahPencarian] = useState(false);
  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);

  const [valHargaRange, setHargaRange] = useState([0, 10000000]);

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

  const handleGradeFilterChange = (e) => {
    let newGradeFilter = [...gradeFilter];
    newGradeFilter[e.target.value] = e.target.checked;
    setGradeFilter(newGradeFilter);
  };

  

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

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    if (origin === null || origin === undefined) {
      setErrPage(true);
    }

    if (destination === null || destination === undefined) {
      setErrPage(true);
    }

    if (date === null || date === undefined) {
      setErrPage(true);
    }

    if (kotaBerangkat === null || kotaBerangkat === undefined) {
      setErrPage(true);
    }

    if (kotaTujuan === null || kotaTujuan === undefined) {
      setErrPage(true);
    }

    if (stasiunBerangkat === null || stasiunBerangkat === undefined) {
      setErrPage(true);
    }

    if (stasiunTujuan === null || stasiunTujuan === undefined) {
      setErrPage(true);
    }

    if (infant === null || infant === undefined || isNaN(parseInt(infant)) === true) {
      setErrPage(true);
    }

    if (adult === null || adult === undefined || isNaN(parseInt(adult)) === true) {
      setErrPage(true);
    }

    if(parseInt(adult) < parseInt(infant)) {
      setErrPage(true);
    }

    if(parseInt(adult) <= 0){
      setErrPage(true);
    }

  }, [
    token,
    stasiunBerangkat,
    stasiunTujuan,
    kotaBerangkat,
    kotaTujuan,
    origin,
    destination,
    date,
    adult,
    infant,
  ]);

  const tanggal_keberangkatan_kereta = parseTanggal(date);

  const [isLoading, setLoading] = React.useState(false);
  const [notFound, setError] = React.useState(true);
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [dataSearch, setDataSearch] = React.useState([]);

  async function handlerSearch() {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/train/search`,
        {
          productCode: "WKAI",
          token: JSON.parse(
            localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
          ),
          origin: origin,
          destination: destination,
          date: date,
        }
      );

      if (response.data.rc.length < 1) {
        setError(true);
        setLoading(false);
      } else if (response.data.rc !== "00" || response.data.rc === undefined) {
        setError(true);
        setLoading(false);
      } else if (response.data === undefined) {
        setError(true);
        setLoading(false);
      } else {
        setError(false);
        setDataSearch(response.data.data);
        setuuid(response.data.uuid)
        setLoading(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  }

  async function bookingHandlerDetail(trainNumber) {
    const detailBooking = dataSearch.filter(
      (e) => e.trainNumber === trainNumber
    );
    const detailKereta = [
      {
        berangkat_id_station: origin,
        tujuan_id_station: destination,
        berangkat_nama_kota: kotaBerangkat,
        tujuan_nama_kota: kotaTujuan,
        adult: adult,
        infant: infant,
        stasiunBerangkat: stasiunBerangkat,
        stasiunTujuan: stasiunTujuan,
      },
    ];

    const dataLengkap = {
      train: detailBooking,
      train_detail: detailKereta,
      uuid:uuids
    };

    const uuid = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/search/k_search`,
      dataLengkap,
    );

    if (uuid.data.rc == "00") {
      navigate("/train/booking/" + uuid.data.uuid);
    } else {
      failedNotification(uuid.data.rd);
    }
  }

  useEffect(() => {
    handlerSearch();
  }, []);

  const filteredData = dataSearch
    .filter((train) => {
      if (!gradeFilter.some((filter) => filter)) {
        return true;
      } else {
        return train.seats.some((seat) => {
          return gradeFilter[["K", "E", "B"].indexOf(seat.grade)];
        });
      }
    })
    .filter((d) => {
      if (selectedTime.length === 0) {
        return true;
      }
      const departureTime = moment(d.departureTime, "HH:mm").format("HH:mm");
      return selectedTime.some((t) => {
        const [start, end] = t.split("-");
        return moment(departureTime, "HH:mm").isBetween(
          moment(start, "HH:mm"),
          moment(end, "HH:mm")
        );
      });
    })
    .filter((train) => {
      return train.seats.some((seat) => {
        return (
          valHargaRange[0] <= seat.priceAdult &&
          seat.priceAdult <= valHargaRange[1]
        );
      });
    });

  return (
    <>
      {contextHolder}

      {err === true ? (
        <>
          <Page500 />
        </>
      ) : errPage === true ? (
        <>
          <Page400 />
        </>
      ) : (
        <>
          <div className="text-sm judul-search mt-4 font-bold text-slate-600">
            PILIH JADWAL
          </div>
          <div className="mt-8">
            <div className="block lg:flex justify-between">
              <div className="flex items-center space-x-3 xl:space-x-4 text-center md:text-left">
                <small className="text-xs font-bold text-slate-600">
                  {stasiunBerangkat}, {kotaBerangkat}
                </small>
                <div className="bg-blue-500 p-1 rounded-full">
                  <IoArrowForwardOutline
                    className="font-bold text-xs text-white"
                    size={16}
                  />
                </div>
                <small className="text-xs font-bold text-slate-600">
                  {stasiunTujuan}, {kotaTujuan}
                </small>
                <div className="hidden md:block font-normal text-slate-600">
                  |
                </div>
                <small className="hidden md:block text-xs font-bold text-slate-600">
                  {tanggal_keberangkatan_kereta}
                </small>
                <div className="hidden md:block font-normal text-slate-600">
                  |
                </div>
                <small className="hidden md:block text-xs font-bold text-slate-600">
                  {parseInt(adult) + parseInt(infant)} Penumpang
                </small>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4 md:mr-0 justify-center md:justify-end">
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
            {ubahPencarian ? (
              <div className="mt-8">
                <KAISearch />
              </div>
            ) : null}
            <div className="flex justify-between mt-6">
              <div className="relative flex items-center space-x-2 text-slate-600 text-xs font-bold">
                <div className="hidden md:block">FILTER : </div>
                <button
                  onClick={() => {setShowHarga(!showHarga); setShowWaktu(false); setShowKelas(false)}} 
                  ref={btnRefHarga}
                  className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300"
                >
                  HARGA
                </button>
                <button
                  onClick={() => {setShowWaktu(!showWaktu); setShowHarga(false); setShowKelas(false)}} 
                  ref={btnRefWaktu}
                  className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300"
                >
                  WAKTU
                </button>
                <button
                  onClick={() => {setShowKelas(!showKelas); setShowWaktu(false); setShowHarga(false)}} 
                  ref={btnRefKelas}
                  className="block border p-2 px-2 md:px-4 focus:ring-1 focus:ring-gray-300"
                >
                  KELAS
                </button>
                {showHarga ? (
                  <div className="w-auto absolute top-10 z-50 opacity-100 bg-white p-4 text-xs">
                    <Box sx={{ width: 200 }}>
                      <Typography
                        theme={theme}
                        id="track-inverted-slider"
                        gutterBottom
                      >
                        Range antara Rp.{toRupiah(valHargaRange[0])} - Rp.
                        {toRupiah(valHargaRange[1])}
                      </Typography>
                      <Slider
                        size="small"
                        track="inverted"
                        aria-labelledby="track-inverted-range-slider"
                        onChange={hargraRangeChange}
                        value={valHargaRange}
                        min={0}
                        max={1500000}
                      />
                    </Box>
                  </div>
                ) : null}
                {showWaktu ? (
                  <div className="w-auto absolute top-10 left-28 z-50 opacity-100 bg-white p-4 text-xs">
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
                          label={
                            <span style={{ fontSize: "12px" }}>
                              06.00 - 12.00
                            </span>
                          }
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
                          label={
                            <span style={{ fontSize: "12px" }}>
                              12.00 - 18.00
                            </span>
                          }
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
                          label={
                            <span style={{ fontSize: "12px" }}>
                              18.00 - 00.00
                            </span>
                          }
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
                          label={
                            <span style={{ fontSize: "12px" }}>
                              00.00 - 06.00
                            </span>
                          }
                        />
                      </FormGroup>
                    </Box>
                  </div>
                ) : null}
                {showKelas ? (
                  <div className="w-auto absolute top-10 left-48 z-50 opacity-100 bg-white p-4 text-xs">
                    <Box sx={{ width: 120 }}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={gradeFilter[0]}
                              value={0}
                              onChange={handleGradeFilterChange}
                              size="small"
                            />
                          }
                          label={
                            <span style={{ fontSize: "12px" }}>Ekonomi</span>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={gradeFilter[1]}
                              value={1}
                              onChange={handleGradeFilterChange}
                              size="small"
                            />
                          }
                          label={
                            <span style={{ fontSize: "12px" }}>Eksekutif</span>
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={gradeFilter[2]}
                              value={2}
                              onChange={handleGradeFilterChange}
                              size="small"
                            />
                          }
                          label={
                            <span style={{ fontSize: "12px" }}>Bisnis</span>
                          }
                        />
                      </FormGroup>
                    </Box>
                  </div>
                ) : null}
              </div>
              <div>
                {/* <div className="flex space-x-2 items-center p-4 px-4 md:px-4 mr-0 xl:mr-16 text-gray-500 rounded-md text-xs font-bold">
                  <div>URUTKAN</div>
                  <MdOutlineKeyboardArrowDown />
                </div> */}
              </div>
            </div>
            <div></div>
          </div>
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
              <div className="row mb-24 w-full p-2">
                {filteredData.map(
                  (
                    e //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                  ) => (
                    <div
                      class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                        (e.seats[0].availability > 0) && (parseInt(adult) + parseInt(infant) < e.seats[0].availability) ? "bg-white" : "bg-gray-200"
                      } border border-gray-200 rounded-lg shadow-sm  hover:border transition-transform transform hover:scale-105`}
                    >
                      {/* desktop cari */}

                      <div className="hidden xl:block w-full text-gray-700 ">
                        <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                          <div className="col-span-1 xl:col-span-2">
                            <h1 className="text-sm font-bold">
                              {e.trainName}{" "}
                            </h1>
                            <small>
                              {e.seats[0].grade === "E"
                                ? "Eksekutif"
                                : e.seats[0].grade === "B"
                                ? "Bisnis"
                                : "Ekonomi"}{" "}
                              Class ({e.seats[0].class})
                            </small>
                          </div>
                          <div className="flex">
                            <div className="">
                              <h1 className="mt-4 xl:mt-0 text-sm font-bold">
                                {e.departureTime}
                              </h1>
                              <small>
                                {kotaBerangkat} ({origin})
                              </small>
                            </div>
                            <HiOutlineArrowNarrowRight size={24} />
                          </div>
                          <div>
                            <h1 className="text-sm font-bold">
                              {e.arrivalTime}
                            </h1>
                            <small>
                              {kotaTujuan} ({destination})
                            </small>
                          </div>
                          <div>
                            <h1 className="mt-4 xl:mt-0 text-sm font-bold">
                              {e.duration}
                            </h1>
                            <small>Langsung</small>
                          </div>
                          <div className="">
                            <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">
                              Rp.{toRupiah(e.seats[0].priceAdult)}
                            </h1>
                            <small className="text-red-500">
                              {e.seats[0].availability} set(s) left
                            </small>
                            <small className="text-red-500">
                              {(e.seats[0].availability > 0) && (parseInt(adult) + parseInt(infant) < e.seats[0].availability) ? "" : ". (Tiket Habis)"}
                            </small>
                          </div>
                          <div>
                            {(e.seats[0].availability > 0) && (parseInt(adult) + parseInt(infant) < e.seats[0].availability) ? (
                              <button
                                type="button"
                                onClick={() =>
                                  bookingHandlerDetail(e.trainNumber)
                                }
                                class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50 font-bold rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                              >
                                <div className="text-white font-bold">
                                  PILIH
                                </div>
                              </button>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {/* mobile cari */}
                        <div
                          onClick={() => (e.seats[0].availability > 0) && (parseInt(adult) + parseInt(infant) < e.seats[0].availability) ? bookingHandlerDetail(e.trainNumber) : " "}
                          className="cursor-pointer block xl:hidden w-full text-gray-700"
                        >
                          <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                            <div className="flex justify-between">
                              <div className="col-span-1 xl:col-span-2">
                                <h1 className="text-xs font-bold">
                                  {e.trainName}
                                </h1>
                                <small>
                                  {e.seats[0].grade === "E"
                                    ? "Eksekutif"
                                    : e.seats[0].grade === "B"
                                    ? "Bisnis"
                                    : "Ekonomi"}{" "}
                                  Class ({e.seats[0].class})
                                </small>
                              </div>
                              <div className="text-right">
                                <h1 className="text-xs font-bold text-blue-500">
                                  Rp. {toRupiah(e.seats[0].priceAdult)}
                                </h1>
                                <small className="text-red-500">
                                  {e.seats[0].availability} set(s)
                                </small>
                                <small className="text-red-500">
                                  {(e.seats[0].availability > 0) && (parseInt(adult) + parseInt(infant) < e.seats[0].availability) ? "" : ". (Tiket Habis)"}
                                </small>
                              </div>
                            </div>
                            <div className="flex justify-start">
                              <div className="flex space-x-2 items-start">
                                <div>
                                  <h1 className="mt-10 xl:mt-0 text-xs font-bold">
                                    {e.departureTime}
                                  </h1>
                                  <small className="text-gray-400">
                                    {origin}
                                  </small>
                                </div>
                                <div className="w-full mt-12 px-4 border-b-2"></div>
                                <div className="text-xs">
                                  <h1 className="text-xs mt-10 xl:mt-0 text-gray-400">
                                    {e.duration}
                                  </h1>
                                  <small className="text-gray-400">
                                    Langsung
                                  </small>
                                </div>
                                <div className="w-full mt-12 px-4 border-b-2"></div>
                                <div>
                                  <h1 className="mt-10 xl:mt-0 text-xs font-bold">
                                    {e.arrivalTime}
                                  </h1>
                                  <small className="text-gray-400">
                                    {destination}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="row mt-12 mb-24 w-full p-2">
                <div className="flex justify-center">
                  <img src={"/nodata.jpg"} width={350} alt="nodata" />
                </div>
                <div className="flex justify-center w-full text-gray-700">
                  <div className="text-gray-500 text-center">
                    <div>
                      <div className="text-lg font-bold">
                        Maaf, sepertinya rute ini belum dibuka kembali
                      </div>
                      <small>
                        Namun jangan khawatir, masih ada pilihan kendaraan lain
                        yang tetap bisa mengantarkan Anda ke tempat tujuan.
                      </small>
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
