import React, { useState, useEffect } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import axios from "axios";
import { Modal, message } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { remainingTime } from "../../helpers/date";
import Page500 from "../components/500";
import { IoBoatSharp } from "react-icons/io5";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { CiBoxList, CiCircleMore, CiTimer } from "react-icons/ci";
import { HiOutlinePrinter } from "react-icons/hi2";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { callbackFetchData } from "../../features/callBackSlice";
import { setBookDataLanjutBayarPelni } from "../../features/createSlice";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function ViewBooking({ path }) {
  const [data, setData] = useState([]);
  const [byrdata, setByrData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadBayar, setLoadBayar] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [loading, setLoading] = useState(false);
  // const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const hardcode_inq = searchParams.get("hc_inq");
  const hardcode_pay = searchParams.get("hc_pay");

  useEffect(() => {
    if (token == null || token == undefined) {
      setErr(true);
    }
  }, [token]);

  useEffect(() => {
    getTransaksiList();
  }, []);

  const getTransaksiList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/app/transaction_book_list`,
        {
          token: JSON.parse(
            localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
          ),
          product: "KAPAL",
        }
      );

      if (response.data.rc !== "00" && response.data.rc !== "33") {
        setErrPage(true);
      }

      const datas = response.data;
      let resp = datas.data || [];

      const harcodeDataInq = {
        id_transaksi: 293892199,
        tanggal_transaksi: "Jumat, 22 Maret 2024",
        kode_booking: "8890583925",
        nama_kapal: "KM.KELUD",
        origin: "TANJUNG PRIOK (JAKARTA)",
        destination: "BELAWAN (MEDAN)",
        tanggal_keberangkatan: "20240322",
        hari_keberangkatan: "Jumat",
        jam_keberangkatan: "23:00",
        tanggal_kedatangan: "20240325",
        hari_kedatangan: "Senin",
        subClass: "C",
        jam_kedatangan: "15:00",
        penumpang: [{ nama: "Komang J" }],
        komisi: 0,
        url_etiket:
          "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=293892199",
        url_struk:
          "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=293892199",
        expiredDate: dayjs().add(1, "hours"),
        url_image:
          "https://rajabiller.fastpay.co.id/travel/app/generate_image_etiket?id_transaksi=293892199",
        nominal: "964000",
        nominal_admin: "10000",
        status: {
          id_transaksi: 293892199,
          paymentCode: "8890583925",
          Produk: "Tiket Pelni",
          Status: "Booking",
          status_booking: "Sukses",
          status_payment: "Belum ada payment",
        },
      };
      const harcodeDataPay = {
        id_transaksi: 293887921,
        tanggal_transaksi: "Jumat, 22 Maret 2024",
        kode_booking: "8830480474",
        nama_kapal: "KM.KELUD",
        origin: "TANJUNG PRIOK (JAKARTA)",
        destination: "BELAWAN (MEDAN)",
        tanggal_keberangkatan: "20240322",
        hari_keberangkatan: "Jumat",
        jam_keberangkatan: "23:00",
        tanggal_kedatangan: "20240325",
        hari_kedatangan: "Senin",
        subClass: "A",
        jam_kedatangan: "15:00",
        penumpang: [{ nama: "Fathoni Waseso J" }],
        komisi: 0,
        url_etiket:
          "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=293887921",
        url_struk:
          "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=293887921",
        expiredDate: dayjs().add(1, "hours"),
        url_image:
          "https://rajabiller.fastpay.co.id/travel/app/generate_image_etiket?id_transaksi=293887921",
        nominal: "1720000",
        nominal_admin: "10000",
        status: {
          id_transaksi: 293887921,
          paymentCode: "8830480474",
          Produk: "Tiket Pelni",
          Status: "Payment",
          status_booking: "Sukses",
          status_payment: "Sukses",
        },
      };

      if (hardcode_pay === "2") {
        resp = [harcodeDataPay, ...resp];
      }

      if (hardcode_inq === "2") {
        resp = [harcodeDataInq, ...resp];
      }

      setData(resp);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setErrPage(true);
    }
  };

  function openModalBayar(e, i) {
    let filterDataSearching = data.filter((_, index) => index === i);
    setByrData(filterDataSearching[0]);
    e.preventDefault();
    setShowModal(true);
    setTimeout(() => {
      setLoadBayar(false);
    }, 1000);
  }

  // const handleBayar = async () => {
  //   setLoading(true);
  // };

  const intervalRef = React.useRef(null);

  const [remainingTimes, setRemainingTimes] = useState([]);

  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      const y = [];

      data.forEach((x, i) => {
        const res = x?.expiredDate;
        y.push(res);
      });

      setRemainingTimes(y);
    }
  }, [data]);

  // Cleanup interval when component unmounts
  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      intervalRef.current = setInterval(() => {
        const updatedRemainingTimes = remainingTimes.map((time) => {
          time = new Date(time).getTime();
          const timenow = new Date().getTime();

          if (time > timenow) {
            time = time - 1;
            return time;
          }
          return 0;
        });

        setRemainingTimes(updatedRemainingTimes);
      }, 1000);
    } else {
      setRemainingTimes([]);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [data, remainingTimes]);

  const handleDetail = async (e) => {
    setIsLoading(true);
    try {
      dispatch(
        callbackFetchData({ type: "pelni", id_transaksi: e.id_transaksi })
      );
      dispatch(setBookDataLanjutBayarPelni(e));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(true);
    navigate({
      pathname: `/pelni/detail/payment`,
    });
  };

  return (
    <>
      {contextHolder}
      <div className="">
        {/* meessage bayar */}
        <Modal
          width={1000}
          open={showModal}
          onOk={handleClose}
          onCancel={handleClose}
          footer={
            [
              // <Button key="back" onClick={handleClose}>
              //   Cancel
              // </Button>,
              // <Button key="submit" type="primary" className='bg-blue-500' loading={loading} disabled>
              //   Bayar Langsung
              // </Button>,
            ]
          }
        >
          {loadBayar !== true ? (
            <div className="mt-4 mb-12">
              {byrdata.penumpang.map((e) => (
                <>
                  <div className="border-b p-4 grid grid-cols-1 xl:grid-cols-5 gap-4 mt-4">
                    <div className="text-xs">
                      <div className="">Nama</div>
                      <div>{e.nama}</div>
                    </div>
                  </div>
                </>
              ))}
              <div className="p-2 flex space-x-2 items-center mt-4">
                <CiBoxList size={16} />
                <div className="text-xs">Deskripsi</div>
              </div>
              {/* desktop */}
              <div className="p-4 w-full hidden xl:gap-4 lg:grid lg:grid-cols-10">
                <div className="col-span-2">
                  <div className="text-xs">{byrdata.nama_kapal} </div>
                  <small>Subclass {byrdata.subClass}</small>
                </div>
                <div className="col-span-2">
                  <div className="text-xs">
                    {new Date(
                      byrdata.tanggal_keberangkatan.slice(0, 4),
                      parseInt(byrdata.tanggal_keberangkatan.slice(4, 6)) - 1,
                      byrdata.tanggal_keberangkatan.slice(6, 8)
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                  </div>
                  <small>Tanggal Keberangkatan</small>
                </div>
                <div className="flex col-span-2">
                  <div className="">
                    <div className="mt-4 xl:mt-0 text-xs">
                      {byrdata.jam_keberangkatan
                        .toString()
                        .padStart(4, "0")
                        .replace(/(\d{2})(\d{2})/, "$1:$2")}
                    </div>
                    <small>{byrdata.origin}</small>
                  </div>
                  <HiOutlineArrowNarrowRight size={24} />
                </div>
                <div className="col-span-2">
                  <div className="text-xs">
                    {new Date(
                      byrdata.tanggal_kedatangan.slice(0, 4),
                      parseInt(byrdata.tanggal_kedatangan.slice(4, 6)) - 1,
                      byrdata.tanggal_kedatangan.slice(6, 8)
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                  </div>
                  <small>Tanggal Kedatangan</small>
                </div>
                <div className="col-span-2">
                  <div className="text-xs">
                    {byrdata.jam_kedatangan
                      .toString()
                      .padStart(4, "0")
                      .replace(/(\d{2})(\d{2})/, "$1:$2")}
                  </div>
                  <small>{byrdata.destination}</small>
                </div>
                <div className="col-span-2">
                  <div className="mt-4 xl:mt-0 text-xs text-blue-500">
                    Rp.{" "}
                    {(
                      (parseInt(byrdata.nominal) || 0) +
                      (parseInt(byrdata.nominal_admin) || 0)
                    ).toLocaleString("id-ID")}
                  </div>
                  <small>
                    Total (Admin Rp.{" "}
                    {toRupiah(
                      byrdata.nominal_admin ? byrdata.nominal_admin : 0
                    ) ?? 0}
                    )
                  </small>
                </div>
              </div>
              {/* mobile */}
              <div className="p-4 w-full block mt-4 lg:hidden">
                <div className="">
                  <div className="text-xs">{byrdata.nama_kapal} </div>
                  <small>Subclass {byrdata.subClass}</small>
                </div>
                <div className="mt-4">
                  <div className="text-xs">
                    {new Date(
                      byrdata.tanggal_keberangkatan.slice(0, 4),
                      parseInt(byrdata.tanggal_keberangkatan.slice(4, 6)) - 1,
                      byrdata.tanggal_keberangkatan.slice(6, 8)
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                  </div>
                  <small>Tanggal Keberangkatan</small>
                </div>
                <div className="mt-4">
                  <div className="text-xs">
                    {new Date(
                      byrdata.tanggal_kedatangan.slice(0, 4),
                      parseInt(byrdata.tanggal_kedatangan.slice(4, 6)) - 1,
                      byrdata.tanggal_kedatangan.slice(6, 8)
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                  </div>
                  <small>Tanggal Kedatangan</small>
                </div>
                <div className="flex space-x-4 items-center">
                  <div className="">
                    <div className="">
                      <div className="mt-4 xl:mt-0 text-xs">
                        {byrdata.jam_keberangkatan
                          .toString()
                          .padStart(4, "0")
                          .replace(/(\d{2})(\d{2})/, "$1:$2")}
                      </div>
                      <small>{byrdata.origin}</small>
                    </div>
                  </div>
                  <HiOutlineArrowNarrowRight size={24} />
                  <div className="">
                    <div>
                      <div className="mt-4  text-xs">
                        {byrdata.jam_kedatangan
                          .toString()
                          .padStart(4, "0")
                          .replace(/(\d{2})(\d{2})/, "$1:$2")}
                      </div>
                      <small>{byrdata.destination}</small>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="mt-4 xl:mt-0 text-xs text-blue-500">
                    Rp.{" "}
                    {(
                      (parseInt(byrdata.nominal) || 0) +
                      (parseInt(byrdata.nominal_admin) || 0)
                    ).toLocaleString("id-ID")}
                  </div>
                  <small>
                    Total (Admin Rp.{" "}
                    {toRupiah(
                      byrdata.nominal_admin ? byrdata.nominal_admin : 0
                    ) ?? 0}
                    )
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Modal>
        {err === true ? (
          <>
            <Page500 />
          </>
        ) : errPage === true ? (
          <>
            <Page500 />
          </>
        ) : (
          <>
            {isLoading === false ? (
              <>
                {data !== null &&
                data !== undefined &&
                data.length !== undefined &&
                data.length !== 0 ? (
                  <div className="mt-4 xl:mt-8">
                    {data.map((e, i) => (
                      <div className="mt-4 xl:mt-0">
                        <div className="w-full profile-header">
                          <div className="p-2 xl:px-8 xl:py-6 mt-4 mb-8 xl:mb-0 xl:mt-0">
                            <div className="flex justify-between items-end">
                              {!e.status?.status_payment
                                ?.toUpperCase()
                                ?.includes("SUKSES") ? (
                                <>
                                  <div className="flex space-x-2  items-end">
                                    <div className="text-xs text-black">
                                      Id Transaksi
                                    </div>
                                    <div className="text-xs text-blue-500">
                                      {e.id_transaksi}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex space-x-2  items-end">
                                    <div className="text-xs text-black">
                                      Kode Booking
                                    </div>
                                    <div className="text-xs text-blue-500">
                                      {e.kode_booking}
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="text-xs text-black">
                                Rp. {toRupiah(e.nominal)}
                              </div>
                            </div>
                            <div className="border-t mt-4 xl:mt-4">
                              <div className="flex space-x-2 mt-6 text-xs text-black">
                                <IoBoatSharp
                                  className="text-blue-500"
                                  size={16}
                                />
                                <div className="flex space-x-2 items-center">
                                  <div>{e.origin.toUpperCase()}</div>
                                  <BsArrowRightShort />
                                  <div>{e.destination.toUpperCase()}</div>
                                </div>
                              </div>
                              <div className="pl-1">
                                <div className="mt-4 xl:mt-4 text-xs text-black font-medium">
                                  Tanggal Transaksi
                                </div>
                                <div className="mt-2 text-xs text-black">
                                  {e.tanggal_transaksi}
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 border-t block lg:flex lg:justify-between  lg:items-center">
                              {/* <div className='mt-2 flex space-x-2 items-end'>
                              <div className='mt-1 text-xs  text-black'>
                                Kode Booking
                              </div>
                              <div className='mt-1 text-sm font-bold text-black'>
                                 - 
                              </div>
                            </div> */}
                              <div className="flex justify-between space-x-0 xl:space-x-4 items-center pt-4 xl:pt-4">
                                <div className="flex space-x-4 items-center">
                                  {!e.status?.status_payment
                                    ?.toUpperCase()
                                    ?.includes("SUKSES") ? (
                                    <>
                                      <div className="flex space-x-2 items-center text-xs py-1 text-black">
                                        <CiTimer size={16} />
                                        <div>
                                          {remainingTimes[i] &&
                                          new Date(e.expiredDate).getTime() >
                                            new Date().getTime()
                                            ? remainingTime(remainingTimes[i])
                                            : " habis."}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs py-1 px-3 rounded-full bg-green-500 text-white">
                                        Transaksi Sukses
                                      </div>
                                    </>
                                  )}
                                  {e.status?.status_payment
                                    ?.toUpperCase()
                                    ?.includes("SUKSES") && (
                                    <>
                                      <a
                                        href={`https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=${e.status.id_transaksi}`}
                                        target="_blank"
                                      >
                                        <div className="flex space-x-2 items-center text-black">
                                          <HiOutlinePrinter size={16} />
                                          <div className="text-xs">Cetak</div>
                                        </div>
                                      </a>
                                    </>
                                  )}
                                  <div className="flex space-x-2 items-center">
                                    <CiCircleMore size={16} />
                                    <a
                                      onClick={(e) => openModalBayar(e, i)}
                                      className="cursor-pointer text-black text-xs hover:text-black"
                                    >
                                      Lihat Detail
                                    </a>
                                  </div>
                                  <div className="flex space-x-2 items-center">
                                      <a
                                        onClick={() => handleDetail(e)}
                                        className="cursor-pointer text-black text-xs hover:text-black"
                                      >
                                        Lanjut Bayar
                                      </a>
                                      <IoIosArrowRoundForward size={16} />
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center items-center">
                      <div className="text-center">
                        <img
                          className="block mx-auto"
                          width={220}
                          src="/emptyy.png"
                          alt="empty.png"
                        />
                        <div className="text-black font-medium text-center">
                          Data Tidak Ditemukan
                        </div>
                        <div className="mt-2 text-center text-black text-xs">
                          Maaf, History Data Booking Tidak ditemukan. Lakukan
                          Booking terlebih dahulu.
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="w-full mt-12 flex justify-center items-center">
                  <div class="text-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.8130 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
