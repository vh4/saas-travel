import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { Button as ButtonAnt, Alert, Modal } from "antd";
import { notification } from "antd";
import Page400 from "../../components/400";
import Page500 from "../../components/500";
import { remainingTime } from "../../../helpers/date";
import { toRupiah } from "../../../helpers/rupiah";
import BayarLoading from "../../components/pelniskeleton/bayar";
import { Typography } from "antd";
import { IoArrowForwardOutline } from "react-icons/io5";
import moment from "moment";
import PageExpired from "../../components/Expired";
import Tiket from "../../../components/pelni/Tiket";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { Box } from "@mui/material";
import { TiketContext } from "../../../App";
import {
  cekIsMerchant,
  cekWhiteListUsername,
} from "../../../helpers/api_global";
import DetailPassengersDrawerPelni from "./DetailPassengersDrawerPelni";

export default function PembayaranPelni() {
  const { Paragraph } = Typography;
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setLoading] = useState(false);

  const [dataDetailForBooking, setdataDetailForBooking] = useState(null);
  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isBookingExpired, setIsBookingExpired] = useState(false); // Added state for booking expiration

  const [callbackBoolean, setcallbackBoolean] = useState(false);
  const [expiredBookTime, setExpiredBookTime] = useState(null);
  const [ispay, setispay] = useState(false);
  const [hasilbayar, setHasilbayar] = useState(null);
  const [isSimulated, setisSimulate] = useState(0);
  const callback = useSelector((state) => state.callback);
  const [openDrawer, setOpenDrawer] = useState(null);
  const { pay, dispatch } = React.useContext(TiketContext);
  let bookPesawatData = useSelector(
    (state) => state.bookpelni.bookDataLanjutBayarPelni
  );

  const toggleDrawer = (type) => {
    setOpenDrawer(type);
  };

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

    Promise.all([
      getInfoBooking(),
      cekIsMerchant(token),
      cekWhiteListUsername(token, 'PELNI'),
    ])
      .then(([getInfoBookingParse, cekIsMerchant, cekWhiteListUsername]) => {
        const isSimulate = cekWhiteListUsername?.is_simulate || 0;
        const getInfoBooking = { ...getInfoBookingParse };

        setisSimulate(isSimulate);

        if (cekIsMerchant.data.rc === "00") {
          setcallbackBoolean(true);
        }

        if (getInfoBooking?.expiredDate) {
          getInfoBooking.expiredDate = moment(
            getInfoBooking.expiredDate,
            "YYYY-MM-DD HH:mm:ss"
          ).format("YYYY-MM-DD HH:mm");
          setExpiredBookTime(
            getInfoBooking.expiredDate || moment().add(1, "hours")
          );
        }

        if (
          getInfoBooking &&
          new Date(getInfoBooking.expiredDate).getTime() < new Date().getTime()
        ) {
          setIsBookingExpired(true);
        } else {
          setIsBookingExpired(false);
        }

        setdataDetailForBooking(getInfoBooking);

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

      if (
        dataDetailForBooking &&
        new Date(dataDetailForBooking.expiredDate).getTime() < new Date().getTime()
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
      const response = bookPesawatData;
      return response;
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

  async function handlerPembayaran(e) {
    e.preventDefault();
    setLoading(true);

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/payment`,
      {
        paymentCode: dataDetailForBooking?.paymentCode || "",
        transactionId: dataDetailForBooking?.id_transaksi,
        nominal: dataDetailForBooking?.nominal,
        nominal_admin: dataDetailForBooking?.nominal_admin,
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
        nomor_hp_booking:
          dataDetailForBooking.paymentCode || dataDetailForBooking.kode_booking,
        id_transaksi: response.data?.data?.transaction_id,
        nominal_admin: dataDetailForBooking.nominal_admin,
        url_etiket: response.data?.data?.url_etiket,
        nominal_sales: dataDetailForBooking.nominal,
        total_dibayar: toRupiah(
          parseInt(dataDetailForBooking.nominal) +
            parseInt(dataDetailForBooking.nominal_admin)
        ),
      };

      dispatch({
        type: "PAY_PELNI",
      });

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
          <div className="px-4 flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <IoMdCheckmarkCircle className="text-blue-500" size={20} />
              <div className="hidden xl:flex text-blue-500">
                Detail pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="text-black hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <AiOutlineClockCircle size={20} className="" />
              <div className="hidden xl:block ">Pembayaran tiket</div>
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
                total={1} //harcode karena ngk ada total adult
              />
            </>
          ) : (
            <>
              <div className="block xl:flex xl:justify-around mb-0 xl:space-x-4 -mt-8 xl:mt-0">
                {/* mobile sidebar */}
                <div className="block xl:hidden sidebar w-full xl:w-2/3 2xl:w-1/2">
                  <div className="py-2 xl:py-4 mt-2 xl:mt-0">
                    <Box
                      className="border shadow px-6 py-6 rounded-xl"
                      sx={
                        {
                          // textAlign: "center",
                          // paddingY: "16px",
                          // borderBottomLeftRadius: "30px",
                          // borderBottomRightRadius: "30px",
                          // cursor: "pointer",
                        }
                      }
                    >
                      <div className="flex justify-between items-center -mt-2">
                        {/* <div className="text-black text-xs">Booking ID</div> */}
                        <div className="text-black text-sm -mt-1.5">
                          Transaksi ID
                        </div>
                        <div className="mt-2 font-bold  text-blue-500 text-[18px]">
                          {/* {
							 && hasilBooking.bookingCode} */}
                          <Paragraph copyable className="">
                            {dataDetailForBooking &&
                              dataDetailForBooking.id_transaksi}
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
                                {dataDetailForBooking.nama_kapal}
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
                                {dataDetailForBooking.origin}{" "}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(
                              dataDetailForBooking.tanggal_keberangkatan.slice(
                                0,
                                4
                              ),
                              parseInt(
                                dataDetailForBooking.tanggal_keberangkatan.slice(
                                  4,
                                  6
                                )
                              ) - 1,
                              dataDetailForBooking.tanggal_keberangkatan.slice(
                                6,
                                8
                              )
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            {dataDetailForBooking.jam_keberangkatan}
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
                                {dataDetailForBooking.destination}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(
                              dataDetailForBooking.tanggal_kedatangan.slice(
                                0,
                                4
                              ),
                              parseInt(
                                dataDetailForBooking.tanggal_kedatangan.slice(
                                  4,
                                  6
                                )
                              ) - 1,
                              dataDetailForBooking.tanggal_kedatangan.slice(
                                6,
                                8
                              )
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            {dataDetailForBooking.jam_kedatangan}
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
                                {dataDetailForBooking.kode_booking}
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
                              {dataDetailForBooking.penumpang.length || "-"}{" "}
                              Penumpang
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
                          {toRupiah(
                            (dataDetailForBooking &&
                              dataDetailForBooking?.nominal) ||
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
                            dataDetailForBooking &&
                              dataDetailForBooking.nominal_admin
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
                              dataDetailForBooking &&
                                dataDetailForBooking?.nominal
                            ) +
                              parseInt(
                                dataDetailForBooking &&
                                  dataDetailForBooking.nominal_admin
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DetailPassengersDrawerPelni
                  dataDetailPassenger={dataDetailForBooking}
                  openDrawer={openDrawer}
                  toggleDrawer={toggleDrawer}
                />

                {/* desktop adult infant */}
                <div className="mt-4 w-full mx-0 2xl:mx-4 hidden xl:block">
                  {/* adult and infant */}
                  <div className="text-sm xl:text-sm font-bold text-black mt-6">
                    <p>LIST PASSENGERS</p>
                  </div>
                  {dataDetailForBooking.penumpang.length > 0
                    ? dataDetailForBooking.penumpang.map((e, i) => (
                        <>
                          <div className="p-4 xl:px-8 xl:mt-6 mt-4 w-full border rounded-lg border-gray-200 shadow-sm">
                            <div className="">
                              <div className="mt-2  grid grid-cols-2 xl:grid-cols-4">
                                {/* <div className="px-2 xl:px-4 py-2 text-sm">
                                          <div className="text-black">NIK</div>
                                          <div className="font-bold text-xs text-black">{bookInfo.PAX_LIST[i][1]}</div>
                                      </div> */}
                                <div className="px-2 py-2">
                                  <div className="text-black font-medium text-xs">
                                    Nama
                                  </div>
                                  <div className="mt-2 text-xs text-black">
                                    {e.nama}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}
                  <div className="text-sm xl:text-sm font-bold text-black mt-6">
                    <p>PRICE DETAILT</p>
                  </div>
                  <div className="border rounded-lg border-gray-200 shadow-sm p-8 xl:mt-6 mt-4 w-full">
                    <div className="p-2">
                      <div className="text-xs text-black font-medium  flex justify-between">
                        <div>Harga </div>
                        <div>
                          Rp.{" "}
                          {dataDetailForBooking &&
                            toRupiah(dataDetailForBooking.nominal)}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Biaya Admin (Fee)</div>
                        <div>
                          Rp.{" "}
                          {dataDetailForBooking &&
                            toRupiah(dataDetailForBooking.nominal_admin)}
                        </div>
                      </div>
                      <div className="mt-8 pt-2 border-t border-gray-200 text-sm text-black font-semibold flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {toRupiah(
                            parseInt(
                              dataDetailForBooking &&
                                dataDetailForBooking?.nominal
                            ) +
                              parseInt(
                                dataDetailForBooking &&
                                  dataDetailForBooking.nominal_admin
                              )
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
                    <div className="px-8 py-4 border rounded-lg border-gray-200 shadow-sm mb-4">
                      {/* <div className="text-black text-xs">Booking ID</div> */}
                      <div className="flex justify-between items-center">
                        <div className="text-black text-xs">Transaksi ID</div>

                        <div className="font-medium  text-blue-500 text-[18px] pt-4">
                          <Paragraph copyable>
                            {dataDetailForBooking && dataDetailForBooking.id_transaksi}
                          </Paragraph>
                        </div>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="mt-2 w-full rounded-md border xl:border-gray-200 xl:shadow-sm">
                        <div className="px-4 py-8 pl-8 text-black">
                          <div className="text-xs font-semibold">
                            {dataDetailForBooking && dataDetailForBooking.nama_kapal}
                          </div>
                          <div className="mt-4">
                            <small className="block font-semibold">
                              Tanggal Keberangkatan
                            </small>
                            <small className="block mt-2">
                              {dataDetailForBooking.tanggal_keberangkatan}
                            </small>
                          </div>
                        </div>
                        <div className="mt-2"></div>
                        <div className="p-4 pl-10 mb-4">
                          <ol class="relative border-l-2 border-dashed border-gray-800">
                            <li class="mb-10 ml-4">
                              <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800"></div>
                              <div className="flex space-x-12">
                                <time class="mb-1 text-sm font-normal leading-none text-black">
                                  {dataDetailForBooking.jam_keberangkatan}
                                </time>
                                <div className="-mt-2">
                                  <div class="text-left text-xs text-black">
                                    {dataDetailForBooking.origin}
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li class="ml-4">
                              <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white"></div>
                              <div className="flex space-x-12">
                                <time class="mb-1 text-sm leading-none text-black">
                                  {dataDetailForBooking.jam_kedatangan}
                                </time>
                                <div className="-mt-2">
                                  <div class="text-left text-xs text-black">
                                    {dataDetailForBooking.destination}
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ol>
                        </div>
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
                  <div className="hidden xl:block mt-2 py-2 rounded-md border-t border-gray-200 shadow-sm">
                    <>
                      {/* {isOk == true && isCurrentBalance == true ? ( */}
                      <>
                        <div className="px-8 xl:px-4 py-4 text-sm text-black">
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
                            className="bg-blue-500 px-12 font-semibold"
                            loading={isLoading}
                          >
                            Bayar Sekarang
                          </ButtonAnt>
                        </div>
                        {isSimulated === 1 ? (
                          <Alert
                            className="mt-4"
                            message="Don't worry, clicking the 'Bayar' will not affect your balance."
                            banner
                          />
                        ) : (
                          ""
                        )}
                      </>
                      {/* ) : ''} */}
                    </>
                  </div>
                  ) : ( 
                  <></>
                  )}
                </div>
                {callbackBoolean == true ? (
                <div className="block xl:hidden w-full mt-4 py-4 rounded-md border border-gray-200 shadow-sm">
                  <>
                    {/* {isOk == true && isCurrentBalance == true ? ( */}
                    <>
                      <div className="flex justify-center">
                        <ButtonAnt
                          onClick={showModal}
                          size="large"
                          key="submit"
                          type="primary"
                          className="bg-blue-500 mx-2 font-semibold mt-4 w-full"
                          loading={isLoading}
                        >
                          Bayar Sekarang
                        </ButtonAnt>
                      </div>
                      {isSimulated === 1 ? (
                        <Alert
                          className="mt-4"
                          message="Click 'Bayar' will not affect your balance."
                          banner
                        />
                      ) : (
                        ""
                      )}
                    </>
                    {/* ) : ''} */}
                  </>
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
