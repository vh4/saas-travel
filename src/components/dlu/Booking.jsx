import React, { useState, useEffect, useRef } from "react";
import { MdHorizontalRule } from "react-icons/md";
import FormControl from "@mui/material/FormControl";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import "react-phone-input-2/lib/bootstrap.css";
import { Button, DatePicker, Modal } from "antd";
import { Input, Form } from "antd";
import { Select as SelectAnt } from "antd";
import dayjs from "dayjs";
import { notification } from "antd";
import { getCurrentDate, parseDate } from "../../helpers/date";
import BookingLoading from "../components/planeskeleton/booking";
import Page500 from "../components/500";
import Page400 from "../components/400";
import ManyRequest from "../components/Manyrequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { IoArrowForwardOutline } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

export default function BookingDLU() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const [form] = Form.useForm();
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  // const [dataDetail, setdataDetail] = React.useState(null);
  const [dataDetailForBooking, setdataDetailForBooking] = React.useState(null);
  const [isInternational, setIsInternational] = React.useState(0);

  const [TotalAdult, SetTotalAdult] = React.useState(null);
  const [TotalChild, setTotalChild] = React.useState(null);
  const [TotalInfant, setTotalInfant] = React.useState(null);

  const [adult, setAdult] = useState(null);
  const [child, setChild] = useState(null);
  const [infant, setInfant] = useState(null);
  const [totalKendaraan, setTotalKendaraan] = useState(null);
  const [kendaraan, setKendaraan] = useState(null);

  const [manyRequestBook, setmanyRequestBook] = useState(false);
  const formRef = useRef();

  const [isDatePickerOpenAdult, setIsDatePickerOpenAdult] = useState(null);
  const [isDatePickerOpenChild, setIsDatePickerOpenChild] = useState(null);
  const [isDatePickerOpenInfant, setIsDatePickerOpenInfant] = useState(null);

  const [email, setEmail] = useState(null);
  const [hp, setHp] = useState(null);
  const [title, setTitle] = useState("L");
  const [namaDepan, setNamaDepan] = useState(null);
  const [namaBelakang, setNamaBelakang] = useState(null);

  const [city, setCity] = useState(null);
  const [identity, setIdentity] = useState(null);

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState(false);

  const data = [
    {
      label: "Tuan.",
      value: "L",
    },
    {
      label: "Nyonya.",
      value: "P",
    },
    {
      label: "Nona.",
      value: "F",
    },
  ];

  const dataInfChld = [
    {
      label: "Tuan.",
      value: "L",
    },
    {
      label: "Nona.",
      value: "F",
    },
  ];

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

  const WarningNotification = (rd) => {
    api["warning"]({
      message: "Warning!",
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
  }, [token]);

  // const [selectedCountry, setSelectedCountry] = useState({});
  // const [countries, setCountries] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_API}/travel/country`
        );
        const data = response.data;
        // setCountries(data.countries);
        // setSelectedCountry(data.userCountryCode);
      } catch (error) {
        setErrPage(true);
        console.log(error.message || "An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Promise.all([getDataDLUSearch()])
      .then(([bookResponse]) => {
        if (bookResponse) {
          const dataDetailForBooking = bookResponse;

          setdataDetailForBooking(dataDetailForBooking);

          const TotalAdult = parseInt(dataDetailForBooking.adult) || 0;
          const TotalChild = parseInt(dataDetailForBooking.child) || 0;
          const TotalInfant = parseInt(dataDetailForBooking.infant) || 0; //
          const TotalKendaraan = parseInt(dataDetailForBooking.kendaraan) || 0; //

          setIsDatePickerOpenAdult(Array(TotalAdult.length).fill(false));
          setIsDatePickerOpenChild(Array(TotalChild.length).fill(false));
          setIsDatePickerOpenInfant(Array(TotalInfant.length).fill(false));

          SetTotalAdult(TotalAdult);
          setTotalChild(TotalChild);
          setTotalInfant(TotalInfant);
          setTotalKendaraan(TotalKendaraan);

          const AdultArr = Array.from({ length: TotalAdult }, () => ({
            gender: "L",
            nama_depan: "",
            nama_belakang: "",
            birthdate: getCurrentDate(),
            idNumber: "",
            nama_kota: "",
          }));

          const InfantArr = Array.from({ length: TotalInfant }, () => ({
            gender: "L",
            nama_depan: "",
            nama_belakang: "",
            birthdate: getCurrentDate(),
            nama_kota: "",
          }));

          const ChildArr = Array.from({ length: TotalChild }, () => ({
            gender: "L",
            nama_depan: "",
            nama_belakang: "",
            birthdate: getCurrentDate(),
            nama_kota: "",
          }));

          const KendaraanArr = Array.from({ length: TotalKendaraan }, () => ({
            nama_depan: "",
            nama_belakang: "",
            no_polisi: "",
            nama_kota: "",
            muatan: "",
            keterangan_muatan: "",
          }));

          setInfant([InfantArr]);
          setChild([ChildArr]);
          setAdult([AdultArr]);
          setKendaraan([KendaraanArr]);
        } else {
          setErrPage(true);
        }

        setTimeout(() => {
          setIsLoadingPage(false);
        }, 100);
      })
      .catch(() => {
        setIsLoadingPage(false);
        setErrPage(true);
      });
  }, [id]);

  async function getDataDLUSearch() {
    try {
      const response = localStorage.getItem(`data:dlu/${id}`);
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  const handleAdultsubCatagoryChange = (i, category) => (e) => {
    let adultCategory = adult[0];

    if (category == "birthdate") {
      let tanggalParse = new Date(e)
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .reverse()
        .join("-");

      adultCategory[i][category] = tanggalParse;
    } else {
      if (category == "gender") {
        adultCategory[i][category] = e;
      } else {
        adultCategory[i][category] = e.target.value;
      }
    }
    setAdult([adultCategory]);
  };

  const handleChildsubCatagoryChange = (i, category) => (e) => {
    let childCategory = child[0];

    if (category == "birthdate") {
      let tanggalParse = new Date(e)
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .reverse()
        .join("-");

      childCategory[i][category] = tanggalParse;
    } else if (category == "gender") {
      childCategory[i][category] = e;
    } else {
      childCategory[i][category] = e.target.value;
    }
    setChild([childCategory]);
  };

  const handleInfantsubCatagoryChange = (i, category) => (e) => {
    let infantCategory = infant[0];

    if (category == "birthdate") {
      let tanggalParse = new Date(e)
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .reverse()
        .join("-");

      infantCategory[i][category] = tanggalParse;
    } else if (category == "gender") {
      infantCategory[i][category] = e;
    } else {
      infantCategory[i][category] = e.target.value;
    }

    setInfant([infantCategory]);
  };

  const handleKendaraansubCatagoryChange = (i, category) => (e) => {
    let kendaraanCategory = kendaraan[0];
    kendaraanCategory[i][category] = e.target.value;

    setKendaraan([kendaraanCategory]);
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = Object.keys(errorInfo.errorFields[0])[0];

    const inputInstance = formRef.current.getFieldInstance(firstErrorField);

    inputInstance.focus();
  };

  const handlerBookingSubmit = async (e) => {
    try {
      let end_adult = "";
      let end_child = "";
      let end_infant = "";
      let end_kendaraan = "";

      // onReset();

      setIsLoading(true);

      child[0].forEach(async (item) => {
        let date = new Date(item.birthdate);
        let dateString =
          date.getDate().toString().padStart(2, "0") +
          "-" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.getFullYear();

        //L;Tony;3527032701970078;24-10-1997;Sampang;;1;5 // 1 => adult, 2 => child, 3 => infant.
        end_child += `${item.gender};${
          item.nama_depan + " " + item.nama_belakang
        };;${dateString};${item.nama_kota};;2;${
          dataDetailForBooking.type_class
        }#`;
      });

      infant[0].forEach(async (item) => {
        let date = new Date(item.birthdate);
        let dateString =
          date.getDate().toString().padStart(2, "0") +
          "-" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.getFullYear();

        //L;Tony;3527032701970078;24-10-1997;Sampang;;1;5 // 1 => adult, 2 => child, 3 => infant.
        end_infant += `${item.gender};${
          item.nama_depan + " " + item.nama_belakang
        };;${dateString};${item.nama_kota};;3;${
          dataDetailForBooking.type_class
        }#`;
      });

      adult[0].forEach(async (item) => {
        let date = new Date(item.birthdate);
        let dateString =
          date.getDate().toString().padStart(2, "0") +
          "-" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.getFullYear();

        //L;Tony;3527032701970078;24-10-1997;Sampang;;1;5 // 1 => adult, 2 => child, 3 => infant.
        end_adult += `${item.gender};${
          item.nama_depan + " " + item.nama_belakang
        };${item.idNumber};${dateString};${item.nama_kota};;1;${
          dataDetailForBooking.type_class
        }#`;
      });

      kendaraan[0].forEach(async (item) => {
        //Nama pemilik;M1234NG;Sampang;0;4;;
        end_kendaraan += `${item.nama_depan + " " + item.nama_belakang};${
          item.no_polisi
        };${item.nama_kota};0;${dataDetailForBooking.type_vehicle};;#`;
      });

      // if (end_kendaraan.endsWith("#")) {
      //   end_kendaraan = end_kendaraan.slice(0, -1); // Menghilangkan karakter terakhir ("#")
      // }

      const book = {
        via: "WEB",
        kode_produk: "SHPDLU",
        departure: dataDetailForBooking.departure,
        arrival: dataDetailForBooking.arrival,
        ship_name: dataDetailForBooking.name,
        origin_code: dataDetailForBooking.origin_code,
        destination_code: dataDetailForBooking.destination_code,
        type_ticket: dataDetailForBooking.type_ticket,
        type_class: dataDetailForBooking.type_class,
        type_vehicle: dataDetailForBooking.type_vehicle,
        schedule_id: dataDetailForBooking.id_schedule?.toString(),
        count_passangers: dataDetailForBooking.count_passangers,
        nominal: dataDetailForBooking.total?.toString(),
        book_detail: {
          book_gender: title,
          book_name: namaDepan + " " + namaBelakang,
          book_noidentity: identity,
          book_email: email,
          book_phone: hp,
          book_city: city,
        },
        passangers: {
          adult: end_adult,
          child: end_child,
          infant: end_infant,
          vehicle: end_kendaraan,
        },
        token: token,
      };

      const bookingResponse = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/ship/book`,
        book,
        {
          timeout: 3600000,
        }
      );

      if (bookingResponse.data.rc === "00") {
        const uuid = uuidv4();

        const params = {
          ...dataDetailForBooking,
          hasilBooking: bookingResponse.data?.data,
        };

        setIsLoading(false);

        localStorage.setItem(`data:dlu-book/${uuid}`, JSON.stringify(params));
        navigate(`/dlu/payment/${uuid}`);

        // if (bookingResponse.data.callback === null) {
        //   navigate({
        //     pathname: `/flight/payment`,
        //     search: `?v_flight=${id}&v_book=${uuid}`,
        //   });
        // } else {
        //   navigate({
        //     pathname: `/flight/payment`,
        //     search: `?v_flight=${id}&v_book=${uuid}`,
        //   });
        // }
      } else {
        setIsLoading(false);

        if (bookingResponse.data.rc === "73") {
          failedNotification(bookingResponse.data.rd);
        } else if (bookingResponse.data.rc === "11") {
          setmanyRequestBook(true);
        } else {
          failedNotification(bookingResponse.data.rd);
        }
      }

      hideModal();
    } catch (error) {
      failedNotification(error.message);
      hideModal();
    }
  };

  const disabledDate = (current, e, i) => {
    const currentDay = dayjs().add(1, "day");
    const dayBookStart = dayjs(dataDetailForBooking.departure_date).add(
      1,
      "day"
    );
    const twoYearsAgo = dayjs(dayBookStart).subtract(2, "year");
    const endOfDays = twoYearsAgo.subtract(1, "day");
    const currentDate = dayjs(currentDay).subtract(1, "day");
    return current && (current < endOfDays || current > currentDate);
  };

  const disabledDateAdult = (current) => {
    const dayBook = dayjs(dataDetailForBooking.departure_date).add(1, "day");
    const TenYearsAgo = dayjs(dayBook).subtract(12, "year");
    return current && current > TenYearsAgo;
  };

  const disabledDateChild = (current) => {
    const dayBook = dayjs(dataDetailForBooking.departure_date).add(1, "day");
    const twoYearsAgo = dayjs(dayBook).subtract(2, "year");
    const TenYearsAgo = dayjs(dayBook).subtract(12, "year");
    const startOfMonth = TenYearsAgo.subtract(1, "day");
    return current && (current < startOfMonth || current > twoYearsAgo);
  };

  const {
    // handleSubmit,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      {contextHolder}

      {err == true ? (
        <>
          <Page500 />
        </>
      ) : errPage == true ? (
        <>
          <Page400 />
        </>
      ) : manyRequestBook === true ? (
        <>
          <ManyRequest />
        </>
      ) : (
        <>
          <div className="-mt-2 xl:mt-0">
            <Modal
              title={
                <>
                  <div className="flex space-x-2 items-center">
                    <ExclamationCircleFilled className="text-orange-500 text-xl" />
                    <div className="text-bold text-xl text-orange-500">
                      Apakah anda yakin ??
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
                      <Button key="back" onClick={hideModal}>
                        Cancel
                      </Button>
                      <Button
                        htmlType="submit"
                        key="submit"
                        type="primary"
                        className="bg-blue-500"
                        loading={isLoading}
                        onClick={handlerBookingSubmit}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </>
              }
            >
              <p>Apakah Anda yakin ingin submit data?</p>
            </Modal>
            {/* header kai flow */}
            <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-4 items-center">
              <div className="hidden xl:flex space-x-2 items-center">
                <div className="hidden xl:flex text-blue-500 font-medium ">
                  Detail pesanan
                </div>
              </div>
              <div>
                <MdHorizontalRule
                  size={20}
                  className="hidden xl:flex text-black"
                />
              </div>
              <div className="hidden xl:flex space-x-2 items-center">
                <RxCrossCircled size={20} className="text-black" />
                <div className="hidden xl:block text-black">
                  Pembayaran tiket
                </div>
              </div>
            </div>
            {/* sidebar mobile dlu*/}
            {isLoadingPage === true ? (
              <>
                <BookingLoading
                  TotalAdult={TotalAdult}
                  TotalChild={TotalChild}
                  TotalInfant={TotalInfant}
                  totalKendaraan={totalKendaraan}
                />
              </>
            ) : (
              <>
                {dataDetailForBooking && (
                  <>
                    <div className="mt-0 md:mt-8 block xl:hidden w-full rounded-md border border-gray-200 shadow-sm">
                      <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                        <div className="text-black text-sm font-medium ">
                          Keberangkatan Kapal
                        </div>
                        <small className="text-xs text-black">
                          {dataDetailForBooking.durasi}
                        </small>
                      </div>
                      <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                        <div className="text-xs">
                          <div className="font-medium  text-black">
                            {dataDetailForBooking &&
                              dataDetailForBooking.origin_name}
                          </div>
                          <small className="text-xs text-black">
                            ({parseDate(dataDetailForBooking.departure_date)})
                          </small>
                        </div>
                        <div className="rounded-full p-1 bg-blue-500 ">
                          <IoArrowForwardOutline
                            className="text-white"
                            size={18}
                          />
                        </div>
                        <div className="text-xs">
                          <div className="font-medium  text-black">
                            {dataDetailForBooking &&
                              dataDetailForBooking.destination_name}
                          </div>
                          <small className="text-xs text-black">
                            ({parseDate(dataDetailForBooking.arrival_date)})
                          </small>
                        </div>
                      </div>

                      <div className="p-4 text-black">
                        <div className="text-xs font-medium ">
                          {dataDetailForBooking && dataDetailForBooking.name}
                        </div>
                        <small>
                          <span>{dataDetailForBooking.type_class_name}</span>
                        </small>
                      </div>
                      <div className="p-4 pl-6 mb-4">
                        <ol class="relative border-l-2 border-dotted border-gray-800 ">
                          <li class="mb-10 ml-4 text-sm">
                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                {dataDetailForBooking &&
                                  dataDetailForBooking.departure_time
                                    .replace("WIB", "")
                                    .replace("WITA", "")}
                              </time>
                              <div className="">
                                <h3 class="text-left text-xs font-medium  text-black ">
                                  {dataDetailForBooking &&
                                    dataDetailForBooking.origin_name}
                                </h3>
                              </div>
                            </div>
                          </li>
                          <li class="ml-4 text-sm mt-10">
                            <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                {dataDetailForBooking &&
                                  dataDetailForBooking.arrival_time
                                    .replace("WIB", "")
                                    .replace("WITA", "")}
                              </time>
                              <div className="">
                                <h3 class="text-left text-xs font-medium  text-black">
                                  {dataDetailForBooking &&
                                    dataDetailForBooking.destination_name}
                                </h3>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </>
                )}

                <div className=" w-full mb-24 block xl:flex xl:space-x-10">
                  {/* detail passengger dlu*/}
                  <Form
                    form={form}
                    ref={formRef}
                    onFinish={showModal}
                    onFinishFailed={onFinishFailed}
                    className="block w-full  mt-8 mb-4 xl:mt-12"
                  >
                    <div className="Booking mb-4 ml-2 xl:ml-0">
                      <h1 className="text-sm text-black">DATA PEMESAN</h1>
                      <small className="text-black">
                        Isi sesuai dengan data anda
                      </small>
                    </div>
                    <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2 gap-12">
                      <div className="">
                        {/* mobile & desktop*/}
                        <div className="p-4 xl:p-8 form block xl:flex xl:space-x-2">
                          <div className="xl:w-full mt-4 xl:mt-0">
                            <div className="text-black text-sm">Title Anda</div>
                            <div className="hidden xl:block">
                              <FormControl
                                sx={{
                                  marginTop: 2,
                                  marginBottom: 2,
                                  maxWidth: 120,
                                }}
                                fullWidth
                              >
                                <SelectAnt
                                  style={{ width: 120 }}
                                  options={data}
                                  value={title}
                                  size="large"
                                  onChange={(e) => setTitle(e)}
                                />
                              </FormControl>
                            </div>
                            <div className="block xl:hidden">
                              <FormControl
                                sx={{ marginTop: 2, marginBottom: 2 }}
                                fullWidth
                              >
                                <SelectAnt
                                  style={{ width: 120 }}
                                  options={data}
                                  value={title}
                                  size="large"
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                              </FormControl>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2">
                              <div className="w-full">
                                <div className="text-black text-sm">
                                  Nama Depan
                                </div>
                                <Form.Item
                                  required={true}
                                  hasFeedback
                                  name={`namaDepan`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nama Depan tidak boleh kosong.",
                                    },
                                    {
                                      min: 3,
                                      message: "Nama Depan minimal 3 karakter.",
                                    },
                                    {
                                      max: 25,
                                      message:
                                        "Nama Depan maksimal 25 karakter.",
                                    },
                                    {
                                      pattern: /^[A-Za-z\s]+$/,
                                      message:
                                        "Nama Depan hanya boleh terdiri dari huruf alfabet.",
                                    },
                                  ]}
                                >
                                  <Input
                                    size="large"
                                    className="mt-2"
                                    value={namaDepan}
                                    onChange={(e) =>
                                      setNamaDepan(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Nama Depan"
                                    id="default-input"
                                  />
                                </Form.Item>
                              </div>
                              <div className="w-full">
                                <div className="text-black text-sm">
                                  Nama Belakang
                                </div>
                                <Form.Item
                                  required={true}
                                  hasFeedback
                                  name={`namaBelakang}`}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Nama Belakang tidak boleh kosong.",
                                    },
                                    {
                                      min: 3,
                                      message:
                                        "Nama Belakang minimal 3 karakter.",
                                    },
                                    {
                                      max: 25,
                                      message:
                                        "Nama Belakang maksimal 25 karakter.",
                                    },
                                    {
                                      pattern: /^[A-Za-z\s]+$/,
                                      message:
                                        "Nama Belakang hanya boleh terdiri dari huruf alfabet.",
                                    },
                                  ]}
                                >
                                  <Input
                                    size="large"
                                    className="mt-2"
                                    value={namaBelakang}
                                    onChange={(e) =>
                                      setNamaBelakang(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Nama Belakang"
                                    id="default-input"
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* mobile & desktop*/}
                        <div className="p-4 xl:p-8 -mt-10 form block xl:flex xl:space-x-2">
                          <div className="xl:w-full mt-4 xl:mt-0">
                            <div className="text-black text-sm">
                              Email Address
                            </div>
                            <div className="block xl:flex xl:space-x-6">
                              <div className="w-full">
                                <Form.Item
                                  required={true}
                                  hasFeedback
                                  name={`emailAdult`}
                                  rules={[
                                    {
                                      required: true,
                                      type: "email",
                                      message: "Format Email tidak sesuai.",
                                      validateTrigger: "onBlur",
                                    },
                                    {
                                      max: 150,
                                      message: "Email maksimal 150 karakter.",
                                      validateTrigger: "onBlur",
                                    },
                                  ]}
                                >
                                  <Input
                                    size="large"
                                    className="mt-2"
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    placeholder="Email Address"
                                  />
                                </Form.Item>
                                <div className="block -mt-4 text-gray-400">
                                  <small>Contoh: ex-machina@gmail.com</small>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mt-4 xl:mt-0">
                            {/* desktop nomor hp */}
                            <div className="w-full">
                              <div className="text-black text-sm mb-2">
                                Nomor HP
                              </div>
                              <Form.Item
                                required={true}
                                hasFeedback
                                name={`nomorHPAdult`}
                                rules={[
                                  {
                                    required: true,
                                    message: "No Hp tidak boleh kosong.",
                                  },
                                  {
                                    min: 10,
                                    message:
                                      "Minimal Nomor HP pemesan adalah 10 digit.",
                                  },
                                ]}
                              >
                                <PhoneInput
                                  hiddenLabel={true}
                                  international
                                  value={hp}
                                  onChange={setHp}
                                  country="id"
                                  inputStyle={{
                                    width: "100%",
                                    borderColor: "hover:red",
                                    paddingTop: 7,
                                    paddingBottom: 7,
                                  }}
                                />
                              </Form.Item>
                              <div className="block -mt-4 text-gray-400">
                                <small>Contoh: (+62) 812345678</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* city and NIK */}
                        <div className="mb-8 mt-0 xl:mt-4">
                          <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6 ">
                            {/* city */}
                            <div className="w-full px-4 xl:px-0">
                              <div className="w-full">
                                <div className="text-black text-sm">
                                  Nama Kota
                                </div>
                                <Form.Item
                                  required={true}
                                  hasFeedback
                                  name={`city`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nama kota tidak boleh kosong.",
                                    },
                                  ]}
                                >
                                  <Input
                                    size="large"
                                    className="mt-2"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    type="text"
                                    placeholder="Nama Kota"
                                    id="default-input"
                                  />
                                </Form.Item>
                                <small className="block -mt-4 text-gray-400">
                                  Contoh: Surabaya, Medan
                                </small>
                              </div>
                            </div>

                            {/* NIK */}
                            <div className="w-full">
                              <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                <div className="text-black text-sm mb-2">
                                  {"No. Ktp"}
                                </div>
                                <Form.Item
                                  required={true}
                                  hasFeedback
                                  name={`identity`}
                                  rules={[
                                    {
                                      required: true,
                                      message: "NIK tidak boleh kosong.",
                                    },
                                    ({ getFieldValue }) => ({
                                      validator(_, value) {
                                        if (
                                          !isNaN(value) &&
                                          value !== null &&
                                          value.toString().length === 16
                                        ) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject(
                                          "Panjang NIK harus 16 digit."
                                        );
                                      },
                                    }),
                                  ]}
                                >
                                  <input
                                    type="text"
                                    pattern="[0-9]*"
                                    onInput={(e) => {
                                      e.target.value = e.target.value.replace(
                                        /[^\d]/g,
                                        ""
                                      ); // Replace any non-digit characters
                                      if (e.target.value.includes(".")) {
                                        e.target.value = e.target.value.replace(
                                          ".",
                                          ""
                                        ); // Remove any dots
                                      }
                                    }}
                                    onKeyPress={(e) => {
                                      return (
                                        (e.charCode >= 48 &&
                                          e.charCode <= 57) ||
                                        e.key !== "."
                                      ); // Disallow the dot
                                    }}
                                    className={
                                      "border border-[#d9d9d9] block rounded-md pl-2 text-[16px] py-1.5 w-full hover:border-blue-400 focus:border-blue-400 focus:outline-blue-200 focus:outline-0"
                                    }
                                    value={identity}
                                    placeholder={"No. Ktp / NIK"}
                                    onChange={(e) =>
                                      setIdentity(e.target.value)
                                    }
                                    min={0}
                                    id="default-input"
                                  />
                                </Form.Item>
                                <small className="block -mt-4 text-gray-400">
                                  Contoh: 16 digit nomor
                                </small>
                                <div></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {adult[0].map((e, i) => (
                      <>
                        <div>
                          <div className="Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0">
                            <h1 className="text-sm text-black">
                              ADULT PASSENGER
                            </h1>
                            <small className="text-black">
                              Isi sesuai dengan data anda
                            </small>
                          </div>
                          {/* Detailt */}
                          <div className="flex space-x-12">
                            {/* form detailt kontal */}
                            <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1">
                              <div className="">
                                <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                  {/* mobile & desktop Nama*/}
                                  <div className="xl:w-full mt-4 xl:mt-0">
                                    <div className="text-black text-sm">
                                      Title Anda
                                    </div>
                                    <div className="hidden xl:block">
                                      <FormControl
                                        sx={{
                                          marginTop: 2,
                                          marginBottom: 2,
                                          maxWidth: 120,
                                        }}
                                        fullWidth
                                      >
                                        <SelectAnt
                                          style={{ width: 120 }}
                                          options={data}
                                          value={e.gender}
                                          size="large"
                                          onChange={handleAdultsubCatagoryChange(
                                            i,
                                            "gender"
                                          )}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="block xl:hidden">
                                      <FormControl
                                        sx={{ marginTop: 2, marginBottom: 2 }}
                                        fullWidth
                                      >
                                        <SelectAnt
                                          style={{ width: 120 }}
                                          options={data}
                                          value={e.gender}
                                          size="large"
                                          onChange={handleAdultsubCatagoryChange(
                                            i,
                                            "gender"
                                          )}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Depan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`namadepanAdult${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Depan tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Depan minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Depan maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Depan hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_depan}
                                            onChange={handleAdultsubCatagoryChange(
                                              i,
                                              "nama_depan"
                                            )}
                                            type="text"
                                            placeholder="Nama Depan"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Belakang
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`namabelakangAdult${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Belakang tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Belakang minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Belakang maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Belakang hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_belakang}
                                            onChange={handleAdultsubCatagoryChange(
                                              i,
                                              "nama_belakang"
                                            )}
                                            type="text"
                                            placeholder="Nama Belakang"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-8 mt-0 xl:mt-4">
                                <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6 ">
                                  {/* mobile & desktop NIK*/}
                                  <div className="w-full px-4 xl:px-0">
                                    <div className="xl:px-0 w-full text-black text-sm mb-2">
                                      Tanggal Lahir
                                    </div>
                                    <Form.Item
                                      required={true}
                                      hasFeedback
                                      name={`tanggalAdult${i}`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Harap input Tanggal Lahir.",
                                        },
                                      ]}
                                    >
                                      <DatePicker
                                        size="large"
                                        className="w-full"
                                        value={dayjs(e.birthdate, "YYYY/MM/DD")}
                                        format={"DD/MM/YYYY"}
                                        onChange={handleAdultsubCatagoryChange(
                                          i,
                                          "birthdate"
                                        )}
                                        disabledDate={disabledDateAdult}
                                        open={isDatePickerOpenAdult[i]} // Pass the state to the open prop
                                        // inputReadOnly={true}
                                        onOpenChange={(status) => {
                                          const newOpenState = [
                                            ...isDatePickerOpenAdult,
                                          ]; // Create a copy of the array
                                          newOpenState[i] = status; // Update the state for the specific index
                                          setIsDatePickerOpenAdult(
                                            newOpenState
                                          ); // Set the updated array as the new state
                                        }}
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: dd/mm/yyyy
                                    </small>
                                  </div>
                                  <div className="w-full">
                                    <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                      <div className="text-black text-sm mb-2">
                                        {"No. Ktp"}
                                      </div>
                                      <Form.Item
                                        required={true}
                                        hasFeedback
                                        name={`nikAdult${i}`}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              isInternational == 1
                                                ? "NIK tidak boleh kosong."
                                                : "Passport tidak boleh kosong.",
                                          },
                                          ({ getFieldValue }) => ({
                                            validator(_, value) {
                                              if (
                                                !isNaN(value) &&
                                                value !== null &&
                                                value.toString().length === 16
                                              ) {
                                                return Promise.resolve();
                                              }
                                              return Promise.reject(
                                                isInternational == 1
                                                  ? "Panjang Passport harus 16 digit."
                                                  : "Panjang NIK harus 16 digit."
                                              );
                                            },
                                          }),
                                        ]}
                                      >
                                        <input
                                          type="text"
                                          pattern="[0-9]*"
                                          onInput={(e) => {
                                            e.target.value =
                                              e.target.value.replace(
                                                /[^\d]/g,
                                                ""
                                              ); // Replace any non-digit characters
                                            if (e.target.value.includes(".")) {
                                              e.target.value =
                                                e.target.value.replace(".", ""); // Remove any dots
                                            }
                                          }}
                                          onKeyPress={(e) => {
                                            return (
                                              (e.charCode >= 48 &&
                                                e.charCode <= 57) ||
                                              e.key !== "."
                                            ); // Disallow the dot
                                          }}
                                          className={
                                            "border border-[#d9d9d9] block rounded-md pl-2 text-[16px] py-1.5 w-full hover:border-blue-400 focus:border-blue-400 focus:outline-blue-200 focus:outline-0"
                                          }
                                          value={e.idNumber}
                                          placeholder={
                                            isInternational == 1
                                              ? "No. Passport"
                                              : "No. Ktp / NIK"
                                          }
                                          onChange={handleAdultsubCatagoryChange(
                                            i,
                                            "idNumber"
                                          )}
                                          min={0}
                                          id="default-input"
                                        />
                                      </Form.Item>
                                      <small className="block -mt-4 text-gray-400">
                                        Contoh: 16 digit nomor
                                      </small>
                                      <div></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* kota tambahan */}
                              <div className="mb-8 xl:mt-4 -mt-4">
                                <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0">
                                  {/* mobile & desktop NIK*/}
                                  <div className="w-full px-4 xl:px-0">
                                    <div className="w-full">
                                      <div className="text-black text-sm">
                                        Nama Kota
                                      </div>
                                      <Form.Item
                                        required={true}
                                        hasFeedback
                                        name={`kotaAdult${i}`}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "Nama kota tidak boleh kosong.",
                                          },
                                        ]}
                                      >
                                        <Input
                                          size="large"
                                          className="mt-2"
                                          value={e.nama_kota}
                                          onChange={handleAdultsubCatagoryChange(
                                            i,
                                            "nama_kota"
                                          )}
                                          type="text"
                                          placeholder="Nama Kota"
                                          id="default-input"
                                        />
                                      </Form.Item>
                                      <small className="block -mt-4 text-gray-400">
                                        Contoh: Surabaya
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

                    {child[0].map((e, i) => (
                      <>
                        <div>
                          <div className="Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0">
                            <h1 className="text-sm text-black">
                              CHILD PASSENGER
                            </h1>
                            <small className="text-black">
                              Isi sesuai dengan data anda
                            </small>
                          </div>
                          {/* Detailt */}
                          <div className="flex space-x-12">
                            {/* form detailt kontal */}
                            <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1">
                              <div className="">
                                <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                  {/* mobile & desktop Nama*/}
                                  <div className="xl:w-full mt-4 xl:mt-0">
                                    <div className="text-black text-sm">
                                      Title Anda
                                    </div>
                                    <div className="hidden xl:block">
                                      <FormControl
                                        sx={{
                                          marginTop: 2,
                                          marginBottom: 2,
                                          maxWidth: 120,
                                        }}
                                        fullWidth
                                      >
                                        <SelectAnt
                                          style={{ width: 120 }}
                                          options={dataInfChld}
                                          value={e.gender}
                                          size="large"
                                          onChange={handleChildsubCatagoryChange(
                                            i,
                                            "gender"
                                          )}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="block xl:hidden">
                                      <FormControl
                                        sx={{ marginTop: 2, marginBottom: 2 }}
                                        fullWidth
                                      >
                                        <SelectAnt
                                          style={{ width: 120 }}
                                          options={dataInfChld}
                                          value={e.gender}
                                          size="large"
                                          onChange={handleChildsubCatagoryChange(
                                            i,
                                            "gender"
                                          )}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Depan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`namadepanChild${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Depan tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Depan minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Depan maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Depan hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_depan}
                                            onChange={handleChildsubCatagoryChange(
                                              i,
                                              "nama_depan"
                                            )}
                                            type="text"
                                            placeholder="Nama Depan"
                                            id="default-input"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Nama Depan tidak boleh kosong.",
                                              },
                                              {
                                                min: 3,
                                                message:
                                                  "Nama Depan minimal 3 karakter.",
                                              },
                                              {
                                                max: 25,
                                                message:
                                                  "Nama Depan maksimal 25 karakter.",
                                              },
                                              {
                                                pattern: /^[A-Za-z\s]+$/,
                                                message:
                                                  "Nama Depan hanya boleh terdiri dari huruf alfabet.",
                                              },
                                            ]}
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Belakang
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`namabelakangChild${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Belakang tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Belakang minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Belakang maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Belakang hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_belakang}
                                            onChange={handleChildsubCatagoryChange(
                                              i,
                                              "nama_belakang"
                                            )}
                                            type="text"
                                            placeholder="Nama Belakang"
                                            id="default-input"
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "Nama Belakang tidak boleh kosong.",
                                              },
                                              {
                                                min: 3,
                                                message:
                                                  "Nama Belakang minimal 3 karakter.",
                                              },
                                              {
                                                max: 25,
                                                message:
                                                  "Nama Belakang maksimal 25 karakter.",
                                              },
                                              {
                                                pattern: /^[A-Za-z\s]+$/,
                                                message:
                                                  "Nama Belakang hanya boleh terdiri dari huruf alfabet.",
                                              },
                                            ]}
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-8 mt-0 xl:mt-4">
                                <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                  {/* mobile & desktop NIK*/}
                                  <div className="w-full px-4 xl:px-0">
                                    <div className="xl:px-0 w-full text-black text-sm mb-2">
                                      Tanggal Lahir
                                    </div>
                                    <Form.Item
                                      required={true}
                                      hasFeedback
                                      name={`tanggallahirChild${i}`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Harap input Tanggal Lahir.",
                                        },
                                      ]}
                                    >
                                      <DatePicker
                                        size="large"
                                        className="w-full"
                                        value={dayjs(e.birthdate, "YYYY/MM/DD")}
                                        format={"DD/MM/YYYY"}
                                        onChange={handleChildsubCatagoryChange(
                                          i,
                                          "birthdate"
                                        )}
                                        disabledDate={disabledDateChild}
                                        open={isDatePickerOpenChild[i]} 
                                        // inputReadOnly={true}
                                        onOpenChange={(status) => {
                                          const newOpenState = [
                                            ...isDatePickerOpenChild,
                                          ]; 
                                          newOpenState[i] = status;
                                          setIsDatePickerOpenChild(
                                            newOpenState
                                          ); 
                                        }}
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: dd/mm/yyyy
                                    </small>
                                  </div>
                                  <div className="w-full px-4 xl:px-0 mt-4 xl:mt-0 md:mt-0">
                                    <div className="text-black text-sm">
                                      Nama Kota
                                    </div>
                                    <Form.Item
                                      required={true}
                                      hasFeedback
                                      name={`kotaChild${i}`}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Nama kota tidak boleh kosong.",
                                        },
                                      ]}
                                    >
                                      <Input
                                        size="large"
                                        className="mt-2"
                                        value={e.nama_kota}
                                        onChange={handleChildsubCatagoryChange(
                                          i,
                                          "nama_kota"
                                        )}
                                        type="text"
                                        placeholder="Nama Kota"
                                        id="default-input"
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: Surabaya
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}

                    {infant[0].map((e, i) => (
                      <>
                        <div>
                          <div className="Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0">
                            <h1 className="text-sm text-black">
                              INFANT PASSENGER
                            </h1>
                            <small className="text-black">
                              Isi sesuai dengan data anda
                            </small>
                          </div>
                          {/* Detailt */}
                          <div className="flex space-x-12">
                            {/* form detailt kontal */}
                            <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1">
                              <div className="">
                                <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                  {/* mobile & desktop Nama*/}
                                  <div className="xl:w-full mt-4 xl:mt-0">
                                    <div className="text-black text-sm">
                                      Title Anda
                                    </div>
                                    <div className="hidden xl:block">
                                      <FormControl
                                        sx={{
                                          marginTop: 2,
                                          marginBottom: 2,
                                          maxWidth: 120,
                                        }}
                                        fullWidth
                                      >
                                        <SelectAnt
                                          style={{ width: 120 }}
                                          options={dataInfChld}
                                          value={e.gender}
                                          size="large"
                                          onChange={handleInfantsubCatagoryChange(
                                            i,
                                            "gender"
                                          )}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="block xl:hidden">
                                      <FormControl
                                        sx={{ marginTop: 2, marginBottom: 2 }}
                                        fullWidth
                                      >
                                        <SelectAnt
                                          style={{ width: 120 }}
                                          options={dataInfChld}
                                          value={e.gender}
                                          size="large"
                                          onChange={handleInfantsubCatagoryChange(
                                            i,
                                            "gender"
                                          )}
                                        />
                                      </FormControl>
                                    </div>
                                    <div className="w-full grid grid-cols-2 gap-2">
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Depan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`infantnamadepan${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Depan tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Depan minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Depan maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Depan hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_depan}
                                            onChange={handleInfantsubCatagoryChange(
                                              i,
                                              "nama_depan"
                                            )}
                                            type="text"
                                            placeholder="Nama Depan"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Belakang
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`infantnamabelakang${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Belakang tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Belakang minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Belakang maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Belakang hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_belakang}
                                            onChange={handleInfantsubCatagoryChange(
                                              i,
                                              "nama_belakang"
                                            )}
                                            type="text"
                                            placeholder="Nama Belakang"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-8 mt-0 xl:mt-4">
                                <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                  {/* mobile & desktop NIK*/}
                                  <div className="w-full px-4 xl:px-0">
                                    <div className="xl:px-0 w-full text-black text-sm mb-2">
                                      Tanggal Lahir
                                    </div>
                                    <Form.Item
                                      required={true}
                                      hasFeedback
                                      name={`infanttanggallhr${i}`}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Harap input Tanggal Lahir.",
                                        },
                                      ]}
                                    >
                                      <DatePicker
                                        size="large"
                                        className="w-full"
                                        value={dayjs(e.birthdate, "YYYY/MM/DD")}
                                        format={"DD/MM/YYYY"}
                                        onChange={handleInfantsubCatagoryChange(
                                          i,
                                          "birthdate"
                                        )}
                                        disabledDate={disabledDate}
                                        open={isDatePickerOpenInfant[i]}
                                        // inputReadOnly={true}
                                        onOpenChange={(status) => {
                                          const newOpenState = [
                                            ...isDatePickerOpenInfant,
                                          ];
                                          newOpenState[i] = status; 
                                          setIsDatePickerOpenInfant(
                                            newOpenState
                                          );
                                        }}
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: dd/mm/yyyy
                                    </small>
                                  </div>
                                  <div className="w-full px-4 xl:px-0 mt-4 xl:mt-0">
                                    <div className="text-black text-sm">
                                      Nama Kota
                                    </div>
                                    <Form.Item
                                      required={true}
                                      hasFeedback
                                      name={`kotaInfant${i}`}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Nama kota tidak boleh kosong.",
                                        },
                                      ]}
                                    >
                                      <Input
                                        size="large"
                                        className="mt-2"
                                        value={e.nama_kota}
                                        onChange={handleInfantsubCatagoryChange(
                                          i,
                                          "nama_kota"
                                        )}
                                        type="text"
                                        placeholder="Nama Kota"
                                        id="default-input"
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: Surabaya
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}

                    {kendaraan[0].map((e, i) => (
                      <>
                        <div>
                          <div className="Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0">
                            <h1 className="text-sm text-black">
                              DATA KENDARAAN
                            </h1>
                            <small className="text-black">
                              Isi sesuai dengan data anda
                            </small>
                          </div>
                          {/* Detailt */}
                          <div className="flex space-x-12">
                            {/* form detailt kontal */}
                            <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-1">
                              <div className="">
                                <div className="px-4 xl:px-8 mt-4">
                                  <small className="text-orange-500">
                                    *<b>Note</b>: Pastikan nama pemilik sesuai
                                    dengan STNK.
                                  </small>
                                </div>
                                <div className="p-4 xl:p-8 -mt-0 xl:-mt-4 form block xl:flex xl:space-x-2">
                                  {/* mobile & desktop Nama*/}
                                  <div className="xl:w-full xl:mt-0">
                                    <div className="w-full grid grid-cols-2 gap-2">
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Depan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kendaraannamadepan${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Depan tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Depan minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Depan maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Depan hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_depan}
                                            onChange={handleKendaraansubCatagoryChange(
                                              i,
                                              "nama_depan"
                                            )}
                                            type="text"
                                            placeholder="Nama Depan"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Nama Belakang
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kendaraannamabelakang${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama Belakang tidak boleh kosong.",
                                            },
                                            {
                                              min: 3,
                                              message:
                                                "Nama Belakang minimal 3 karakter.",
                                            },
                                            {
                                              max: 25,
                                              message:
                                                "Nama Belakang maksimal 25 karakter.",
                                            },
                                            {
                                              pattern: /^[A-Za-z\s]+$/,
                                              message:
                                                "Nama Belakang hanya boleh terdiri dari huruf alfabet.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_belakang}
                                            onChange={handleKendaraansubCatagoryChange(
                                              i,
                                              "nama_belakang"
                                            )}
                                            type="text"
                                            placeholder="Nama Belakang"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>

                                  {/* mobile & desktop No Polisi*/}
                                  <div className="xl:w-full mt-4 xl:mt-0">
                                    <div className="w-full grid grid-cols-2 gap-2">
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          No. Polisi
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kendaraanpolisi${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "No. polisi tidak boleh kosong.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.no_polisi}
                                            onInput={(e) =>
                                              (e.target.value =
                                                e.target.value.toUpperCase())
                                            }
                                            onChange={handleKendaraansubCatagoryChange(
                                              i,
                                              "no_polisi"
                                            )}
                                            type="text"
                                            placeholder="No. Polisi"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                      <div className="w-full">
                                        <div className="text-black text-sm">
                                          Kota
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kendaraankota${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Nama kota tidak boleh kosong.",
                                            },
                                          ]}
                                        >
                                          <Input
                                            size="large"
                                            className="mt-2"
                                            value={e.nama_kota}
                                            onChange={handleKendaraansubCatagoryChange(
                                              i,
                                              "nama_kota"
                                            )}
                                            type="text"
                                            placeholder="Nama Kota"
                                            id="default-input"
                                          />
                                        </Form.Item>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}

                    <div className="flex justify-end mr-2 mt-8">
                      <Button
                        htmlType="submit"
                        size="large"
                        key="submit"
                        type="primary"
                        className="bg-blue-500 mx-2 font-medium"
                      >
                        Booking Sekarang
                      </Button>
                    </div>
                  </Form>

                  {/* sidebra desktop*/}
                  {dataDetailForBooking && (
                    <>
                      <div className="w-full md:w-2/3 2xl:w-1/2 xl:mt-12">
                        <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm">
                          <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                            <div className="text-black text-sm font-medium ">
                              Keberangkatan Kapal
                            </div>
                            <small className="text-xs text-black">
                              {dataDetailForBooking.durasi}
                            </small>
                          </div>
                          <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                            <div className="text-xs">
                              <div className="font-medium  text-black">
                                {dataDetailForBooking &&
                                  dataDetailForBooking.origin_name}
                              </div>
                              <small className="text-xs text-black">
                                (
                                {parseDate(dataDetailForBooking.departure_date)}
                                )
                              </small>
                            </div>
                            <div className="rounded-full p-1 bg-blue-500 ">
                              <IoArrowForwardOutline
                                className="text-white"
                                size={18}
                              />
                            </div>
                            <div className="text-xs">
                              <div className="font-medium  text-black">
                                {dataDetailForBooking &&
                                  dataDetailForBooking.destination_name}
                              </div>
                              <small className="text-xs text-black">
                                ({parseDate(dataDetailForBooking.arrival_date)})
                              </small>
                            </div>
                          </div>

                          <div className="p-4 pl-8 text-black">
                            <div className="text-xs font-medium ">
                              {dataDetailForBooking &&
                                dataDetailForBooking.name}
                            </div>
                            <small>
                              <span>
                                {dataDetailForBooking.type_class_name}
                              </span>
                            </small>
                          </div>
                          <div className="p-4 pl-12 mb-4">
                            <ol class="relative border-l-2 border-dotted border-gray-800 ">
                              <li class="mb-10 ml-4 text-sm">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                                <div className="flex space-x-12">
                                  <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                    {dataDetailForBooking &&
                                      dataDetailForBooking.departure_time
                                        .replace("WIB", "")
                                        .replace("WITA", "")}
                                  </time>
                                  <div className="">
                                    <h3 class="text-left text-xs font-medium  text-black ">
                                      {dataDetailForBooking &&
                                        dataDetailForBooking.origin_name}
                                    </h3>
                                  </div>
                                </div>
                              </li>
                              <li class="ml-4 text-sm mt-10">
                                <div class="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                                <div className="flex space-x-12">
                                  <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                    {dataDetailForBooking &&
                                      dataDetailForBooking.arrival_time
                                        .replace("WIB", "")
                                        .replace("WITA", "")}
                                  </time>
                                  <div className="">
                                    <h3 class="text-left text-xs font-medium  text-black">
                                      {dataDetailForBooking &&
                                        dataDetailForBooking.destination_name}
                                    </h3>
                                  </div>
                                </div>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
