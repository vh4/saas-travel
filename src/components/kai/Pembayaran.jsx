import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { Alert, Button as ButtonAnt, Modal } from "antd";
import { notification } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal, remainingTime } from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import PageExpired from "../components/Expired";
import BayarLoading from "../components/trainskeleton/bayar";
import { Typography } from "antd";
import moment from "moment";
import Tiket from "./Tiket";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";

export default function Pembayaran() {
  const isOk = useSelector((state) => state.callback.isOk);
  const callback = useSelector((state) => state.callback);

  const isCurrentBalance = useSelector(
    (state) => state.bookkereta.isOkBalanceKereta
  );
  const bookKereta = useSelector((state) => state.bookkereta.bookDataKereta);
  const dataSearch = useSelector((state) => state.bookkereta.searchDataKereta);
  const { Paragraph } = Typography;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  const [TotalInfant, setTotalInfant] = useState(0);

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration
  const [expiredBookTime, setExpiredBookTime] = useState(null);

  const [api, contextHolder] = notification.useNotification();
  const [isSimulated, setisSimulate] = useState(0);

  const [ispay, setispay] = useState(false);
  const [hasilbayar, setHasilbayar] = useState(null);

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

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

    Promise.all([
      getDataTrain(),
      getHasilBooking(),
      cekIsMerchant(),
      cekWhiteListUsername(),
    ])
      .then(
        ([
          ResponsegetDataTrain,
          ResponsegetHasilBooking,
          cekIsMerchant,
          cekWhiteListUsername,
        ]) => {
          if (cekIsMerchant.data.rc == "00") {
            setcallbackBoolean(true);
          }

          const isSimulate = cekWhiteListUsername?.is_simulate || 0;
          setisSimulate(isSimulate);

          if (ResponsegetDataTrain) {
            setdataDetailTrain(ResponsegetDataTrain.train_detail);
            setdataBookingTrain(ResponsegetDataTrain.train);
          } else {
            setErrPage(true);
          }

          if (ResponsegetHasilBooking) {
            setHasilBooking(ResponsegetHasilBooking.hasil_book);
            setPassengers(ResponsegetHasilBooking.passengers);
            setExpiredBookTime(
              ResponsegetHasilBooking.hasil_book.timeLimit ||
                moment().add(1, "hours")
            );

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
  }, [token]);

  const [remainingBookTime, setremainingBookTime] = useState(
    remainingTime(expiredBookTime)
  );

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

  async function cekIsMerchant() {
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
        `${process.env.REACT_APP_HOST_API}/travel/is_whitelist`,{
          produk:'WKAI'
        }
      );

      return response.data;
    } catch (error) {
      throw error;
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
        simulateSuccess: isSimulated, //
        pay_type: "TUNAI",
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
        booking_id: hasilBooking.bookingCode,
        tipe_pembayaran: "TUNAI",
        nomor_hp_booking: passengers.adults[0].phone,
        id_transaksi: response.data?.data?.transaction_id,
        nominal_admin: hasilBooking.nominalAdmin,
        discount: hasilBooking.discount,
        url_etiket: response.data.data.url_etiket,
        nominal_sales: hasilBooking.normalSales,
        total_dibayar: toRupiah(
          parseInt(hasilBooking.normalSales) -
            parseInt(hasilBooking.discount) +
            parseInt(hasilBooking.nominalAdmin)
        ),
      };
      setispay(true);
      setHasilbayar(params);
    } else {
      setTimeout(() => {
        failedNotification(response.data.rd);
        setIsLoading(false);
      }, 100);
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
      ) : ispay == true ? (
        <>
          <Tiket data={hasilbayar} />
        </>
      ) : (
        <>
          {/* header kai flow */}
          <Modal
            title={
              <>
                <div className="flex space-x-2 items-center">
                  <ExclamationCircleFilled className="text-orange-500 text-xl" />
                  <div className="text-bold text-xl text-orange-500">
                    Are you sure?
                  </div>
                </div>
              </>
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
                <div className="block xl:hidden sidebar w-full xl:w-2/3 2xl:w-1/2">
                  <div className="mt-2 py-2 md:py-4 rounded-md border-b border-gray-200 shadow-sm">
                    <div className="px-4 py-2">
                      {/* <div className="text-black text-xs">Booking ID</div> */}
                      <div className="text-black font-medium  text-sm">
                        Transaksi ID
                      </div>

                      <div className="mt-2 font-medium  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>
                          {hasilBooking && hasilBooking.transactionId}{" "}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-black">
                        {dataBookingTrain[0].trainName}
                      </div>
                      <div className="mt-1 text-xs text-black font-medium ">
                        {dataDetailTrain[0].berangkat_nama_kota} -{" "}
                        {dataDetailTrain[0].tujuan_nama_kota}
                      </div>
                      <div className="mt-3 text-xs text-black">
                        {parseTanggal(dataBookingTrain[0].departureDate)}
                      </div>
                      <div className="mt-1 text-xs text-black">
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
                          <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
                            <div className="">
                              <div className="px-2 py-4 md:py-2 text-black border-b border-gray-200 text-xs font-medium ">
                                {e.name}
                              </div>
                              <div className="mt-2 grid w-full grid-cols-2 md:grid-cols-4">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    NIK
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    Nomor HP
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.phone}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    Kursi
                                  </div>
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
                          <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
                            <div className="">
                              <div className="px-2 py-4 md:py-2 text-black border-b border-gray-200 text-xs font-medium ">
                                {e.name}
                              </div>
                              <div className="mt-2 grid w-full grid-cols-2 md:grid-cols-4">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    NIK
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.idNumber}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.birthdate}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium">
                                    Kursi
                                  </div>
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
                  <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
                    <div className="p-2">
                      <div className="text-xs text-black font-medium  flex justify-between">
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
                {/* desktop sidebar */}
                <div className="sidebar hidden md:block w-full xl:w-2/3 2xl:w-1/2">
                  <div className="py-2 rounded-md border-b border-gray-200 shadow-sm">
                    <div className="mt-4">
                      {isOk == false || isCurrentBalance == false ? (
                          <>
                            <div className="mt-4">
                              <Alert
                                message={`Saldo anda tidak mencukupi. silahkan deposit.`}
                                type="error"
                                banner
                                closable
                              />
                            </div>
                          </>
                        ) : ''}
                    </div>
                    <div className="px-4 py-2">
                      {/* <div className="text-black text-xs">Booking ID</div> */}
                      <div className="text-black text-xs">Transaksi ID</div>

                      <div className="mt-1 font-medium  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>
                          {hasilBooking && hasilBooking.transactionId}{" "}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t md:0 mt-2">
                      <div className="text-xs text-black">
                        TRAIN DESCRIPTION
                      </div>
                      <div className="mt-3 md:mt-4 text-xs text-black">
                        {dataBookingTrain[0].trainName}
                      </div>
                      <div className="mt-1 md:mt-2 text-xs text-black font-medium ">
                        {dataDetailTrain[0].berangkat_nama_kota} -{" "}
                        {dataDetailTrain[0].tujuan_nama_kota}
                      </div>
                      <div className="mt-3 md:mt-4 text-xs text-black">
                        {parseTanggal(dataBookingTrain[0].departureDate)}
                      </div>
                      <div className="mt-1 md:mt-2 text-xs text-black">
                        {dataBookingTrain[0].departureTime} -{" "}
                        {dataBookingTrain[0].arrivalTime}
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="text-xs text-black">LIST PASSENGERS</div>
                      {passengers.adults &&
                        passengers.adults.length > 0 &&
                        passengers.adults.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium ">
                            {e.name} (Adult)
                          </div>
                        ))}
                      {passengers.children &&
                        passengers.children.length > 0 &&
                        passengers.children.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium ">
                            {e.name} (Children)
                          </div>
                        ))}
                      {passengers.infants &&
                        passengers.infants.length > 0 &&
                        passengers.infants.map((e, i) => (
                          <div className="mt-3 text-xs text-slate-700 font-medium ">
                            {e.name} (Infants)
                          </div>
                        ))}
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
                              className="bg-blue-500 px-8 font-semibold"
                              loading={isLoading}
                            >
                              Bayar Sekarang
                            </ButtonAnt>
                          </div>
                          {isSimulated == 1 ? (<Alert className="mt-4"  message="Don't worry, clicking the 'Bayar' button will not affect your balance." banner/>) : ''}
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
                    </div> */}
                    </>
                  )}
                </div>
                {callbackBoolean == true ? (
                  <div className="block xl:hidden mt-8 py-2 rounded-md">
                    <>
                      {isOk == true && isCurrentBalance == true ? (
                        <>
                          <div className="flex justify-center">
                            <ButtonAnt
                              onClick={showModal}
                              size="large"
                              key="submit"
                              type="primary"
                              className="bg-blue-500 mx-2 font-semibold"
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
                            <Alert
                              message={`Saldo anda tidak mencukupi. silahkan deposit.`}
                              type="error"
                              banner
                              closable
                            />
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
