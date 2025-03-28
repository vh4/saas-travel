import React, { useState, useEffect } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import axios from "axios";
import { Modal, message } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { parseTanggal, remainingTime } from "../../helpers/date";
import Page500 from "../components/500";
import { IoBoatSharp } from "react-icons/io5";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { CiBoxList } from "react-icons/ci";
import { HiOutlinePrinter } from "react-icons/hi2";
import dayjs from "dayjs";

export default function ViewBooking({ path }) {
  const [data, setData] = useState([]);
  const [byrdata, setByrData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadBayar, setLoadBayar] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  // const [loading, setLoading] = useState(false);
  const handleClose = () => setShowModal(false);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);

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
          product: "DLUKAPAL",
          startDate: dayjs().format("YYYY-MM-DD"),
          endDate: dayjs().format("YYYY-MM-DD"),
        }
      );

      if (response.data.rc !== "00" && response.data.rc !== "33") {
        setErrPage(true);
      }

      const datas = response.data;

      setData(datas.data);
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
                      <div>{e.nama || "-"}</div>
                    </div>
                    <div className="text-xs">
                      <div className="">Tanggal Lahir</div>
                      <div>{e.dob || "-"}</div>
                    </div>
                    <div className="text-xs">
                      <div className="">NIK</div>
                      <div>{e.idpass || "-"}</div>
                    </div>
                    <div className="text-xs">
                      <div className="">ID Tiket</div>
                      <div>{e.id_ticket || "-"}</div>
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
                  <small>Kelas {byrdata.tipe_class.split("|")[1] || ""}</small>
                </div>
                <div className="col-span-2">
                  <div className="text-xs">
                    {parseTanggal(byrdata.tanggal_keberangkatan)}{" "}
                  </div>
                  <small>Tanggal Keberangkatan</small>
                </div>
                <div className="flex col-span-2">
                  <div className="">
                    <div className="mt-4 xl:mt-0 text-xs">
                      {byrdata?.time_keberangkatan}
                    </div>
                    <small>{byrdata.origin[0]?.nama_pelabuhan}</small>
                  </div>
                  <HiOutlineArrowNarrowRight size={24} />
                </div>
                <div className="col-span-2">
                  <div className="text-xs">
                    {parseTanggal(byrdata?.tanggal_kedatangan)}{" "}
                  </div>
                  <small>Tanggal Kedatangan</small>
                </div>
                <div className="col-span-2">
                  <div className="text-xs">{byrdata.time_kedatangan}</div>
                  <small>{byrdata.destination[0]?.nama_pelabuhan}</small>
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
              {/* <div className="p-4 w-full block mt-4 lg:hidden">
                <div className="">
                  <div className="text-xs">{byrdata.nama_kapal} </div>
                  <small>Kelas {byrdata.tipe_class}</small>
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
                        {byrdata.time_keberangkatan}
                      </div>
                      <small>{byrdata.origin}</small>
                    </div>
                  </div>
                  <HiOutlineArrowNarrowRight size={24} />
                  <div className="">
                    <div>
                      <div className="mt-4  text-xs">
                        {byrdata.time_kedatangan}
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
              </div> */}
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
                      <div className="w-full mb-4">
                        <div className="w-full profile-header">
                          <div className="p-2 xl:p-8 mt-12 xl:mt-0">
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
                                  <div>
                                    {e.origin[0].nama_pelabuhan?.toUpperCase()}
                                  </div>
                                  <BsArrowRightShort />
                                  <div>
                                    {e.destination[0].nama_pelabuhan?.toUpperCase()}
                                  </div>
                                </div>
                              </div>
                              <div className="pl-1">
                                <div className="mt-4 xl:mt-4 text-xs text-black font-medium">
                                  Tanggal Transaksi
                                </div>
                                <div className="mt-2 text-xs text-black">
                                  {parseTanggal(e.tanggal_transaksi)}
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
                                      <div className="text-xs font-bold py-1 px-3 rounded-full bg-blue-500 text-white inline-block">
                                        Sisa waktu{" "}
                                        {remainingTimes[i] &&
                                        new Date(e.expiredDate).getTime() >
                                          new Date().getTime()
                                          ? remainingTime(remainingTimes[i])
                                          : " habis."}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs py-1 px-3 rounded-full bg-green-500 text-white">
                                        Transaksi Sukses
                                      </div>
                                    </>
                                  )}
                                  <div
                                    onClick={(e) => openModalBayar(e, i)}
                                    className="cursor-pointer text-blue-500 font-bold text-xs"
                                  >
                                    Lihat Detail
                                  </div>
                                </div>
                                {e.status?.status_payment
                                  ?.toUpperCase()
                                  ?.includes("SUKSES") && (
                                  <>
                                    <a
                                      href={`https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=${e.status.id_transaksi}`}
                                      target="_blank"
                                    >
                                      <div className="flex space-x-2 items-center text-black">
                                        <HiOutlinePrinter size={16} />
                                        <div className="text-xs">Cetak</div>
                                      </div>
                                    </a>
                                  </>
                                )}
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
