import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheckCircle, AiOutlineClockCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import {
  MdHorizontalRule,
  MdOutlineAirlineSeatReclineExtra,
} from "react-icons/md";
import { IoIosArrowDropright, IoMdCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./SeatMap.css";
import { Modal, Placeholder, Button } from "rsuite";
import { Alert, Select, notification } from "antd";
import { Button as ButtonAnt } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal, remainingTime } from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import PageExpired from "../components/Expired";
import KonfirmasiLoading from "../components/trainskeleton/konfirmasi";
import {Typography } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { callbackFetchData } from "../../features/callBackSlice";
import { setDataBookKereta, setisOkBalanceKereta } from "../../features/createSlice";
import { Box } from "@mui/material";
import DetailPassengersDrawer from "./components/DetailPassengersDrawer";

const SeatMap = ({ seats, changeState, setChangeSet, clickSeatsData, selectedCount, setSelectedCount, setgerbongsamawajib, gerbongsamawajib,  selectedCheckboxes, setSelectedCheckboxes}) => {
  
const groupColumnCounts = {};
const rowCount = Math.max(...seats.map((seat) => seat.row));

seats.forEach((seat) => {
  const groupKey = `${seat.groupColumn}-${seat.row}`;
  if (!groupColumnCounts[groupKey]) {
    groupColumnCounts[groupKey] = 0;
  }
  if (seat.isFilled === 0) {
    groupColumnCounts[groupKey]++;
  }
});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function limitFunction() {
    var x = 0;
    changeState[0].map((e, i) => {
      if (e.type == "adult") {
        x = x + 1;
      } else {
        x = x + 0;
      }
    });
    return x;
  }

  const limit = limitFunction();
  const handleOnChange = (e, row, cols, seats) => {

    if (e.target.checked) {
      
      if (selectedCount < limit) {
        setSelectedCount(selectedCount + 1);
        setgerbongsamawajib(gerbongsamawajib + 1);
        
        const handlersetSelectedCheckboxes = (prevSelectedCheckboxes) => {
          if (
            prevSelectedCheckboxes.includes(
              `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
            )
          ) {
            return prevSelectedCheckboxes.filter(
              (checkbox) =>
                checkbox !== `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
            );
          } else {
            return [
              ...prevSelectedCheckboxes,
              `${row}-${cols}-${parseInt(clickSeatsData) + 1}`,
            ];
          }
        }

          setSelectedCheckboxes(handlersetSelectedCheckboxes(selectedCheckboxes));

          const changeStateData = changeState[0];
          const tolong = handlersetSelectedCheckboxes(selectedCheckboxes);

          const splittingSeat = tolong[selectedCount].split("-");
          changeStateData[selectedCount].row = parseInt(splittingSeat[0]);
          changeStateData[selectedCount].type = "adult";
          changeStateData[selectedCount].column = splittingSeat[1];
          changeStateData[selectedCount].wagonNumber = parseInt(splittingSeat[2]);

          setChangeSet([changeStateData]);

        }
    else {
          alert('Melebihi jumlah penumpang.')
          e.target.checked = false;
        }
      } else {
        setSelectedCount(selectedCount - 1);
        setgerbongsamawajib(gerbongsamawajib - 1);

        const updateSelectedCheckboxes = (prevSelectedCheckboxes, row, cols, clickSeatsData) => {
          if (
            prevSelectedCheckboxes.includes(
              `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
            )
          ) {
            return prevSelectedCheckboxes.filter(
              (checkbox) =>
                checkbox !== `${row}-${cols}-${parseInt(clickSeatsData) + 1}`
            );
          } else {
            return [
              ...prevSelectedCheckboxes,
              `${row}-${cols}-${parseInt(clickSeatsData) + 1}`,
            ];
          }
        };
        
        const tolong = updateSelectedCheckboxes(
          selectedCheckboxes,
          row,
          cols,
          clickSeatsData
        );
        
        setSelectedCheckboxes(tolong);

        const changeStateData = changeState[0];

        const splittingSeat = tolong[selectedCount].split("-");
        changeStateData[selectedCount].row = parseInt(splittingSeat[0]);
        changeStateData[selectedCount].type = "adult";
        changeStateData[selectedCount].column = splittingSeat[1];
        changeStateData[selectedCount].wagonNumber = parseInt(splittingSeat[2]);

        setChangeSet([changeStateData]);
        

      }
  };


  // useEffect(() => {
  //   let changeStateData = changeState[0];
  //   if (limit === selectedCount) {
  //     for (let i = 0; i < limit; i++) {
  //       if (
  //         selectedCheckboxes[i] !== null &&
  //         selectedCheckboxes[i] !== undefined
  //       ) {
  //         let splittingSeat = selectedCheckboxes[i].split("-");

  //         changeStateData[i].row = parseInt(splittingSeat[0]);
  //         changeStateData[i].type = "adult";
  //         changeStateData[i].column = splittingSeat[1];
  //         changeStateData[i].wagonNumber = parseInt(splittingSeat[2]);
  //       } else {
  //         setSelectedCount(0);
  //         setgerbongsamawajib(gerbongsamawajib - 1);
  //         alert("Mohon maaf, pilih gerbong yang sama !");
  //       } 
  //     }

  //     setChangeSet([changeStateData]);
  //   }

  // }, [limit, selectedCount, selectedCheckboxes]);

  return (
    <div className="flex space-x-0 xl:space-x-2 justify-center">
      <div className="">
      {Array.from({ length: rowCount }, (_, index) => (
        <div className="block py-2 pl-0 xl:pl-4">
          <div class="select-none w-4 h-10 font-medium  rounded-lg">
          <div key={index} class="py-2 text-center text-black">
            {index + 1}.
          </div>
        </div>
        </div>
        ))}
      </div>
      <div className="grid grid-rows-10 grid-cols-4 xl:grid-cols-5">
        {seats.map((seat, i) => {
          const { row, column, class: seatClass, isFilled } = seat;
          return (
            <>
              {seats.length <= 80 && (
                <div
                  key={`${row}-${column}`}
                  className={`
                              seat ${column}80
                              ${row > 2 ? "" : ""}
                            `}
                >
                  {isFilled === 0 ? (
                    <label
                      class={`block py-2 pl-2 items-center cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleOnChange(e, seat.row, seat.column, seat)
                        }
                        class="sr-only peer"
                      />
                      <div class="select-none  w-10 text-blue-700 h-10 bg-blue-700 peer-checked:text-black font-medium  peer-checked:border peer-checked:bg-white rounded-lg">
                        <div class="py-2 text-center">
                          {seat.row}
                          {seat.column}
                        </div>
                      </div>
                    </label>
                  ) : (
                    <label
                      class={`select-none block py-2 pl-2 items-center cursor-pointer`}
                    >
                      <div class="w-10 text-white-500 h-10 bg-gray-500 peer-focus:outline-none rounded-lg">
                        <div class="flex justify-center py-2.5">X</div>
                      </div>
                    </label>
                  )}
                </div>
              )}

              {seats.length > 80 && (
                <div
                  key={`${row}-${column}`}
                  className={`
                              seat ${column}106
                              ${row > 2 ? "" : ""}
                            `}
                >
                  {isFilled === 0 ? (
                    <label
                      class={`block py-2 pl-2  items-center cursor-pointer`}
                    >
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleOnChange(e, seat.row, seat.column)
                        }
                        class="sr-only peer"
                      />
                      <div class="select-none  w-10 text-blue-700 h-10 bg-blue-700 peer-checked:text-black font-medium  peer-checked:border peer-checked:bg-white rounded-lg">
                        <div class="py-2 text-center">
                          {seat.row}
                          {seat.column}
                        </div>
                      </div>
                    </label>
                  ) : (
                    <label
                      class={`select-none block py-2 pl-2 items-center cursor-pointer`}
                    >
                      <div class="w-10 text-white-500 h-10 bg-gray-500 peer-focus:outline-none rounded-lg">
                        <div class="text-center py-2.5 px-3.5">X</div>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default function Konfirmasi() {

  const [api, contextHolder] = notification.useNotification();
  const { Paragraph } = Typography;
  const [selectedCount, setSelectedCount] = useState(0);
  const dispatch = useDispatch();
  const bookKereta = useSelector((state) => state.bookkereta.bookDataKereta);
  const dataSearch = useSelector((state) => state.bookkereta.searchDataKereta);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const failedNotification = (rd) => {
    api["error"]({
      message: "Error!",
      description:
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
        duration: 7,
    });
  };

  const successNotification = (rd) => {
    api["success"]({
      message: "Success!",
      description: "Successfully, pindah kursi anda sudah berhasil!.",
      duration: 7,
    });
  };

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [dataBookingTrain, setdataBookingTrain] = useState(null);
  const [dataDetailTrain, setdataDetailTrain] = useState(null);

  const [hasilBooking, setHasilBooking] = useState(null);
  const [hasilBookingTriggerResetGagal, sethasilBookingTriggerResetGagal] = useState(null);

  const [passengers, setPassengers] = useState(null);
  const [tanggal_keberangkatan_kereta, settanggal_keberangkatan_kereta] =
    useState(null);
  const [classTrain, setClassTrain] = useState(null);
  const [TotalAdult, setTotalAdult] = useState(0);
  //   const [TotalChild, setTotalChild] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPindahKursi, setisLoadingPindahKursi] = useState(false);

  const [clickSeats, setClickSeats] = useState(0);
  const [dataSeats, setDataSeats] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const [changeState, setChangeSet] = useState({}); //change seats.
  const [changeStateKetikaGagalTidakUpdate, setchangeStateKetikaGagalTidakUpdate] = useState({}); //change seats.
  const [gerbongsamawajib, setgerbongsamawajib] = useState(0);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {setOpen(false);setSelectedCount(0); setgerbongsamawajib(0)};
  
  const [expiredBookTime, setExpiredBookTime] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(null);
  const toggleDrawer = (type) => {
    setOpenDrawer(type);
  };

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    Promise.all([getDataTrain(), getHasilBooking()])
      .then(([ResponsegetDataTrain, ResponsegetHasilBooking]) => {
        if (ResponsegetDataTrain) {
          setdataDetailTrain(ResponsegetDataTrain.train_detail);
          setdataBookingTrain(ResponsegetDataTrain.train);

          const dataBookingTrain = ResponsegetDataTrain.train;
          const classTrain =
            dataBookingTrain[0].seats[0].grade === "E"
              ? "Eksekutif"
              : dataBookingTrain[0].seats[0].grade === "B"
              ? "Bisnis"
              : "Ekonomi";
          const tanggal_keberangkatan_kereta = parseTanggal(
            dataBookingTrain[0].departureDate
          );

          settanggal_keberangkatan_kereta(tanggal_keberangkatan_kereta);
          setClassTrain(classTrain);
        } else {
          setErrPage(true);
        }

        if (ResponsegetHasilBooking) {

          setHasilBooking(ResponsegetHasilBooking.hasil_book);
          setExpiredBookTime(ResponsegetHasilBooking.hasil_book.timeLimit || moment().add(1, 'hours'))
          
          //mengatasi ketika mencopy variable hasilBooking, state nya ikut update.
          sethasilBookingTriggerResetGagal(JSON.stringify(ResponsegetHasilBooking.hasil_book))

          setPassengers(ResponsegetHasilBooking.passengers);

          const passengers = ResponsegetHasilBooking.passengers;
          const hasilBooking = ResponsegetHasilBooking.hasil_book;
          const initialChanges = Array();

          hasilBooking.passengers.map((e, i) => {
            initialChanges.push({
              name: e,
              type:
                passengers.adults[i] !== null && passengers.adults[i]
                  ? "adult"
                  : "infant",
              class: hasilBooking.seats[i][0],
              wagonNumber: hasilBooking.seats[i][1],
              row: hasilBooking.seats[i][2],
              column: hasilBooking.seats[i][3],
              checkbox: false,
            });
          });

          setChangeSet([initialChanges]);
          //mengatasi ketika mencopy variable setChangeSet, state nya ikut update.
          setchangeStateKetikaGagalTidakUpdate(JSON.stringify([initialChanges]))
          setTotalAdult(passengers.adults.length);
          //   setTotalChild(passengers.children ? passengers.children.length : 0);
          setTotalInfant(passengers.infants.length);
        } else {
          setErrPage(true);
        }

        if (
          ResponsegetHasilBooking.hasil_book &&
          new Date(ResponsegetHasilBooking.hasil_book.timeLimit).getTime() < new Date().getTime()
        ) {

          setIsBookingExpired(true);

        } else {
          setIsBookingExpired(false);
        }

        setTimeout(() => {
          setIsLoadingPage(false);
        }, 1000);
      })
      .catch((error) => {
        setIsLoadingPage(false);
        setErrPage(true);
      });

    // Set booking expiration flag
    if (
      hasilBooking &&
      new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()
    ) {
      setIsBookingExpired(true);
    } else {
      setIsBookingExpired(false);
    }
  }, [token]);


  const [remainingBookTime, setremainingBookTime] = useState(remainingTime(expiredBookTime));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setremainingBookTime(remainingTime(expiredBookTime));

      if (
        hasilBooking &&
        new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()
      ) {
        
        setIsBookingExpired(true);

      } else {
        setIsBookingExpired(false);
      }

    }, 500);
  
    return () => clearInterval(intervalId);
  }, [expiredBookTime]);
  

  async function getDataTrain() {
    try {
      const response = dataSearch;
      return response;

    } catch (error) {
      return null;
    }
  }

  async function getHasilBooking() {
    try {
      const response = bookKereta;
      return response;
    } catch (error) {
      return null;
    }
  }

  async function handlerPilihKursi() {
    setDataSeats([]); //untuk reset data.
    gantigerbong(0) // untuk reset data pindah gerbong.
    setChangeSet(JSON.parse(changeStateKetikaGagalTidakUpdate));  // untuk reset data ketika sudah di pilih kursinya, tapi keluar lagi..
    
    setOpen(true);
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/get_seat_layout`,
      {
        productCode: "WKAI",
        origin: dataDetailTrain[0].berangkat_id_station,
        destination: dataDetailTrain[0].tujuan_id_station,
        date: dataBookingTrain[0].arrivalDate,
        trainNumber: dataBookingTrain[0].trainNumber,
        token: token,
      }
    );

    if (response.data.rc === "00") {
      if (response.data !== undefined && response.data !== 0) {
        setDataSeats(response.data);
      }
    }

    
  }

  const handlerKonfirmasi = async (e) => {

    setIsLoading(true);

      const idtrx = hasilBooking.transactionId;
      const allowPayment = hasilBooking.is_allowed_pay;

      //set booking data
      dispatch(setisOkBalanceKereta(allowPayment));

      //set data callback
      dispatch(callbackFetchData({ type: 'train', id_transaksi:idtrx  }));

      setIsLoading(false);
      navigate({
        pathname: `/train/bayar`,
      });
    
  };  


  const handlerPindahKursi = async (e) => {
    e.preventDefault();
  
    const changeStateFix = changeState; // Create a deep copy

    //validasi wagon number
    for(const train of changeState[0]){
        if(train.type !== 'infant'){
          if(changeStateFix[0][0]["wagonNumber"] !== train.wagonNumber){
            failedNotification('Gerbong harus sama.')
            setOpen(true);
            return null;
          }
        }
    }

    
    let wagonNumber = changeStateFix[0][0]["wagonNumber"];
    let className = changeStateFix[0][0]["class"];

    setisLoadingPindahKursi(true);
    setgerbongsamawajib(0);

    // changeStateFix[0].forEach((item) => {
    //   delete item.name;
    //   delete item.checkbox;
    //   delete item.class;
    //   delete item.wagonNumber;
    // });

    let gantiKursiFix = {
      productCode: "WKAI",
      bookingCode: hasilBooking.bookingCode,
      transactionId: hasilBooking.transactionId,
      wagonNumber: wagonNumber,
      wagonCode: className,
      seats: changeStateFix[0],
      token: token,
    };
  
    gantiKursiFix.seats = gantiKursiFix.seats.filter((seat) => seat.type !== "infant");
  
    // gantiKursiFix.seats.forEach((item) => {
    //   delete item.type;
    // });
  
    const hasilBookingDataCopyDeep = JSON.parse(JSON.stringify(hasilBooking));
    const hasilBookingData = {...hasilBookingDataCopyDeep};
    setSelectedCount(0);
  
    for (var i = 0; i < changeStateFix[0].length; i++) {
      if (gantiKursiFix.seats[i] !== undefined && gantiKursiFix.seats[i] !== null) {
        hasilBookingData.seats[i][1] = wagonNumber;
        hasilBookingData.seats[i][2] = gantiKursiFix.seats[i].row.toString();
        hasilBookingData.seats[i][3] = gantiKursiFix.seats[i].column;
      }
    }


    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/change_seat`,
      gantiKursiFix
    );

    const idtrx = response.data.transactionId;

    if (response.data.rc == "00") {
      
      hasilBookingData['transactionId'] = idtrx;

      const data = {
        passengers: passengers,
        hasil_book: hasilBookingData,
      }

      dispatch(setDataBookKereta(data));


      setisLoadingPindahKursi(false);
      successNotification();
      setHasilBooking(hasilBookingData);

      setchangeStateKetikaGagalTidakUpdate(JSON.stringify(changeState))

    } else if (response.data.rc === "55") {
      setChangeSet(JSON.parse(changeStateKetikaGagalTidakUpdate));
      setHasilBooking((prev) => prev);
      setisLoadingPindahKursi(false);
      failedNotification(response.data.rd);
    } else {
      setChangeSet(JSON.parse(changeStateKetikaGagalTidakUpdate));
      setHasilBooking((prev) => prev);
      setisLoadingPindahKursi(false);
      failedNotification(response.data.rd);
    }

    setOpen(false);
  };

  const [backdrop, setBackdrop] = React.useState('static');
  function gantigerbong(value){

    setSelectedCount(0); 
    setgerbongsamawajib(0); 
    setClickSeats(value); 
    setSelectedCheckboxes([]);

    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach((input) => {
      input.checked = false;
    });

  }

  return (
    <>
      {/* meessage bayar */}
      {contextHolder}

      {err === true ? (
        <>
          <Page500 />
        </>
      ) : errPage === true ? (
        <>
          <Page400 />
        </>
      ) : isBookingExpired === true ? (
        <>
          <PageExpired />
        </>
      ) : (
        <>
         {/* change seats */}
          <Modal size="md" backdrop={backdrop} keyboard={false} open={open} onClose={handleClose}>
            <Modal.Header>
              <Modal.Title>
                <div className="text-black font-medium  mt-2 mb-2">Pindah Kursi</div>
                <small>
                  tekan tombol warna biru untuk ganti kursi.
                </small>
                {/* <Alert
                  className="mt-4"
                  message="Notification!"
                  description={(<><div className="text-xs">Pilih kursi hanya dalam satu gerbong yang sama.</div></>)}
                  type="info"
                  showIcon
                  closable
                /> */}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>

              {dataSeats.data !== undefined ? (
                <>
                  <div className="flex flex-col w-full bg-white outline-none focus:outline-none">
                    <form>
                      {/*header*/}

                      {/*body*/}
                      <div className="relative flex-auto">
                        <div className="">
                          <div className="grid w-full grid-cols-1 xl:grid-cols-3">
                            {/* sidebar seats Kai */}
                            <div className="text-start">
                              {changeState[0].map((e, i) => (
                                <>
                                  {e.type === "adult" && (
                                    <div className="border m-2 rounded-md mt-2 text-xs font-medium ">
                                      <div className="flex space-x-4 items-center py-2 px-4 text-black">
                                        <div className="text-2xl font-medium ">
                                          {i + 1}
                                        </div>
                                        <div>
                                          
                                          <div className="font-medium mt-2">
                                            {e.name}
                                          </div>
                                          <div className="mt-2">
                                            {e.class === "EKO"
                                              ? "Ekonomi"
                                              : e.class === "EKS"
                                              ? "Eksekutif"
                                              : "Bisnis"}{" "}
                                            {e.wagonNumber}
                                          </div>
                                          <div>
                                            {e.row}
                                            {e.column}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              ))}
                              
                              <div className="mt-4 xl:mt-4 ml-2">
                                <div className="flex space-x-2 items-center mt-2 ">
                                  <label
                                    class={`select-none block py-1.5 items-center cursor-pointer`}
                                  >
                                    <div class="w-8 text-white-500 text-white h-8 bg-gray-500 rounded-lg">
                                      <div class="flex justify-center py-1.5">X</div>
                                    </div>
                                  </label>
                                  <div className="text-md text-black font-medium ">
                                    Seats not available.
                                  </div>
                                </div>
                                <div className="flex space-x-2 items-center">
                                  <label
                                    class={`select-none block py-1.5 items-center cursor-pointer`}
                                  >
                                    <div class="w-8 text-white-500 h-8 bg-blue-500 rounded-lg">
                                    </div>
                                  </label>
                                  <div className="text-md text-black font-medium ">
                                    Seats available.
                                  </div>
                                </div>
                                <div className="flex space-x-2 items-center mt-2">
                                    <Alert message="Only supported at the same gate." banner/>
                                </div>
                              </div>
                            </div>
                            {/* seats cols and rows kereta premium dan bisnis */}
                            <div className="col-span-2 w-full h-[540px]">
                              <div className="flex justify-center mb-8 mt-4">
                                <>
                                  <div className="w-full mx-0 xl:mx-8 text-center">
                                    <label
                                      for="underline_select"
                                      class="sr-only"
                                    >
                                      Underline select
                                    </label>
                                    <Select
                                        onChange={(value) => {gantigerbong(value)}}
                                        id="underline_select"
                                        style={{ width: '100%' }}
                                        defaultValue={0}
                                      >
                                        {dataSeats !== undefined && dataSeats !== null ? (
                                          dataSeats.data.map((data, i) => (
                                            <Select.Option key={i} value={i}>
                                              {data.wagonCode === "EKO" ? "Ekonomi" :
                                              data.wagonCode === "EKS" ? "Eksekutif" : "Bisnis"} {data.wagonNumber}
                                            </Select.Option>
                                          ))
                                        ) : (
                                          <Select.Option value="empty">Data kosong</Select.Option>
                                        )}
                                      </Select>
                                  </div>
                                </>
                              </div>
                              <div className=""></div>
                              {dataSeats !== undefined &&
                                dataSeats !== null && (
                                  <>
                                    <SeatMap
                                      changeState={changeState}
                                      gerbongsamawajib={gerbongsamawajib}
                                      setgerbongsamawajib={setgerbongsamawajib}
                                      selectedCount={selectedCount}
                                      setSelectedCount={setSelectedCount}
                                      setChangeSet={setChangeSet}
                                      clickSeatsData={clickSeats}
                                      seats={dataSeats.data[clickSeats].layout}
                                      selectedCheckboxes={selectedCheckboxes}
                                      setSelectedCheckboxes={setSelectedCheckboxes}
                                    />
                                  </>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <Placeholder.Paragraph />
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="flex space-x-4 pt-8 py-2 justify-end">
                <Button onClick={handlerPindahKursi} appearance="primary">
                  {isLoadingPindahKursi === true ? (
                    <div className="flex space-x-2 items-center">
                      <svg
                        aria-hidden="true"
                        class="mr-2 w-4 h-4 text-gray-200 animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <div class="">Loading...</div>
                    </div>
                  ) : (
                    <>Pindah Kursi</>
                  )}
                </Button>
                <Button onClick={handleClose} appearance="subtle">
                  Cancel
                </Button>
              </div>
            </Modal.Footer>
          </Modal>


          {/* header kai flow */}
          <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <IoMdCheckmarkCircle className="text-green-500" size={20} />
              <div className="hidden xl:flex text-green-500">
                  Detail pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="hidden xl:flex "
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <AiOutlineClockCircle size={20} className="" />
              <div className="hidden xl:flex font-medium ">
                Konfirmasi pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className=" hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <RxCrossCircled size={20} className="" />
              <div className="hidden xl:block ">
                Pembayaran tiket
              </div>
            </div>
          </div>

          {isLoadingPage === true ? (
            <>
              <KonfirmasiLoading
                TotalAdult={TotalAdult}
                TotalInfant={TotalInfant}
              />
            </>
          ) : (
            <>
              <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
                <div className="block xl:hidden mb-4 xl:mb-0">
                  <Alert message={`Expired Booking : ${remainingBookTime}`} banner />
                </div>

               {/* desktop and mobile sidebar*/}
                <div className="w-full mx-0 2xl:mx-4 ">
                  <div className="mt-2 xl:mt-8 w-full rounded-md border-b xl:border xl:border-gray-200 xl:shadow-sm">
                    <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                      <div className="text-black font-medium  ">
                        Keberangkatan kereta
                      </div>
                      <small className="text-black">
                        {tanggal_keberangkatan_kereta}
                      </small>
                    </div>
                    <div className="p-4 pl-8  text-black">
                      <div className="text-xs font-medium ">
                        {dataBookingTrain && dataBookingTrain[0].trainName}
                      </div>
                      <small>
                        {classTrain} Class{" "}
                        {dataBookingTrain && dataBookingTrain[0].seats[0].class}
                      </small>
                    </div>
                    <div className="mt-2"></div>
                    <div className="p-4 pl-8 mb-4">
                      <ol class="relative border-l-2 border-dashed border-gray-800">
                        <li class="mb-10 ml-4">
                          <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800"></div>
                          <div className="flex space-x-12">
                            <time class="mb-1 text-sm font-normal leading-none text-black">
                              {dataBookingTrain &&
                                dataBookingTrain[0].departureTime}
                            </time>
                            <div className="-mt-2">
                              <div class="text-left text-xs text-black">
                                {dataBookingTrain &&
                                  dataDetailTrain[0].berangkat_nama_kota}
                              </div>
                              <p class="text-left text-xs text-black ">
                                (
                                {dataBookingTrain &&
                                  dataDetailTrain[0].berangkat_id_station}
                                )
                              </p>
                            </div>
                          </div>
                        </li>
                        <li class="ml-4">
                          <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                          <div className="flex space-x-12">
                            <time class="mb-1 text-sm leading-none text-black">
                              {dataBookingTrain &&
                                dataBookingTrain[0].arrivalTime}
                            </time>
                            <div className="-mt-2">
                              <div class="text-left text-xs  text-black">
                                {dataBookingTrain &&
                                  dataDetailTrain[0].tujuan_nama_kota}
                              </div>
                              <p class="text-left text-xs text-black ">
                                (
                                {dataBookingTrain &&
                                  dataDetailTrain[0].tujuan_id_station}
                                )
                              </p>
                            </div>
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                  
                  {/* mobile sidebar */}
                  <div className="mt-4 block xl:hidden">
                    <Box
                        className="border-b px-4 py-4 "
                        sx={{
                          // textAlign: "center",
                          // paddingY: "16px",
                          // borderBottomLeftRadius: "30px",
                          // borderBottomRightRadius: "30px",
                          // cursor: "pointer",
                        }}
                        >
                    <div className="flex justify-between items-center -mt-2">
                      {/* <div className="text-black text-xs">Booking ID</div> */}
                      <div className="text-black text-sm -mt-1.5">
                        Transaksi ID
                      </div>
                      <div className="mt-2 font-bold  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable className="">
                          {hasilBooking && hasilBooking.transactionId}
                        </Paragraph>
                      </div>
                    </div>
                    <div className="text-gray-500 text-xs">

                      Gunakan kode bayar ini sebagai nomor tujuan pada menu
                      pembayaran di aplikasi.
                    </div>
                    </Box>
                    <button onClick={handlerPilihKursi} className="block w-full">
                    <div className="mt-2 border-b border-gray-200 shadow-sm  hover:bg-gray-100">
                      <div className="flex items-center justify-between space-x-2 p-4 pr-2 xl:pr-4">
                        <div className="flex space-x-2 items-center">
                          <div>
                            <MdOutlineAirlineSeatReclineExtra
                              size={28}
                              className="text-blue-500"
                            />
                          </div>
                          <div className="block text-black text-sm">
                            <div className="text-sm font-medium ">
                              Pindah Kursi
                            </div>
                            <small>available seats</small>
                          </div>
                        </div>
                        <div>
                          <IoIosArrowDropright
                            size={28}
                            className="text-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                    <div className="py-2">
                      <div className="w-full px-4">
                        <div className="flex justify-between items-center border-b border-gray-200 shadow-sm py-4">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-gray-500">
                              <small className="text-xs text-gray-400">Data Penumpang</small>
                              <div className="my-1">{TotalAdult > 0 && TotalAdult + ' Dewasa'} {TotalAdult > 0 && ', ' +TotalInfant + ' Bayi'}</div>
                            </div>
                          </div>
                          <div onClick={() => {toggleDrawer(true)}} className="cursor-pointer text-xs text-blue-400">
                            Detail
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 xl:py-4 xl:mt-0">
                      <div className="w-full px-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-gray-500">
                              <div >Total Harga</div>
                            </div>
                          </div>
                          <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(hasilBooking && hasilBooking?.normalSales || '-')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 xl:py-4 xl:mt-0">
                      <div className="w-full px-4">
                        <div className="flex justify-between items-center border-b border-gray-200 shadow-sm pb-4">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-gray-500">
                            <div className="text-xs text-gray-500">
                              <div >Biaya Admin</div>
                            </div>
                            </div>
                          </div>
                          <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(hasilBooking && hasilBooking.nominalAdmin)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 xl:py-4 xl:mt-0">
                      <div className="w-full px-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-gray-500">
                            <div className="text-xs text-gray-500">
                              <div >Total Bayar</div>
                            </div>
                            </div>
                          </div>
                          <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(
                            parseInt(hasilBooking && hasilBooking?.normalSales || 0) +
                              parseInt(
                                hasilBooking && hasilBooking.nominalAdmin
                              )
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* mobile detail */}
                <DetailPassengersDrawer passengers={passengers} hasilBooking={hasilBooking} openDrawer={openDrawer} toggleDrawer={toggleDrawer} />              


                  {/* for desktop adult, infant*/}
                  <div className="hidden xl:block">
                  {/* adult */}
                  {passengers.adults && passengers.adults.length > 0 ? (
                    <div className="text-sm xl:text-sm font-bold text-black mt-6 xl:mt-12">
                      <p>ADULT PASSENGERS</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {passengers.adults && passengers.adults.length > 0
                    ? passengers.adults.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border-b xl:border xl:border-gray-200 xl:shadow-sm">
                            <div className="p-2">
                              <div className="px-2 xl:px-4 py-2 text-black border-b border-gray-200 text-sm font-medium ">
                                {e.name}
                              </div>
                              <div className="mt-2 grid grid-cols-2 xl:grid-cols-4">
                                <div className="px-2 xl:px-4 py-2 text-xs">
                                  <div className="text-black font-medium ">NIK</div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 xl:px-4 py-2 text-xs">
                                  <div className="text-black ">Nomor HP</div>
                                  <div className="mt-2 text-black text-xs">{e.phone}</div>
                                </div>
                                <div className="px-2 xl:px-4 py-2 text-xs">
                                  <div className="text-black  font-medium ">Kursi</div>
                                  <div className="mt-2 text-black text-xs">
                                    {hasilBooking !== null
                                      ? hasilBooking.seats[i][0] === "EKO"
                                        ? "Ekonomi"
                                        : hasilBooking.seats[i][0] === "BIS"
                                        ? "Bisnis"
                                        : "Eksekutif"
                                      : ""}{" "}
                                    {hasilBooking !== null
                                      ? hasilBooking.seats[i][1]
                                      : ""}{" "}
                                    -{" "}
                                    {hasilBooking
                                      ? hasilBooking.seats[i][2]
                                      : ""}
                                    {hasilBooking !== null
                                      ? hasilBooking.seats[i][3]
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}
                  {/* infants */}
                  {passengers.infants && passengers.infants.length > 0 ? (
                    <div className="text-sm xl:text-sm font-bold text-black mt-6 xl:mt-12">
                      <p>INFANTS PASSENGERS</p>
                    </div>
                  ) : (
                    ""
                  )}
                  {passengers.infants && passengers.infants.length > 0
                    ? passengers.infants.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border-b xl:border xl:border-gray-200 xl:shadow-sm">
                            <div className="mt-2">
                              <div className="px-4 py-2 text-black border-b border-gray-200 text-sm font-medium ">
                                {e.name}
                              </div>
                              <div className="mt-2 grid grid-cols-2 xl:grid-cols-4">
                                <div className="px-4 py-2 text-xs">
                                  <div className="text-black font-medium ">NIK</div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-4 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.birthdate}
                                  </div>
                                </div>
                                <div className="px-4 py-2 text-xs">
                                  <div className="text-black font-medium ">Kursi</div>
                                  <div className="mt-2 text-black text-xs">
                                    {hasilBooking !== null
                                      ? hasilBooking.seats[i][0] === "EKO"
                                        ? "Ekonomi"
                                        : hasilBooking.seats[i][0] === "BIS"
                                        ? "Bisnis"
                                        : "Eksekutif"
                                      : ""}{" "}
                                      {"/"}
                                      {" 0 "}
                                    {/* {hasilBooking !== null
                                      ? hasilBooking.seats[i][1]
                                      : ""}{" "} */}
                                    -{" "}
                                    {/* {hasilBooking
                                      ? hasilBooking.seats[i][2]
                                      : ""} */}
                                    {/* {hasilBooking !== null
                                      ? hasilBooking.seats[i][3]
                                      : ""} */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                  : ""}

                  <div className="text-sm xl:text-sm font-bold text-black mt-12">
                    <p>PRICE DETAILT</p>
                  </div>
                  <div className="p-2 mt-4 w-full rounded-md border-b xl:border xl:border-gray-200">
                    <div className="p-4">
                      <div className="text-xs text-black font-medium  flex justify-between">
                        <div>
                          {dataBookingTrain && dataBookingTrain[0].trainName}{" "}
                          {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ""}{" "}
                          {/* {TotalChild > 0 ? `(Children) x${TotalChild}` : ""}{" "} */}
                          {TotalInfant > 0 ? `(Infants) x${TotalInfant}` : ""}
                        </div>
                        <div>
                          Rp.{" "}
                          {hasilBooking && toRupiah(hasilBooking.normalSales)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Biaya Admin (Fee)</div>
                        <div>
                          Rp.{" "}
                          {hasilBooking && toRupiah(hasilBooking.nominalAdmin)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Diskon (Rp.)</div>
                        <div>Rp. {hasilBooking && hasilBooking.discount}</div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-black font-medium  flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {hasilBooking &&
                            toRupiah(
                              parseInt(hasilBooking.normalSales) -
                                parseInt(hasilBooking.discount) +
                                parseInt(hasilBooking.nominalAdmin)
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                 {/* end desktop */}

                  <div className="flex justify-end w-full xl:w-auto">
                    <ButtonAnt
                      onClick={handlerKonfirmasi}
                      size="large"
                      key="submit"
                      type="primary"
                      className="bg-blue-500 mx-2 font-semibold mt-8 xl:mt-4 w-full xl:w-auto"
                      loading={isLoading}
                    >
                      Lanjut ke Pembayaran
                    </ButtonAnt>
                  </div>
                </div>

                {/* desktop sidebar */}
                <div className="sidebar w-full xl:w-2/3 2xl:w-1/2 hidden xl:block">
                  <div className="mt-2 xl:mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between py-2 px-4">
                      {/* <div className="text-black text-sm">Booking ID</div> */}
                      <div className="-mt-4  text-black text-sm">Transaksi ID</div>
                      <div className="font-medium  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>{hasilBooking && hasilBooking.transactionId}</Paragraph>
                      </div>
                    </div>
                    <div className="px-4 text-grapy-500 text-xs">
                    Gunakan kode bayar ini sebagai nomor tujuan pada menu pembayaran di aplikasi.
                      </div>
                  </div>
                  <button onClick={handlerPilihKursi} className="block w-full">
                    <div className="mt-2 rounded-md border border-gray-200 shadow-sm  hover:bg-gray-100">
                      <div className="flex items-center justify-between space-x-2 p-4 pr-2 xl:pr-4">
                        <div className="flex space-x-2 items-center">
                          <div>
                            <MdOutlineAirlineSeatReclineExtra
                              size={28}
                              className="text-blue-500"
                            />
                          </div>
                          <div className="block text-black text-sm">
                            <div className="text-sm font-medium ">
                              Pindah Kursi
                            </div>
                            <small>available seats</small>
                          </div>
                        </div>
                        <div>
                          <IoIosArrowDropright
                            size={28}
                            className="text-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="hidden xl:block mt-2">
                    <Alert message={`Expired Booking : ${remainingBookTime}`} banner />
                  </div>
                  <div></div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
