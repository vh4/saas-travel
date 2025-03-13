import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { Alert, Button as ButtonAnt, Modal } from "antd";
import { notification } from "antd";
import { toRupiah } from "../../../helpers/rupiah";
import { parseTanggal, remainingTime } from "../../../helpers/date";
import Page500 from "../../components/500";
import Page400 from "../../components/400";
import PageExpired from "../../components/Expired";
import BayarLoading from "../../components/trainskeleton/bayar";
import { Typography } from "antd";
import moment from "moment";
import Tiket from "../../../components/kai/Tiket";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { Box } from "@mui/material";
import { TiketContext } from "../../../App";
import {
  cekIsMerchant,
  cekWhiteListUsername,
} from "../../../helpers/api_global";
import DetailPassengersDrawerKereta from "./DetailPassengerDrawerKereta";

export default function PembayaranKereta() {
  const callback = useSelector((state) => state.callback);
  let bookKeretaData = useSelector(
    (state) => state.bookkereta.bookDataLanjutBayarKereta
  );

  const { Paragraph } = Typography;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [dataBookingTrain, setdataBookingTrain] = useState(null);
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
  const [openDrawer, setOpenDrawer] = useState(null);
  const { pay, dispatch } = React.useContext(TiketContext);

  const toggleDrawer = (type) => {
    setOpenDrawer(type);
  };

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
      getInfoBooking(),
      cekIsMerchant(token),
      cekWhiteListUsername(token, "WKAI"),
    ])
      .then(([getInfoBookingParse, cekIsMerchant, cekWhiteListUsername]) => {
        const getInfoBooking = { ...getInfoBookingParse };
        if (cekIsMerchant.data.rc == "00") {
          setcallbackBoolean(true);
        }

        const isSimulate = cekWhiteListUsername?.is_simulate || 0;
        setisSimulate(isSimulate);

        //expired date convert
        if (getInfoBooking?.expiredDate) {
          getInfoBooking.expiredDate = moment(
            getInfoBooking.expiredDate,
            "YYYY-MM-DD HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm");
          setExpiredBookTime(
            getInfoBooking.expiredDate || moment().add(1, "hours")
          );
        }

        setdataBookingTrain(getInfoBooking);

        //passenggers. nama saja. => bella, mama,
        const passengers = getInfoBooking.penumpang.map((e) => e.nama);
        setPassengers(passengers);

        const initialChanges = Array();
        let totaladult = 0;
        let totalinfant = 0;

        if (!Array.isArray(getInfoBooking["seats"])) {
          getInfoBooking["seats"] = []; // Inisialisasi sebagai array jika belum ada
        }

        getInfoBooking.penumpang.map((e, i) => {
          const seat = e.kursi.split(/[-/]/);
          getInfoBooking["seats"].push(seat);

          if (e.kursi?.trim().length > 1) {
            totaladult += 1;
          } else {
            totalinfant += 1;
          }
        });

        setTotalAdult(totaladult);
        setTotalInfant(totalinfant);

        if (
          getInfoBooking &&
          new Date(getInfoBooking.expiredDate).getTime() < new Date().getTime()
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
  }, [token]);

  const [remainingBookTime, setremainingBookTime] = useState(
    remainingTime(expiredBookTime)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setremainingBookTime(remainingTime(expiredBookTime));

      if (
        dataBookingTrain &&
        new Date(dataBookingTrain.expiredDate).getTime() < new Date().getTime()
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
      const response = bookKeretaData;
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
        productCode: "WKAIH",
        bookingCode: dataBookingTrain.kode_booking,
        transactionId: dataBookingTrain.id_transaksi,
        nominal: dataBookingTrain.nominal,
        nominal_admin: dataBookingTrain.nominal_admin,
        discount: dataBookingTrain?.discount || 0,
        simulateSuccess: isSimulated, //
        pay_type: "TUNAI",
        token: token,
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
        booking_id: dataBookingTrain.kode_booking,
        tipe_pembayaran: "TUNAI",
        nomor_hp_booking: dataBookingTrain.penumpang[0].telepon,
        id_transaksi: response.data?.data?.transaction_id,
        nominal_admin: dataBookingTrain.admin,
        discount: dataBookingTrain?.discount || 0,
        url_etiket: response.data.data.url_etiket,
        nominal_sales: dataBookingTrain.nominal,
        total_dibayar: toRupiah(
          parseInt(dataBookingTrain.nominal) -
            parseInt(dataBookingTrain?.discount || 0) +
            parseInt(dataBookingTrain.nominal_admin)
        ),
      };
      setispay(true);
      dispatch({
        type: "PAY_TRAIN",
        // payload:{
        //   isPayed:true
        // }
      });
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
                    Apakah anda yakin?
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
          <div className="px-0 xl:px-12 flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <IoMdCheckmarkCircle className="text-green-500" size={20} />
              <div className="hidden xl:flex text-green-500">
                Detail pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule size={20} className="hidden xl:flex " />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <IoMdCheckmarkCircle className="text-green-500" size={20} />
              <div className="hidden xl:flex text-green-500">
                Konfirmasi pesanan
              </div>
            </div>
            <div className="hidden xl:flex">
              <MdHorizontalRule size={20} className=" hidden xl:flex" />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <AiOutlineClockCircle size={20} />
              <div className="font-medium  hidden xl:block">
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
              <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4 -mt-8 xl:mt-0">
                {/* mobile sidebar */}
                <div className="block xl:hidden sidebar w-full xl:w-2/3 2xl:w-1/2">
                  <div className="py-2 xl:py-4 mt-2 xl:mt-0">
                    <Box className="border shadow px-6 py-6 rounded-xl">
                      <div className="flex justify-between items-center -mt-2">
                        {/* <div className="text-black text-xs">Booking ID</div> */}
                        <div className="text-black text-sm -mt-1.5">
                          Transaksi ID
                        </div>
                        <div className="mt-2 font-bold  text-blue-500 text-[18px]">
                          {/* {hasilBooking && hasilBooking.bookingCode} */}
                          <Paragraph copyable className="">
                            {dataBookingTrain && dataBookingTrain.id_transaksi}
                          </Paragraph>
                        </div>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </Box>
                    <div className="p-4">
                      <div className="flex items-center space-x-2 py-2">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-black">
                              <div className="font-semibold">
                                {dataBookingTrain.nama_kereta}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full py-2">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-black">
                              <small className="text-xs text-gray-400">
                                Asal
                              </small>
                              <div className="font-semibold">
                                {dataBookingTrain && dataBookingTrain.origin} (
                                {dataBookingTrain.id_origin})
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(
                              dataBookingTrain.tanggal_keberangkatan.slice(
                                0,
                                4
                              ),
                              parseInt(
                                dataBookingTrain.tanggal_keberangkatan.slice(
                                  4,
                                  6
                                )
                              ) - 1,
                              dataBookingTrain.tanggal_keberangkatan.slice(6, 8)
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            {dataBookingTrain.jam_keberangkatan
                              .toString()
                              .padStart(4, "0")
                              .replace(/(\d{2})(\d{2})/, "$1:$2")}
                          </div>
                        </div>
                      </div>
                      <div className="w-full py-2">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-black">
                              <small className="text-xs text-gray-400">
                                Tujuan
                              </small>
                              <div className="font-semibold">
                                {dataBookingTrain && dataBookingTrain.origin} (
                                {dataBookingTrain.id_origin})
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(
                              dataBookingTrain.tanggal_kedatangan.slice(0, 4),
                              parseInt(
                                dataBookingTrain.tanggal_kedatangan.slice(4, 6)
                              ) - 1,
                              dataBookingTrain.tanggal_kedatangan.slice(6, 8)
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            {dataBookingTrain.jam_kedatangan.trim() == ""
                              ? "-"
                              : dataBookingTrain.jam_kedatangan
                                  .toString()
                                  .padStart(4, "0")
                                  .replace(/(\d{2})(\d{2})/, "$1:$2")}
                          </div>
                        </div>
                      </div>
                      <div className="w-full py-2">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-black">
                              <small className="text-xs text-gray-400">
                                Kode Booking
                              </small>
                              <div className="font-semibold">
                                {dataBookingTrain.kode_booking}
                              </div>
                            </div>
                          </div>
                          <div className="block xl:hidden">
                            <Alert
                              className="text-xs text-gray-500"
                              message={`${remainingBookTime}`}
                              banner
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <div className="w-full px-4">
                      <div className="flex justify-between items-center border-b border-gray-200 py-4">
                        <div className="flex space-x-2 items-center">
                          <div className="text-xs text-gray-500">
                            <small className="text-xs text-gray-400">
                              Data Penumpang
                            </small>
                            <div className="my-1">
                              {TotalAdult > 0 && TotalAdult + " Dewasa"}{" "}
                              {TotalAdult > 0 && ", " + TotalInfant + " Bayi"}
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={() => {
                            toggleDrawer(true);
                          }}
                          className="cursor-pointer text-xs text-blue-400"
                        >
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
                            <div>Total Harga</div>
                          </div>
                        </div>
                        <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(
                            (dataBookingTrain && dataBookingTrain?.nominal) ||
                              "-"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 xl:py-4 xl:mt-0">
                    <div className="w-full px-4">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                        <div className="flex space-x-2 items-center">
                          <div className="text-xs text-gray-500">
                            <div className="text-xs text-gray-500">
                              <div>Biaya Admin</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(
                            dataBookingTrain && dataBookingTrain.nominal_admin
                          )}
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
                              <div>Total Bayar</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(
                            parseInt(
                              (dataBookingTrain && dataBookingTrain?.nominal) ||
                                0
                            ) +
                              parseInt(
                                dataBookingTrain &&
                                  dataBookingTrain.nominal_admin
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* mobile detail */}
                <DetailPassengersDrawerKereta
                  dataDetailPassenger={dataBookingTrain}
                  openDrawer={openDrawer}
                  toggleDrawer={toggleDrawer}
                />

                <div className="mt-4 w-full mx-0 2xl:mx-4 hidden xl:block">
                  {/* adult */}
                  {dataBookingTrain.penumpang.length > 0
                    ? dataBookingTrain.penumpang.map((e, i) => (
                        <>
                          <div className="p-2 xl:px-8 xl:mt-6 mt-4 w-full">
                            <div className="">
                              <div className="px-2 py-4 xl:py-2 text-black border-b border-gray-200 text-xs font-semibold ">
                                {e.nama}
                              </div>
                              <div className="mt-2 grid w-full grid-cols-2 xl:grid-cols-4">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    NIK
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.nomor_identitas}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    Nomor HP
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {e.telepon !== "" ? e.telepon : "-"}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium ">
                                    Kursi
                                  </div>
                                  <div className="mt-2 text-black text-xs">
                                    {dataBookingTrain !== null
                                      ? dataBookingTrain.seats[i][0] === "EKO"
                                        ? "Ekonomi"
                                        : dataBookingTrain.seats[i][0] === "BIS"
                                        ? "Bisnis"
                                        : "Eksekutif"
                                      : ""}{" "}
                                    {dataBookingTrain.seats[i][1]
                                      ? dataBookingTrain.seats[i][1]
                                      : ""}{" "}
                                    -{" "}
                                    {dataBookingTrain.seats[i][2]
                                      ? dataBookingTrain.seats[i][2]
                                      : "/ 0"}
                                    {dataBookingTrain.seats[i][3]
                                      ? dataBookingTrain.seats[i][3]
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}

                  <div className="p-2 xl:px-8 xl:mt-6 mt-4 w-full">
                    <div className="p-2">
                      <div className="text-xs text-black font-medium  flex justify-between">
                        <div>
                          {dataBookingTrain && dataBookingTrain.nama_kereta}{" "}
                          {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ""}{" "}
                          {TotalInfant > 0 ? `(Infants) x${TotalInfant}` : ""}
                        </div>
                        <div>
                          Rp.{" "}
                          {dataBookingTrain &&
                            toRupiah(dataBookingTrain.nominal)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Biaya Admin (Fee)</div>
                        <div>
                          Rp.{" "}
                          {dataBookingTrain &&
                            toRupiah(dataBookingTrain.nominal_admin)}
                        </div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-black font-semibold  flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {dataBookingTrain &&
                            toRupiah(
                              parseInt(dataBookingTrain.nominal) +
                                parseInt(dataBookingTrain.nominal_admin)
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* desktop sidebar */}
                <div className="sidebar hidden xl:block w-full xl:w-2/3 2xl:w-1/2">
                  <div className="py-2 rounded-md border-b border-gray-200 shadow-sm">
                    <div className="mt-4">
                      {/* {isOk == false || isCurrentBalance == false ? (
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
                        ) : ''} */}
                    </div>
                    <div className="px-4 py-2">
                      {/* <div className="text-black text-xs">Booking ID</div> */}
                      <div className="text-black text-xs">Transaksi ID</div>

                      <div className="mt-1 font-medium  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>
                          {dataBookingTrain && dataBookingTrain.id_transaksi}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t xl:0 mt-2">
                      <div className="text-xs text-black">
                        TRAIN DESCRIPTION
                      </div>
                      <div className="mt-3 xl:mt-4 text-xs text-black">
                        {dataBookingTrain.nama_kereta}
                      </div>
                      <div className="mt-1 xl:mt-2 text-xs text-black font-medium ">
                        {dataBookingTrain.origin} -{" "}
                        {dataBookingTrain.destination}
                      </div>
                      <div className="mt-3 xl:mt-4 text-xs text-black">
                        {new Date(
                          dataBookingTrain.tanggal_keberangkatan.slice(0, 4),
                          parseInt(
                            dataBookingTrain.tanggal_keberangkatan.slice(4, 6)
                          ) - 1,
                          dataBookingTrain.tanggal_keberangkatan.slice(6, 8)
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(
                          dataBookingTrain.tanggal_kedatangan.slice(0, 4),
                          parseInt(
                            dataBookingTrain.tanggal_kedatangan.slice(4, 6)
                          ) - 1,
                          dataBookingTrain.tanggal_kedatangan.slice(6, 8)
                        ).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                      </div>
                      <div className="mt-1 xl:mt-2 text-xs text-black">
                        {dataBookingTrain.jam_keberangkatan.trim() == ""
                          ? "-"
                          : dataBookingTrain.jam_keberangkatan
                              .toString()
                              .padStart(4, "0")
                              .replace(/(\d{2})(\d{2})/, "$1:$2")}{" "}
                        -{" "}
                        {dataBookingTrain.jam_kedatangan.trim() == ""
                          ? "-"
                          : dataBookingTrain.jam_kedatangan
                              .toString()
                              .padStart(4, "0")
                              .replace(/(\d{2})(\d{2})/, "$1:$2")}
                      </div>
                    </div>
                  </div>
                  <div className="hidden xl:block mt-2">
                    <Alert
                      message={`Expired Booking : ${remainingBookTime}`}
                      banner
                    />
                  </div>
                  {callbackBoolean == true ? (
                  <div className="hidden xl:block mt-2 py-4 rounded-md border-t border-gray-200 shadow-sm">
                    {/* {isOk == true && isCurrentBalance == true ? ( */}
                    <>
                      <div className="px-8 xl:px-4 py-4 text-sm text-black w-full xl:w-auto">
                        Tekan tombol dibawah ini untuk melanjutkan proses
                        transaksi.
                      </div>
                      <div className="flex justify-center">
                        <ButtonAnt
                          // onClick={isOk && isCurrentBalance && showModal}
                          onClick={showModal}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 px-8 font-semibold"
                          loading={isLoading}
                        >
                          Bayar Sekarang
                        </ButtonAnt>
                      </div>
                      {isSimulated == 1 ? (
                        <Alert
                          className="mt-4"
                          message="Don't worry, clicking the 'Bayar' button will not affect your balance."
                          banner
                        />
                      ) : (
                        ""
                      )}
                    </>
                    {/* ) : ''} */}
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
                    {/* {isOk == true && isCurrentBalance == true ? ( */}
                    <>
                      <div className="flex justify-center w-full xl:w-auto">
                        <ButtonAnt
                          onClick={showModal}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 mx-2 font-semibold w-full xl:w-auto"
                          loading={isLoading}
                        >
                          Bayar Sekarang
                        </ButtonAnt>
                      </div>
                      {isSimulated === 1 ? (
                        <Alert
                          className="mt-4"
                          message="Clicking 'Bayar' will not affect your balance."
                          banner
                        />
                      ) : (
                        ""
                      )}
                    </>
                    {/* ) : ''} */}
                  </>
                  {/* {isOk == false || isCurrentBalance == false ? ( */}
                  {/* <>
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
                        </> */}
                  {/* ) : ''} */}
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
