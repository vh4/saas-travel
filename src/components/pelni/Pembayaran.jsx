import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { TiketContext } from "../../App";
import { Button as ButtonAnt, Alert } from "antd";
import { notification } from "antd";
import Page400 from "../components/400";
import Page500 from "../components/500";
import { parseTanggal, remainingTime } from "../../helpers/date";
import { toRupiah } from "../../helpers/rupiah";
import BayarLoading from "../components/pelniskeleton/bayar";
import { Typography } from "antd";
import { IoArrowForwardOutline } from "react-icons/io5";
import moment from "moment";
import PageExpired from "../components/Expired";
import Tiket from "./Tiket";

export default function Pembayaran() {
  const navigate = useNavigate();

  const { dispatch } = useContext(TiketContext);
  const { Paragraph } = Typography;

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [api, contextHolder] = notification.useNotification();

  //loading hanlde submit pembayaran.
  const [isLoading, setLoading] = React.useState(false);
  const [passengers, setPassengers] = useState({});

  let { id } = useParams();
  const [book, setBook] = useState(null);

  const [bookInfo, setBookInfo] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errPage, setErrPage] = useState(false);

  const [TotalAdult, setTotalAdult] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);
  const [callbackBoolean, setcallbackBoolean] = useState(false);
  const [expiredBookTime, setExpiredBookTime] = useState(null);
  const [isNavigationDone, setIsNavigationDone] = useState(false);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration
  const [whiteList, setWhiteList] = useState(0);
  const [ispay, setispay] = useState(false);
  const [hasilbayar, setHasilbayar] = useState(null);

  const [err, setErr] = useState(false);

  // useEffect(() => {
  //   if (token === null || token === undefined) {
  //     setErr(true);
  //   }

  //   Promise.all([getInfoBooking(), getInfoBookingInfo(), getDataPassengers()])
  //     .then(([bookResponse, bookInfoResponse, passenggerResponse]) => {
  //       if (bookResponse.data.rc === "00") {
  //         setBook(bookResponse.data.data);
  //       }else{
  //         setErrPage(true);
  //       }

  //       if (bookInfoResponse.data.rc === "00") {
  //         setBookInfo(bookInfoResponse.data.data);
  //       }else{
  //         setErrPage(true);
  //       }

  //       if (passenggerResponse.data.rc === "00") {
  //         setPassengers(passenggerResponse.data);
  //         setTotalAdult(passenggerResponse.data.adult);
  //         setTotalInfant(passenggerResponse.data.infant);

  //       }else{
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
  // }, [id, token]);

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    Promise.all([getDataAllBook(), cekCallbakIsMitra(), cekWhiteListUsername()])
      .then(([getDataAllBook, cekCallbakIsMitra, cekWhiteListUsername]) => {
        const bookResponse = getDataAllBook.book;
        const passenggerResponse = getDataAllBook;
        const bookInfoResponse = getDataAllBook.infobooking;
        const hasilBooking = bookResponse.data.data;

        if (cekCallbakIsMitra.data.rc == "00") {
          setcallbackBoolean(true);
        }

        const isWhiteList = cekWhiteListUsername?.is_whitelist || 0;

        setWhiteList(isWhiteList);

        if (bookResponse.data.rc === "00") {
          setBook(bookResponse.data.data);
          setExpiredBookTime(hasilBooking.payLimit || moment().add(1, "hours"));
        } else {
          setErrPage(true);
        }

        if (bookInfoResponse.data.rc === "00") {
          setBookInfo(bookInfoResponse.data.data);
        } else {
          setErrPage(true);
        }

        if (passenggerResponse) {
          setPassengers(passenggerResponse);
          setTotalAdult(passenggerResponse.adult);
          setTotalInfant(passenggerResponse.infant);
        } else {
          setErrPage(true);
        }

        // Set booking expiration flag
        if (
          hasilBooking &&
          new Date(hasilBooking.payLimit).getTime() < new Date().getTime()
        ) {
          setIsBookingExpired(true);
        } else {
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
  }, [id, token]);

  const [remainingBookTime, setremainingBookTime] = useState(
    remainingTime(expiredBookTime)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setremainingBookTime(remainingTime(expiredBookTime));

      if (book && new Date(book.payLimit).getTime() < new Date().getTime()) {
        setIsBookingExpired(true);

                
        localStorage.removeItem(`data:pl-passenger/${id}`);
        localStorage.removeItem(`data:pelni/${id}`);

      } else {
        setIsBookingExpired(false);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [expiredBookTime]);

  // async function getInfoBooking() {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_HOST_API}/travel/pelni/book/${id[1]}`
  //     );
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async function getInfoBookingInfo() {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_HOST_API}/travel/pelni/book_info/${id[1]}`
  //     );
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async function getDataAllBook() {
    try {
      const response = localStorage.getItem(`data:pl-passenger/${id}`);
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  // async function getDataPassengers() {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_HOST_API}/travel/pelni/booking/passengers/${id}`
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

  async function cekWhiteListUsername() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/travel/is_whitelist`
      );
      
      return response.data;

    } catch (error) {
      throw error;
    }
  }

  const failedNotification = (rd) => {
    api["error"]({
      message: "Error!",
      description: `${rd.toLowerCase().charAt(0).toUpperCase()}${rd
        .slice(1)
        .toLowerCase()}`,
    });
  };

  const successNotification = () => {
    api["success"]({
      message: "Success!",
      description: "Successfully, pindah kursi anda sudah berhasil!.",
      duration: 7,
    });
  };


  async function handlerPembayaran(e) {
    e.preventDefault();
    setLoading(true);

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/payment`,
      {
        paymentCode: book?.paymentCode,
        transactionId: book?.transactionId,
        simulateSuccess: whiteList == 1 ? "yes" : process.env.REACT_APP_SIMUATION_PAYMENT, //
        token: token
      }
      
    );

    if (response.data.rc === "00") {
      const params = {
        // airline: dataDetail.airline,
        booking_id: response.data?.data?.bookCode,
        nomor_hp_booking: book.paymentCode,
        id_transaksi: response.data?.data?.transaction_id,
        nominal_admin: book.nominal_admin,
        url_etiket: response.data?.data?.url_etiket,
        nominal_sales: book.normalSales,
        total_dibayar: toRupiah(
          parseInt(book.normalSales) + parseInt(book.nominal_admin)
        ),
      }
      

      setispay(true);
      setHasilbayar(params);

    //   // dispatch({
    //   //   type: "PAY_FLIGHT",
    //   // });

    //   // navigate({
    //   //   pathname: "/flight/tiket-pesawat",
    //   //   search: `?${createSearchParams(params)}`,
    //   // });

      setLoading(false);

      localStorage.removeItem(`data:pl-passenger/${id}`);
      localStorage.removeItem(`data:pelni/${id}`);

    } else {
      setTimeout(() => {
        setLoading(false);
        failedNotification(response.data.rd);
      }, 1000);
    }
  }
  async function handleCallbackSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      const dataParse = JSON.parse(
        localStorage.getItem(`data:pl-passenger/${id}`)
      );

      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/callback`,
        {
          id_transaksi: dataParse.transactionId,
        }
      );

      if (response.data.rc == "00") {
        navigate("/");

        localStorage.removeItem(`data:pl-passenger/${id}`);
        localStorage.removeItem(`data:pelni/${id}`);

      } else {
        failedNotification(response.data.rd);
      }

      setLoading(false);
    }, 100);
  }

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
      ) : isBookingExpired === true ? (
        <>
          <PageExpired />
        </>
      ) :
      ispay == true ? 
      (
      <>
        <Tiket data={hasilbayar} />
      </>)
      
      : (
        <>
          {/* header kai flow */}
          <div className="px-0 md:px-12 flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <AiOutlineCheckCircle className="text-black" size={20} />
              <div className="hidden xl:flex text-black">Detail pesanan</div>
              <div className="block xl:hidden text-black">Detail</div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="text-black hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <div className="hidden xl:block text-blue-500 font-bold">
                Pembayaran tiket
              </div>
            </div>
            {/* <div>
              <MdHorizontalRule
                size={20}
                className="text-black hidden xl:flex"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <RxCrossCircled size={20} className="text-black" />
              <div className="text-black">E-Tiket</div>
            </div> */}
          </div>
          {isLoadingPage === true ? (
            <>
              <BayarLoading
                total={parseInt(TotalAdult) + parseInt(TotalInfant)}
              />
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
                <div className="block xl:hidden sidebar w-full xl:w-2/3 2xl:w-1/2">
                  <div className="mt-2 py-2 md:py-4 rounded-md border-b border-gray-200 shadow-sm">
                    <div className="px-4 py-2 mb-4">
                      {/* <div className="text-black text-xs">Status Booking</div> */}
                      <div className="text-black text-sm font-semibold">
                        Transaksi ID
                      </div>
                      <div className="mt-2 font-medium  text-blue-500 text-[18px]">
                        <Paragraph copyable>
                          {book && book.transactionId}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="mt-3 text-xs text-black">
                        {book.SHIP_NAME}
                      </div>
                      <div className="flex space-x-4">
                        <div className="mt-1 text-xs text-black font-medium ">
                          {passengers.pelabuhan_asal}
                        </div>
                        <IoArrowForwardOutline
                          className="text-black"
                          size={18}
                        />
                        <div className="mt-1 text-xs text-black font-medium ">
                          {passengers.pelabuhan_tujuan}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-black">
                        {parseTanggal(passengers.departureDate)} -{" "}
                        {parseTanggal(book.arrivalDate)}
                      </div>
                      <div className="mt-1 text-xs text-black">
                        {book.departureTime} - {book.arrivalTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full mx-0 2xl:mx-4">
                  {/* adult and infant */}
                  {bookInfo.PAX_LIST.length > 0
                    ? bookInfo.PAX_LIST.map((e, i) => (
                        <>
                          <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
                            <div className="">
                              <div className="px-2 py-4 md:py-2 text-black border-b border-gray-200 text-xs font-medium ">
                                {bookInfo.PAX_LIST[i][0]} (
                                {bookInfo.PAX_LIST[i][6] == "N/A"
                                  ? "INFANT"
                                  : "ADULT"}
                                )
                              </div>
                              <div className="mt-2 md:mt-4 grid grid-cols-2 md:grid-cols-3">
                                {/* <div className="px-2 md:px-4 py-2 text-sm">
                                          <div className="text-black">NIK</div>
                                          <div className="font-bold text-xs text-black">{bookInfo.PAX_LIST[i][1]}</div>
                                      </div> */}
                                <div className="px-2 py-2">
                                  <div className="text-black font-medium text-xs">
                                    Nomor HP
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {bookInfo.CALLER}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-black text-xs font-medium ">
                                    Kursi
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {bookInfo.PAX_LIST[i][6] == "N/A"
                                      ? " Non Seats"
                                      : `${
                                          bookInfo.PAX_LIST[i][2] +
                                          "/" +
                                          bookInfo.PAX_LIST[i][5] +
                                          "-" +
                                          bookInfo.PAX_LIST[i][4]
                                        }`}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    Kelas
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {bookInfo.CLASS} / Subclass (
                                    {bookInfo.SUBCLASS})
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}
                  <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
                    <div className="p-2">
                      <div className="text-xs text-black font-medium  flex justify-between">
                        <div>
                          {bookInfo && bookInfo.SHIP_NAME}{" "}
                          {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ""}{" "}
                          {TotalInfant > 0 ? `(Infant) x${TotalInfant}` : ""}
                        </div>
                        <div>Rp. {book && toRupiah(book.normalSales)}</div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Biaya Admin (Fee) x{TotalAdult + TotalInfant}</div>
                        <div>
                          Rp.{" "}
                          {book &&
                            toRupiah(
                              book.nominal_admin
                            )}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Diskon (Rp.)</div>
                        <div>Rp. {book && book.discount}</div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-black font-medium  flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {book &&
                            toRupiah(
                              parseInt(book.normalSales) -
                                parseInt(book.discount) +
                                parseInt(book.nominal_admin)
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                {/* desktop sidebar */}
                <div className="hidden xl:block sidebar w-full xl:w-2/3 2xl:w-1/2">
                  <div className="mt-8 py-2 rounded-md border-b border-gray-200 shadow-sm">
                    <div className="px-4 py-2">
                      {/* <div className="text-black text-xs">Status Booking</div> */}
                      <div className="text-black text-xs">Transaksi ID</div>
                      <div className="mt-1 font-medium  text-blue-500 text-[18px]">
                        <Paragraph copyable>
                          {book && book.transactionId}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t md:0 mt-2">
                      <div className="text-xs text-black">
                        PELNI DESCRIPTION
                      </div>
                      <div className="mt-3 md:mt-4 text-xs text-black">
                        {book.SHIP_NAME}
                      </div>
                      <div className="flex space-x-4">
                        <div className="mt-1 md:mt-2 text-xs text-black font-medium ">
                          {passengers.pelabuhan_asal}
                        </div>
                        <IoArrowForwardOutline
                          className="text-black mt-0 md:mt-2"
                          size={18}
                        />
                        <div className="mt-1 md:mt-2 text-xs text-black font-medium ">
                          {passengers.pelabuhan_tujuan}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-black">
                        {parseTanggal(passengers.departureDate)} -{" "}
                        {parseTanggal(book.arrivalDate)}
                      </div>
                      <div className="mt-1 text-xs text-black">
                        {book.departureTime} - {book.arrivalTime}
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-black">
                        LIST PASSENGERS
                      </div>
                      {passengers.passengers.adults &&
                      passengers.passengers.adults.length > 0
                        ? passengers.passengers.adults.map((e, i) => (
                            <div className="mt-3 text-xs text-black font-medium ">
                              {e.name} (Adult)
                            </div>
                          ))
                        : ""}
                      {passengers.passengers.infants &&
                      passengers.passengers.infants.length > 0
                        ? passengers.passengers.infants.map((e, i) => (
                            <div className="mt-3 text-xs text-black font-medium ">
                              {e.name} (Infants)
                            </div>
                          ))
                        : ""}
                    </div>
                  </div>
                  <div className="hidden md:block mt-2">
                    <Alert
                      message={`Expired Booking : ${remainingBookTime}`}
                      banner
                    />
                  </div>
                {callbackBoolean == true ? (
                  <div className="mt-2 py-4 rounded-md border-t border-gray-200 shadow-sm">
                      <>
                        <div className="px-8 md:px-4 py-4 text-sm text-black">
                          Tekan tombol dibawah ini untuk melanjutkan proses
                          transaksi.
                        </div>
                        <div className="flex justify-center">
                          <ButtonAnt
                          onClick={whiteList == 1 ? handlerPembayaran : handleCallbackSubmit}
                          size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 px-12 font-semibold"
                            loading={isLoading}
                          >
                            Bayar Sekarang
                          </ButtonAnt>
                        </div>
                      </>
                  </div>
                ) : (
                  <>
                    {/* <div className="px-8 py-4 text-sm text-black">
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
                  </div> */}
                  </>
                )}
                </div>
              {callbackBoolean == true ? (
                <div className="block xl:hidden mt-4 py-4 rounded-md border border-gray-200 shadow-sm">
                    <>
                      <div className="flex justify-center">
                        <ButtonAnt
                           onClick={whiteList == 1 ? handlerPembayaran : handleCallbackSubmit}                         
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
                <>
                  {/* <div className="px-8 py-4 text-sm text-black">
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
                    </div>                      */}
                </>
              )}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
