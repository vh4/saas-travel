import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { useNavigate, createSearchParams } from "react-router-dom";
import { TiketContext } from "../../App";
import { Button as ButtonAnt } from "antd";
import { notification } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal } from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import PageExpired from "../components/Expired";
import BayarLoading from "../components/trainskeleton/bayar";
import {Typography } from 'antd';

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

    Promise.all([getDataTrain(), getHasilBooking(), cekCallbakIsMitra()])
      .then(([ResponsegetDataTrain, ResponsegetHasilBooking, cekCallbakIsMitra]) => {
        
        
        if(cekCallbakIsMitra.data.rc == '00'){
          setcallbackBoolean(true);
        }

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

        } else {
          setErrPage(true);
        }

        if (ResponsegetHasilBooking) {
          setHasilBooking(ResponsegetHasilBooking.hasil_book);
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

          setTotalAdult(passengers.adults.length);
          //   setTotalChild(passengers.children ? passengers.children.length : 0);
          setTotalInfant(passengers.infants.length);
        } else {
          setErrPage(true);
        }

        setTimeout(() => {
          setIsLoadingPage(false);
        }, 100);

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
  }, [uuid_book, uuid_train_data, token]);

  // async function getDataTrain() {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_HOST_API}/travel/train/search/k_search/${uuid_train_data}`
  //     );

  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async function getDataTrain() {
    try {
      const response = localStorage.getItem(`data:k-train/${uuid_train_data}`);
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  // async function getHasilBooking() {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_HOST_API}/travel/train/book/k_book/${uuid_book}`
  //     );
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }


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
      const response = localStorage.getItem(`data:k-book/${uuid_book}`);
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

  async function handleCallbackSubmit(e){
      e.preventDefault();
      setIsLoading(true);
      
      setTimeout(async () => {
        
        const dataParse = JSON.parse(localStorage.getItem(`data:k-book/${uuid_book}`))

        const response = await axios.post(
          `${process.env.REACT_APP_HOST_API}/travel/train/callback`,
          {
            id_transaksi:dataParse.hasil_book.transactionId
          }
        );

      if(response.data.rc == '00'){
        navigate('/')
      }else{
        failedNotification(response.data.rd)
      }

      setIsLoading(false);

      }, 100);
    
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
              <AiOutlineCheckCircle className="text-slate-500" size={20} />
              <div className="hidden xl:flex text-slate-500">
                Detail pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="hidden xl:flex text-gray-500"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <AiOutlineCheckCircle className="text-slate-500" size={20} />
              <div className="hidden xl:flex text-slate-500">
                Konfirmasi pesanan
              </div>
            </div>
            <div className="hidden xl:flex">
              <MdHorizontalRule
                size={20}
                className="text-gray-500 hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <div className="font-medium xl:font-bold hidden xl:block text-blue-500">
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
              <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
                {/* mobile sidebar */}
                <div className="sidebar block xl:hidden w-full xl:w-1/2">
                  <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                    <div className="px-4 py-2">
                      {/* <div className="text-gray-500 text-xs">Booking ID</div> */}
                      <div className="text-gray-800 font-medium xl:font-bold text-sm">Transaksi ID</div>

                      <div className="mt-2 font-medium xl:font-bold text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>{hasilBooking && hasilBooking.transactionId} </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan transaksi id diatas untuk melakukan inq ulang dan pembayaran.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-gray-800">
                        {dataBookingTrain[0].trainName}
                      </div>
                      <div className="mt-1 text-xs text-gray-800 font-medium xl:font-bold">
                        {dataDetailTrain[0].berangkat_nama_kota} -{" "}
                        {dataDetailTrain[0].tujuan_nama_kota}
                      </div>
                      <div className="mt-3 text-xs text-gray-800">
                        {parseTanggal(dataBookingTrain[0].departureDate)}
                      </div>
                      <div className="mt-1 text-xs text-gray-800">
                        {dataBookingTrain[0].departureTime} -{" "}
                        {dataBookingTrain[0].arrivalTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full mx-0 2xl:mx-4">
                  {/* adult */}
                  {passengers.adults.length > 0
                    ? passengers.adults.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="mt-4">
                              <div className="px-2 py-2 text-gray-800 border-b border-gray-200 text-sm font-medium xl:font-bold">
                                {e.name}
                              </div>
                              <div className="mt-2 grid grid-cols-2">
                                <div className="px-2 py-2 text-sm">
                                  <div className="text-gray-800 font-medium xl:font-bold">NIK</div>
                                  <div className="mt-2 text-gray-800 text-xs">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-sm">
                                  <div className="text-gray-800 font-medium xl:font-bold">Nomor HP</div>
                                  <div className="mt-2 text-gray-800 text-xs">{e.phone}</div>
                                </div>
                                <div className="px-2 py-2 text-sm">
                                  <div className="text-gray-800 font-medium xl:font-bold">Kursi</div>
                                  <div className="mt-2 text-gray-800 text-xs">
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
                                    {hasilBooking !== null
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
                  {passengers.infants.length > 0
                    ? passengers.infants.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="mt-2">
                              <div className="px-2 py-2 text-gray-800 border-b border-gray-200 text-sm font-medium xl:font-bold">
                                {e.name}
                              </div>
                              <div className="mt-2 grid grid-cols-2">
                                <div className="px-2 py-2 text-sm">
                                  <div className="text-gray-800 font-medium xl:font-bold">NIK</div>
                                  <div className="mt-2 text-gray-800 text-xs">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-sm">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-gray-800 text-xs">
                                    {e.birthdate}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-sm">
                                <div className="text-gray-800 font-medium xl:font-bold">Kursi</div>
                                  <div className="mt-2 text-gray-800 text-xs">
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
                  <div className="p-2 mt-2 w-full rounded-md border border-gray-200 shadow-sm">
                    <div className="p-2">
                      <div className="text-xs text-gray-800 font-medium xl:font-bold flex justify-between">
                        <div>
                          {dataBookingTrain && dataBookingTrain[0].trainName}{" "}
                          {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ""}{" "}
                          {TotalInfant > 0 ? `(Infants) x${TotalInfant}` : ""}
                        </div>
                        <div>
                          Rp.{" "}
                          {hasilBooking && toRupiah(hasilBooking.normalSales)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-gray-800 font-medium xl:font-bold flex justify-between">
                        <div>Biaya Admin (Fee)</div>
                        <div>
                          Rp.{" "}
                          {hasilBooking && toRupiah(hasilBooking.nominalAdmin)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-gray-800 font-medium xl:font-bold flex justify-between">
                        <div>Diskon (Rp.)</div>
                        <div>Rp. {hasilBooking && hasilBooking.discount}</div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-gray-800 font-medium xl:font-bold flex justify-between">
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
                {/* desktop sidebar */}
                <div className="sidebar hidden xl:block w-full xl:w-1/2">
                  <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                    <div className="px-4 py-2">
                      {/* <div className="text-gray-500 text-xs">Booking ID</div> */}
                      <div className="text-gray-800 text-xs">Transaksi ID</div>

                      <div className="mt-1 font-medium xl:font-bold text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>{hasilBooking && hasilBooking.transactionId} </Paragraph>

                                               
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan transaksi id diatas untuk melakukan inq ulang dan pembayaran.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-gray-800">
                        TRAIN DESCRIPTION
                      </div>
                      <div className="mt-3 text-xs text-gray-800">
                        {dataBookingTrain[0].trainName}
                      </div>
                      <div className="mt-1 text-xs text-gray-800 font-medium xl:font-bold">
                        {dataDetailTrain[0].berangkat_nama_kota} -{" "}
                        {dataDetailTrain[0].tujuan_nama_kota}
                      </div>
                      <div className="mt-3 text-xs text-gray-800">
                        {parseTanggal(dataBookingTrain[0].departureDate)}
                      </div>
                      <div className="mt-1 text-xs text-gray-800">
                        {dataBookingTrain[0].departureTime} -{" "}
                        {dataBookingTrain[0].arrivalTime}
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-gray-500">
                        LIST PASSENGERS
                      </div>
                      {passengers.adults &&
                        passengers.adults.length > 0 &&
                        passengers.adults.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium xl:font-bold">
                            {e.name} (Adult)
                          </div>
                        ))}
                      {passengers.children &&
                        passengers.children.length > 0 &&
                        passengers.children.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium xl:font-bold">
                            {e.name} (Children)
                          </div>
                        ))}
                      {passengers.infants &&
                        passengers.infants.length > 0 &&
                        passengers.infants.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium xl:font-bold">
                            {e.name} (Infants)
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                  {callbackBoolean == true ? (
                    <>
                      <div className="px-8 py-4 text-sm text-gray-500">
                      Tekan tombol dibawah ini untuk melanjutkan proses transaksi.
                      </div>                   
                       <div className="flex justify-center">
                        <ButtonAnt
                          onClick={handleCallbackSubmit}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 px-12 font-semibold mt-4"
                          loading={isLoading}
                        >
                          Selesai
                        </ButtonAnt>
                      </div>                   
                    </>
                  ):(
                    <>
                      <div className="px-8 py-4 text-sm text-gray-500">
                      Untuk payment silahkan menggunakan api, atau silahkan hubungi tim bisnis untuk info lebih lanjut
                      </div>
                      <div className="flex justify-center">
                        <ButtonAnt
                          onClick={handlerPembayaran}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 mx-2 font-semibold mt-4"
                          loading={isLoading}
                          disabled
                        >
                          Langsung Bayar
                        </ButtonAnt>
                      </div>
                    </>
                    )}
                  </div>
                </div>
                  <div className="block xl:hidden mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                    {callbackBoolean == true ? (
                      <>
                         <div className="flex justify-center">
                          <ButtonAnt
                            onClick={handleCallbackSubmit}
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 mx-2 font-semibold mt-4"
                            loading={isLoading}
                          >
                            Selesai
                          </ButtonAnt>
                        </div>                      
                      </>
                      ) : (
                      <>
                        <div className="px-8 py-4 text-sm text-gray-500">
                        Untuk payment silahkan menggunakan api, atau silahkan hubungi tim bisnis untuk info lebih lanjut
                        </div>
                        <div className="flex justify-center">
                          <ButtonAnt
                            onClick={handlerPembayaran}
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 mx-2 font-semibold mt-4"
                            loading={isLoading}
                            disabled
                          >
                            Langsung Bayar
                          </ButtonAnt>
                        </div>                     
                      </>
                    )}

                  </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
