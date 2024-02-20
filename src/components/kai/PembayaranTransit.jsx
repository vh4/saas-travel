import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { useNavigate, createSearchParams } from "react-router-dom";
import { TiketContext } from "../../App";
import { Alert, Button as ButtonAnt } from "antd";
import { notification } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal, remainingTime } from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import PageExpired from "../components/Expired";
import BayarLoading from "../components/trainskeleton/bayar";
import { Typography } from "antd";
import moment from "moment";

export default function Pembayaran() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const { Paragraph } = Typography;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const uuid_book = searchParams.get("k_book");
  const uuid_train_data = searchParams.get("k_train");

  const { dispatch } = useContext(TiketContext);

  const [isLoading, setIsLoading] = useState(false);

  const [dataBookingTrain, setdataBookingTrain] = useState(null);
  const [dataDetailTrain, setdataDetailTrain] = useState(null);
  const [hasilBooking, setHasilBooking] = useState(null);
  const [passengers, setPassengers] = useState(null);
  const [callbackBoolean, setcallbackBoolean] = useState(false);

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [TotalAdult, setTotalAdult] = useState(0);
  //   const [TotalChild, setTotalChild] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration
  const [expiredBookTime, setExpiredBookTime] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const [isNavigationDone, setIsNavigationDone] = useState(false);

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

    Promise.all([getDataTrain(), getHasilBooking(), cekCallbakIsMitra()])
      .then(
        ([
          ResponsegetDataTrain,
          ResponsegetHasilBooking,
          cekCallbakIsMitra,
        ]) => {
          if (cekCallbakIsMitra.data.rc == "00") {
            setcallbackBoolean(true);
          }

          const hasilBooking = ResponsegetHasilBooking.hasil_book;

          if (ResponsegetDataTrain) {
            const dataTrainDetail = ResponsegetDataTrain.train_detail;
            const dataTrain = ResponsegetDataTrain.train[0];

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
            dataTrainDetail[1]["tujuan_id_station"] =
              dataTrain.tujuan_id_station;

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
            setPassengers(ResponsegetHasilBooking.passengers);

            const passengers = ResponsegetHasilBooking.passengers;
            const initialChanges = Array();

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

            setTotalAdult(passengers.adults.length);
            setTotalInfant(passengers.infants.length);
          } else {
            setErrPage(true);
          }

          if (
            ResponsegetHasilBooking.hasil_book &&
            new Date(ResponsegetHasilBooking.hasil_book.timeLimit).getTime() <
              new Date().getTime()
          ) {
            setIsBookingExpired(true);
          } else {
            setIsBookingExpired(false);
          }

          setTimeout(() => {
            setIsLoadingPage(false);
          }, 1000);
        }
      )
      .catch((error) => {
        setIsLoadingPage(false);
        setErrPage(true);
      });
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

  async function cekCallbakIsMitra() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/is_merchant`,
        {
          token: JSON.parse(
            localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
          ),
        }
      );
      return response;
    } catch (error) {
      throw error;
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

  async function handlerPembayaran(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/payment`,
      {
        productCode: "WKAI",
        bookingCode: hasilBooking.bookingCode,
        transactionId: hasilBooking.transactionId,
        nominal: hasilBooking.normalSales,
        nominal_admin: hasilBooking.nominalAdmin,
        discount: hasilBooking.discount,
        simulateSuccess: process.env.REACT_APP_SIMUATION_PAYMENT,
        pay_type: "TUNAI",
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      }
    );

    if (response.data.rc === "00") {
      const params = {
        success: JSON.stringify({
          booking_id: hasilBooking.bookingCode,
          tipe_pembayaran: "TUNAI",
          nomor_hp_booking: passengers.adults[0].phone,
          id_transaksi: hasilBooking.transactionId,
          nominal_admin: hasilBooking.nominalAdmin,
          discount: hasilBooking.discount,
          url_etiket: response.data.data.url_etiket,
          nominal_sales: hasilBooking.normalSales,
          total_dibayar: toRupiah(
            parseInt(hasilBooking.normalSales) -
              parseInt(hasilBooking.discount) +
              parseInt(hasilBooking.nominalAdmin)
          ),
        }),
      };

      dispatch({
        type: "PAY_TRAIN",
      });

      setTimeout(() => {
        setIsLoading(false);

        navigate({
          pathname: "/train/tiket-kai",
          search: `?${createSearchParams(params)}`,
        });
      }, 100);
    } else {
      setTimeout(() => {
        failedNotification(response.data.rd);
        setIsLoading(false);
      }, 100);
    }
  }

  async function handleCallbackSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      setTimeout(async () => {
        const dataParse = JSON.parse(
          localStorage.getItem(`data:k-book-transit/${uuid_book}`)
        );
        const list_idtrx = Array();

        dataParse.hasil_book.forEach((e) => {
          list_idtrx.push(e.transactionId);
        });

        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/travel/train/transit/callback`,
          {
            id_transaksi: list_idtrx,
          }
        );

        setIsLoading(false);

        if (response.data.rc == "00") {
          navigate("/");
        } else {
          failedNotification(response.data.rd);
        }
      }, 500);
    } catch (error) {
      failedNotification(error.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* for message */}
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
              <AiOutlineCheckCircle className="text-black" size={20} />
              <div className="hidden xl:flex text-black">
                Konfirmasi pesanan
              </div>
            </div>
            <div className="hidden xl:flex">
              <MdHorizontalRule
                size={20}
                className="text-black hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <div className="font-medium  hidden xl:block text-blue-500">
                Pembayaran tiket
              </div>
            </div>
          </div>
          {isLoadingPage === true ? (
            <>
              <BayarLoading TotalAdult={TotalAdult} TotalInfant={TotalInfant} />
            </>
          ) : (
            <>
              <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
                <div className="block md:hidden">
                  <Alert
                    message={`Expired Booking : ${remainingBookTime}`}
                    banner
                  />
                </div>
                {/* mobile sidebar */}
                <div className="sidebar block xl:hidden w-full xl:w-2/3 2xl:w-1/2">
                  {hasilBooking.map((e, i) => (
                    <>
                      <div className="mt-2 py-2 rounded-md border border-gray-200 shadow-sm">
                        <div className="px-4 py-2">
                          {/* <div className="text-black text-xs">Booking ID</div> */}
                          <div className="text-black font-medium  text-sm">
                            Transaksi ID
                          </div>

                          <div className="mt-2 font-medium  text-blue-500 text-[18px]">
                            {/* {hasilBooking && hasilBooking.bookingCode} */}
                            <Paragraph copyable>{e.transactionId} </Paragraph>
                          </div>
                          <div className="text-grapy-500 text-xs">
                            Gunakan kode bayar ini sebagai nomor tujuan pada
                            menu pembayaran di aplikasi.
                          </div>
                        </div>
                        <div className="p-4 border-t">
                          <div className="text-xs text-black">
                            {dataDetailTrain[i].trainName}
                          </div>
                          <div className="mt-1 text-xs text-black font-medium ">
                            {dataDetailTrain[i].berangkat_nama_kota} -{" "}
                            {dataDetailTrain[i].tujuan_nama_kota}
                          </div>
                          <div className="mt-3 text-xs text-black">
                            {parseTanggal(dataDetailTrain[i].departureDate)}
                          </div>
                          <div className="mt-1 text-xs text-black">
                            {dataDetailTrain[i].departureTime} -{" "}
                            {dataDetailTrain[i].arrivalTime}
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="mt-4 w-full mx-0 2xl:mx-4">
                  {/* adult */}
                  {dataDetailTrain &&
                    dataDetailTrain.map((k, l) => (
                      <>
                        {passengers.adults && passengers.adults.length > 0
                          ? passengers.adults.map((e, i) => (
                              <>
                                <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                                  <div className="p-2">
                                    <div className="px-2 xl:px-4 py-2 text-black border-b border-gray-200 text-sm font-medium ">
                                      {k.trainName}
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4">
                                      <div className="px-2 md:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          Nama
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.name}
                                        </div>
                                      </div>
                                      <div className="px-2 md:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          NIK
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.idNumber}
                                        </div>
                                      </div>
                                      <div className="px-2 md:px-4 py-2 text-xs">
                                        <div className="text-black  font-medium ">
                                          Nomor HP
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.phone}
                                        </div>
                                      </div>
                                      <div className="px-2 md:px-4 py-2 text-xs">
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
                                </div>
                              </>
                            ))
                          : ""}
                      </>
                    ))}

                  {/* infants */}
                  {dataDetailTrain &&
                    dataDetailTrain.map((k, l) => (
                      <>
                        {passengers.infants && passengers.infants.length > 0
                          ? passengers.infants.map((e, i) => (
                              <>
                                <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                                  <div className="p-2">
                                    <div className="px-2 xl:px-4 py-2 text-black border-b border-gray-200 text-sm font-medium ">
                                      {k.trainName}
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4">
                                      <div className="px-2 md:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          Nama
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.name}
                                        </div>
                                      </div>
                                      <div className="px-2 md:px-4 py-2 text-xs">
                                        <div className="text-black font-medium ">
                                          NIK
                                        </div>
                                        <div className="mt-2 text-black text-xs">
                                          {e.idNumber}
                                        </div>
                                      </div>
                                      <div className="px-2 md:px-4 py-2 text-xs">
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
                                </div>
                              </>
                            ))
                          : ""}
                      </>
                    ))}
                  <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                    {hasilBooking.map((e, z) => (
                      <>
                        <div className="p-4">
                          <div className="my-2 font-bold text-black pb-2 border-b border-gray-200 mb-2">
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
                </div>
                {/* desktop sidebar */}
                <div className="sidebar hidden xl:block w-full xl:w-2/3 2xl:w-1/2">
                  {hasilBooking.map((e, i) => (
                    <>
                      <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                        <div className="px-4 py-2">
                          {/* <div className="text-black text-xs">Booking ID</div> */}
                          <div className="text-black text-xs">Transaksi ID</div>

                          <div className="mt-1 font-medium  text-blue-500 text-[18px]">
                            {/* {hasilBooking && hasilBooking.bookingCode} */}
                            <Paragraph copyable>{e.transactionId} </Paragraph>
                          </div>
                          <div className="text-grapy-500 text-xs">
                            Gunakan kode bayar ini sebagai nomor tujuan pada
                            menu pembayaran di aplikasi.
                          </div>
                        </div>
                        <div className="p-4 border-t">
                          <div className="text-xs text-black">
                            TRAIN DESCRIPTION
                          </div>
                          <div className="mt-3 text-xs text-black">
                            {e.trainName}
                          </div>
                          <div className="mt-1 text-xs text-black font-medium ">
                            {dataDetailTrain[i].berangkat_nama_kota} -{" "}
                            {dataDetailTrain[i].tujuan_nama_kota}
                          </div>
                          <div className="mt-3 text-xs text-black">
                            {parseTanggal(dataDetailTrain[i].departureDate)}
                          </div>
                          <div className="mt-1 text-xs text-black">
                            {dataDetailTrain[i].departureTime} -{" "}
                            {dataDetailTrain[i].arrivalTime}
                          </div>
                        </div>
                        <div className="p-4 border-t">
                          <div className="text-xs text-black">
                            LIST PASSENGERS
                          </div>
                          {passengers.adults &&
                            passengers.adults.length > 0 &&
                            passengers.adults.map((e, i) => (
                              <div className="mt-3 text-xs text-black font-medium ">
                                {e.name} (Adult)
                              </div>
                            ))}
                          {passengers.children &&
                            passengers.children.length > 0 &&
                            passengers.children.map((e, i) => (
                              <div className="mt-3 text-xs text-black font-medium ">
                                {e.name} (Children)
                              </div>
                            ))}
                          {passengers.infants &&
                            passengers.infants.length > 0 &&
                            passengers.infants.map((e, i) => (
                              <div className="mt-3 text-xs text-black font-medium ">
                                {e.name} (Infants)
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  ))}
                  <div className="hidden md:block mt-2">
                    <Alert
                      message={`Expired Booking : ${remainingBookTime}`}
                      banner
                    />
                  </div>
                  {callbackBoolean == true ? (
                    <div className="mt-2 py-4 rounded-md border border-gray-200 shadow-sm">
                      <>
                        <div className="px-8 py-4 text-sm text-black">
                          Tekan tombol dibawah ini untuk melanjutkan proses
                          transaksi.
                        </div>
                        <div className="flex justify-center">
                          <ButtonAnt
                            onClick={handleCallbackSubmit}
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 px-8 font-semibold"
                            loading={isLoading}
                          >
                            Bayar Sekarang
                          </ButtonAnt>
                        </div>
                      </>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                {callbackBoolean == true ? (
                  <div className="block xl:hidden mt-8 py-4 rounded-md border border-gray-200 shadow-sm">
                    <>
                      <div className="flex justify-center">
                        <ButtonAnt
                          onClick={handleCallbackSubmit}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 mx-2 font-semibold"
                          loading={isLoading}
                        >
                          Bayar Sekarang
                        </ButtonAnt>
                      </div>
                    </>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
