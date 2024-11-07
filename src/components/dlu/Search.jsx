import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import SearchDLU from "./DLUSearch";
import { notification } from "antd";
import Page400 from "../components/400";
import Page500 from "../components/500";
import { toRupiah } from "../../helpers/rupiah";
import { v4 as uuidv4 } from "uuid";
import {BsArrowDownCircle} from "react-icons/bs";
import { extractTimeWithTimeZone, parseTanggal, parseTanggalPelni } from "../../helpers/date";
export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const origin = searchParams.get("origin_code");
  const originName = searchParams.get("origin_name");
  const destination = searchParams.get("destination_code");
  const destinationName = searchParams.get("destination_name");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  const infant = searchParams.get("infant");
  const type_ticket = searchParams.get("type_ticket");
  const type_class = searchParams.get("type_class");
  const type_class_name = searchParams.get("type_class_name");
  const count_passangers = searchParams.get("count_passangers");
  const count_passangers_name = searchParams.get("count_passangers_name");
  const type_vehicle = searchParams.get("type_vehicle");
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );
  const [uuid, setuuid] = useState(null);
  const navigate = useNavigate();
  const [ubahPencarian, setUbahPencarian] = useState(false);
  const [err, setErr] = useState(false);
  const [pageErr, setPageErr] = useState(false);
  const [openButton, setOpenButton] = useState(null);
  const [api, contextHolder] = notification.useNotification();

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

    if (origin === null || origin === undefined) {
      setPageErr(true);
    }

    if (destination === null || destination === undefined) {
      setPageErr(true);
    }

    if (startDate === null || startDate === undefined) {
      setPageErr(true);
    }
    if (endDate === null || endDate === undefined) {
      setPageErr(true);
    }

    if (originName === null || originName === undefined) {
      setPageErr(true);
    }
    if (destinationName === null || destinationName === undefined) {
      setPageErr(true);
    }

    if (count_passangers === null || count_passangers === undefined) {
      setPageErr(true);
    }

    if (
      type_ticket === null ||
      type_ticket === undefined ||
      isNaN(parseInt(type_ticket)) == true
    ) {
      setPageErr(true);
    }

    if (
      type_class === null ||
      type_class === undefined ||
      isNaN(parseInt(type_class)) == true
    ) {
      setPageErr(true);
    }

    if (
      type_vehicle === null ||
      type_vehicle === undefined ||
      isNaN(parseInt(type_vehicle)) == true
    ) {
      setPageErr(true);
    }

    if (
      infant === null ||
      infant === undefined ||
      isNaN(parseInt(infant)) == true
    ) {
      setPageErr(true);
    }

    if (
      child === null ||
      child === undefined ||
      isNaN(parseInt(child)) == true
    ) {
      setPageErr(true);
    }

    if (
      adult === null ||
      adult === undefined ||
      isNaN(parseInt(adult)) == true
    ) {
      setPageErr(true);
    }
  }, [
    token,
    origin,
    destination,
    startDate,
    endDate,
    adult,
    infant,
    child,
    destinationName,
    originName,
    type_class,
    type_ticket,
    count_passangers,
    type_vehicle,
  ]);

  const [isLoading, setLoading] = React.useState(false);
  const [notFound, setError] = React.useState(true);
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [dataSearch, setDataSearch] = React.useState(Array());

  useEffect(() => {
    handlerSearch();
  }, []);

  const handlerSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/ship/search`,
        {
          via: "MOBILE_SMART",
          kode_produk: "SHPDLU",
          start_date: startDate,
          end_date: endDate,
          origin_code: origin,
          destination_code: destination,
          type_ticket: type_ticket,
          type_class: type_class,
          type_vehicle: type_vehicle,
          count_passangers: count_passangers,
          token: token,
        }
      );

      if (response.data.rc == "00" || response.data.rc == "01") {
        const dataParsing = response.data.data || [];

        setDataSearch(dataParsing);
        setuuid(response.data.uuid || "");

        setLoading(false);
        setError(false);
      } else {
        failedNotification(response.data.rd);
        setLoading(false);
        setError(true);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  async function handleSubmit(e, i) {
    let params = {
      adult: adult,
      infant: infant,
      child: child,
      kendaraan: count_passangers_name,
      ...e,
    };

    const response_fare = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/ship/fare`,
      {
        via: "WEB",
        kode_produk: "SHPDLU",
        start_date: e.departure_date,
        origin_code: e.origin_code,
        destination_code: e.destination_code,
        type_ticket: e.type_ticket,
        type_class: e.type_class,
        type_vehicle: e.type_vehicle,
        schedule_id: e.id_schedule,
        count_passangers: `${adult}#${child}#${infant}#${count_passangers_name}`,
        nominal: e.total,
        token: token,
      }
    );

    if (response_fare.data.rc == "00") {
      params = {
        ...params,
        ...response_fare.data.data,
        type_class_name,
        count_passangers,
      };

      const uuid = uuidv4();
      localStorage.setItem(`data:dlu/${uuid}`, JSON.stringify(params));

      navigate(`/dlu/booking/${uuid}`);
    } else {
      failedNotification(response_fare.data.rd);
    }
  }

  const sortedData = dataSearch.sort(
    (a, b) => new Date(a.departure_date) - new Date(b.departure_date)
  );

  return (
    <>
      {err === true ? (
        <>
          <Page500 />
        </>
      ) : pageErr === true ? (
        <>
          <Page400 />
        </>
      ) : (
        <>
          <>
            {contextHolder}
            <div className="hidden md:block judul-search font-medium text-black">
              PILIH JADWAL
            </div>
            <div className="mt-0 md:mt-4">
              <div className="block md:flex flex-col md:flex-row md:justify-between items-center md:space-x-4">
                <div className="hidden md:flex items-center space-x-3 text-center md:text-left">
                  <small className="text-xs font-medium text-black">
                    {originName}
                  </small>
                  <div className="hidden md:flex bg-blue-500 p-1 rounded-full">
                    <IoArrowForwardOutline
                      className="text-xs text-white"
                      size={16}
                    />
                  </div>
                  <small className="hidden md:flex text-xs font-medium text-black">
                    {destinationName}
                  </small>
                  <div className="hidden md:block font-normal text-black">
                    |
                  </div>
                  <div className="hidden md:flex text-xs text-black">
                    <div>{parseTanggalPelni(startDate)}</div>
                  </div>
                  {parseInt(adult) + parseInt(child) + parseInt(infant) !==
                    0 && (
                    <>
                      <div className="hidden md:block font-normal text-black">
                        |
                      </div>
                      <small className="hidden md:block text-xs  text-black">
                        {parseInt(adult) + parseInt(child) + parseInt(infant)}{" "}
                        Penumpang
                      </small>
                    </>
                  )}
                  {count_passangers_name > 0 && (
                    <>
                      <div className="hidden md:block font-normal text-black">
                        |
                      </div>
                      <small className="hidden md:block text-xs  text-black">
                        {count_passangers_name} Kendaraan
                      </small>
                    </>
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="mt-0 block md:flex space-x-0 md:space-x-4 mr-0 md:mr-0 justify-start md:justify-end">
                    <Link
                      to="/"
                      className="hidden md:flex space-x-2 items-center"
                    >
                      <IoArrowBackOutline className="text-black" size={16} />
                      <div className="text-black text-xs">Kembali</div>
                    </Link>
                    <div
                      onClick={() => setUbahPencarian((prev) => !prev)}
                      className="p-2 flex md:hidden space-x-2 items-center cursor-pointer"
                    >
                      <div className="text-xs text-black">Ubah pencarian</div>
                      <BsArrowDownCircle
                        className="text-black font-bold"
                        size={16}
                      />
                    </div>
                    <button
                      onClick={() => setUbahPencarian((prev) => !prev)}
                      className="hidden md:block border p-2 px-4 md:px-4 mr-0 bg-blue-500 text-white rounded-md text-xs font-bold"
                    >
                      Ubah Pencarian
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {ubahPencarian ? (
              <div className="mt-2">
                <SearchDLU />
              </div>
            ) : null}
            <div>
              {isLoading ? (
                skeleton.map(() => (
                  <div className="row mt-4 w-full p-2">
                    <Box sx={{ width: "100%" }}>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </Box>
                  </div>
                ))
              ) : notFound !== true && sortedData.length !== 0 ? (
                <div className="row mb-24 w-full p-2">
                  {/* untuk sorting yang  availbility nya tidak habis. */}
                  <div>
                    {sortedData.map((e, i, arr) => (
                      <>
                        <div className="mt-8 text-black font-bold text-md">
                          {(i === 0 ||
                            e.departure_date !== arr[i - 1].departure_date) &&
                            parseTanggal(e.departure_date)}
                        </div>

                        <div
                          class={`block mt-8 md:mt-6 w-full px-4 py-2 xl:px-6 2xl:px-10 xl:py-8 ${
                            (
                              e.detail?.length == 4
                                ? e.detail.reduce(
                                    (a, b) => a + b.available,
                                    0
                                  ) > 1
                                : e.detail.reduce(
                                    (a, b) => a + b.available,
                                    0
                                  ) > 0
                            )
                              ? "bg-white"
                              : "bg-gray-200"
                          } border border-gray-200 rounded-lg shadow-sm  hover:border transition-transform transform hover:scale-105`}
                        >
                          {/* desktop cari */}
                          <div className="hidden xl:block w-full text-black ">
                            <div className="px-0 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                              <div className="col-span-1">
                                <h1 className="text-sm font-medium xl:">
                                  {e.name}{" "}
                                </h1>
                                <small>{type_class_name}</small>
                              </div>
                              <div className="flex">
                                <div className="">
                                  <h1 className="mt-4 xl:mt-0 text-sm font-medium xl:">
                                    {extractTimeWithTimeZone(e.departure)}
                                  </h1>
                                  <small>{originName}</small>
                                </div>
                              </div>
                              {/*  */}
                              <HiOutlineArrowNarrowRight size={24} />
                              <div>
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium xl:">
                                  {extractTimeWithTimeZone(e.arrival)}
                                </h1>
                                <small>{destinationName}</small>
                              </div>
                              <div>
                                <h1 className="mt-4 xl:mt-0 text-sm font-medium xl:">
                                  {e.durasi}
                                </h1>
                                <small>Langsung</small>
                              </div>
                              <div className="">
                                {e.detail.map((e) => (
                                  <>
                                    <div className="flex text-xs space-x-1 items-center">
                                      <div className="text-xs">
                                        Rp.{e.price}
                                      </div>
                                      <div className="text-xs">
                                        {e.type_class.toUpperCase() ==
                                        "KENDARAAN"
                                          ? "Kendaraan"
                                          : e.type_passanger}
                                      </div>
                                    </div>
                                  </>
                                ))}
                              </div>
                              <div>
                                {(
                                  e.detail?.length == 4
                                    ? e.detail.reduce(
                                        (a, b) => a + b.available,
                                        0
                                      ) > 1
                                    : e.detail.reduce(
                                        (a, b) => a + b.available,
                                        0
                                      ) > 0
                                ) ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleSubmit(e)}
                                      class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50  rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                                    >
                                      <div className="text-white font-bold">
                                        PILIH
                                      </div>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button class="mt-4 xl:mt-0 text-gray-400 bg-gray-300 space-x-2 hover:bg-gray-300/80 focus:ring-4 focus:outline-none focus:ring-gray-300/50  rounded-lg text-sm px-10 md:px-10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2">
                                      <div className="text-gray-400 ">
                                        HABIS
                                      </div>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            {/* mobile cari */}
                            <div
                              onClick={() =>
                                (
                                  e.detail?.length == 4
                                    ? e.detail.reduce(
                                        (a, b) => a + b.available,
                                        0
                                      ) > 1
                                    : e.detail.reduce(
                                        (a, b) => a + b.available,
                                        0
                                      ) > 0
                                )
                                  ? handleSubmit(e)
                                  : " "
                              }
                              className="cursor-pointer block xl:hidden w-full text-black"
                            >
                              <div className="mt-4">
                                <div className="flex justify-between">
                                  <div className="grid col-span-1 xl:col-span-2">
                                    <h1 className="text-xs font-medium xl:">
                                      {e.name}
                                    </h1>
                                    <small>{type_class_name}</small>
                                  </div>
                                  <div className="text-right">
                                    <div
                                      className={`text-xs font-medium xl: ${
                                        (
                                          e.detail?.length == 4
                                            ? e.detail.reduce(
                                                (a, b) => a + b.available,
                                                0
                                              ) > 1
                                            : e.detail.reduce(
                                                (a, b) => a + b.available,
                                                0
                                              ) > 0
                                        )
                                          ? "text-blue-500"
                                          : "text-black"
                                      }`}
                                    >
                                      Total Rp.{toRupiah(e.total)}
                                    </div>
                                    {/* <small className="text-red-500">
                                      {e.seats[0].available} set(s)
                                    </small>
                                    <small className="text-red-500">
                                      {e.seats[0].available > 0 &&
                                      parseInt(adult) + parseInt(infant) <
                                        e.seats[0].available
                                        ? ""
                                        : ". (Tiket Habis)"}
                                    </small> */}
                                  </div>
                                </div>
                                <div className="flex justify-start items-center">
                                  <div className="flex items-start">
                                    <div>
                                      <h1 className="mt-10 xl:mt-0 text-xs font-medium xl:">
                                        {extractTimeWithTimeZone(e.departure)}
                                      </h1>
                                      <small className="text-black">
                                        {originName}
                                      </small>
                                    </div>
                                    <div className="w-full mt-12 px-4 border-b-2"></div>
                                    <div className="text-xs">
                                      <div className="text-xs mt-10 xl:mt-0 text-black">
                                        {e.durasi}
                                      </div>
                                      <small className="text-black">
                                        Langsung
                                      </small>
                                    </div>
                                    <div className="w-full mt-12 px-4 border-b-2"></div>
                                    <div>
                                      <h1 className="mt-10 xl:mt-0 text-xs font-medium xl:">
                                        {extractTimeWithTimeZone(e.arrival)}
                                      </h1>
                                      <small className="text-black">
                                        {destinationName}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                {(e.detail?.length == 4
                                  ? e.detail.reduce(
                                      (a, b) => a + b.available,
                                      0
                                    ) > 1
                                  : e.detail.reduce(
                                      (a, b) => a + b.available,
                                      0
                                    ) > 0) && (
                                  <>
                                    <div
                                      className="flex justify-center text-xs mt-2 text-blue-500 cursor-pointer text-center items-center mb-2"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openButton ==
                                        `open-${i}${e.id_schedule}`
                                          ? setOpenButton(
                                              `close-${i}${e.id_schedule}`
                                            )
                                          : setOpenButton(
                                              `open-${i}${e.id_schedule}`
                                            );
                                      }}
                                    >
                                      Detail Price
                                    </div>
                                  </>
                                )}
                                {openButton === `open-${i}${e.id_schedule}` ? (
                                  <div
                                    className={`block xl:hidden ${
                                      openButton === `open-${i}${e.id_schedule}`
                                        ? ""
                                        : "max-h-0"
                                    }`}
                                  >
                                    <div className="mt-4">
                                      <div className="m-2 text-xs font-semibold">
                                        Detail Penumpang
                                      </div>
                                      <div className="border-t border-gray-200 m-2 text-xs mt-2">
                                        {parseInt(adult) +
                                          parseInt(child) +
                                          parseInt(infant) !==
                                          0 && (
                                          <>
                                            <div className="mt-4">
                                              {parseInt(adult) +
                                                parseInt(child) +
                                                parseInt(infant)}{" "}
                                              penumpang
                                            </div>
                                          </>
                                        )}
                                        {count_passangers_name > 0 && (
                                          <>
                                            <div className="mt-4">
                                              {count_passangers_name} kendaraan
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <div className="m-2 mt-4 text-xs font-semibold">
                                        Detail Harga
                                      </div>
                                      <div className="border-t border-gray-200 m-2 mt-2">
                                        {e.detail.map((e) => (
                                          <>
                                            <div className="flex text-xs items-center mt-4">
                                              <div className="text-xs">
                                                Rp.{e.price}/
                                              </div>
                                              <div className="text-xs">
                                                {e.type_class.toUpperCase() ==
                                                "KENDARAAN"
                                                  ? "Kendaraan"
                                                  : e.type_passanger}
                                                {/*  */}
                                              </div>
                                            </div>
                                          </>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="row mt-24 mb-24 w-full p-2">
                  <div className="flex justify-center items-center">
                    <img
                      src={"/nodata.jpg"}
                      className="w-[200px] md:w-[300px]"
                      alt="No data"
                    />
                  </div>
                  <div className="flex justify-center w-full text-black">
                    <div className="text-black text-center">
                      <div>
                        <div className="text-sm md:text-md font-medium">
                          Maaf, sepertinya pada rute ini masih belum dibuka
                          kembali.
                        </div>
                        {/* <small>
                        Namun jangan khawatir, masih ada pilihan kendaraan lain
                        yang tetap bisa mengantarkan Anda ke tempat tujuan.
                      </small> */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        </>
      )}
    </>
  );
}
