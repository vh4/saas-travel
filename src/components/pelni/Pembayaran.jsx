import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { Button as ButtonAnt, Alert, Modal } from "antd";
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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useSelector } from "react-redux";

export default function Pembayaran() {
  const isOk = useSelector((state) => state.callback.isOk);

  const status = useSelector((state) => state.callback.rc);
  const keterangan = useSelector((state) => state.callback.rd);

  const callback = useSelector((state) => state.callback);
  const bookPelni = useSelector((state) => state.bookpelni.bookDataPelni);
  const isCurrentBalance = useSelector((state) => state.bookpelni.isOkBalancePelni);
  const { Paragraph } = Typography;
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setLoading] = React.useState(false);
  const [passengers, setPassengers] = useState({});
  const [book, setBook] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [TotalAdult, setTotalAdult] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);
  const [callbackBoolean, setcallbackBoolean] = useState(false);
  const [expiredBookTime, setExpiredBookTime] = useState(null);
  const [isBookingExpired, setIsBookingExpired] = useState(false);
  const [ispay, setispay] = useState(false);
  const [hasilbayar, setHasilbayar] = useState(null);
  const [isSimulated, setisSimulate] = useState(0);
  const [err, setErr] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

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

        const isSimulate = cekWhiteListUsername?.is_simulate || 0;
        setisSimulate(isSimulate)

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
  }, [token]);

  const [remainingBookTime, setremainingBookTime] = useState(
    remainingTime(expiredBookTime)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setremainingBookTime(remainingTime(expiredBookTime));

      if (book && new Date(book.payLimit).getTime() < new Date().getTime()) {
        setIsBookingExpired(true);

      } else {
        setIsBookingExpired(false);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [expiredBookTime]);

  async function getDataAllBook() {
    try {
      const response = bookPelni;
      return response;
    } catch (error) {
      return null;
    }
  }

  async function cekCallbakIsMitra() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/is_merchant`,
        {
          token: token,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function cekWhiteListUsername() {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/is_whitelist`, {
          produk: 'SHPPELNI'
        }
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

  async function handlerPembayaran(e) {
    e.preventDefault();
    setLoading(true);

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/payment`,
      {
        paymentCode: book?.paymentCode,
        transactionId: book?.transactionId,
        nominal:book?.normalSales,
        nominal_admin:book?.nominal_admin,
        simulateSuccess: isSimulated, //
        token: token,
        //cal;back
        username: callback.username,
        merchant: callback.merchant,
        total_komisi: callback.total_komisi,
        komisi_mitra: callback.komisi_mitra,
        komisi_merchant: callback.komisi_merchant,
        saldo_terpotong_mitra: callback.saldo_terpotong_mitra,
        saldo_terpotong_merchant: callback.saldo_terpotong_merchant,
      }
      
    );

    if (response.data.rc === "00") {
      const params = {
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
      setLoading(false);

    } else {
      setTimeout(() => {
        setLoading(false);
        failedNotification(response.data.rd);
      }, 1000);
    }
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
          <Modal
              title={
                (<>
                  <div className="flex space-x-2 items-center">
                      <ExclamationCircleFilled className="text-orange-500 text-xl" />
                      <div className="text-bold text-xl text-orange-500">Are you sure?</div>
                  </div>
                </>)
              }
              open={open}
              onOk={hideModal}
              onCancel={hideModal}
              okText="Cancel"
              cancelText="Submit"
              maskClosable={false}
              footer={
                <>
                <div className="blok mt-8">
                  <div className="flex justify-end space-x-2">
                  <ButtonAnt key="back" onClick={hideModal}>
                    Cancel
                  </ButtonAnt>
                  <ButtonAnt
                      htmlType="submit"
                      key="submit"
                      type="primary"
                      className="bg-blue-500"
                      loading={isLoading}
                      onClick={handlerPembayaran}
                    >
                      Bayar
                    </ButtonAnt>
                  </div>
                </div>
              </>
              }
            >
              <p>Apakah Anda yakin ingin melakukan pembayaran ?</p>
            </Modal>
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
                <div className="block xl:hidden">
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
                  <div className="py-2 rounded-md border-b border-gray-200 shadow-sm">
                      <div className="mt-4">
                        {isOk == false || isCurrentBalance == false ? (
                          <>
                            <div className="mt-4">
                            {status !== '68' && status !== '99' ? 
                              (
                                <Alert
                                message={isCurrentBalance == false ? 'Saldo tidak cukup.': keterangan}
                                type="error"
                                banner
                                closable
                              />
                              ) : null
                              }
                            </div>
                          </>
                        ) : ''}
                    </div>
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
                  <div className="hidden xl:block mt-2">
                    <Alert
                      message={`Expired Booking : ${remainingBookTime}`}
                      banner
                    />
                  </div>
                {callbackBoolean == true ? (
                  <div className="hidden xl:block mt-2 py-2 rounded-md border-t border-gray-200 shadow-sm">
                  <>
                    {isOk == true && isCurrentBalance == true ? (
                      <>
                        <div className="px-8 md:px-4 py-4 text-sm text-black">
                          Tekan tombol dibawah ini untuk melanjutkan proses
                          transaksi.
                        </div>
                        <div className="flex justify-center">
                          <ButtonAnt
                            onClick={isOk && isCurrentBalance && showModal}                        
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 px-12 font-semibold"
                            loading={isLoading}
                          >
                            Bayar Sekarang
                          </ButtonAnt>
                        </div>
                        {isSimulated === 1 ? (<Alert className="mt-4" message="Don't worry, clicking the 'Bayar' will not affect your balance." banner/>) : ''}
                      </>
                    ) : ''}
                  </>
              </div>
                ) : (
                  <>
                  </>
                )}
                </div>
              {callbackBoolean == true ? (
                <div className="block xl:hidden mt-4 py-4 rounded-md border border-gray-200 shadow-sm">
                    <>
                    {isOk == true && isCurrentBalance == true ? (
                      <>
                        <div className="flex justify-center">
                          <ButtonAnt
                            onClick={showModal}                        
                            size="large"
                            key="submit"
                            type="primary"
                            className="bg-blue-500 mx-2 font-semibold mt-4"
                            loading={isLoading}
                          >
                            Bayar Sekarang
                          </ButtonAnt>
                        </div>
                        {isSimulated === 1 ? (<Alert className="mt-4" message="Don't worry, clicking the 'Bayar' will not affect your balance." banner/>) : ''}
                      </>
                    ) : ''}
                    </>
                    {isOk == false || isCurrentBalance == false ? (
                      <>
                        <div className="mt-4">
                            {status !== '68' && status !== '99' ? 
                              (
                                <Alert
                                message={isCurrentBalance == false ? 'Saldo tidak cukup.': keterangan}
                                type="error"
                                banner
                                closable
                              />
                              ) : null
                              }
                        </div>
                      </>
                    ) : ''}
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
