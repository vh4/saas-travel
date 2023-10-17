import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import { MdHorizontalRule } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { TiketContext } from "../../App";
import { Button as ButtonAnt } from "antd";
import { notification } from "antd";
import Marquee from "react-fast-marquee";
import { Alert } from "antd";
import { TbArrowsLeftRight } from "react-icons/tb";
import Page400 from "../components/400";
import Page500 from "../components/500";
import { parseTanggal } from "../../helpers/date";
import { toRupiah } from "../../helpers/rupiah";
import BayarLoading from "../components/pelniskeleton/bayar";

export default function Pembayaran() {
  const navigate = useNavigate();

  const { dispatch } = useContext(TiketContext);

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [api, contextHolder] = notification.useNotification();

  //loading hanlde submit pembayaran.
  const [isLoading, setLoading] = React.useState(false);
  const [passengers, setPassengers] = useState({});

  const { id } = useParams();
  const [book, setBook] = useState(null);

  const [bookInfo, setBookInfo] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errPage, setErrPage] = useState(false);

  const [TotalAdult, setTotalAdult] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);

  const [err, setErr] = useState(false);

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    Promise.all([getInfoBooking(), getInfoBookingInfo(), getDataPassengers()])
      .then(([bookResponse, bookInfoResponse, passenggerResponse]) => {
        if (bookResponse.data.rc === "00") {
          setBook(bookResponse.data.data);
        }else{
          setErrPage(true);
        }

        if (bookInfoResponse.data.rc === "00") {
          setBookInfo(bookInfoResponse.data.data);
        }else{
          setErrPage(true);
        }

        if (passenggerResponse.data.rc === "00") {
          setPassengers(passenggerResponse.data);
          setTotalAdult(passenggerResponse.data.adult);
          setTotalInfant(passenggerResponse.data.infant);

        }else{
          setErrPage(true);
        }

        setTimeout(() => {
          setIsLoadingPage(false);
        }, 2000);
        
      })
      .catch(() => {
        setIsLoadingPage(false);
        setErrPage(true);
      });
  }, [id, token]);

  async function getInfoBooking() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/book/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getInfoBookingInfo() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/book_info/${id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

    async function getDataPassengers() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/booking/passengers/${id}`
      );
      return response;
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
  }

  return (
    <>
      {contextHolder}
      
      {err === true ? 
      (
        <>
          <Page500 />
        </>
      ) : errPage === true ? 
      (
        <>
          <Page400 />
        </>
      ) : 
      (
        <>
          {/* header kai flow */}
          <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="flex space-x-2 items-center">
              <AiOutlineCheckCircle className="text-slate-500" size={20} />
              <div className="hidden xl:flex text-slate-500">
                Detail pesanan
              </div>
              <div className="block xl:hidden text-slate-500">Detail</div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="hidden xl:flex text-gray-500"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <AiOutlineCheckCircle className="text-slate-500" size={20} />
              <div className="hidden xl:flex text-slate-500 font-bold">
                Konfirmasi pesanan
              </div>
              <div className="block xl:hidden text-slate-500 font-bold">
                Konfirmasi
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="text-gray-500 hidden xl:flex"
              />
            </div>
            <div className="flex space-x-2 items-center">
              <div className="hidden xl:block text-blue-500">
                Pembayaran tiket
              </div>
              <div className="block xl:hidden text-blue-500">Payment</div>
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
          {
            isLoadingPage === true ? 
            (
              <>
              <BayarLoading total={parseInt(TotalAdult) + parseInt(TotalInfant)} />
              </>
            ) : (
              <>
                <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
                  <div className="mt-4 w-full mx-0 2xl:mx-4">
                    {/* adult and infant */}
                    {bookInfo.PAX_LIST.length > 0
                      ? bookInfo.PAX_LIST.map((e, i) => (
                          <>
                            <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                              <div className="p-2">
                                <div className="px-2 xl:px-4 py-2 text-gray-600 border-b border-gray-200 text-sm font-bold">
                                  {bookInfo.PAX_LIST[i][0]} (
                                  {bookInfo.PAX_LIST[i][6] == "N/A"
                                    ? "INFANT"
                                    : "ADULT"}
                                  )
                                </div>
                                <div className="mt-2 block md:flex md:space-x-8">
                                  {/* <div className="px-2 md:px-4 py-2 text-sm">
                                          <div className="text-gray-500">NIK</div>
                                          <div className="font-bold text-xs text-gray-600">{bookInfo.PAX_LIST[i][1]}</div>
                                      </div> */}
                                  <div className="px-2 md:px-4 py-2">
                                    <div className="text-gray-500 text-sm">
                                      Nomor HP
                                    </div>
                                    <div className="font-bold text-xs text-gray-600">
                                      {bookInfo.CALLER}
                                    </div>
                                  </div>
                                  <div className="px-2 md:px-4 py-2">
                                    <div className="text-gray-500 text-sm">Kursi</div>
                                    <div className="font-bold text-xs text-gray-600">
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
                                  <div className="px-2 md:px-4 py-2">
                                    <div className="text-sm text-gray-500">Kelas</div>
                                    <div className="font-bold text-xs text-gray-600">
                                      {bookInfo.CLASS} / Subclass ({bookInfo.SUBCLASS}
                                      )
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ))
                      : ""}
                    <div className="p-2 mt-2 w-full rounded-md border border-gray-200 shadow-sm">
                      <div className="p-4">
                        <div className="text-xs text-gray-600 font-bold flex justify-between">
                          <div>
                            {bookInfo && bookInfo.SHIP_NAME}{" "}
                            {TotalAdult > 0 ? `(Adult) x${TotalAdult}` : ""}{" "}
                            {TotalInfant > 0 ? `(Infant) x${TotalInfant}` : ""}
                          </div>
                          <div>Rp. {book && toRupiah(book.normalSales)}</div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 font-bold flex justify-between">
                          <div>Biaya Admin (Fee) x{TotalAdult + TotalInfant}</div>
                          <div>
                            Rp.{" "}
                            {book &&
                              toRupiah(
                                book.nominal_admin * (TotalAdult + TotalInfant)
                              )}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 font-bold flex justify-between">
                          <div>Diskon (Rp.)</div>
                          <div>Rp. {book && book.discount}</div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-gray-600 font-bold flex justify-between">
                          <div>Total Harga</div>
                          <div>
                            Rp.{" "}
                            {book &&
                              toRupiah(
                                parseInt(book.normalSales) -
                                  parseInt(book.discount) +
                                  parseInt(
                                    book.nominal_admin * (TotalAdult + TotalInfant)
                                  )
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* desktop sidebar */}
                  <div className="sidebar w-full xl:w-1/2">
                    <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                      <div className="px-4 py-2">
                        {/* <div className="text-gray-500 text-xs">Status Booking</div> */}
                        <div className="text-gray-500 text-xs">Transaksi ID</div>
                        <div className="mt-1 font-bold text-blue-500 text-[18px]">
                          {book && book.transactionId}
                        </div>
                        <div className="text-grapy-500 text-xs">
                        Gunakan transaksi id diatas untuk melakukan inq ulang dan pembayaran.
                      </div>
                      </div>
                      <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">PELNI DESCRIPTION</div>
                        <div className="mt-3 text-xs text-gray-500">
                          {book.SHIP_NAME}
                        </div>
                        <div className="flex space-x-4">
                          <div className="mt-1 text-xs text-slate-700 font-bold">
                            {passengers.pelabuhan_asal}
                          </div>
                          <TbArrowsLeftRight className="text-gray-500" size={18} />
                          <div className="mt-1 text-xs text-slate-700 font-bold">
                            {passengers.pelabuhan_tujuan}
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          {parseTanggal(passengers.departureDate)} -{" "}
                          {parseTanggal(book.arrivalDate)}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {book.departureTime} - {book.arrivalTime}
                        </div>
                      </div>
                      <div className="p-4 border-t">
                        <div className="text-xs text-gray-500">LIST PASSENGERS</div>
                        {passengers.passengers.adults &&
                        passengers.passengers.adults.length > 0
                          ? passengers.passengers.adults.map((e, i) => (
                              <div className="mt-3 text-xs text-slate-700 font-bold">
                                {e.name} (Adult)
                              </div>
                            ))
                          : ""}
                        {passengers.passengers.infants &&
                        passengers.passengers.infants.length > 0
                          ? passengers.passengers.infants.map((e, i) => (
                              <div className="mt-3 text-xs text-slate-700 font-bold">
                                {e.name} (Infants)
                              </div>
                            ))
                          : ""}
                      </div>
                    </div>
                    <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
                      {/* <div className="px-8 py-4 text-sm text-gray-500">
                              Tekan tombol <span className="text-blue-500">bayar langsung</span> untuk melakukan pembayaran secara tunai.
                          </div> */}

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
                    </div>
                  </div>
                </div>
              </>
            )
          }
        </>
      )

    }
    </>
  );
}
