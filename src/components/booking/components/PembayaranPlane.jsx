import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdHorizontalRule } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import { Button, message, Alert, Modal } from "antd";
import {
  remainingTime,
} from "../../../helpers/date";
import { toRupiah } from "../../../helpers/rupiah";
import Page500 from "../../components/500";
import Page400 from "../../components/400";
import BayarLoading from "../../components/planeskeleton/bayar";
import { Typography } from "antd";
import Tiket from "../../../components/plane/Tiket";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { Box } from "@mui/material";
import { TiketContext } from "../../../App";
import { cekIsMerchant, cekWhiteListUsername } from "../../../helpers/api_global";
import PageExpired from "../../components/Expired";
import moment from "moment";
import DetailPassengersDrawerPlane from "./DetailPassengersDrawerPlane";

export default function PembayaranPlane() {
  const { Paragraph } = Typography;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

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
  const [ispay, setispay] = useState(false);
  const [hasilbayar, setHasilbayar] = useState(null);
  const [isSimulated, setisSimulate] = useState(0);

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

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

  const callback = useSelector((state) => state.callback);
  let bookPesawatData = useSelector((state) => state.bookpesawat.bookDataLanjutBayar);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [openDrawer, setOpenDrawer] = useState(null);
  const { pay, dispatch } = React.useContext(TiketContext);

  const toggleDrawer = (type) => {
    setOpenDrawer(type);
  };

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    Promise.all([getInfoBooking(), cekIsMerchant(token), cekWhiteListUsername(token)])
      .then(([getInfoBookingParse, cekIsMerchant, cekWhiteListUsername]) => {
        const isSimulate = cekWhiteListUsername?.is_simulate || 0;
		const getInfoBooking = { ...getInfoBookingParse };

		setisSimulate(isSimulate);
		
		if (cekIsMerchant.data.rc === "00") {
			setcallbackBoolean(true);
		}
		
		if (getInfoBooking?.expiredDate) {
			getInfoBooking.expiredDate = moment(getInfoBooking.expiredDate, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm");
			setExpiredBookTime(
				getInfoBooking.expiredDate || moment().add(1, "hours")
			);
		}
		
		const { adult, child, infant } = getInfoBooking.penumpang.reduce(
			(counts, { status }) => {
				const key = status.toUpperCase();
				if (key === "DEWASA") counts.adult++;
				if (key === "ANAK") counts.child++;
				if (key === "BAYI") counts.infant++;
				return counts;
			},
			{ adult: 0, child: 0, infant: 0 }
		);
	
		setTotalAdult(adult);
		setTotalChild(child);
		setTotalInfant(infant);

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
        getInfoBooking &&
        new Date(getInfoBooking.expiredDate).getTime() < new Date().getTime()
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

  async function handlerPembayaran(e) {
    e.preventDefault();
    setIsLoading(true);

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/flight/payment`,
      {
        airline: dataDetailForBooking.nama_maskapai,
        transactionId: dataDetailForBooking.id_transaksi,
        nominal:dataDetailForBooking.nominal,
        nominal_admin:dataDetailForBooking.nominal_admin,
        bookingCode: dataDetailForBooking.kode_booking,
        simulateSuccess: isSimulated, //
        paymentCode: "",
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
        airline: dataDetailForBooking?.nama_maskapai,
        booking_id: dataDetailForBooking?.bookingCode,
        nomor_hp_booking: dataDetailForBooking?.penumpang[0].no_hp,
        id_transaksi: response.data.data?.transaction_id,
        nominal_admin: dataDetailForBooking?.nominal_admin,
        url_etiket: response.data.data?.url_etiket,
        nominal_sales: response.data.data?.nominal,
        total_dibayar: toRupiah(
          parseInt(response.data.data?.nominal) + parseInt(dataDetailForBooking.nominal_admin)
        ),
      }

      setispay(true);
      dispatch({
        type: "PAY_FLIGHT",
        // payload:{
        //   isPayed:true
        // }
      });
      setHasilbayar(params);
      
      setIsLoading(false);

    } else {
      setTimeout(() => {
        setIsLoading(false);
        gagal(response.data.rd);
      }, 1000);
    }
	
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
      ) : 
      
      ispay === true ? (
        <>
          <Tiket data={hasilbayar} />
        </>
      )
        :
      (
        <>
          {/* header kai flow */}
          <Modal
              title={
                (<>
                  <div className="flex space-x-2 items-center">
                      <ExclamationCircleFilled className="text-orange-500 text-xl" />
                      <div className="text-bold text-xl text-orange-500">Apakah anda yakin?</div>
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
                  <Button key="back" onClick={hideModal}>
                    Cancel
                  </Button>
                  <Button
                      htmlType="submit"
                      key="submit"
                      type="primary"
                      className="bg-blue-500"
                      loading={isLoading}
                      onClick={handlerPembayaran}
                    >
                      Bayar
                    </Button>
                  </div>
                </div>
              </>
              }
            >
              <p>Apakah Anda yakin ingin melakukan pembayaran ?</p>
            </Modal>
          <div className="px-0 md:px-12 flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <IoMdCheckmarkCircle className="text-green-500" size={20} />
              <div className="hidden xl:flex text-green-500">
                Detail pesanan
              </div>
            </div>
            <div className=" hidden xl:flex">
              <MdHorizontalRule
                size={20}
              />
            </div>
            <div className="hidden xl:flex font-medium space-x-2 items-center">
              <AiOutlineClockCircle size={20} className="" />
              <div className="font-medium ">
                Pembayaran tiket
              </div>
            </div>
          </div>

          {isLoadingPage === true ? (
            <>
              <BayarLoading
                TotalAdult={TotalAdult}
                TotalChild={TotalChild}
                TotalInfant={TotalInfant}
              />
            </>
          ) : (
            <>
              <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
                {/* <div className="block xl:hidden">
                  <Alert
                    message={`Expired Booking : ${remainingBookTime}`}
                    banner
                  />
                </div> */}
                {/* mobile sidebar */}
                <div className="text-black block xl:hidden sidebar w-full xl:w-1/2">
                  <div className="py-2 xl:py-4 -mt-4 xl:mt-0">
                    <Box 
                        className="border shadow px-6 py-6 rounded-xl"
                        sx={{
                          // textAlign: "center",
                          // paddingY: "16px",
                          // borderBottomLeftRadius: "30px",
                          // borderBottomRightRadius: "30px",
                          // cursor: "pointer",
                        }}
                        >
                    <div className="flex justify-between items-center -mt-2">
                      {/* <div className="text-black text-xs">Booking ID</div> */}
                      <div className="text-black text-sm -mt-1.5">
                        Transaksi ID
                      </div>
                      <div className="mt-2 font-bold  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable className="">
                          {dataDetailForBooking && dataDetailForBooking.id_transaksi}
                        </Paragraph>
                      </div>
                    </div>
                    <div className="text-grapy-500 text-xs">

                      Gunakan kode bayar ini sebagai nomor tujuan pada menu
                      pembayaran di aplikasi.
                    </div>
                    </Box>
                    <div className="p-4">
                          <>
                            <div className="flex items-center space-x-2 py-2">
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2 items-center">
                                  <div className="text-xs text-black">
                                    <div className="font-semibold">{dataDetailForBooking.nama_maskapai}</div>
                                  </div>
                                  <img
                                    src={dataDetailForBooking.airlineIcon}
                                    width={30}
                                    alt="logo.png"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="w-full py-2">
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2 items-center">
                                  <div className="text-xs text-black">
                                    <small className="text-xs text-gray-400">Asal</small>
                                    <div className="font-semibold">{dataDetailForBooking.origin}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                {dataDetailForBooking.tanggal_keberangkatan} {" "}{dataDetailForBooking.jam_keberangkatan}
                                </div>
                              </div>
                            </div>
                            <div className="w-full py-2">
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2 items-center">
                                  <div className="text-xs text-black">
                                    <small className="text-xs text-gray-400">Tujuan</small>
                                    <div className="font-semibold">{dataDetailForBooking.destination}</div>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                  {dataDetailForBooking.tanggal_kedatangan} {" "}
                                  {dataDetailForBooking.jam_kedatangan}
                                </div>
                              </div>
                            </div>
                            <div className="w-full py-2">
                              <div className="flex justify-between items-center">
                                <div className="flex space-x-2 items-center">
                                  <div className="text-xs text-black">
                                    <small className="text-xs text-gray-400">Kode Booking</small>
                                    <div className="font-semibold">{dataDetailForBooking.kode_booking}</div>
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
                          </>
                    </div>
                  </div>
                    <div className="py-2">
                      <div className="w-full px-4">
                        <div className="flex justify-between items-center border-b border-gray-200 py-4">
                          <div className="flex space-x-2 items-center">
                            <div className="text-xs text-gray-500">
                              <small className="text-xs text-gray-400">Data Penumpang</small>
                              <div className="my-1">{TotalAdult > 0 && TotalAdult + ' Dewasa'} {TotalAdult > 0 && ', ' +TotalChild + ' Anak'} {TotalAdult > 0 && ', ' +TotalInfant + ' Bayi'}</div>
                            </div>
                          </div>
                          <div onClick={() => {toggleDrawer(true)}} className="cursor-pointer text-xs text-blue-400">
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
                              <div >Total Harga</div>
                            </div>
                          </div>
                          <div className="text-xs">
                          Rp.{" "}
                          	{toRupiah(dataDetailForBooking && dataDetailForBooking?.nominal || '-')}
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
                              <div >Biaya Admin</div>
                            </div>
                            </div>
                          </div>
                          <div className="text-xs">
                          Rp.{" "}
                          {dataDetailForBooking && dataDetailForBooking.nominal_admin}
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
                              <div >Total Bayar</div>
                            </div>
                            </div>
                          </div>
                          <div className="text-xs">
                          Rp.{" "}
                          {toRupiah(
                            parseInt(dataDetailForBooking && dataDetailForBooking?.nominal) +
                              parseInt(
                                dataDetailForBooking && dataDetailForBooking.nominal_admin
                              )
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                </div>

                {/* mobile detail */}
                <DetailPassengersDrawerPlane dataDetailPassenger={dataDetailForBooking} openDrawer={openDrawer} toggleDrawer={toggleDrawer} />              

                {/* desktop */}
                <div className="mt-4 w-full mx-0 2xl:mx-4 hidden xl:block">
                  
                  {/* adult */}
                  {dataDetailForBooking && dataDetailForBooking.penumpang.length > 0
                    ? dataDetailForBooking.penumpang.map((e, i) => (
                        <>
                          <div className="p-0 xl:px-8 xl:mt-6 mt-4 w-full">
                            <div className="">
                              <div className="px-2 py-4 md:py-2 text-black border-b border-gray-200 text-xs font-semibold">
                                {e.nama}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-4 mt-2 gap-4 xl:gap-6">
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium">
                                    NIK
                                  </div>
                                  <div className="mt-2 text-black">
                                    {e.nik}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium">
                                    Nomor HP
                                  </div>
                                  <div className="mt-2 text-black">
                                    {e.status.toUpperCase() == 'DEWASA' ? e.no_hp : '-'}
                                  </div>
                                </div>
                                <div className="px-2 py-2 text-xs">
                                  <div className="text-black font-medium">
                                    Tanggal Lahir
                                  </div>
                                  <div className="mt-2 text-black">
                                    {e.tgl_lahir}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ))
                    : ""}

					
                  <div className="p-2 px-10 mt-4 w-full">
                    <div>
                      <div className="text-xs text-black font-medium  flex justify-between border-t pt-4">
                        <div>
                          {dataDetailForBooking && dataDetailForBooking.nama_maskapai}{" "}
                          {TotalAdult > 0 ? `(Adults) x${TotalAdult}` : ""}{" "}
                          {TotalChild > 0 ? `(Childen) x${TotalChild}` : ""}{" "}
                          {TotalInfant > 0 ? `(Infants) x${TotalInfant}` : ""}
                        </div>
                        <div>
                          Rp. {toRupiah(dataDetailForBooking && dataDetailForBooking?.nominal || '-')}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-black font-medium  flex justify-between">
                        <div>Biaya Admin (Fee)</div>
                        <div>
                          Rp.{" "}
                          {toRupiah(dataDetailForBooking && dataDetailForBooking.nominal_admin)}
                        </div>
                      </div>
                      <div className="mt-4 mb-4 pt-2 border-t border-gray-200 text-sm text-black font-semibold  flex justify-between">
                        <div>Total Harga</div>
                        <div>
                          Rp.{" "}
                          {toRupiah(
                            parseInt(dataDetailForBooking && dataDetailForBooking?.nominal || 0) +
                              parseInt(
                                dataDetailForBooking && dataDetailForBooking.nominal_admin
                              )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* desktop sidebar */}
                <div className="px-8sidebar hidden xl:block w-full xl:w-2/3 2xl:w-1/2">
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
                      <div className="mt-1  font-medium  text-blue-500 text-[18px]">
                        {/* {hasilBooking && hasilBooking.bookingCode} */}
                        <Paragraph copyable>
                          {dataDetailForBooking && dataDetailForBooking.id_transaksi}
                        </Paragraph>
                      </div>
                      <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
                    </div>
                    <div className="p-4 border-t mt-2">
                      <div className="text-xs text-black">
                        PESAWAT DESCRIPTION
                      </div>
                          <>
                            <div className="mt-2 mb-2 flex items-center space-x-2">
                              <div>
                                <img
                                  src={dataDetailForBooking.airlineIcon}
                                  width={50}
                                  alt="logo.png"
                                />
                              </div>
                              <div className="mt-3 md:mt-4 text-xs text-black">
                                <div className="font-semibold">{dataDetailForBooking.kode_maskapai}</div>
                                <div>{dataDetailForBooking.nama_maskapai}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-1 md:mt-4 text-xs text-black font-medium ">
                              <div>{dataDetailForBooking.origin}</div>{" "}
                              <BsArrowRightShort />{" "}
                              <div>{dataDetailForBooking.destination}</div>
                            </div>
                            <div className="mt-3 md:mt-4 text-xs text-black">
                              {dataDetailForBooking.tanggal_kedatangan}
                            </div>
                            <div className="mt-1 md:mt-2 text-xs text-black">
                              {dataDetailForBooking.jam_keberangkatan} -{" "}
                              {dataDetailForBooking.jam_kedatangan}
                            </div>
                          </>
                    </div>
                  </div>

                  {/* desktop payment button */}
                  <div className="hidden xl:block mt-2">
                    <Alert
                      message={`Expired Booking : ${remainingBookTime}`}
                      banner
                    />
                  </div>
                {/* {callbackBoolean == true ? ( */}
                  <div className="hidden xl:block mt-2 py-2 rounded-md border-t border-gray-200 shadow-sm">
                      <>
                        {/* {isOk == true && isCurrentBalance == true ? ( */}
                          <>
                            <div className="px-8 md:px-4 py-4 text-sm text-black">
                              Tekan tombol dibawah ini untuk melanjutkan proses
                              transaksi.
                            </div>
                            <div className="flex justify-center">
                              <Button
                              // onClick={isOk && isCurrentBalance && showModal}   
                              onClick={showModal}                                             
                              size="large"
                                key="submit"
                                type="primary"
                                className="bg-blue-500 px-12 font-semibold"
                                loading={isLoading}
                              >
                                Bayar Sekarang
                              </Button>
                            </div>
                            {isSimulated === 1 ? (<Alert className="mt-4" message="Don't worry, clicking the 'Bayar' will not affect your balance." banner/>) : ''}
                          </>
                        {/* ) : ''} */}
                      </>
                  </div>
                  {/* ) : ( */}
                    <>
                    </>
                  {/* )} */}
                </div>
              {/* {callbackBoolean == true ? ( */}
                <div className="block xl:hidden mt-2 py-4 rounded-md">
                    <>
                    {/* {isOk == true && isCurrentBalance == true ? ( */}
                      <>
                        <div className="min-w-full flex justify-center">
                          <Button
                            onClick={showModal}                        
                            size="large"
                            key="submit"
                            type="primary"
                            className="w-full bg-blue-500 mx-2 font-semibold mt-4"
                            loading={isLoading}
                          >
                            Bayar Sekarang
                          </Button>
                        </div>
                        {isSimulated === 1 ? (<Alert className="mt-4" message="Clicking 'Bayar' will not affect your balance." banner/>) : ''}
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
              {/* ) : ( */}
                <>
                </>
               {/* )} */}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
