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

  let { id } = useParams();
  const [book, setBook] = useState(null);

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errPage, setErrPage] = useState(false);

  const [TotalAdult, setTotalAdult] = useState(0);
  const [TotalChild, setTotalChild] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);
  const [TotalVehicle, setTotalVehicle] = useState(0);

  const [callbackBoolean, setcallbackBoolean] = useState(false);
  const [expiredBookTime, setExpiredBookTime] = useState(null);
  const [isNavigationDone, setIsNavigationDone] = useState(false);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration

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

    Promise.all([getDataAllBook(), cekCallbakIsMitra()])
		.then(([getDataAllBook, cekCallbakIsMitra]) => {

		const hasilBooking = getDataAllBook.hasilBooking;

    if (cekCallbakIsMitra.data.rc == "00") {
      setcallbackBoolean(true);
    }

		//jika tidak ada timeLimit.

        if (getDataAllBook) {
		  
          
		  setBook(getDataAllBook);
          setExpiredBookTime(hasilBooking.timeLimit);

		  setTotalAdult(getDataAllBook.adult)
		  setTotalChild(getDataAllBook.child)
		  setTotalInfant(getDataAllBook.infant)
		  setTotalVehicle(getDataAllBook.kendaraan)

        } else {
          setErrPage(true);
        }


        // Set booking expiration flag
        if (
          hasilBooking &&
          new Date(hasilBooking.timeLimit).getTime() < new Date().getTime()
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

  const [remainingBookTime, setremainingBookTime] = useState(
    remainingTime(expiredBookTime)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setremainingBookTime(remainingTime(expiredBookTime));

      if (expiredBookTime && new Date(expiredBookTime).getTime() < new Date().getTime()) {
        setIsBookingExpired(true);
      } else {
        setIsBookingExpired(false);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [expiredBookTime]);

  async function getDataAllBook() {
    try {
      const response = localStorage.getItem(`data:dlu-book/${id}`);
      return JSON.parse(response);
    } catch (error) {
      return null;
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
  }

  async function handleCallbackSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      const dataParse = JSON.parse(
        localStorage.getItem(`data:dlu-book/${id}`)
      );

      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/ship/callback`,
        {
          id_transaksi: dataParse.hasilBooking.id_transaksi || 0,
        }
      );

      if (response.data.rc == "00") {
        navigate("/");
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
      ) : (
        <>
          {/* header kai flow */}
          <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
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
                total={parseInt(TotalAdult) + parseInt(TotalInfant) + parseInt(TotalInfant) + parseInt(TotalVehicle)}
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
                <div className="block xl:hidden sidebar  w-full xl:w-2/3 2xl:w-1/2">
                  <div className="mt-2 py-2 rounded-md border border-gray-200 shadow-sm">
                    <div className="px-4 py-2 mb-4">
                      {/* <div className="text-black text-xs">Status Booking</div> */}
                      <div className="text-black text-sm font-semibold">
                        Transaksi ID
                      </div>
                      <div className="mt-2 font-medium  text-blue-500 text-[18px]">
                        <Paragraph copyable>
                          {book.hasilBooking && book.hasilBooking.id_transaksi}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="mt-3 text-xs text-black">
                        {book.name}
                      </div>
                      <div className="flex space-x-4">
                        <div className="mt-1 text-xs text-black font-medium ">
                          {book.origin_name}
                        </div>
                        <IoArrowForwardOutline
                          className="text-black"
                          size={18}
                        />
                        <div className="mt-1 text-xs text-black font-medium ">
                          {book.destination_name}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-black">
                        {parseTanggal(book.departure_date)} -{" "}
                        {parseTanggal(book.arrival_date)}
                      </div>
                      <div className="mt-1 text-xs text-black">
                        {book.departure_time} - {book.arrival_time}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-full mx-0 2xl:mx-4">
                  {/* adult, child and infant */}

                     {book.hasilBooking.book_detail && (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="">
                              <div className="px-2 py-2 text-black border-b border-gray-200 text-xs font-medium ">
                                {book.hasilBooking.book_detail.book_name} <span>(PEMESAN)</span>
                              </div>
                              <div className="mt-2 grid grid-cols-1 md:grid-cols-4">
                                {/* <div className="px-2 md:px-4 py-2 text-sm">
                                          <div className="text-black">NIK</div>
                                          <div className="font-bold text-xs text-black">{bookInfo.PAX_LIST[i][1]}</div>
                                      </div> */}
                                <div className="px-2 py-2">
                                  <div className="text-black font-medium text-xs">
                                    No HP
                                  </div>
                                  <div className="mt-2 text-xs text-black">
								   {book.hasilBooking.book_detail.book_phone}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-black text-xs font-medium ">
                                    KTP
                                  </div>
                                  <div className="mt-2 text-xs text-black">
								  {book.hasilBooking.book_detail.book_noidentity}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    Email
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {book.hasilBooking.book_detail.book_email}
                                  </div>
                                </div>
								<div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    Kota / Kabupaten
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {book.hasilBooking.book_detail.book_city}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
				  
				  {book.hasilBooking.detail_pasangers.data_pax.length > 0 && (
						<>
							<div className="Booking mt-4 mb-6 xl:mt-6 ml-2 xl:ml-0">
								<div className="text-md font-medium text-black">
								 DETAIL PASSENGERS
								</div>
							</div>
						</>
					)}
                     {book.hasilBooking.detail_pasangers.data_pax && book.hasilBooking.detail_pasangers.data_pax.length > 0
                    ? book.hasilBooking.detail_pasangers.data_pax.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="">
                              <div className="px-2 py-2 text-black border-b border-gray-200 text-xs font-medium ">
                                {e.name} ({e.idpasstype == "1"
                                  ? "ADULT"
                                  : e.idpasstype == "2"
                                  ? "CHILDER" : "INFANT" }
                                )
                              </div>
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-4">
                                {/* <div className="px-2 md:px-4 py-2 text-sm">
                                          <div className="text-black">NIK</div>
                                          <div className="font-bold text-xs text-black">{bookInfo.PAX_LIST[i][1]}</div>
                                      </div> */}
                                <div className="px-2 py-2">
                                  <div className="text-black font-medium text-xs">
                                    ID Tiket
                                  </div>
                                  <div className="mt-2 text-xs text-black">
								   {e.id_ticket}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-black text-xs font-medium ">
                                    KTP
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {e.idpass && e.idpass !== '' ? e.idpass :  '-'}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {e.dob}
                                  </div>
                                </div>
								<div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    Kota / Kabupaten
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {e.city}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}

					{book.hasilBooking.detail_pasangers.data_vehicle.length > 0 && (
						<>
							<div className="Booking mt-4 mb-6 xl:mt-6 ml-2 xl:ml-0">
								<div className="text-md font-medium text-black">
								DATA VEHICLES
								</div>
							</div>
						</>
					)}
				  {book.hasilBooking.detail_pasangers.data_vehicle && book.hasilBooking.detail_pasangers.data_vehicle.length > 0
                    ? book.hasilBooking.detail_pasangers.data_vehicle.map((e, i) => (
                        <>
                          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                            <div className="">
                              <div className="px-2 py-2 text-black border-b border-gray-200 text-xs font-medium ">
                                {e.idload}
                              </div>
                              <div className="mt-2 grid grid-cols-2 md:grid-cols-4">
                                {/* <div className="px-2 md:px-4 py-2 text-sm">
                                          <div className="text-black">NIK</div>
                                          <div className="font-bold text-xs text-black">{bookInfo.PAX_LIST[i][1]}</div>
                                      </div> */}
                                <div className="px-2 py-2">
                                  <div className="text-black font-medium text-xs">
                                    Nama Lengkap
                                  </div>
                                  <div className="mt-2 text-xs text-black">
								   {e.name}
                                  </div>
                                </div>
                                <div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    ID Tiket
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {e.id_ticket}
                                  </div>
                                </div>
								<div className="px-2 py-2">
                                  <div className="text-xs text-black font-medium ">
                                    Kota / Kabupaten
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {e.city}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}

                  <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                    <div className="p-2">
                      <div className="text-xs text-black font-medium  flex justify-between">
                        <div className="">
                          {book && book.name}{" "}
                          {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ""}{" "}
						  {TotalChild > 0 ? `(Child) x${TotalChild}` : ""}{" "}
                          {TotalInfant > 0 ? `(Infant) x${TotalInfant}` : ""}
						  {TotalVehicle > 0 ? `(Vehicle) x${TotalVehicle}` : ""}
                        </div>
                        <div>Rp. {book.hasilBooking && toRupiah(book.hasilBooking.nominal)}</div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Biaya Admin (Fee) x{parseInt(TotalAdult) + parseInt(TotalInfant) + parseInt(TotalChild) + parseInt(TotalVehicle)}</div>
                        <div>
                          Rp.{" "}
                          {book.hasilBooking &&
                            toRupiah(
								book.hasilBooking.nominal_admin
                            )}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Diskon (Rp.)</div>
                        <div>Rp. 0</div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-black font-medium  flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {book &&
                            toRupiah(
                              parseInt(book.hasilBooking.nominal) +
                                parseInt(
									book.hasilBooking.nominal_admin
                                )
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                {/* desktop sidebar */}
                <div className="hidden xl:block sidebar w-full xl:w-2/3 2xl:w-1/2">
                  <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                    <div className="px-4 py-2">
                      {/* <div className="text-black text-xs">Status Booking</div> */}
                      <div className="text-black text-xs">Transaksi ID</div>
                      <div className="mt-1 font-medium  text-blue-500 text-[18px]">
                        <Paragraph copyable>
						{book.hasilBooking && book.hasilBooking.id_transaksi}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-black">
                        DLU DESCRIPTION
                      </div>
                      <div className="mt-3 text-xs text-black">
                        {book.name} ({book.type_class_name})
                      </div>
                      <div className="flex space-x-4">
                        <div className="mt-1 text-xs text-black font-medium ">
                          {book.origin_name}
                        </div>
                        <IoArrowForwardOutline
                          className="text-black"
                          size={18}
                        />
                        <div className="mt-1 text-xs text-black font-medium ">
                          {book.destination_name}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-black">
                        {parseTanggal(book.departure_date)} -{" "}
                        {parseTanggal(book.arrival_date)}
                      </div>
                      <div className="mt-1 text-xs text-black">
                        {book.departure_time} - {book.arrival_time}
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-black">
                        LIST PASSENGERS
                      </div>
                      {book.hasilBooking.detail_pasangers.data_pax &&
                      book.hasilBooking.detail_pasangers.data_pax.length > 0
                        ? book.hasilBooking.detail_pasangers.data_pax.map((e, i) => (
                            <div className="mt-3 text-xs text-black font-medium ">
                              {e.name}  ({e.idpasstype == "1"
                                  ? "ADULT"
                                  : e.idpasstype == "2"
                                  ? "CHILDER" : "INFANT" }
                                )
                            </div>
                          ))
                        : ""}

					  {/* vehicles */}
					  {/* {book.hasilBooking.detail_pasangers.data_vehicle &&
                      book.hasilBooking.detail_pasangers.data_vehicle.length > 0
                        ? book.hasilBooking.detail_pasangers.data_vehicle.map((e, i) => (
                            <div className="mt-3 text-xs text-black font-medium ">
                              {e.idload}
                            </div>
                          ))
                        : ""} */}
                    </div>
                  </div>
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
