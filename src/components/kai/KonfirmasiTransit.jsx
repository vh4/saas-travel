import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import {
  MdHorizontalRule,
  MdOutlineAirlineSeatReclineExtra,
} from "react-icons/md";
import { IoIosArrowDropright } from "react-icons/io";
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
import { Typography } from "antd";
import moment from "moment";
import { SeatMapTransit } from "./SeatMapsTransit";
import { MdOutlineTrain } from "react-icons/md";

export default function KonfirmasiTransit() {
  const [api, contextHolder] = notification.useNotification();
  const { Paragraph } = Typography;
  const [selectedCount, setSelectedCount] = useState(0);

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

  const [searchParams, setSearchParams] = useSearchParams();

  const uuid_book = searchParams.get("k_book");
  const uuid_train_data = searchParams.get("k_train");
  const callback_train = localStorage.getItem("callback_train") || null;

  // const uuid_auth = searchParams.get("k_auth");

  const [dataBookingTrain, setdataBookingTrain] = useState(null);
  const [dataDetailTrain, setdataDetailTrain] = useState(null);

  const [hasilBooking, setHasilBooking] = useState(null);
  const [hasilBookingTriggerResetGagal, sethasilBookingTriggerResetGagal] =
    useState(null);

  const [passengers, setPassengers] = useState(null);
  const [tanggal_keberangkatan_kereta, settanggal_keberangkatan_kereta] =
    useState(null);
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
  const [isNumberTrainPassenger, SetIsnumberTrainPassenger] = useState(0);

  const [changeState, setChangeSet] = useState({}); //change seats.
  const [
    changeStateKetikaGagalTidakUpdate,
    setchangeStateKetikaGagalTidakUpdate,
  ] = useState({}); //change seats.
  const [gerbongsamawajib, setgerbongsamawajib] = useState(0);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setSelectedCount(0);
    setgerbongsamawajib(0);
  };

  const [expiredBookTime, setExpiredBookTime] = useState(null);

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    Promise.all([getDataTrain(), getHasilBooking()])

      .then(([ResponsegetDataTrain, ResponsegetHasilBooking]) => {
        const hasilBooking = ResponsegetHasilBooking.hasil_book;

        if (ResponsegetDataTrain) {
          const dataTrain = ResponsegetDataTrain.train[0];
          const dataTrainDetail = ResponsegetDataTrain.train_detail;

          dataTrainDetail[0]["berangkat_nama_kota"] =
            dataTrain.berangkat_nama_kota;
          dataTrainDetail[0]["berangkat_id_station"] =
            dataTrain.berangkat_id_station;

          dataTrainDetail[0]["tujuan_nama_kota"] =
            dataTrain.transit_name_stasiun;
          dataTrainDetail[0]["tujuan_id_station"] =
            dataTrain.transit_id_stasiun;

          dataTrainDetail[1]["berangkat_nama_kota"] =
            dataTrain.transit_name_stasiun;
          dataTrainDetail[1]["berangkat_id_station"] =
            dataTrain.transit_id_stasiun;

          dataTrainDetail[1]["tujuan_nama_kota"] = dataTrain.tujuan_nama_kota;
          dataTrainDetail[1]["tujuan_id_station"] = dataTrain.tujuan_id_station;

          setdataDetailTrain(dataTrainDetail);
          setdataBookingTrain(dataTrain);
        } else {
          setErrPage(true);
        }

        if (ResponsegetHasilBooking) {
          setHasilBooking(ResponsegetHasilBooking.hasil_book);
          //ambil timelimit yang awal.
          setExpiredBookTime(
            ResponsegetHasilBooking.hasil_book[0].timeLimit ||
              moment().add(1, "hours")
          );

          //mengatasi ketika mencopy variable hasilBooking, state nya ikut update.
          sethasilBookingTriggerResetGagal(
            JSON.stringify(ResponsegetHasilBooking.hasil_book)
          );

          setPassengers(ResponsegetHasilBooking.passengers);

          const passengers = ResponsegetHasilBooking.passengers;
          const initialChanges = Array(); //

          hasilBooking.forEach((data) => {
            const responseArray = data.passengers.map((e, i) => {
              return {
                name: e,
                type:
                  passengers.adults[i] !== null && passengers.adults[i]
                    ? "adult"
                    : "infant",
                class: data.seats[i][0],
                wagonNumber: data.seats[i][1],
                row: data.seats[i][2],
                column: data.seats[i][3],
                checkbox: false,
              };
            });

            initialChanges.push(responseArray);
          });

          setChangeSet([initialChanges]);
          //mengatasi ketika mencopy variable setChangeSet, state nya ikut update.
          setchangeStateKetikaGagalTidakUpdate(
            JSON.stringify([initialChanges])
          );
          setTotalAdult(passengers.adults.length);
          //   setTotalChild(passengers.children ? passengers.children.length : 0);
          setTotalInfant(passengers.infants.length);
        } else {
          setErrPage(true);
        }

        if (
          ResponsegetHasilBooking.hasil_book &&
          new Date(ResponsegetHasilBooking.hasil_book[0].timeLimit).getTime() <
            new Date().getTime()
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
      new Date(hasilBooking[0].timeLimit).getTime() < new Date().getTime()
    ) {
      setIsBookingExpired(true);
    } else {
      setIsBookingExpired(false);
    }
  }, [uuid_book, uuid_train_data, token]);

  const [remainingBookTime, setremainingBookTime] = useState(
    remainingTime(expiredBookTime)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setremainingBookTime(remainingTime(expiredBookTime));
      if (
        hasilBooking &&
        new Date(hasilBooking[0].timeLimit).getTime() < new Date().getTime()
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
      const response = localStorage.getItem(
        `data:k-train-transit/${uuid_train_data}`
      );
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  async function getHasilBooking() {
    try {
      const response = localStorage.getItem(`data:k-book-transit/${uuid_book}`);
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  async function handlerPilihKursi(dataForSeats) {
    setDataSeats([]); //untuk reset data.
    gantigerbong(0); // untuk reset data pindah gerbong.
    setChangeSet(JSON.parse(changeStateKetikaGagalTidakUpdate)); // untuk reset data ketika sudah di pilih kursinya, tapi keluar lagi..

    setOpen(true);
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/get_seat_layout`,
      {
        productCode: "WKAI",
        origin: dataForSeats.berangkat_id_station,
        destination: dataForSeats.tujuan_id_station,
        date: dataForSeats.arrivalDate,
        trainNumber: dataForSeats.trainNumber,
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
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

    if (callback_train && callback_train == "true") {
      // setTimeout(async () => {

      //   const dataParse = JSON.parse(localStorage.getItem(`data:k-book/${uuid_book}`))

      //   const response = await axios.post(
      //     `${process.env.REACT_APP_HOST_API}/travel/train/callback`,
      //     {
      //       id_transaksi:dataParse.hasil_book.transactionId
      //     }
      //   );

      // if(response.data.rc == '00'){
      //   navigate('/')
      // }else{
      //   failedNotification(response.data.rd)
      // }

      // setIsLoading(false);

      // }, 100);

      setTimeout(() => {
        setIsLoading(false);
        navigate({
          pathname: `/train/bayar/transit`,
          search: `?k_train=${uuid_train_data}&k_book=${uuid_book}`,
        });
      }, 100);
    } else {
      e.preventDefault();
      setTimeout(() => {
        setIsLoading(false);
        navigate({
          pathname: `/train/bayar/transit`,
          search: `?k_train=${uuid_train_data}&k_book=${uuid_book}`,
        });
      }, 100);
    }
  };

  const handlerPindahKursi = async (e) => {
    e.preventDefault();

    const changeStateFix = JSON.parse(JSON.stringify(changeState)); // Create a deep copy

    let wagonNumber =
      changeStateFix[0][isNumberTrainPassenger][0]["wagonNumber"];
    let className = changeStateFix[0][isNumberTrainPassenger][0]["class"];

    setisLoadingPindahKursi(true);
    setgerbongsamawajib(0);

    changeStateFix[0][isNumberTrainPassenger].forEach((item) => {
      delete item.name;
      delete item.checkbox;
      delete item.class;
      delete item.wagonNumber;
    });

    let gantiKursiFix = {
      productCode: "WKAI",
      bookingCode: hasilBooking[isNumberTrainPassenger].bookingCode,
      transactionId: hasilBooking[isNumberTrainPassenger].transactionId,
      wagonNumber: wagonNumber,
      wagonCode: className,
      seats: changeStateFix[0][isNumberTrainPassenger],
      token: JSON.parse(
        localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
      ),
    };

    gantiKursiFix.seats = gantiKursiFix.seats.filter(
      (seat) => seat.type !== "infant"
    );

    gantiKursiFix.seats.forEach((item) => {
      delete item.type;
    });

    const hasilBookingDataCopyDeep = JSON.parse(JSON.stringify(hasilBooking));
    const hasilBookingData = JSON.parse(
      JSON.stringify(hasilBookingDataCopyDeep)
    );

    setSelectedCount(0);

    for (var i = 0; i < changeStateFix[0][isNumberTrainPassenger].length; i++) {
      if (
        gantiKursiFix.seats[i] !== undefined &&
        gantiKursiFix.seats[i] !== null
      ) {
        hasilBookingData[isNumberTrainPassenger].seats[i][1] = wagonNumber;
        hasilBookingData[isNumberTrainPassenger].seats[i][2] =
          gantiKursiFix.seats[i].row.toString();
        hasilBookingData[isNumberTrainPassenger].seats[i][3] =
          gantiKursiFix.seats[i].column;
      }
    }

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/change_seat`,
      gantiKursiFix
    );

    const idtrx = response.data.transactionId;

    if (response.data.rc == "00") {
      hasilBookingData[isNumberTrainPassenger]["transactionId"] = idtrx;

      //passenger nya harusmya di update yang baru change seats.
      // const response = await axios.put(
      //   `${process.env.REACT_APP_HOST_API}/travel/train/book/k_book`,
      //   {
      //     // uuid: uuid_book,
      //     passengers: passengers,
      //     hasil_book: hasilBookingData,
      //     // uuid_permission: uuid_auth,
      //   }
      // );

      localStorage.setItem(
        `data:k-book-transit/${uuid_book}`,
        JSON.stringify({
          passengers: passengers,
          hasil_book: hasilBookingData,
        })
      );

      setisLoadingPindahKursi(false);
      successNotification();
      setHasilBooking(hasilBookingData);

      // if (response.data.rc === "00") {
      //   setHasilBooking(hasilBookingData);
      //   setisLoadingPindahKursi(false);
      //   successNotification();
      // } else {
      //   setisLoadingPindahKursi(false);
      //   failedNotification(response.data.rd);
      // }

      setchangeStateKetikaGagalTidakUpdate(JSON.stringify(changeState));
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

    // await handlerPilihKursi();
    setOpen(false);
    // handleClose();
  };

  const [backdrop, setBackdrop] = React.useState("static");

  function gantigerbong(value) {
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
          <Modal
            size="md"
            backdrop={backdrop}
            keyboard={false}
            open={open}
            onClose={handleClose}
          >
            <Modal.Header>
              <Modal.Title>
                <div className="text-black font-medium  mt-2 mb-2">
                  Pindah Kursi
                </div>
                <small>tekan tombol warna biru untuk ganti kursi.</small>
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
                              {changeState[0][isNumberTrainPassenger].map(
                                (e, i) => (
                                  <>
                                    {e.type === "adult" && (
                                      <div className="border m-2 rounded-md mt-2 text-xs font-medium ">
                                        <div className="flex space-x-4 items-center py-2 px-4 text-black">
                                          <div className="text-2xl font-medium ">
                                            {i + 1}
                                          </div>
                                          <div>
                                            <div className="font-medium  mt-2">
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
                                )
                              )}

                              <div className="mt-4 xl:mt-4 ml-2">
                                <div className="flex space-x-2 items-center mt-2 ">
                                  <label
                                    class={`select-none block py-1.5 items-center cursor-pointer`}
                                  >
                                    <div class="w-8 text-white-500 text-white h-8 bg-gray-500 rounded-lg">
                                      <div class="flex justify-center py-1.5">
                                        X
                                      </div>
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
                                    <div class="w-8 text-white-500 h-8 bg-blue-500 rounded-lg"></div>
                                  </label>
                                  <div className="text-md text-black font-medium ">
                                    Seats available.
                                  </div>
                                </div>
                                <div className="flex space-x-2 items-center mt-2">
                                  <Alert
                                    message="Only supported at the same gate."
                                    banner
                                  />
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
                                      onChange={(value) => {
                                        gantigerbong(value);
                                      }}
                                      id="underline_select"
                                      style={{ width: "100%" }}
                                      defaultValue={0}
                                    >
                                      {dataSeats !== undefined &&
                                      dataSeats !== null ? (
                                        dataSeats.data.map((data, i) => (
                                          <Select.Option key={i} value={i}>
                                            {data.wagonCode === "EKO"
                                              ? "Ekonomi"
                                              : data.wagonCode === "EKS"
                                              ? "Eksekutif"
                                              : "Bisnis"}{" "}
                                            {data.wagonNumber}
                                          </Select.Option>
                                        ))
                                      ) : (
                                        <Select.Option value="empty">
                                          Data kosong
                                        </Select.Option>
                                      )}
                                    </Select>
                                  </div>
                                </>
                              </div>
                              <div className=""></div>
                              {dataSeats !== undefined &&
                                dataSeats !== null && (
                                  <>
                                    <SeatMapTransit
                                      isNumberTrainPassenger={
                                        isNumberTrainPassenger
                                      }
                                      changeState={changeState}
                                      gerbongsamawajib={gerbongsamawajib}
                                      setgerbongsamawajib={setgerbongsamawajib}
                                      selectedCount={selectedCount}
                                      setSelectedCount={setSelectedCount}
                                      setChangeSet={setChangeSet}
                                      clickSeatsData={clickSeats}
                                      seats={dataSeats.data[clickSeats].layout}
                                      selectedCheckboxes={selectedCheckboxes}
                                      setSelectedCheckboxes={
                                        setSelectedCheckboxes
                                      }
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
          {/* end show modal */}

          {/* header kai flow */}
          <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <AiOutlineCheckCircle className="text-black" size={20} />
              <div className="hidden xl:flex text-black">Detail pesanan</div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="hidden xl:flex text-black"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <div className="hidden xl:flex text-blue-500 font-medium ">
                Konfirmasi pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="text-black hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <RxCrossCircled size={20} className="text-black" />
              <div className="hidden xl:block text-black">Pembayaran tiket</div>
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
                <div className="block xl:hidden">
                  <Alert
                    message={`Expired Booking : ${remainingBookTime}`}
                    banner
                  />
                </div>
                <div className="w-full mx-0 2xl:mx-4">
                  {dataDetailTrain.map((e, i) => (
                    <>
                      <div className="mt-2 xl:mt-8 w-full rounded-md border border-gray-200 shadow-sm">
                        <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                          <div className="text-black font-medium  ">
                            Keberangkatan kereta
                          </div>
                          <small className="text-black">
                            {parseTanggal(e.departureDate)}
                          </small>
                        </div>
                        <div className="p-4 pl-8  text-black">
                          <div className="text-xs font-medium ">
                            {e.trainName}
                          </div>
                          <small>
                            {e.seats[0].grade === "E"
                              ? "Eksekutif"
                              : e.seats[0].grade === "B"
                              ? "Bisnis"
                              : "Ekonomi"}{" "}
                            Class ({e.seats[0].class})
                          </small>
                        </div>
                        <div className="mt-2"></div>
                        <div className="p-4 pl-8 mb-4">
                          <ol class="relative border-l-2 border-dashed border-gray-800">
                            <li class="mb-10 ml-4">
                              <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800"></div>
                              <div className="flex space-x-12">
                                <time class="mb-1 text-sm font-normal leading-none text-black">
                                  {e.departureTime}
                                </time>
                                <div className="-mt-2">
                                  <div class="text-left text-xs text-black">
                                    {e.berangkat_nama_kota}
                                  </div>
                                  <p class="text-left text-xs text-black ">
                                    ({e.berangkat_id_station})
                                  </p>
                                </div>
                              </div>
                            </li>
                            <li class="ml-4">
                              <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                              <div className="flex space-x-12">
                                <time class="mb-1 text-sm leading-none text-black">
                                  {e.arrivalTime}
                                </time>
                                <div className="-mt-2">
                                  <div class="text-left text-xs  text-black">
                                    {e.tujuan_nama_kota}
                                  </div>
                                  <p class="text-left text-xs text-black ">
                                    ({e.tujuan_id_station})
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </>
                  ))}

                  {/* adult */}
                  {passengers.adults && passengers.adults.length > 0 ? (
                    <div className="text-sm xl:text-sm font-bold text-black mt-12">
                      <p>ADULT PASSENGERS</p>
                    </div>
                  ) : (
                    ""
                  )}

                  {dataDetailTrain &&
                    passengers.adults &&
                    passengers.adults.length > 0 &&
                    dataDetailTrain.map((k, l) => (
                      <>
                        <div className="p-2">
                          <div className="flex space-x-2 items-center px-2 py-2 text-black border-b border-gray-200 text-sm font-medium ">
                            <MdOutlineTrain className="text-black" size={22} />
                            <p>{k.trainName}</p>
                          </div>
                          {passengers.adults && passengers.adults.length > 0
                            ? passengers.adults.map((e, i) => (
                                <>
                                  <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                                    <div className="mt-2 grid grid-cols-2 xl:grid-cols-4">
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          Nama
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.name}
                                        </div>
                                      </div>
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          NIK
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.idNumber}
                                        </div>
                                      </div>
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black  font-medium ">
                                          Nomor HP
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.phone}
                                        </div>
                                      </div>
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black  font-medium ">
                                          Kursi
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {hasilBooking[l] !== null
                                            ? hasilBooking[l].seats[i][0] ===
                                              "EKO"
                                              ? "Ekonomi"
                                              : hasilBooking[l].seats[i][0] ===
                                                "BIS"
                                              ? "Bisnis"
                                              : "Eksekutif"
                                            : ""}{" "}
                                          {hasilBooking[l] !== null
                                            ? hasilBooking[l].seats[i][1]
                                            : ""}{" "}
                                          -{" "}
                                          {hasilBooking[l]
                                            ? hasilBooking[l].seats[i][2]
                                            : ""}
                                          {hasilBooking[l] !== null
                                            ? hasilBooking[l].seats[i][3]
                                            : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))
                            : ""}
                        </div>
                      </>
                    ))}

                  {/* infants */}
                  {passengers.infants && passengers.infants.length > 0 ? (
                    <div className="text-sm xl:text-sm font-bold text-black mt-12">
                      <p>INFANTS PASSENGERS</p>
                    </div>
                  ) : (
                    ""
                  )}

                  {dataDetailTrain &&
                    passengers.infants &&
                    passengers.infants.length > 0 &&
                    dataDetailTrain.map((k, l) => (
                      <>
                        <div className="p-2">
                          <div className="flex space-x-2 items-center px-2 py-2 text-black border-b border-gray-200 text-sm font-medium ">
                            <MdOutlineTrain className="text-black" size={22} />
                            <p>{k.trainName}</p>
                          </div>
                          {passengers.infants && passengers.infants.length > 0
                            ? passengers.infants.map((e, i) => (
                                <>
                                  <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                                    <div className="mt-2 grid grid-cols-2 xl:grid-cols-4">
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          Nama
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.name}
                                        </div>
                                      </div>
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          NIK
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.idNumber}
                                        </div>
                                      </div>
                                      <div className="px-2 xl:px-4 py-2 text-xs">
                                        <div className="text-black  font-medium ">
                                          Tanggal Lahir
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.birthdate}
                                        </div>
                                      </div>
                                      <div className="px-2 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          Kursi
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {hasilBooking[l] !== null
                                            ? hasilBooking[l].seats[i][0] ===
                                              "EKO"
                                              ? "Ekonomi"
                                              : hasilBooking[l].seats[i][0] ===
                                                "BIS"
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
                                </>
                              ))
                            : ""}
                        </div>
                      </>
                    ))}

                  <div className="text-sm xl:text-sm font-bold text-black mt-12">
                    <p>PRICE DETAILT</p>
                  </div>
                  <div className="mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                    {hasilBooking.map((e, z) => (
                      <>
                        <div className="p-4">
                          <div className="my-2 text-black pb-2 border-b border-gray-200 mb-2">
                            {dataDetailTrain[z].trainName}
                          </div>
                          <div className="text-xs text-black font-medium  flex justify-between mt-4">
                            <div>
                              {e.trainName}{" "}
                              {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ""}{" "}
                              {/* {TotalChild > 0 ? `(Children) x${TotalChild}` : ""}{" "} */}
                              {TotalInfant > 0
                                ? `(Infants) x${TotalInfant}`
                                : ""}
                            </div>
                            <div>Rp. {toRupiah(e.normalSales)}</div>
                          </div>
                          <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                            <div>Biaya Admin (Fee)</div>
                            <div>Rp. {toRupiah(e.nominalAdmin)}</div>
                          </div>
                          <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                            <div>Diskon (Rp.)</div>
                            <div>Rp. {e.discount}</div>
                          </div>
                        </div>
                      </>
                    ))}
                    <div className="mt-8 p-4 border-t border-gray-200 text-sm text-black font-medium  flex justify-between">
                      <div>Total Harga</div>
                      <div>
                        Rp.{" "}
                        {toRupiah(
                          hasilBooking.reduce(
                            (total, item) =>
                              total + parseInt(item.normalSales, 10),
                            0
                          ) +
                            hasilBooking.reduce(
                              (total, item) =>
                                total + parseInt(item.discount, 10),
                              0
                            ) +
                            hasilBooking.reduce(
                              (total, item) =>
                                total + parseInt(item.nominalAdmin, 10),
                              0
                            )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <ButtonAnt
                      onClick={handlerKonfirmasi}
                      size="large"
                      key="submit"
                      type="primary"
                      className="bg-blue-500 mx-2 font-semibold mt-4"
                      loading={isLoading}
                    >
                      Lanjut ke Pembayaran
                    </ButtonAnt>
                  </div>
                </div>

                {/* desktop sidebar */}
                <div className="sidebar w-full xl:w-2/3 2xl:w-1/2 mt-4">
                  {hasilBooking &&
                    hasilBooking.map((e, i) => (
                      <>
                        <div className="mt-4 py-2 rounded-md border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between py-2 px-4">
                            {/* <div className="text-black text-sm">Booking ID</div> */}
                            <div className="-mt-4  text-black text-sm">
                              Transaksi ID{" "}
                              <span className="text-xs text-blue-500">
                                {dataDetailTrain[i].trainName}
                              </span>
                            </div>
                            <div className="font-medium  text-blue-500 text-[18px]">
                              {/* {hasilBooking && hasilBooking.bookingCode} */}
                              <Paragraph copyable>{e.transactionId}</Paragraph>
                            </div>
                          </div>
                          <div className="px-4 text-grapy-500 text-xs">
                            Gunakan kode bayar ini sebagai nomor tujuan pada
                            menu pembayaran di aplikasi.
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            SetIsnumberTrainPassenger(i);
                            handlerPilihKursi(dataDetailTrain[i]);
                          }}
                          className="block w-full"
                        >
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
                                  <div className="flex space-x-2 items-center">
                                    <div className="text-sm font-medium ">
                                      Pindah Kursi
                                    </div>
                                    <div>
                                      <small className="text-xs text-blue-500">
                                        {dataDetailTrain[i].trainName}
                                      </small>
                                    </div>
                                  </div>
                                  <div className="text-left">
                                    <small>available seats</small>
                                  </div>
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
                        <div></div>
                      </>
                    ))}
                  <div className="hidden xl:block mt-4">
                    <Alert
                      message={`Expired Booking : ${remainingBookTime}`}
                      banner
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
