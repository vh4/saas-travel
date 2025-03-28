import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import {
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoSearchCircle,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import Slider from "@mui/material/Slider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import KAISearch from "./KAISearch";
import moment from "moment";
import { toRupiah } from "../../helpers/rupiah";
import {
  calculateTotalDurationTransit,
  parseTanggal,
} from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import { Radio, Space, notification } from "antd";
import { Popover, Whisper } from "rsuite";
import { v4 as uuidv4 } from "uuid";
import { MdArrowForwardIos, MdSort } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setDataSearchKereta } from "../../features/createSlice";
import FilterMobileKereta from "./components/FilterMobileKereta";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [uuids, setuuid] = useState(null);
  const dispatch = useDispatch();

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
  const [isTransit, setIsTransit] = useState(1);

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

  const [gradeFilter, setGradeFilter] = useState([false, false, false]); //index ke-0 ekonomi (K), index ke-1 eksekutif (E), dan index ke-2 bisnis (B)
  const [waktuFilter, setWaktuFilter] = useState([false, false, false, false]);
  const [HargaTerendahTinggi, setHargaTerendahTinggi] = useState(false);
  const [selectedTime, setSelectedTime] = useState([]);
  const [ubahPencarian, setUbahPencarian] = useState(false);
  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [messageError, setmessageError] = useState("");
  const [messageErrorTransit, setmessageErrorTransit] = useState("");

  const [valHargaRange, setHargaRange] = useState([0, 10000000]);

  const [api, contextHolder] = notification.useNotification();

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

    if (
      infant === null ||
      infant === undefined ||
      isNaN(parseInt(infant)) === true
    ) {
      setErrPage(true);
    }

    if (
      adult === null ||
      adult === undefined ||
      isNaN(parseInt(adult)) === true
    ) {
      setErrPage(true);
    }

    if (parseInt(adult) < parseInt(infant)) {
      setErrPage(true);
    }

    if (parseInt(adult) <= 0) {
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
  const [isLoadingTransit, setLoadingTransit] = React.useState(false);
  const [notFound, setError] = React.useState(true);
  const [notFoundTransit, setErrorTransit] = React.useState(true);

  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [dataSearch, setDataSearch] = React.useState([]);
  const [dataSearchTransit, setDataSearchTransit] = React.useState([]);
  const [listStaton, setListStaton] = React.useState([]);

  async function getKAIdata() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/train/station`,
        {
          token: token,
        }
      );

      return response.data.data;
    } catch (error) {
      return [];
    }
  }

  async function handlerSearch() {
    try {
      setLoading(true);
      const listCategory = ["false", "true"];

      let rc_non = "";
      let rc_transit = "";

      let data_non = "";
      let data_transit = "";

      // Mendapatkan data stasiun dan mengatur state terkait
      const stationData = await getKAIdata();
      setListStaton(stationData);

      for (const category of listCategory) {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/travel/train/search`,
          {
            productCode: "WKAIH",
            token: token,
            origin: origin,
            destination: destination,
            date: date,
            connection_train: category,
          }
        );

        if (category == "true") {
          rc_transit = response.data.rc;
          data_transit = response.data;
        } else {
          rc_non = response.data.rc;
          data_non = response.data;
        }
      }

      // Handle non-transit response
      if (rc_non == "10") {
        setmessageError(
          "Pencarian melebihi batas limit dan user dimohon menunggu 2 menit untuk melakukan pencarian ulang."
        );
      } else if (rc_non != "00" && rc_transit != "10") {
        setmessageError(
          "Maaf, sepertinya pada rute ini masih belum dibuka kembali."
        );
      } else {
        setDataSearch(data_non.data);
        setuuid(data_non.uuid);
      }

      // Handle transit response
      if (rc_transit == "10") {
        setmessageErrorTransit(
          "Pencarian melebihi batas limit dan user dimohon menunggu 5 menit untuk melakukan pencarian ulang."
        );
      } else if (rc_transit != "00" && rc_transit != "10") {
        setmessageErrorTransit(
          "Maaf, sepertinya pada rute ini masih belum dibuka kembali."
        );
      } else {
        setDataSearchTransit(data_transit.data);
        setuuid(data_transit.uuid);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setmessageError("Maaf, Terjadi kesalahan pada server.");
    } finally {
      setLoading(false);
      setLoadingTransit(false);
      // Adjust these based on actual conditions or responses
      setError(false);
      setErrorTransit(false);
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
    };

    dispatch(setDataSearchKereta(dataLengkap));
    setTimeout(() => {
      navigate("/train/booking/");
    }, 1000);
  }

  const bookingHandlerDetailTransit = (dataDetailTrainTransit, category) => {
    const filteredStations = listStaton.filter((e) => e.id_stasiun == category);

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
        transit_name_stasiun: filteredStations[0].nama_stasiun,
        transit_id_stasiun: filteredStations[0].id_stasiun,
      },
    ];

    const dataLengkap = {
      train: detailKereta,
      train_detail: dataDetailTrainTransit,
      uuid: uuids,
    };

    const uuidTransit = uuidv4();
    localStorage.setItem(
      `data:k-train-transit/${uuidTransit}`,
      JSON.stringify(dataLengkap)
    );

    navigate("/train/booking/transit/" + uuidTransit);
  };

  useEffect(() => {
    handlerSearch();
  }, []);

  const [filteredDataTransit, setfilteredDataTransit] = useState({});

  const filterDataTransit = (
    data,
    gradeFilter,
    valHargaRange,
    selectedTime,
    HargaTerendahTinggi
  ) => {
    const filteredData = {};
    const gradeMapping = ["K", "E", "B"]; // Mapping untuk grade
    const activeGrades = gradeMapping.filter((_, index) => gradeFilter[index]);

    const isGradeFilterActive = gradeFilter.some((value) => value);
    const isPriceFilterActive =
      valHargaRange[0] > 0 || valHargaRange[1] < 10000000;

    if (data && Object.keys(data).length > 0) {
      Object.keys(data).forEach((key) => {
        const trains = data[key];

        const filteredTrains = trains.filter((trainPair) => {
          let isGradeMatch = true; // Default true jika tidak ada filter grade
          let isPriceMatch = true; // Default true jika tidak ada filter harga
          let isWaktuMatch = true; // Default true jika tidak ada filter harga

          if (isGradeFilterActive) {
            isGradeMatch = trainPair[0].seats.some((seat) =>
              activeGrades.includes(seat.grade)
            );
          }

          if (isPriceFilterActive) {
            const totalPrice = trainPair.reduce((acc, train) => {
              return (
                acc +
                train.seats.reduce(
                  (acc, seat) => acc + parseInt(seat.priceAdult),
                  0
                )
              );
            }, 0);

            isPriceMatch =
              totalPrice >= valHargaRange[0] && totalPrice <= valHargaRange[1];
          }

          if (isWaktuMatch) {
            if (selectedTime && selectedTime.length > 0) {
              const departureTime = moment(trainPair[0].departureTime, "HH:mm");
              isWaktuMatch = selectedTime.some((t) => {
                const [start, end] = t.split("-");
                return departureTime.isBetween(
                  moment(start, "HH:mm"),
                  moment(end, "HH:mm"),
                  undefined,
                  "[]"
                ); // '[]' inklusif kedua batas
              });
            }
            //
          }

          // Return true jika kedua kondisi (atau salah satu, tergantung filter yang aktif) terpenuhi
          return isGradeMatch && isPriceMatch && isWaktuMatch;
        });

        if (HargaTerendahTinggi !== undefined && filteredTrains.length > 0) {
          // Fungsi untuk menghitung total priceAdult dari sebuah sub-array
          const calculateTotalPrice = (trainArray) => {
            return trainArray.reduce((total, train) => {
              return (
                total +
                train.seats.reduce(
                  (seatTotal, seat) => seatTotal + parseInt(seat.priceAdult),
                  0
                )
              );
            }, 0);
          };

          if (HargaTerendahTinggi === 2) {
            filteredTrains.sort((a, b) => {
              const totalPriceA = calculateTotalPrice(a);
              const totalPriceB = calculateTotalPrice(b);
              return totalPriceB - totalPriceA; // Balikkan kondisi untuk mengurutkan dari tertinggi ke terendah
            });
          } else {
            filteredTrains.sort((a, b) => {
              const totalPriceA = calculateTotalPrice(a);
              const totalPriceB = calculateTotalPrice(b);
              return totalPriceA - totalPriceB; // Balikkan kondisi untuk mengurutkan dari tertinggi ke terendah
            });
          }
        }

        if (filteredTrains.length > 0) {
          filteredData[key] = filteredTrains;
        }
      });
    }

    setfilteredDataTransit(filteredData);
  };

  useEffect(() => {
    filterDataTransit(
      dataSearchTransit,
      gradeFilter,
      valHargaRange,
      selectedTime,
      HargaTerendahTinggi
    );
  }, [
    dataSearchTransit,
    gradeFilter,
    valHargaRange,
    selectedTime,
    HargaTerendahTinggi,
  ]);

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
    })
    .sort((a, b) => {
      if (HargaTerendahTinggi == 1) {
        const priceA = Math.min(...a.seats.map((seat) => seat.priceAdult));
        const priceB = Math.min(...b.seats.map((seat) => seat.priceAdult));
        return priceA - priceB;
      }
    })
    .sort((a, b) => {
      if (HargaTerendahTinggi == 2) {
        const priceA = Math.max(...a.seats.map((seat) => seat.priceAdult));
        const priceB = Math.max(...b.seats.map((seat) => seat.priceAdult));
        return priceB - priceA; // Reverse the order to sort by highest price
      }
    })
    .sort((a, b) => {
      const availableSeatsA = a.seats.filter(
        (seat) => seat.availability > 0
      ).length;
      const availableSeatsB = b.seats.filter(
        (seat) => seat.availability > 0
      ).length;

      return availableSeatsB - availableSeatsA;
    });

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
          max={10000000}
        />
      </div>
    </Popover>
  );

  const KelasPopoOver = (
    <Popover className="text-black" title="Filter Harga">
      <div className="block px-2 text-xs">
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
            label={<span style={{ fontSize: "12px" }}>Ekonomi</span>}
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
            label={<span style={{ fontSize: "12px" }}>Eksekutif</span>}
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
            label={<span style={{ fontSize: "12px" }}>Bisnis</span>}
          />
        </FormGroup>
      </div>
    </Popover>
  );

  const SortingPopoOver = (
    <Popover className="text-black" title="Urutkan Dengan">
      <div className="">
        <Box sx={{ width: 150 }}>
          <Radio.Group
            className="mt-2"
            onChange={(e) => setHargaTerendahTinggi(e.target.value)}
            value={HargaTerendahTinggi}
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

  const handleIsTransit = async (e) => {
    try {
      setLoadingTransit(true);
      setLoading(true);
      setIsTransit(e.target.value);

      if (Object.keys(dataSearchTransit).length !== 0) {
        setTimeout(() => {
          setLoadingTransit(false);
          setLoading(false);
        }, 1000);
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/travel/train/search`,
          {
            productCode: "WKAIH",
            token: token,
            origin: origin,
            destination: destination,
            date: date,
            connection_train: true,
          }
        );

        if (response.data.rc.length < 1) {
          setLoadingTransit(false);
          setLoading(false);

          if (response.data.rc == "10") {
            setmessageErrorTransit(
              "Pencarian melebihi batas limit dan user dimohon menunggu 5 menit untuk melakukan pencarian ulang."
            );
          } else {
            setmessageErrorTransit(
              "Maaf, sepertinya pada rute ini masih belum dibuka kembali."
            );
          }

          setErrorTransit(true);
        } else if (
          response.data.rc !== "00" ||
          response.data.rc === undefined
        ) {
          setLoadingTransit(false);
          setLoading(false);

          if (response.data.rc == "10") {
            setmessageErrorTransit(
              "Pencarian melebihi batas limit dan user dimohon menunggu 5 menit untuk melakukan pencarian ulang."
            );
          } else {
            setmessageErrorTransit(
              "Maaf, sepertinya pada rute ini masih belum dibuka kembali."
            );
          }
          setErrorTransit(true);
        } else if (response.data === undefined) {
          setLoadingTransit(false);
          setLoading(false);

          if (response.data.rc == "10") {
            setmessageErrorTransit(
              "Pencarian melebihi batas limit dan user dimohon menunggu 5 menit untuk melakukan pencarian ulang."
            );
          } else {
            setmessageErrorTransit(
              "Maaf, sepertinya pada rute ini masih belum dibuka kembali."
            );
          }

          setErrorTransit(true);
        } else {
          setDataSearchTransit(response.data.data);
          setuuid(response.data.uuid);
          setLoadingTransit(false);
          setLoading(false);
          setErrorTransit(false);
        }
      }
    } catch (error) {
      setmessageErrorTransit("Maaf, terjadi kesalahan pada server.");
      setErrorTransit(false);
      setLoading(false);
      setLoadingTransit(false);
    }
  };

  return (
    <>
      {contextHolder}

      {err === true ? (
        <>
          <Page500 />
        </>
      ) : errPage === true ? (
        <>
          <Page400 message="Maaf, Terjadi Kesalahan pada server." />
        </>
      ) : (
        <>
          <div className="hidden xl:block judul-search  text-black">
            PILIH JADWAL
          </div>
          <div className="mt-4 xl:mt-8">
            <div className="block lg:flex justify-between">
              <div className="hidden xl:flex items-center space-x-3 xl:space-x-4 text-center xl:text-left">
                <small className="text-xs font-medium  text-black">
                  {stasiunBerangkat}, {kotaBerangkat}
                </small>
                <div className="bg-blue-500 p-1 rounded-full">
                  <IoArrowForwardOutline
                    className=" text-xs text-white"
                    size={16}
                  />
                </div>
                <small className="text-xs font-medium  text-black">
                  {stasiunTujuan}, {kotaTujuan}
                </small>
                <div className="hidden xl:block font-normal text-black">|</div>
                <small className="hidden xl:block text-xs font-medium  text-black">
                  {tanggal_keberangkatan_kereta}
                </small>
                <div className="hidden xl:block font-normal text-black">|</div>
                <small className="hidden xl:block text-xs font-medium  text-black">
                  {parseInt(adult) + parseInt(infant)} Penumpang
                </small>
              </div>
              <div className="hidden mt-4 xl:mt-0 xl:flex space-x-4 xl:mr-0 justify-center xl:justify-end">
                <Link to="/" className="hidden xl:flex space-x-2 items-center">
                  <IoArrowBackOutline className="text-black" size={16} />
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

            {/* desktop filter */}
            <div className="hidden xl:flex justify-between mt-0 xl:mt-6">
              <div className="relative flex items-center space-x-2 text-black text-xs font-medium ">
                <Whisper
                  placement="top"
                  trigger="active"
                  controlId="control-id-active"
                  speaker={hargaPopoOver}
                  placement="bottomStart"
                >
                  <button className="text-black block border rounded-full p-2 px-4 xl:px-4 focus:ring-1 focus:ring-gray-300 font-medium ">
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
                  <button className="text-black rounded-full block border p-2 px-4 xl:px-4 focus:ring-1 focus:ring-gray-300 font-medium ">
                    WAKTU
                  </button>
                </Whisper>
                <Whisper
                  placement="top"
                  trigger="active"
                  controlId="control-id-active"
                  speaker={KelasPopoOver}
                  placement="bottomStart"
                >
                  <button className="text-black rounded-full block border p-2 px-4 xl:px-4 focus:ring-1 focus:ring-gray-300">
                    KELAS
                  </button>
                </Whisper>
                {/* <Radio.Group
                  className="hidden xl:block"
                  onChange={handleIsTransit}
                  value={isTransit}
                >
                  <Radio className="font-normal" value={1}>Langsung</Radio>
                  <Radio className="font-normal" value={2}>Transit</Radio>
                </Radio.Group> */}
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
                    speaker={SortingPopoOver}
                    placement="bottomEnd"
                  >
                    <div>
                      <MdSort
                        className="text-blue-500 xl:text-black"
                        size={28}
                      />
                    </div>
                  </Whisper>
                </div>
              </div>
            </div>
            {ubahPencarian ? (
              <div className="mt-8">
                <KAISearch />
              </div>
            ) : null}
          </div>
          {/* mobile filter */}
          <div className="w-full flex xl:hidden justify-center">
            <FilterMobileKereta
              waktuFilter={waktuFilter}
              handleWaktuFilterChange={handleWaktuFilterChange}
              valHargaRange={valHargaRange}
              hargraRangeChange={hargraRangeChange}
              HargaTerendahTinggi={HargaTerendahTinggi}
              setHargaTerendahTinggi={setHargaTerendahTinggi}
            />
          </div>
          {/* <div className="mt-4 flex justify-center xl:hidden">
            <Radio.Group
              className=""
              onChange={handleIsTransit}
              value={isTransit}
            >
              <Radio value={1}>Langsung</Radio>
              <Radio value={2}>Transit</Radio>
            </Radio.Group>
          </div> */}

          {/* for non transit. */}
          {isTransit === 1 && (
            <>
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
                  <div className="row mb-4 xl:mb-24 w-full p-2 -mt-10 xl:mt-0">
                    {filteredData.map(
                      (
                        e //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                      ) => (
                        <div
                          class={`mt-4 xl:mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                            e.seats[0].availability > 0 &&
                            parseInt(adult) + parseInt(infant) <
                              e.seats[0].availability
                              ? "bg-white"
                              : "bg-white xl:bg-gray-50"
                          } border-b xl:border xl:border-gray-200 xl:rounded-lg xl:shadow-sm xl:hover:border-gray-300 xl:transition-transform xl:hover:scale-105`}
                        >
                          {/* desktop cari */}

                          <div className="hidden xl:block w-full text-black ">
                            <div className="px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                              <div className="col-span-1 xl:col-span-2">
                                <h1 className="text-sm font-medium ">
                                  {e?.trainName?.charAt(0) +
                                    e?.trainName?.slice(1)?.toLowerCase()}
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
                                  <h1 className="mt-4 xl:mt-0 text-sm font-medium ">
                                    {e.departureTime}
                                  </h1>
                                  <small>
                                    {kotaBerangkat} ({origin})
                                  </small>
                                </div>
                                <HiOutlineArrowNarrowRight size={24} />
                              </div>
                              <div>
                                <h1 className="text-sm font-medium ">
                                  {e.arrivalTime}
                                </h1>
                                <small>
                                  {kotaTujuan} ({destination})
                                </small>
                              </div>
                              <div>
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium ">
                                  {e.duration}
                                </h1>
                                <small>Langsung</small>
                              </div>
                              <div className="">
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium  text-black">
                                  Rp.{toRupiah(e.seats[0].priceAdult)}
                                </h1>
                                {e.seats[0].availability > 0 &&
                                parseInt(adult) + parseInt(infant) <
                                  e.seats[0].availability ? (
                                  <div>
                                    {e.seats[0].availability > 50 ? (
                                      <small>Available</small>
                                    ) : (
                                      <small className="text-red-500">
                                        {e.seats[0].availability} set(s) left
                                      </small>
                                    )}
                                  </div>
                                ) : null}
                                <small className="text-red-500">
                                  {e.seats[0].availability > 0 &&
                                  parseInt(adult) + parseInt(infant) <
                                    e.seats[0].availability
                                    ? ""
                                    : "Tiket Habis"}
                                </small>
                              </div>
                              <div>
                                {e.seats[0].availability > 0 &&
                                parseInt(adult) + parseInt(infant) <
                                  e.seats[0].availability ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      bookingHandlerDetail(e.trainNumber)
                                    }
                                    class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50  rounded-lg text-sm px-10 xl:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                                  >
                                    <div className="text-white ">PILIH</div>
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
                              onClick={() =>
                                e.seats[0].availability > 0 &&
                                parseInt(adult) + parseInt(infant) <
                                  e.seats[0].availability
                                  ? bookingHandlerDetail(e.trainNumber)
                                  : " "
                              }
                              className={`cursor-pointer block xl:hidden w-full
                                ${
                                  e.seats[0].availability > 0 &&
                                  parseInt(adult) + parseInt(infant) <
                                    e.seats[0].availability
                                    ? "text-black"
                                    : "text-slate-400 "
                                }
                              `}
                            >
                              <div className="bg-white">
                                <div className="flex justify-between">
                                  <div className="">
                                    <h1
                                      className={`${
                                        e.seats[0].availability > 0 &&
                                        parseInt(adult) + parseInt(infant) <
                                          e.seats[0].availability
                                          ? "text-black"
                                          : "text-gray-400 "
                                      } font-bold text-sm`}
                                    >
                                      {e?.trainName?.charAt(0) +
                                        e?.trainName?.slice(1)?.toLowerCase()}
                                    </h1>
                                    <p className="text-gray-500 text-xs">
                                      <small>
                                        {e.seats[0].grade === "E"
                                          ? "Eksekutif"
                                          : e.seats[0].grade === "B"
                                          ? "Bisnis"
                                          : "Ekonomi"}{" "}
                                        Class ({e.seats[0].class})
                                      </small>
                                    </p>
                                  </div>
                                  <div className="text-right flex space-x-2 items-center">
                                    {e.seats[0].availability > 0 &&
                                    parseInt(adult) + parseInt(infant) <
                                      e.seats[0].availability ? (
                                      <div>
                                        {e.seats[0].availability > 50 ? (
                                          <small className="text-gray-500">
                                            Available
                                          </small>
                                        ) : (
                                          <small className="text-gray-500">
                                            {e.seats[0].availability} set(s)
                                            left
                                          </small>
                                        )}
                                      </div>
                                    ) : null}
                                    <small className="text-red-500">
                                      {e.seats[0].availability > 0 &&
                                      parseInt(adult) + parseInt(infant) <
                                        e.seats[0].availability
                                        ? ""
                                        : "Tiket Habis"}
                                    </small>
                                    <MdArrowForwardIos
                                      size={20}
                                      className="text-black"
                                    />
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
                                        {e.departureTime}
                                        <span className="font-bold"></span>
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {e.duration}
                                      </p>
                                    </div>
                                    <div className="mt-1">
                                      <p className="text-sm font-medium">
                                        {e.arrivalTime}
                                        <span className="font-bold"></span>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-5 flex justify-between items-center">
                                  <p className="text-sm font-semibold">
                                    {" "}
                                    Rp. {toRupiah(e.seats[0].priceAdult)}{" "}
                                    <span className="text-sm text-gray-400">
                                      /org
                                    </span>
                                  </p>
                                  <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                    Langsung
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
                            {messageError}
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

          {/* for transit. */}
          {isTransit === 2 && (
            <>
              {isLoadingTransit ? (
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
              ) : notFoundTransit !== true &&
                filteredDataTransit.length !== 0 &&
                Object.keys(filteredDataTransit).length !== 0 ? (
                <div className="row mb-24 w-full p-2">
                  {Object.keys(filteredDataTransit).map((category) => (
                    <div key={category}>
                      {filteredDataTransit[category].map(
                        (trainArray, index) => (
                          <div key={index}>
                            <div key={index}>
                              <div>
                                <div
                                  className={`mt-4 xl:mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                                    trainArray[0].seats[0].availability > 0 &&
                                    parseInt(adult) + parseInt(infant) <
                                      trainArray[0].seats[0].availability
                                      ? "bg-white"
                                      : "bg-gray-200"
                                  } border border-gray-200 rounded-lg shadow-sm hover:border transition-transform transform hover:scale-105`}
                                >
                                  <div className="hidden xl:block w-full text-black ">
                                    <div className="px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                      <div className="col-span-1 xl:col-span-2">
                                        <h1 className="text-sm font-medium ">
                                          {trainArray.map((data, h) => (
                                            <span key={h}>
                                              {" "}
                                              {/* Added key for better performance and to avoid warning */}
                                              {data.trainName}{" "}
                                              {h < trainArray.length - 1
                                                ? " + "
                                                : ""}
                                            </span>
                                          ))}
                                        </h1>
                                        <small>
                                          {trainArray.map((data, h) => (
                                            <span key={h}>
                                              {" "}
                                              {/* Added key for better performance and to avoid warning */}
                                              {data.seats[0].grade === "E"
                                                ? "Eksekutif"
                                                : data.seats[0].grade === "B"
                                                ? "Bisnis"
                                                : "Ekonomi"}{" "}
                                              Class ({data.seats[0].class})
                                              {h < trainArray.length - 1
                                                ? " + "
                                                : ""}
                                            </span>
                                          ))}
                                        </small>
                                      </div>
                                      <div className="flex">
                                        <div className="">
                                          <h1 className="mt-4 xl:mt-0 text-sm font-medium ">
                                            {trainArray[0].departureTime}
                                          </h1>
                                          <small>
                                            {kotaBerangkat} ({origin})
                                          </small>
                                        </div>
                                        <HiOutlineArrowNarrowRight size={24} />
                                      </div>
                                      <div>
                                        <h1 className="text-sm font-medium ">
                                          {
                                            trainArray[trainArray.length - 1]
                                              .arrivalTime
                                          }
                                        </h1>
                                        <small>
                                          {kotaTujuan} ({destination})
                                        </small>
                                        {/*  */}
                                      </div>
                                      <div>
                                        <h1 className="mt-4 xl:mt-0 text-sm font-medium ">
                                          {calculateTotalDurationTransit(
                                            trainArray
                                          )}
                                        </h1>
                                        <small>
                                          Transit (
                                          {(() => {
                                            const filteredStations =
                                              listStaton.filter(
                                                (e) => e.id_stasiun === category
                                              );
                                            return filteredStations.length > 0
                                              ? filteredStations[0].nama_stasiun
                                              : "No station found";
                                          })()}
                                          )
                                        </small>
                                      </div>
                                      <div className="">
                                        <h1 className="mt-4 xl:mt-0 text-sm font-medium  text-blue-500">
                                          {toRupiah(
                                            trainArray.reduce(
                                              (total, item) =>
                                                total +
                                                parseInt(
                                                  item.seats[0].priceAdult,
                                                  10
                                                ),
                                              0
                                            )
                                          )}
                                        </h1>
                                        <small className="text-red-500">
                                          {trainArray[0].seats[0].availability}{" "}
                                          set(s) left
                                        </small>
                                        <small className="text-red-500">
                                          {trainArray[0].seats[0].availability >
                                            0 &&
                                          parseInt(adult) + parseInt(infant) <
                                            trainArray[0].seats[0].availability
                                            ? ""
                                            : ". (Tiket Habis)"}
                                        </small>
                                      </div>
                                      <div>
                                        {trainArray[0].seats[0].availability >
                                          0 &&
                                        parseInt(adult) + parseInt(infant) <
                                          trainArray[0].seats[0]
                                            .availability ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              bookingHandlerDetailTransit(
                                                trainArray,
                                                category
                                              )
                                            }
                                            class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50  rounded-lg text-sm px-10 xl:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                                          >
                                            <div className="text-white ">
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
                                      onClick={() =>
                                        trainArray[0].seats[0].availability >
                                          0 &&
                                        parseInt(adult) + parseInt(infant) <
                                          trainArray[0].seats[0].availability
                                          ? bookingHandlerDetailTransit(
                                              trainArray,
                                              category
                                            )
                                          : " "
                                      }
                                      className="cursor-pointer block xl:hidden w-full text-black"
                                    >
                                      <div className="py-4 px-4 grid grid-cols-1 xl:grid-cols-7">
                                        <div className="flex justify-between">
                                          <div className="w-full">
                                            <h1 className="text-xs font-medium ">
                                              {trainArray.map((data, h) => (
                                                <span key={h}>
                                                  {" "}
                                                  {/* Added key for better performance and to avoid warning */}
                                                  {data.trainName}{" "}
                                                  {h < trainArray.length - 1
                                                    ? " + "
                                                    : ""}
                                                </span>
                                              ))}
                                            </h1>
                                            <small>
                                              {trainArray.map((data, h) => (
                                                <span key={h}>
                                                  {" "}
                                                  {/* Added key for better performance and to avoid warning */}
                                                  {data.seats[0].grade === "E"
                                                    ? "Eks"
                                                    : data.seats[0].grade ===
                                                      "B"
                                                    ? "Bis"
                                                    : "Eko"}{" "}
                                                  Class ({data.seats[0].class})
                                                  {h < trainArray.length - 1
                                                    ? " + "
                                                    : ""}
                                                </span>
                                              ))}
                                            </small>
                                          </div>
                                          <div>
                                            <h1 className="text-xs font-medium  text-black">
                                              Rp.{" "}
                                              {toRupiah(
                                                trainArray.reduce(
                                                  (total, item) =>
                                                    total +
                                                    parseInt(
                                                      item.seats[0].priceAdult,
                                                      10
                                                    ),
                                                  0
                                                )
                                              )}
                                            </h1>
                                            <small className="text-red-500">
                                              {
                                                trainArray[0].seats[0]
                                                  .availability
                                              }{" "}
                                              set(s)
                                            </small>
                                            <small className="text-red-500">
                                              {trainArray[0].seats[0]
                                                .availability > 0 &&
                                              parseInt(adult) +
                                                parseInt(infant) <
                                                trainArray[0].seats[0]
                                                  .availability
                                                ? ""
                                                : ". (Tiket Habis)"}
                                            </small>
                                          </div>
                                          <div></div>
                                        </div>
                                        <div className="flex justify-start mt-4">
                                          <div className="flex items-center space-x-8">
                                            {/* Departure Time and Origin */}
                                            <div>
                                              <h1 className="text-sm xl:text-base font-medium ">
                                                {trainArray[0].departureTime}
                                              </h1>
                                              <small className="text-black">
                                                {origin}
                                              </small>
                                            </div>

                                            {/* Transit Duration */}
                                            <div className="flex-1 mt-2 w-full">
                                              <div className="border-t-2 border-gray-300 my-4 -mx-4"></div>
                                              <div className="text-center">
                                                <div className="text-xs text-black">
                                                  {calculateTotalDurationTransit(
                                                    trainArray
                                                  )}
                                                </div>
                                                <small className="text-black">
                                                  <small>
                                                    Transit (
                                                    {(() => {
                                                      const filteredStations =
                                                        listStaton.filter(
                                                          (e) =>
                                                            e.id_stasiun ===
                                                            category
                                                        );
                                                      return filteredStations.length >
                                                        0
                                                        ? filteredStations[0]
                                                            .nama_stasiun
                                                        : "No station found";
                                                    })()}
                                                    )
                                                  </small>
                                                </small>
                                              </div>
                                            </div>

                                            {/* Arrival Time and Destination */}
                                            <div>
                                              <h1 className="text-sm xl:text-base font-medium ">
                                                {
                                                  trainArray[
                                                    trainArray.length - 1
                                                  ].arrivalTime
                                                }
                                              </h1>
                                              <small className="text-black">
                                                {destination}
                                              </small>
                                            </div>
                                          </div>
                                        </div>
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
                  ))}
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
                          {messageErrorTransit.length > 0
                            ? messageErrorTransit
                            : "Maaf, sepertinya pada rute ini masih belum dibuka kembali."}
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
            </>
          )}
        </>
      )}
    </>
  );
}
