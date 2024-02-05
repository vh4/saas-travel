import React, { useState, useEffect } from "react";
import { MdHorizontalRule } from "react-icons/md";
import "react-phone-number-input/style.css";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import "react-phone-input-2/lib/bootstrap.css";
import { Button, DatePicker, Form, Modal } from "antd";
import dayjs from "dayjs";
import PhoneInput from "react-phone-input-2";
import { Input } from "antd";
import { notification } from "antd";
import { getCurrentDate, parseTanggal } from "../../helpers/date";
import Page500 from "../components/500";
import Page400 from "../components/400";
import ManyRequest from "../components/Manyrequest";
import BookingLoading from "../components/trainskeleton/booking";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { IoArrowForwardOutline } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

export default function BookingKaiTransit() {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const failedNotification = (rd) => {
    api["error"]({
      message: "Error!",
      description:
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
    });
  };

  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [manyRequestBook, setmanyRequestBook] = useState(false);
  const [dataBookingTrain, setdataBookingTrain] = useState([]);
  const [dataDetailTrain, setdataDetailTrain] = useState([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(null);

  const [err, setErr] = useState(false);
  const [ErrPage, setErrPage] = useState(false);

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [classTrain, setclassTrain] = useState(null);
  const [tanggal_keberangkatan_kereta, Settanggal_keberangkatan_kereta] =
    useState(null);

  const [adult, setAdult] = useState([]);
  const [infant, setInfant] = useState([]);

  const [TotalAdult, setTotalAdult] = useState(0);
  const [TotalInfant, setTotalInfant] = useState(0);

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }

    getDataTrain()
      .then((trainDataResponse) => {
        if (trainDataResponse) {
          const dataTrain = trainDataResponse.train[0];
          const dataTrainDetail = trainDataResponse.train_detail;

          dataTrainDetail[0]["berangkat_nama_kota"] =
            dataTrain.berangkat_nama_kota;
          dataTrainDetail[0]["berangkat_id_station"] =
            dataTrain.berangkat_id_station;

          dataTrainDetail[0]["tujuan_nama_kota"] =
            dataTrain.transit_name_stasiun;
          dataTrainDetail[0]["tujuan_id_station"] =
            dataTrain.transit_id_stasiun;

          dataTrainDetail[1]["berangkat_nama_kota"] =
            dataTrain.transit_name_stasiun;
          dataTrainDetail[1]["berangkat_id_station"] =
            dataTrain.transit_id_stasiun;

          dataTrainDetail[1]["tujuan_nama_kota"] = dataTrain.tujuan_nama_kota;
          dataTrainDetail[1]["tujuan_id_station"] = dataTrain.tujuan_id_station;

          setdataBookingTrain([dataTrain]);
          setdataDetailTrain(dataTrainDetail);

          const TotalAdult = parseInt(dataTrain.adult);
          const TotalInfant = parseInt(dataTrain.infant);

          setTotalAdult(TotalAdult);
          setTotalInfant(TotalInfant);

          setIsDatePickerOpen(Array(TotalInfant.length).fill(false));

          const AdultArr = Array.from({ length: TotalAdult }, () => ({
            name: "",
            birthdate: getCurrentDate(),
            idNumber: "",
            phone: "",
          }));

          const InfantArr = Array.from({ length: TotalInfant }, () => ({
            name: "",
            birthdate: getCurrentDate(),
            idNumber: "",
          }));

          setAdult([AdultArr]);
          setInfant([InfantArr]);

          const date_Keberangkatan = new Date(dataTrain.departureDate);
          const tanggal_keberangkatan_kereta = parseTanggal(date_Keberangkatan);
          Settanggal_keberangkatan_kereta(tanggal_keberangkatan_kereta);
        } else {
          setErrPage(true);
        }

        setTimeout(() => {
          setIsLoadingPage(false);
        }, 100);
      })
      .catch((err) => {
        setIsLoadingPage(false);
        setErrPage(true);
      });
  }, [id, token]);

  async function getDataTrain() {
    try {
      const response = localStorage.getItem(`data:k-train-transit/${id}`);
      return JSON.parse(response);
    } catch (error) {
      return null;
    }
  }

  const handleAdultsubCatagoryChange = (i, category) => (e) => {
    const adultCategory = adult[0];

    if (category === "phone") {
      adultCategory[i][category] = e;
    } else {
      adultCategory[i][category] = e.target.value;
    }

    setAdult([adultCategory]);
  };

  const handleInfantsubCatagoryChange = (i, category) => (e) => {
    const infantCategory = infant[0];

    if (category == "birthdate" || category == "expireddate") {
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
    } else {
      infantCategory[i][category] = e.target.value;
    }
    setInfant([infantCategory]);
  };

  const { handleSubmit } = useForm();

  const handlerBookingSubmit = async () => {
    setIsLoading(true);

    onReset();

    const uuid = uuidv4();

    adult[0].map((data) => {
      if (data.phone.substring(0, 2) == "62") {
        data.phone = data.phone.replace("62", "0");
      } else {
        data.phone = data.phone;
      }
    });

    const listPassenger = [];

    dataDetailTrain.forEach((e) => {
      listPassenger.push(
        {
          productCode: "WKAI",
          origin: e.berangkat_id_station,
          destination: e.tujuan_id_station,
          date: e.departureDate,
          trainNumber: parseInt(e.trainNumber),
          grade: e.seats[0].grade,
          class: e.seats[0].class,
          adult: TotalAdult,
          infant: TotalInfant,
          trainName: e.trainName,
          departureStation: e.stasiunBerangkat,
          departureTime: e.departureTime,
          arrivalStation: e.stasiunTujuan,
          arrivalTime: e.arrivalTime,
          priceAdult: parseInt(e.seats[0].priceAdult),
          priceInfant: "-",
          passengers: {
            adults: adult[0],
            infants: TotalInfant > 0 ? infant[0] : [],
          },
        }
      )
    });

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/book`,
      {
        data:listPassenger,
        token: JSON.parse(
          localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
        ),
      }
    );

    if (response.data.rc !== "00") {
      if (response.data.rc == "11") {
        setIsLoading(false);
        setmanyRequestBook(true);
      } else {
        setIsLoading(false);
        failedNotification(response.data.rd);
      }

    } else {
      
      const hasilDataBooking = response.data.data;

      localStorage.setItem(
        `data:k-book-transit/${uuid}`,
        JSON.stringify({
          passengers: {
            adults: adult[0],
            infants: TotalInfant > 0 ? infant[0] : [],
          },
          hasil_book: hasilDataBooking,
          // uuid:response.data.uuid,
        })
      );
      ///

      setIsLoading(false);

      navigate({
        pathname: `/train/konfirmasi/transit`,
        search: `?k_train=${id}&k_book=${uuid}`,
      });
    }

    setIsLoading(false);
    hideModal();
  };

  const disabledDate = (current, e, i) => {
    const twoYearsAgo = dayjs().subtract(2, "year");
    const currentDate = dayjs();

    return current && (current < twoYearsAgo || current > currentDate);
  };

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      {/* message notification  */}
      {contextHolder}

      {err === true ? (
        <>
          <Page500 />
        </>
      ) : ErrPage === true ? (
        <>
          <Page400 />
        </>
      ) : manyRequestBook === true ? (
        <>
          <ManyRequest />
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
          <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
            <div className="hidden xl:flex space-x-2 items-center">
              <div className="hidden xl:flex text-blue-500 font-medium xl:font-bold">
                Detail pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="hidden xl:flex text-gray-500"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <RxCrossCircled size={20} className="text-slate-500" />
              <div className="hidden xl:block text-slate-500">
                Konfirmasi pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="text-gray-500 hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <RxCrossCircled size={20} className="text-slate-500" />
              <div className="hidden xl:block text-slate-500">
                Pembayaran tiket
              </div>
            </div>
          </div>
          <div className="xl:mt-0">
            {isLoadingPage === true ? (
              <>
                <BookingLoading
                  total={parseInt(TotalAdult) + parseInt(TotalInfant)}
                />
              </>
            ) : (
              <>
                {isLoadingPage === true ? (
                  <></>
                ) : (
                  <>
                    {/* sidebar mobile kai*/}
                    {dataDetailTrain.map((e, i) => (
                      <>
                        <div className="mt-8 block xl:hidden w-full rounded-md border border-gray-200 shadow-sm">
                          <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                            <div className="text-gray-800 font-medium xl:font-bold">
                              Keberangkatan kereta
                            </div>
                            <small className="text-gray-800">
                              {parseTanggal(e.departureDate)}
                            </small>
                          </div>
                          <div className="p-4 px-4 flex justify-between space-x-12 items-center">
                            <div className="text-gray-800 text-xs">
                              <div>{e.berangkat_nama_kota}</div>
                              <div>({e.berangkat_id_station})</div>
                            </div>
                            <div className="rounded-full p-2 bg-blue-500">
                              <IoArrowForwardOutline
                                className="text-white"
                                size={18}
                              />
                            </div>
                            <div className="text-gray-800 text-xs">
                              <div>{e.tujuan_nama_kota}</div>
                              <div>({e.tujuan_id_station})</div>
                            </div>
                          </div>
                          <div className="p-4 pl-8 text-gray-800">
                            <div className="text-xs">{e.trainName}</div>
                            <small>
                              {e.seats[0].grade === "E"
                                ? "Eksekutif"
                                : e.seats[0].grade === "B"
                                ? "Bisnis"
                                : "Ekonomi"}{" "}
                              Class ({e.seats[0].class})
                            </small>
                          </div>
                          <div className="p-4 pl-8 mb-4">
                            <ol class="relative border-l-2 border-dotted border-gray-800 ">
                              <li class="mb-10 ml-4">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                                <div className="flex space-x-12">
                                  <time class="mb-1 text-sm leading-none text-gray-800 ">
                                    {e.departureTime}
                                  </time>
                                  <div className="-mt-2">
                                    <div class="text-left text-xs text-gray-800 ">
                                      {e.berangkat_nama_kota}
                                    </div>
                                    <p class="text-left text-xs text-gray-800 ">
                                      ({e.berangkat_id_station})
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li class="ml-4">
                                <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                                <div className="flex space-x-12">
                                  <time class="mb-1 text-sm leading-none text-gray-800 ">
                                    {e.arrivalTime}
                                  </time>
                                  <div className="-mt-2">
                                    <div class="text-left text-xs  text-gray-800 ">
                                      {e.tujuan_nama_kota}
                                    </div>
                                    <p class="text-left text-xs text-gray-800 ">
                                      ({e.tujuan_id_station})
                                    </p>
                                  </div>
                                </div>
                              </li>
                            </ol>
                          </div>
                        </div>
                      </>
                    ))}
                  </>
                )}

                <div className="w-full mb-24 block xl:flex xl:space-x-10">
                  {/* detail passengger kai*/}

                  <Form
                    form={form}
                    onFinish={handleSubmit(showModal)}
                    className="block w-full mt-0 xl:mt-4 mb-4"
                  >
                    {isLoadingPage === true ? (
                      <></>
                    ) : (
                      <>
                        {/* adult loop */}

                        {adult &&
                          adult[0].map((e, i) => (
                            <>
                              <div>
                                <div className="Booking ml-2 md:ml-0 mt-8 mb-4 xl:mt-12">
                                  <h1 className="text-sm font-medium xl:font-bold text-gray-800">
                                    ADULT PASSENGER
                                  </h1>
                                  <small className="text-gray-800">
                                    Isi sesuai dengan data anda
                                  </small>
                                </div>
                                {/* Detailt */}
                                <div className="flex space-x-12">
                                  {/* form detailt kontal */}
                                  <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2">
                                    <div className="">
                                      <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                        {/* mobile & desktop Nama*/}
                                        <div className="xl:w-full mt-4 xl:mt-0 ">
                                          <div className="w-full">
                                            <div className="text-gray-800 text-sm">
                                              Nama Lengkap
                                            </div>
                                            <Form.Item
                                              hasFeedback
                                              name={`adultNameLengkap${i}`}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Nama Lengkap tidak boleh kosong.",
                                                },
                                                {
                                                  min: 5,
                                                  message:
                                                    "Nama Lengkap minimal 5 karakter.",
                                                },
                                                {
                                                  max: 25,
                                                  message:
                                                    "Nama Lengkap maksimal 25 karakter.",
                                                },
                                                {
                                                  pattern: /^[A-Za-z\s]+$/,
                                                  message:
                                                    "Nama Lengkap hanya boleh terdiri dari huruf alfabet.",
                                                },
                                              ]}
                                            >
                                              <Input
                                                size="large"
                                                className="mt-2"
                                                value={e.name}
                                                onChange={handleAdultsubCatagoryChange(
                                                  i,
                                                  "name"
                                                )}
                                                type="text"
                                                placeholder="Nama Lengkap"
                                                id="default-input"
                                              />
                                            </Form.Item>
                                            <div className="block -mt-4 text-gray-400">
                                              <small>
                                                Contoh: Farris Muhammad
                                                Ramadhan.
                                              </small>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mb-8">
                                      <div className="py-0 px-0 xl:px-8 block xl:grid xl:grid-cols-2 xl:gap-8">
                                        {/* desktop nomor hp */}
                                        <div className="w-full px-4 xl:px-0 mt-2 xl:mt-0">
                                          <div className="text-gray-800 text-sm mb-2">
                                            Nomor HP
                                          </div>
                                          <Form.Item
                                            hasFeedback
                                            name={`nomorHPAdult${i}`}
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "No Hp tidak boleh kosong.",
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
                                              inputProps={{
                                                required: true,
                                              }}
                                              country="id"
                                              inputStyle={{
                                                width: "100%",
                                                borderColor: "hover:red",
                                                paddingTop: 7,
                                                paddingBottom: 7,
                                              }}
                                              value={
                                                e.phone.substring(0, 2) == "08"
                                                  ? "62" + e.phone.slice(2)
                                                  : e.phone
                                              }
                                              onChange={handleAdultsubCatagoryChange(
                                                i,
                                                "phone"
                                              )}
                                            />
                                          </Form.Item>
                                          <div className="-mt-4 text-gray-400">
                                            <small>
                                              Contoh: (+62) 812345678
                                            </small>
                                          </div>
                                        </div>
                                        {/* mobile & desktop NIK*/}
                                        <div className="w-full p-4 xl:p-0 mt-2 xl:mt-0">
                                          <div className="text-gray-800 text-sm mb-2">
                                            No. Ktp
                                          </div>
                                          <Form.Item
                                            hasFeedback
                                            name={`niktpAdult${i}`}
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "NIK tidak boleh kosong.",
                                              },

                                              ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                  if (
                                                    !isNaN(value) &&
                                                    value !== null &&
                                                    value.toString().length ===
                                                      16
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
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^\d]/g,
                                                    ""
                                                  ); // Replace any non-digit characters
                                                if (
                                                  e.target.value.includes(".")
                                                ) {
                                                  e.target.value =
                                                    e.target.value.replace(
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
                                              value={e.idNumber}
                                              placeholder="No. Ktp / NIK"
                                              onChange={handleAdultsubCatagoryChange(
                                                i,
                                                "idNumber"
                                              )}
                                              min={0}
                                              id="default-input"
                                            />
                                          </Form.Item>

                                          <div className="block -mt-4 text-gray-400">
                                            <small>
                                              Contoh: harus berupa digit jumlah
                                              16.
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

                        {/* Infant loop */}
                        {infant &&
                          infant[0].map((e, i) => (
                            <>
                              <div>
                                <div className="Booking ml-2  md:ml-0 mt-8 mb-4 xl:mt-12">
                                  <h1 className="xl:text-sm font-medium xl:font-bold text-gray-800 text-sm">
                                    INFANT PASSENGER
                                  </h1>
                                  <small className="text-gray-500">
                                    isi dengan detail pemesanan kereta
                                  </small>
                                </div>
                                {/* Detailt */}
                                <div className="flex space-x-12">
                                  {/* form detailt kontal */}
                                  <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2">
                                    <div className="">
                                      <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                        {/* mobile & desktop Nama*/}
                                        <div className="xl:w-full mt-4 xl:mt-0">
                                          <div className="w-full">
                                            <div className="text-gray-800 text-sm">
                                              Nama Lengkap
                                            </div>
                                            <Form.Item
                                              hasFeedback
                                              name={`infantNamaLengkap${i}`}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Nama Lengkap tidak boleh kosong.",
                                                },
                                                {
                                                  min: 5,
                                                  message:
                                                    "Nama Lengkap minimal 5 karakter.",
                                                },
                                                {
                                                  max: 25,
                                                  message:
                                                    "Nama Lengkap maksimal 25 karakter.",
                                                },
                                                {
                                                  pattern: /^[A-Za-z\s]+$/,
                                                  message:
                                                    "Nama Lengkap hanya boleh terdiri dari huruf alfabet.",
                                                },
                                              ]}
                                            >
                                              <Input
                                                size="large"
                                                className="mt-2"
                                                value={e.name}
                                                onChange={handleInfantsubCatagoryChange(
                                                  i,
                                                  "name"
                                                )}
                                                type="text"
                                                placeholder="Nama Lengkap"
                                                id="default-input"
                                              />
                                            </Form.Item>
                                            <div className="block -mt-4 text-gray-400">
                                              <small>
                                                Contoh: Farris Muhammad
                                                Ramadhan.
                                              </small>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/*  */}
                                    <div className="mb-8">
                                      <div className="py-0 px-0 xl:px-8 block xl:grid xl:grid-cols-2 mt-0 xl:gap-8">
                                        {/* desktop nomor hp */}
                                        <div className="p-4 xl:p-0 w-full">
                                          <div className="text-gray-800 text-sm mb-2">
                                            Tanggal Lahir
                                          </div>
                                          <DatePicker
                                            size="large"
                                            className="w-full"
                                            value={dayjs(
                                              e.birthdate,
                                              "YYYY/MM/DD"
                                            )}
                                            format="DD/MM/YYYY"
                                            onChange={handleInfantsubCatagoryChange(
                                              i,
                                              "birthdate"
                                            )}
                                            disabledDate={disabledDate}
                                            open={isDatePickerOpen[i]} // Pass the state to the open prop
                                            inputReadOnly={true}
                                            onOpenChange={(status) => {
                                              const newOpenState = [
                                                ...isDatePickerOpen,
                                              ]; // Create a copy of the array
                                              newOpenState[i] = status; // Update the state for the specific index
                                              setIsDatePickerOpen(newOpenState); // Set the updated array as the new state
                                            }}
                                          />
                                          <small className="block mt-2 text-gray-400">
                                            Contoh: dd-mm-yyyy
                                          </small>
                                        </div>
                                        {/* mobile & desktop NIK*/}
                                        <div className="p-4 xl:p-0 w-full">
                                          <div className="text-gray-800 text-sm mb-2">
                                            No. Ktp
                                          </div>
                                          <Form.Item
                                            hasFeedback
                                            name={`infantktpnik${i}`}
                                            rules={[
                                              {
                                                required: true,
                                                message:
                                                  "NIK tidak boleh kosong.",
                                              },

                                              ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                  if (
                                                    !isNaN(value) &&
                                                    value !== null &&
                                                    value.toString().length ===
                                                      16
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
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^\d]/g,
                                                    ""
                                                  ); // Replace any non-digit characters
                                                if (
                                                  e.target.value.includes(".")
                                                ) {
                                                  e.target.value =
                                                    e.target.value.replace(
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
                                              value={e.idNumber}
                                              placeholder="No. Ktp / NIK"
                                              onChange={handleInfantsubCatagoryChange(
                                                i,
                                                "idNumber"
                                              )}
                                              min={0}
                                              id="default-input"
                                            />
                                          </Form.Item>

                                          <div className="block -mt-4 text-gray-400">
                                            <small>
                                              Contoh: harus berupa digit jumlah
                                              16.
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
                    )}

                    <div className="flex justify-end mr-2 mt-8">
                      <Button
                        htmlType="submit"
                        size="large"
                        key="submit"
                        type="primary"
                        className="bg-blue-500 mx-2 font-semibold"
                      >
                        Lanjut ke Konfirmasi
                      </Button>
                    </div>
                  </Form>

                  {isLoadingPage === true ? (
                    <></>
                  ) : (
                    <>
                      {/* sidebra desktop*/}
                      <div className="w-1/2 xl:mt-16">
                        {dataDetailTrain.map((e, i) => (
                          <>
                            <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm mt-4">
                              <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                                <div className="text-gray-800 text-sm font-medium xl:font-bold">
                                  Keberangkatan kereta
                                </div>
                                <small className="text-xs text-gray-800">
                                  {parseTanggal(e.departureDate)}
                                </small>
                              </div>
                              <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                                <div className="text-xs font-medium xl:font-bold text-gray-800">
                                  <div>{e.berangkat_nama_kota}</div>
                                  <div>({e.berangkat_id_station})</div>
                                </div>
                                <div className="rounded-full p-1 bg-blue-500 ">
                                  <IoArrowForwardOutline
                                    className="text-white"
                                    size={18}
                                  />
                                </div>
                                <div className="text-xs font-medium xl:font-bold text-gray-800">
                                  <div>{e.tujuan_nama_kota}</div>
                                  <div>({e.tujuan_id_station})</div>
                                </div>
                              </div>

                              <div className="p-4 pl-8 text-gray-800">
                                <div className=" text-xs font-medium xl:font-bold">
                                  {e.trainName}
                                </div>
                                <small>
                                  {e.seats[0].grade === "E"
                                    ? "Eksekutif"
                                    : e.seats[0].grade === "B"
                                    ? "Bisnis"
                                    : "Ekonomi"}{" "}
                                  Class ({e.seats[0].class})
                                </small>
                              </div>
                              <div className="p-4 pl-12 mb-4">
                                <ol class="relative border-l-2 border-dotted border-gray-800">
                                  <li class="mb-10 ml-4 text-sm">
                                    <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                                    <div className="flex space-x-12">
                                      <time class="mb-1 text-xs font-medium xl:font-bold leading-none text-gray-800 ">
                                        {e.departureTime}
                                      </time>
                                      <div className="-mt-2">
                                        <h3 class="text-left text-xs font-medium xl:font-bold text-gray-800 ">
                                          {e.berangkat_nama_kota}
                                        </h3>
                                        <p class="text-left text-xs font-medium xl:font-bold text-gray-800 ">
                                          ({e.berangkat_id_station})
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                  <li class="ml-4 text-sm mt-10">
                                    <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                                    <div className="flex space-x-12">
                                      <time class="mb-1 text-xs font-medium xl:font-bold leading-none text-gray-800 ">
                                        {e.arrivalTime}
                                      </time>
                                      <div className="-mt-2">
                                        <h3 class="text-left text-xs font-medium xl:font-bold text-gray-800">
                                          {e.tujuan_nama_kota}
                                        </h3>
                                        <p class="text-left text-xs font-medium xl:font-bold text-gray-800">
                                          ({e.tujuan_id_station})
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                </ol>
                              </div>
                            </div>
                          </>
                        ))}
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
