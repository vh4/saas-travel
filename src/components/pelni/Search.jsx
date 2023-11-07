import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Searchpelni from "./PelniSearch";
import { notification } from "antd";
import Page400 from "../components/400";
import Page500 from "../components/500";
import { duration, durationFull } from "../../helpers/pelni";
import { parseTanggal, parseTanggalPelni } from "../../helpers/date";
import { toRupiah } from "../../helpers/rupiah";
import moment from "moment";

export default function Search() {

  const [searchParams, setSearchParams] = useSearchParams();
  const origin = searchParams.get("origin");
  const originName = searchParams.get("originName");

  const destination = searchParams.get("destination");
  const destinationName = searchParams.get("destinationName");

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const laki = searchParams.get("laki");
  const wanita = searchParams.get("wanita");
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [uuid, setuuid] =useState(null)

  const navigate = useNavigate();
  const [ubahPencarian, setUbahPencarian] = useState(false);
  const [err, setErr] = useState(false);
  const [pageErr, setPageErr] = useState(false);

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

    if (laki === null || laki === undefined || isNaN(parseInt(laki)) === true ) {
      setPageErr(true);
    }

    if (wanita === null || wanita === undefined || isNaN(parseInt(wanita)) === true ) {
      setPageErr(true);
    }

    if(parseInt(wanita) <= 0 && parseInt(laki) <= 0){
        setPageErr(true);
    }

  }, [
    token,
    origin,
    destination,
    startDate,
    endDate,
    laki,
    wanita,
    destinationName,
    originName,
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
        `${process.env.REACT_APP_HOST_API}/travel/pelni/search`,
        {
          origin: origin,
          destination: destination,
          startDate: startDate,
          endDate: endDate,
          token: token,
        }
      );

      if (response.data.rc === "00") {
        const dataParsing = response.data.data;

        setuuid(response.data.uuid);

        for (let k = 0; k < dataParsing.length; k++) {
          const e = dataParsing[k];
          for (let i = 0; i < e.fares.length; i++) {
            const fareResponse = await handleAvailbillity(e, i);
            dataParsing[k].fares[i]["M_available"] = fareResponse.M;
            dataParsing[k].fares[i]["F_available"] = fareResponse.F;
          }
        }

        setDataSearch(dataParsing);
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

  const handleAvailbillity = async (e, i) => {
    const departureDate = e.DEP_DATE.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    );

    const params = {
      origin: origin,
      originCall: e.ORG_CALL,
      destination: destination,
      destinationCall: e.DES_CALL,
      departureDate: departureDate,
      shipNumber: e.SHIP_NO,
      subClass: e.fares[i].SUBCLASS,
      male: 1,
      female: e.fares[i].AVAILABILITY.F,
      uuid:uuid,
      token: JSON.parse(
        localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
      ),
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/check_availability`,
        params
      );
      const data = response.data.data;

      return {
        M: data.M,
        F: data.F,
      };
    } catch (error) {
      return {
        M: 0, // Handle error case gracefully
        F: 0, // Handle error case gracefully
      };
    }
  };

  const fare = async (e, i) => {
    const departureDate = e.DEP_DATE.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    );

    const params = {
      origin: origin,
      originCall: e.ORG_CALL,
      destination: destination,
      destinationCall: e.DES_CALL,
      departureDate: departureDate,
      shipNumber: e.SHIP_NO,
      token: JSON.parse(
        localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
      ),
    };

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/fare`,
      params
    );
    const parsing = response.data.data;

    const faresResponseFix = parsing[i];

    return faresResponseFix;
  };

  async function handleSubmit(e, i) {
    const fares = await fare(e, i);
    const departureDate = e.DEP_DATE.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    );
    const arrivalDate = e.ARV_DATE.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

    const params = {
      harga_dewasa: fares.FARE_DETAIL.A.TOTAL,
      harga_anak: "0",
      harga_infant: fares.FARE_DETAIL.I.TOTAL,
      pelabuhan_asal: originName,
      pelabuhan_tujuan: destinationName,
      shipName: e.SHIP_NAME,
      origin: origin,
      originCall: e.ORG_CALL,
      destination: destination,
      destinationCall: e.DES_CALL,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
      departureTime: `${e.DEP_TIME.slice(0, 2)}:${e.DEP_TIME.slice(2)}`,
      arrivalTime: `${e.ARV_TIME.slice(0, 2)}:${e.ARV_TIME.slice(2)}`,
      shipNumber: e.SHIP_NO,
      class: e.fares[i].CLASS,
      subClass: fares.SUBCLASS,
      duration: durationFull(e.DEP_DATE, e.ARV_DATE, e.DEP_TIME, e.ARV_TIME),
      male: laki,
      female: wanita,
      rc: "00",
      rd: "success",
    };

    const uuid = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/search/p_search`,
      params
    );

    if (uuid.data.rc == "00") {
      navigate(`/pelni/booking/${uuid.data.uuid}`);
    } else {
      failedNotification(uuid.data.rd);
    }
  }

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
            <div className="judul-search mt-4 font-bold text-slate-600">
              PILIH JADWAL
            </div>
            <div className="mt-8">
              <div className="flex flex-col md:flex-row md:justify-between items-center md:space-x-4">
                <div className="flex items-center space-x-3 xl:space-x-4 text-center md:text-left">
                  <small className="text-xs font-bold text-slate-600">
                    {originName}
                  </small>
                  <div className="bg-blue-500 p-1 rounded-full">
                    <IoArrowForwardOutline
                      className="font-bold text-xs text-white"
                      size={16}
                    />
                  </div>
                  <small className="text-xs font-bold text-slate-600">
                    {destinationName}
                  </small>
                  <div className="hidden md:block font-normal text-slate-600">
                    |
                  </div>
                  <div className="hidden md:flex space-x-4 text-xs font-bold text-slate-600">
                    <div>{parseTanggalPelni(startDate)}</div>
                    <div>s.d</div>
                    <div>{parseTanggalPelni(endDate)}</div>
                  </div>
                  <div className="hidden md:block font-normal text-slate-600">
                    |
                  </div>
                  <small className="hidden md:block text-xs font-bold text-slate-600">
                    {parseInt(laki) + parseInt(wanita)} Penumpang
                  </small>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-4 md:mr-0 xl:mr-16 justify-center md:justify-end">
                  <Link to="/" className="flex space-x-2 items-center">
                    <IoArrowBackOutline className="text-blue-500" size={16} />
                    <div className="text-blue-500 text-sm font-bold">
                      Kembali
                    </div>
                  </Link>
                  <button
                    onClick={() => setUbahPencarian((prev) => !prev)}
                    className="block border p-2 px-4 md:px-4 xl:mr-16 bg-blue-500 text-white rounded-md text-xs font-bold"
                  >
                    Ubah Pencarian
                  </button>
                </div>
              </div>

              <div></div>
            </div>

            {ubahPencarian ? (
              <div className="mt-8">
                <Searchpelni />
              </div>
            ) : null}
            <div>
              {isLoading ? (
                skeleton.map(() => (
                  <div className="row mt-4 w-full p-2 pr-0 xl:pr-16">
                    <Box sx={{ width: "100%" }}>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </Box>
                  </div>
                ))
              ) : notFound !== true && dataSearch.length !== 0 ? (
                <div className="row mb-24 w-full p-2 pr-0 xl:pr-16">
                  {dataSearch.map(
                    (
                      e //&& checkedKelas[0] ? item.seats[0].grade == 'K' : true && checkedKelas[0] ? item.seats[1].grade == 'E' : true && checkedKelas[2] ? item.seats[2].grade == 'B' : true
                    ) => (
                      <>
                        {e.fares.map((z, i) => (
                          <>
                            <div
                              class={`mt-6 w-full p-2 py-4 xl:px-6 2xl:px-10 xl:py-8 ${
                                e.fares[i]["M_available"] == "0" &&
                                e.fares[i]["F_available"] == "0"
                                  ? "bg-gray-200"
                                  : "bg-white"
                              } border border-gray-200 rounded-lg shadow-sm  hover:border transition-transform transform hover:scale-105`}
                            >
                              {/* desktop cari */}
                              <div className="hidden xl:block w-full text-gray-700 ">
                                <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-8">
                                  <div className="col-span-1 xl:col-span-2">
                                    <h1 className="text-sm font-bold">
                                      {e.SHIP_NAME}{" "}
                                    </h1>
                                    <small>
                                      Class {e.fares[i].CLASS}{" "}
                                      Subclass ({e.fares[i].SUBCLASS})
                                    </small>
                                  </div>
                                  <div className="flex">
                                    <div className="">
                                      <h1 className="mt-4 xl:mt-0 text-sm font-bold">{`${e.DEP_TIME.slice(
                                        0,
                                        2
                                      )}:${e.DEP_TIME.slice(2)}`}</h1>
                                      <small>{originName}</small>
                                    </div>
                                  </div>
                                  <HiOutlineArrowNarrowRight size={24} />
                                  <div>
                                    <h1 className="text-sm font-bold">{`${e.ARV_TIME.slice(
                                      0,
                                      2
                                    )}:${e.ARV_TIME.slice(2)}`}</h1>
                                    <small>{destinationName}</small>
                                  </div>
                                  <div>
                                    <h1 className="mt-4 xl:mt-0 text-sm font-bold">
                                      {duration(
                                        e.DEP_DATE,
                                        e.ARV_DATE,
                                        e.DEP_TIME,
                                        e.ARV_TIME
                                      )}
                                    </h1>
                                    <small>Langsung</small>
                                  </div>
                                  <div className="">
                                    <h1 className="mt-4 xl:mt-0 text-sm font-bold text-blue-500">
                                      Rp.
                                      {toRupiah(e.fares[i].FARE_DETAIL.A.TOTAL)}
                                    </h1>
                                    <small className="text-red-500">
                                      Infant Rp.
                                      {toRupiah(e.fares[i].FARE_DETAIL.I.TOTAL)}
                                    </small>
                                  </div>
                                  <div>
                                    {e.fares[i]["M_available"] == "0" &&
                                    e.fares[i]["F_available"] == "0" ? (
                                      <></>
                                    ) : (
                                      <>
                                        <button
                                          onClick={async () =>
                                            handleSubmit(e, i)
                                          }
                                          type="button"
                                          class="mt-4 xl:mt-0 text-white bg-blue-500 space-x-2 hover:bg-blue-500/80 focus:ring-4 focus:outline-none focus:ring-blue-500/50 font-bold rounded-lg text-sm px-10 md:px10 xl:px-10 2xl:px-14 py-2 text-center inline-flex items-center  mr-2 mb-2"
                                        >
                                          <div className="text-white font-bold">
                                            PILIH
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
                                  onClick={async () => e.fares[i]["M_available"] == "0" &&
                                  e.fares[i]["F_available"] == "0" ? "" : handleSubmit(e, i)}
                                  className="cursor-pointer block xl:hidden w-full text-gray-700"
                                >
                                  <div className="px-4 md:px-4 xl:px-0 2xl:px-4 mt-4 grid grid-cols-1 xl:grid-cols-7">
                                    <div className="flex justify-between">
                                      <div className="col-span-1 xl:col-span-2">
                                        <h1 className="text-xs font-bold">
                                          {e.SHIP_NAME}
                                        </h1>
                                        <small>
                                          Class {e.fares[i].CLASS}{" "}
                                          Subclass ({e.fares[i].SUBCLASS})
                                        </small>
                                      </div>
                                      <div className="text-right">
                                        <h1 className="text-xs font-bold text-blue-500">
                                          Rp.
                                          {toRupiah(
                                            e.fares[0].FARE_DETAIL.A.TOTAL
                                          )}
                                        </h1>
                                        <small className="text-red-500">
                                          Infant Rp.
                                          {toRupiah(
                                            e.fares[0].FARE_DETAIL.I.TOTAL
                                          )}
                                        </small>
                                      </div>
                                    </div>
                                    <div className="flex justify-start">
                                      <div className="flex space-x-2 items-start">
                                        <div>
                                          <h1 className="mt-10 xl:mt-0 text-xs font-bold">{`${e.DEP_TIME.slice(
                                            0,
                                            2
                                          )}:${e.DEP_TIME.slice(2)}`}</h1>
                                          <small className="text-gray-400">
                                            {originName}
                                          </small>
                                        </div>
                                        <div className="w-full mt-12 px-4 border-b-2"></div>
                                        <div className="text-xs">
                                          <h1 className="text-xs mt-10 xl:mt-0 text-gray-400">
                                            {duration(
                                              e.DEP_DATE,
                                              e.ARV_DATE,
                                              e.DEP_TIME,
                                              e.ARV_TIME
                                            )}
                                          </h1>
                                          <small className="text-gray-400">
                                            Langsung
                                          </small>
                                        </div>
                                        <div className="w-full mt-12 px-4 border-b-2"></div>
                                        <div>
                                          <h1 className="mt-10 xl:mt-0 text-xs font-bold">{`${e.ARV_TIME.slice(
                                            0,
                                            2
                                          )}:${e.ARV_TIME.slice(2)}`}</h1>
                                          <small className="text-gray-400">
                                            {destinationName}
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                      </>
                    )
                  )}
                </div>
              ) : (
                <div className="row mt-12 mb-24 w-full p-2 pr-0 xl:pr-16">
                  <div className="flex justify-center">
                    <img src={"/nodata.jpg"} width={350} alt="nodata" />
                  </div>
                  <div className="flex justify-center w-full text-gray-700">
                    <div className="text-gray-500 text-center">
                      <div>
                        <div className="text-xl font-semibold">
                          Maaf, sepertinya rute ini belum dibuka kembali
                        </div>
                        <small>
                          Namun jangan khawatir, masih ada pilihan kendaraan
                          lain yang tetap bisa mengantarkan Anda ke tempat
                          tujuan.
                        </small>
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
