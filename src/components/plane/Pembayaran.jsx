import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
// import { RxCrossCircled } from "react-icons/rx";
import { MdHorizontalRule } from "react-icons/md";
import { useNavigate, createSearchParams } from "react-router-dom";
import { TiketContext } from "../../App";
import { BsArrowRightShort } from "react-icons/bs";
import { Button, message, Alert } from "antd";
import { remainingTime, parseTanggal as tanggalParse } from "../../helpers/date";
import { toRupiah } from "../../helpers/rupiah";
import Page500 from "../components/500";
import Page400 from "../components/400";
import BayarLoading from "../components/planeskeleton/bayar";
import {Typography } from 'antd';
import moment from "moment";
import PageExpired from "../components/Expired";

export default function Pembayaran() {
  const [searchParams, setSearchParams] = useSearchParams();
  const v_flight = searchParams.get("v_flight");
  const v_book = searchParams.get("v_book");
  const { Paragraph } = Typography;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { dispatch } = useContext(TiketContext);
  const [isLoading, setIsLoading] = useState(false);

  const [dataDetail, setdataDetail] = useState(null);
  const [dataDetailPassenger, setdataDetailPassenger] = useState(null);
  const [hasilBooking, sethasilBooking] = useState(null);
  const [dataDetailForBooking, setdataDetailForBooking] = useState(null);

  const [TotalAdult, setTotalAdult] = useState(0);
  const [TotalChild, setTotalChild] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration

  const [callbackBoolean, setcallbackBoolean] = useState(false);
  const [expiredBookTime, setExpiredBookTime] = useState(null);
  const [isNavigationDone, setIsNavigationDone] = useState(false);

  function gagal(rd) {
    messageApi.open({
      type: "error",
      content:
        "Failed, " +
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
      duration: 5,
    });
  }

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  // useEffect(() => {
  //   if (token === null || token === undefined) {
  //     setErr(true);
  //   }

  //   Promise.all([getInfoBooking(), getSearchFlightInfo()])
  //     .then(([getInfoBooking, getSearchFlightInfo]) => {
  //       const dataDetail = getSearchFlightInfo.data._flight;
  //       const dataDetailPassenger = getInfoBooking.data._DetailPassenger;
  //       const hasilBooking = getInfoBooking.data._Bookingflight;
  //       const dataDetailForBooking =
  //         getSearchFlightInfo.data._flight_forBooking;

  //       if (getInfoBooking.data.rc === "00") {
  //         setdataDetailPassenger(dataDetailPassenger);
  //         sethasilBooking(hasilBooking);
  //       } else {
  //         setErrPage(true);
  //       }

  //       if (getSearchFlightInfo.data.rc === "00") {
  //         setdataDetail(dataDetail);
  //         setdataDetailForBooking(dataDetailForBooking);

  //         setTotalAdult(dataDetail[0].adult);
  //         setTotalChild(dataDetail[0].child);
  //         setTotalInfant(dataDetail[0].infant);
  //       } else {
  //         setErrPage(true);
  //       }

  //       setTimeout(() => {

  //         setIsLoadingPage(false);
          
  //       }, 2000);

        
  //     })
  //     .catch(() => {
  //       setIsLoadingPage(false);
  //       setErrPage(true);
  //     });
  // }, [v_book, v_flight, token]);

  // async function getInfoBooking() {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_HOST_API}/travel/pesawat/book/flight/${v_book}`
  //     );
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    Promise.all([getInfoBooking(), getSearchFlightInfo(), cekCallbakIsMitra()])
      .then(([getInfoBooking, getSearchFlightInfo, cekCallbakIsMitra]) => {
        const dataDetail = getSearchFlightInfo._flight;
        const dataDetailPassenger = getInfoBooking._DetailPassenger;
        const hasilBooking = getInfoBooking._Bookingflight;
        const dataDetailForBooking =
          getSearchFlightInfo._flight_forBooking;

          if(cekCallbakIsMitra.data.rc == '00'){
            setcallbackBoolean(true);
          }

        if (getInfoBooking) {
          setdataDetailPassenger(dataDetailPassenger);
          sethasilBooking(hasilBooking);
          setExpiredBookTime(hasilBooking.timeLimit || moment().add(1, 'hours'))

        } else {
          setErrPage(true);
        }

        if (getSearchFlightInfo) {
          setdataDetail(dataDetail);
          setdataDetailForBooking(dataDetailForBooking);

          setTotalAdult(dataDetail[0].adult);
          setTotalChild(dataDetail[0].child);
          setTotalInfant(dataDetail[0].infant);
        } else {
          setErrPage(true);
        }

        // Set booking expiration flag
        if (
          hasilBooking &&
          new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()
        ) {
          setIsBookingExpired(true);
        }else {
          setIsBookingExpired(false);
        }


        setTimeout(() => {

          setIsLoadingPage(false);
          
        }, 1000);
        
      })
      .catch(() => {
        setIsLoadingPage(false);
        setErrPage(true);
      });
  }, [v_book, v_flight, token]);

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

  async function getInfoBooking() {
    try {
      const response = localStorage.getItem(`data:f-book/${v_book}`)
      return JSON.parse(response);

    } catch (error) {
      return null;
    }
  }

  async function getSearchFlightInfo() {
    try {
      const response = localStorage.getItem(`data:flight/${v_flight}`);
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


  async function handlerPembayaran(e) {
    e.preventDefault();
    setIsLoading(true);

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/flight/payment`,
      {
        airline: dataDetailForBooking.airline,
        transactionId: hasilBooking.transactionId,
        bookingCode: hasilBooking.bookingCode,
        simulateSuccess: process.env.REACT_APP_SIMUATION_PAYMENT,
        paymentCode: "",
        token: token,
      }
    );

    if (response.data.rc === "00") {
      const params = {
        success: JSON.stringify({
          airline: dataDetail.airline,
          booking_id: hasilBooking.bookingCode,
          nomor_hp_booking: dataDetailPassenger.adults[0].nomor,
          id_transaksi: hasilBooking.transactionId,
          nominal_admin: hasilBooking.nominalAdmin,
          url_etiket: response.data.data.url_etiket,
          nominal_sales: response.data.data.nominal,
          total_dibayar: toRupiah(
            parseInt(hasilBooking.nominal) + parseInt(hasilBooking.nominalAdmin)
          ),
        }),
      };

      dispatch({
        type: "PAY_FLIGHT",
      });

      navigate({
        pathname: "/flight/tiket-pesawat",
        search: `?${createSearchParams(params)}`,
      });
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        gagal(response.data.rd);
      }, 1000);
    }
  }

  async function handleCallbackSubmit(e){
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(async () => {
      
      const dataParse = JSON.parse(localStorage.getItem(`data:f-book/${v_book}`))

      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/plane/callback`,
        {
          id_transaksi:dataParse._Bookingflight.transactionId
        }
      );

    if(response.data.rc == '00'){
      navigate('/')
    }else{
      gagal(response.data.rd)
    }

    setIsLoading(false);

    }, 100); //
  
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
      ) : 
      isBookingExpired === true ? (
        <>
          <PageExpired />
        </>
      ) :
      (
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
                className="text-gray-500 hidden xl:flex"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <div className="hidden xl:flex text-blue-500 font-medium xl:font-bold">
                Pembayaran tiket
              </div>
            </div>
            {/* <div>
              <MdHorizontalRule
                size={20}
                className="text-gray-500 hidden xl:flex"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <RxCrossCircled size={20} className="text-slate-500" />
              <div className="text-slate-500">E-Tiket</div>
            </div> */}
          </div>

          {isLoadingPage === true ? (
            <>
              <BayarLoading TotalAdult={TotalAdult} TotalChild={TotalChild} TotalInfant={TotalInfant} />
            </>
          ) : (
            <>
              <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
                <div className="block md:hidden mt-2">
                    <Alert message={`Expired Booking : ${remainingBookTime}`} type="info" showIcon closable />
                </div>
              {/* mobile sidebar */}
                <div className="block xl:hidden sidebar w-full xl:w-1/2">
                  <div className="mt-2 py-2 rounded-md border border-gray-200 shadow-sm">
                    <div className="px-4 py-2 mb-4">
                      {/* <div className="text-gray-500 text-xs">Booking ID</div> */}
                      <div className="text-gray-800 text-sm font-semibold">Transaksi ID</div>                      
                        <div className="mt-2 font-medium xl:font-bold text-blue-500 text-[18px]">
                          {/* {hasilBooking && hasilBooking.bookingCode} */}
                          <Paragraph copyable>{hasilBooking && hasilBooking.transactionId}</Paragraph>
                        </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan transaksi id diatas untuk melakukan inq ulang dan pembayaran.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      {dataDetail &&
                        dataDetail.map((dataDetail) => (
                          <>
                            <div className="mt-4 mb-4 flex items-center space-x-2">
                              <div>
                                <img
                                  src={dataDetail.airlineIcon}
                                  width={50}
                                  alt="logo.png"
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                {dataDetail.airlineName}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-slate-700 font-medium xl:font-bold">
                              <div>{dataDetail.departureName}</div>{" "}
                              <BsArrowRightShort />{" "}
                              <div>{dataDetail.arrivalName}</div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500">
                              {tanggalParse(dataDetail.departureDate)}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {dataDetail.departureTime} -{" "}
                              {dataDetail.arrivalTime}
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
               
                <div className="mt-4 w-full mx-0 2xl:mx-4">
                  {/* adult */}
                  {dataDetailPassenger && dataDetailPassenger.adults.length > 0
                    ? dataDetailPassenger.adults.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="mt-4">
                              <div className="px-2 py-2 text-gray-800 border-b border-gray-200 text-sm font-medium xl:font-bold">
                                {e.nama_depan} {e.nama_belakang}
                              </div>
                              <div className="grid grid-cols-2 mt-2">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    NIK
                                  </div>
                                  <div className="mt-2 text-gray-800">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    Nomor HP
                                  </div>
                                  <div className="mt-2 text-gray-800">{e.nomor}</div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    Email
                                  </div>
                                  <div className="mt-2 text-gray-800">{e.email}</div>
                                </div>
                              </div>
                              <div className="px-2 py-2 text-xs">
                                <div className="text-gray-800 font-medium xl:font-bold">
                                  Tanggal Lahir
                                </div>
                                <div className="mt-2 text-gray-800">
                                  {e.birthdate}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}

                  {/* Childs */}
                  {dataDetailPassenger &&
                  dataDetailPassenger.children.length > 0
                    ? dataDetailPassenger.children.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="mt-4">
                              <div className="px-2 py-2 text-gray-800 border-b border-gray-200 text-sm font-medium xl:font-bold">
                                {e.nama_depan} {e.nama_belakang}
                              </div>
                              <div className="flex space-x-8 mt-2 items-center">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    NIK/ No.Ktp
                                  </div>
                                  <div className="mt-2 text-gray-800">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-gray-800">
                                    {e.birthdate}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}

                  {/* infants */}
                  {dataDetailPassenger && dataDetailPassenger.infants.length > 0
                    ? dataDetailPassenger.infants.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="mt-4">
                              <div className="px-2 py-2 text-gray-800 border-b border-gray-200 text-sm font-medium xl:font-bold">
                                {e.nama_depan} {e.nama_belakang}
                              </div>
                              <div className="mt-2 flex space-x-8">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    NIK/ No.Ktp
                                  </div>
                                  <div className="mt-2 text-gray-800">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-gray-800 font-medium xl:font-bold">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-gray-800">
                                    {e.birthdate}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}
                  <div className="p-4 mt-2 w-full rounded-md border border-gray-200 shadow-sm">
                    <div className="mt-4">
                      <div className="text-xs text-gray-800 font-medium xl:font-bold flex justify-between">
                        <div>
                          {dataDetail && dataDetail.airlineName}{" "}
                          {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ""}{" "}
                          {TotalChild > 0 ? `(Childen) x${TotalChild}` : ""}{" "}
                          {TotalInfant > 0 ? `(Infants) x${TotalInfant}` : ""}
                        </div>
                        <div>
                          Rp. {toRupiah(hasilBooking && hasilBooking.nominal)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-gray-800 font-medium xl:font-bold flex justify-between">
                        <div>Biaya Admin (Fee)</div>
                        <div>
                          Rp.{" "}
                          {toRupiah(hasilBooking && hasilBooking.nominalAdmin)}
                        </div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-gray-800 font-medium xl:font-bold flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {toRupiah(
                            parseInt(hasilBooking && hasilBooking.nominal) +
                              parseInt(
                                hasilBooking && hasilBooking.nominalAdmin
                              )
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
                      <div className="text-gray-500 text-xs">Transaksi ID</div>                      
                        <div className="mt-1  font-medium xl:font-bold text-blue-500 text-[18px]">
                          {/* {hasilBooking && hasilBooking.bookingCode} */}
                          <Paragraph copyable>{hasilBooking && hasilBooking.transactionId}</Paragraph>
                        </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan transaksi id diatas untuk melakukan inq ulang dan pembayaran.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-gray-500">
                        PESAWAT DESCRIPTION
                      </div>
                      {dataDetail &&
                        dataDetail.map((dataDetail) => (
                          <>
                            <div className="mt-2 mb-2 flex items-center space-x-2">
                              <div>
                                <img
                                  src={dataDetail.airlineIcon}
                                  width={50}
                                  alt="logo.png"
                                />
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                {dataDetail.airlineName}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 text-xs text-slate-700 font-medium xl:font-bold">
                              <div>{dataDetail.departureName}</div>{" "}
                              <BsArrowRightShort />{" "}
                              <div>{dataDetail.arrivalName}</div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500">
                              {tanggalParse(dataDetail.departureDate)}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {dataDetail.departureTime} -{" "}
                              {dataDetail.arrivalTime}
                            </div>
                          </>
                        ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-gray-500">
                        LIST PASSENGERS
                      </div>
                      {dataDetailPassenger.adults &&
                        dataDetailPassenger.adults.length > 0 &&
                        dataDetailPassenger.adults.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium xl:font-bold">
                            {e.nama_depan} {e.nama_belakang} (Adult)
                          </div>
                        ))}
                      {dataDetailPassenger.children &&
                        dataDetailPassenger.children.length > 0 &&
                        dataDetailPassenger.children.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium xl:font-bold">
                            {e.nama_depan} {e.nama_belakang} (Children)
                          </div>
                        ))}
                      {dataDetailPassenger.infants &&
                        dataDetailPassenger.infants.length > 0 &&
                        dataDetailPassenger.infants.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium xl:font-bold">
                            {e.nama_depan} {e.nama_belakang} (Infants)
                          </div>
                        ))}
                    </div>
                    {/* <div className="p-4 border-t">
                            <div>
                                < Timer />
                            </div>
                        </div> */}
                  </div>

                  {/* desktop payment button */}
                  <div className="hidden md:block mt-2">
                       <Alert message={`Expired Booking : ${remainingBookTime}`} type="info" showIcon closable />
                    </div>
                  <div className="hidden xl:block mt-2 py-2 rounded-md border border-gray-200 shadow-sm">
                  {callbackBoolean == true ? (
                    <>
                      <div className="px-8 py-4 text-sm text-gray-500">
                      Tekan tombol dibawah ini untuk melanjutkan proses transaksi.
                      </div>                   
                       <div className="flex justify-center">
                        <Button
                          onClick={handleCallbackSubmit}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 px-12 font-semibold mt-4"
                          loading={isLoading}
                        >
                          Selesai
                        </Button>
                      </div>                   
                    </>
                  ):(
                    <>
                      {/* <div className="px-8 py-4 text-sm text-gray-500">
                      Untuk payment silahkan menggunakan api, atau silahkan hubungi tim bisnis untuk info lebih lanjut
                      </div>
                      <div className="flex justify-center">
                        <Button
                          onClick={handlerPembayaran}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 mx-2 font-semibold mt-4"
                          loading={isLoading}
                          disabled
                        >
                          Langsung Bayar
                        </Button>
                      </div> */}
                    </>
                    )}
                  </div>
                </div>
                <div className="block xl:hidden mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                    {callbackBoolean == true ? (
                      <>
                         <div className="flex justify-center">
                          <Button
                            onClick={handleCallbackSubmit}
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 mx-2 font-semibold mt-4"
                            loading={isLoading}
                          >
                            Selesai
                          </Button>
                        </div>                      
                      </>
                      ) : (
                      <>
                        {/* <div className="px-8 py-4 text-sm text-gray-500">
                        Untuk payment silahkan menggunakan api, atau silahkan hubungi tim bisnis untuk info lebih lanjut
                        </div>
                        <div className="flex justify-center">
                          <Button
                            onClick={handlerPembayaran}
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 mx-2 font-semibold mt-4"
                            loading={isLoading}
                            disabled
                          >
                            Langsung Bayar
                          </Button>
                        </div>                      */}
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
