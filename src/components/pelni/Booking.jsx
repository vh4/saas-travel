import React, { useEffect, useState } from "react";
import { MdHorizontalRule } from "react-icons/md";
import "react-phone-number-input/style.css";
import "../../index.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import "react-phone-input-2/lib/bootstrap.css";
import { Button, DatePicker, Modal } from "antd";
import { InputNumber } from "rsuite";
import dayjs from "dayjs";
import PhoneInput from "react-phone-input-2";
import { Input, Form } from "antd";
import { notification } from "antd";
import FormControl from "@mui/material/FormControl";
import { Select } from "antd";
import {parseDate, getCurrentDate} from '../../helpers/date'
import Page400 from "../components/400";
import Page500 from "../components/500";
import BookingLoading from "../components/pelniskeleton/booking";
import ManyRequest from "../components/Manyrequest";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { IoArrowForwardOutline } from "react-icons/io5";


export default function BookingPelni() {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const navigate = useNavigate();
  const { id } = useParams();

  const failedNotification = (rd) => {
    api["error"]({
      message: "Error!",
      description:
        rd.toLowerCase().charAt(0).toUpperCase() +
        rd.slice(1).toLowerCase() +
        "",
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [dataDetailPelni, setdataDetailPelni] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [manyRequestBook, setmanyRequestBook] = useState(false);

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [email, setEmail] = useState();
  const [hp, setHp] = useState();
  const [wanita, setWanita] = useState([]);
  const [pria, setPria] = useState([]);
  const [tanggal_keberangkatan_pelni, Settanggal_keberangkatan_pelni] = useState(null);
  const [tanggal_tujuan_pelni, Settanggal_tujuan_pelni] = useState(null);
  const [duration, setDuration] = useState(null);
  const [TotalPria, setTotalPria] = useState(0);
  const [TotalWanita, setTotalWanita] = useState(0);

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }
  }, [
    token,
  ]);

  useEffect(() => {

    Promise.all([getDataPelniSearch()])
      .then(([bookResponse]) => {
        if (bookResponse.data.rc === "00") {
          setdataDetailPelni(bookResponse.data);

          const TotalWanita = parseInt(bookResponse.data.female) || 0;
          const TotalPria = parseInt(bookResponse.data.male) || 0;

          setTotalPria(TotalPria)
          setTotalWanita(TotalWanita);
         
          const WanitaArr = Array.from({ length: TotalWanita }, () => ({
            name: "",
            birthdate: getCurrentDate(),
            identityNumber: "",
            gender: "F",
            usia: "adult",
          }));

          const PriaArr = Array.from({ length: TotalPria }, () => ({
            name: "",
            birthdate: getCurrentDate(),
            identityNumber: "",
            gender: "M",
            usia: "adult",
          }));

          setWanita([WanitaArr]);
          setPria([PriaArr]);

          const date_Keberangkatan = new Date(bookResponse.data.departureDate);
          
          const date_tujuan = new Date(bookResponse.data.arrivalDate);
        
          const duration = bookResponse.data.duration
        
          const tanggal_keberangkatan_pelni = parseDate(date_Keberangkatan);
          const tanggal_tujuan_pelni = parseDate(date_tujuan);

          Settanggal_keberangkatan_pelni(tanggal_keberangkatan_pelni);
          Settanggal_tujuan_pelni(tanggal_tujuan_pelni)
          setDuration(duration);

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
  }, [id]);

  async function getDataPelniSearch() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/search/p_search/${id}`
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
  
  const handleUsiasubCatagoryChange =
    (e, i, category, type = "pria") =>
    (e) => {
      let data = [
        {
          name: "",
          birthdate: "",
          identityNumber: "",
          usia: "",
        },
      ];

      if (type == "pria") {
        data = pria[0];
      }

      if (type == "wanita") {
        data = wanita[0];
      }

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
        data[i][category] = tanggalParse;
      }else if(category == 'identityNumber'){
        data[i][category] = e;
      } else {
        if (category == "usia") {
          data[i][category] = e;
          data[i]["birthdate"] = null;
        } else {
          data[i][category] = e.target.value;
        }
      }

      if (type == "pria") {
        setPria([data]);
      }

      if (type == "wanita") {
        setWanita([data]);
      }
    };

  const { handleSubmit } = useForm();

  const handlerBookingSubmit = async () => {
    setIsLoading(true);

    let contact = {
      email: email,
      phone: hp,
    };

    let totalAdult = 0;
    let totalInfant = 0;

    onReset();

    pria[0].forEach((x) => {
      if (x.usia == "adult") {
        totalAdult = totalAdult + 1;
      }

      if (x.usia == "infant") {
        totalInfant = totalInfant + 1;
      }
    });

    wanita[0].forEach((x) => {
      if (x.usia == "adult") {
        totalAdult = totalAdult + 1;
      }

      if (x.usia == "infant") {
        totalInfant = totalInfant + 1;
      }
    });

    if (totalAdult == 0) {
      setIsLoading(false);
      failedNotification(
        "Bayi tidak boleh sendiri (maksimal 1 dewasa membawa 1 bayi)."
      );

      return;
    }

    const adults = [];
    const children = [];
    const infants = [];

    pria[0].forEach((x) => {
      const passengers = {
        name: x.nama_lengkap,
        birthDate: x.birthdate,
        gender: x.gender,
      };

      if (x.usia == "adult") {
        passengers["identityNumber"] = x.identityNumber;
        adults.push(passengers);
      }

      if (x.usia == "infant") {
        infants.push(passengers);
      }
    });

    wanita[0].forEach((x) => {
      const passengers = {
        name: x.nama_lengkap,
        birthDate: x.birthdate,
        gender: x.gender,
      };

      if (x.usia == "adult") {
        passengers["identityNumber"] = x.identityNumber;
        adults.push(passengers);
      }

      if (x.usia == "infant") {
        infants.push(passengers);
      }
    });

    const params = {
      harga_dewasa: dataDetailPelni.harga_dewasa,
      harga_anak: "0",
      harga_infant: dataDetailPelni.harga_infant,
      pelabuhan_asal: dataDetailPelni.pelabuhan_asal,
      pelabuhan_tujuan: dataDetailPelni.pelabuhan_tujuan,
      shipName: dataDetailPelni.shipName,
      origin: dataDetailPelni.origin,
      originCall: dataDetailPelni.originCall,
      destination: dataDetailPelni.destination,
      destinationCall: dataDetailPelni.destinationCall,
      departureDate: dataDetailPelni.departureDate,
      shipNumber: dataDetailPelni.shipNumber,
      subClass: dataDetailPelni.subClass,
      male: parseInt(dataDetailPelni.male),
      female: parseInt(dataDetailPelni.female),
      adult: totalAdult,
      child: 0,
      infant: totalInfant,
      isFamily: "N",
      contact: contact,
      passengers: {
        adults: adults,
        children: children,
        infants: infants,
      },
      token: token,
    };

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/pelni/book`,
      params
    );

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (response.data.rc !== "00") {

      if(response.data.rc === "11"){
        setIsLoading(false);
        setmanyRequestBook(true);
      }

      failedNotification(response.data.rd);
    } else {
      const data = response.data.data;
      const infobooking = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/pelni/book_info`,
        {
          paymentCode: parseInt(data.paymentCode),
          token: token,
        }
      );

      if (infobooking.data.rc !== "00") {
        failedNotification(infobooking.data.rd);
        setIsLoading(false);
      } else {

        const transactionId = await axios.post(
            `${process.env.REACT_APP_HOST_API}/travel/pelni/booking/passengers`,
            {
                ...params,
                arrivalDate: dataDetailPelni.arrivalTime,
                departureTime: dataDetailPelni.departureTime,
                transactionId: data.transactionId
              }
          );
      
          if (transactionId.data.rc == "00") {
            navigate(`/pelni/payment/${data.transactionId}`);

          } else {
            failedNotification(transactionId.data.rd);
            setIsLoading(false);
          }
      }
    }

    hideModal()

  };

  const data = [
    {
      label: "Dewasa.",
      value: "adult",
    },
    {
      label: "Bayi",
      value: "infant",
    },
  ];

  const disabledDate = (current, e, i) => {
    const twoYearsAgo = dayjs().subtract(2, "year");
    // const endOfMonth = twoYearsAgo.endOf("month");
    const endOfDays = twoYearsAgo.subtract(2, "day");

    const currentDate = dayjs();

    return current && (current < endOfDays || current > currentDate);
  };

  const disabledDateAdult = (current) => {
    const TenYearsAgo = dayjs().subtract(2, "year");
    const endOfDays = TenYearsAgo.subtract(2, "day");

    return current && current > endOfDays;
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
      ) : errPage === true ? (
        <>
          <Page400 />
        </>
      )  : 

      manyRequestBook === true ? (
        <>
          <ManyRequest />
        </>
      ) :
      
      (
        <>
        <div className="xl:mt-0">
        {/* header kai flow */}
        <Modal
              title={
                (<>
                  <div className="flex space-x-2 items-center">
                      <ExclamationCircleFilled className="text-orange-500 text-xl" />
                      <div className="text-bold text-xl text-orange-500">Are you sure?</div>
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
          <div className="flex space-x-2 items-center">
            <div className="hidden xl:flex text-blue-500 font-bold">
              Detail pesanan
            </div>
            <div className="block xl:hidden text-blue-500 font-bold">
              Detail
            </div>
          </div>
          <div>
            <MdHorizontalRule
              size={20}
              className="hidden xl:flex text-gray-500"
            />
          </div>
          <div className="flex space-x-2 items-center">
            <RxCrossCircled size={20} className="text-slate-500" />
            <div className="hidden xl:block text-slate-500">
              Pembayaran tiket
            </div>
            <div className="block xl:hidden text-slate-500">Payment</div>
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

      {isLoadingPage === true ? (
        <>
          < BookingLoading total={parseInt(TotalPria) + parseInt(TotalWanita)}/> 
        </>
      ) : (
        <>
          {/* sidebar mobile kai*/}
          <div className="mt-8 block xl:hidden w-full rounded-md border border-gray-200 shadow-sm">
            <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
              <div className="text-gray-700 ">Keberangkatan Kapal</div>
              <small className="text-xs text-gray-700 ">{duration}</small>
            </div>
            <div className="p-4 px-4 flex justify-between space-x-12 items-center">
              <div className="text-slate-600 text-xs">
                <div>{dataDetailPelni && dataDetailPelni.pelabuhan_asal}</div>
                <div>{tanggal_keberangkatan_pelni}</div>
              </div>
              <div className="rounded-full p-2 bg-blue-500">
                <IoArrowForwardOutline className="text-white" size={18} />
              </div>
              <div className="text-slate-600 text-xs">
                <div>{dataDetailPelni && dataDetailPelni.pelabuhan_tujuan}</div>
                <div>{tanggal_tujuan_pelni}</div>
              </div>
            </div>
            <div className="p-4 pl-8  text-gray-700">
              <div className="text-xs font-bold">
                {dataDetailPelni.shipName}
              </div>
              <small>
                <span>{dataDetailPelni.class}</span> Subclass ({dataDetailPelni.subClass})
              </small>
            </div>
            <div className="p-4 pl-8 mb-4">
              <ol class="relative border-l border-gray-500 ">
                <li class="mb-10 ml-4">
                  <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500 "></div>
                  <div className="flex space-x-12">
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 ">
                      {dataDetailPelni && dataDetailPelni.departureTime}
                    </time>
                    <div className="-mt-2">
                      <h3 class="text-left text-xs text-slate-600 ">
                        {dataDetailPelni && dataDetailPelni.pelabuhan_asal}
                      </h3>
                    </div>
                  </div>
                </li>
                <li class="ml-4">
                  <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                  <div className="flex space-x-12">
                    <time class="mb-1 text-sm leading-none text-gray-400 ">
                      {dataDetailPelni && dataDetailPelni.arrivalTime}
                    </time>
                    <div className="-mt-2">
                      <h3 class="text-left text-xs  text-slate-600 ">
                        {dataDetailPelni && dataDetailPelni.pelabuhan_tujuan}
                      </h3>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
          <div className="w-full mb-24 block xl:flex xl:space-x-10">
            {/* detail passengger kai*/}
            <Form
            form={form}
              onFinish={showModal}
              className="block w-full  mt-8 mb-4 xl:mt-12"
            >
              <div className="w-full mt-4 xl:mt-0 border border-gray-200 shadow-sm col-span-1 xl:col-span-2 gap-12">
                <div className="">
                  <div className="p-4 xl:p-8 form block xl:flex xl:space-x-2">
                    {/* mobile & desktop Nama*/}
                    <div className="xl:w-full mt-4 xl:mt-0">
                      <div className="text-gray-500 text-sm">Email Address</div>
                      <div className="block xl:flex xl:space-x-6">
                        <div className="w-full">
                          <Form.Item
                            name={`emailAdult`}
                            rules={[
                              {
                                required: true,
                                type: "email",
                                message:
                                  "Format Email tidak sesuai.",
                              },
                              {
                                max: 150,
                                message:
                                  "Email maksimal 150 karakter.",
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
                          <div className="mt-2 text-gray-400">
                            <small>Contoh: ex-machina@gmail.com</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-4 xl:mt-0">
                      {/* desktop nomor hp */}
                      <div className="w-full">
                        <div className="text-gray-500 text-sm mb-2 ml-2">
                          Nomor HP
                        </div>
                        <Form.Item
                          name={`nomorHPAdult`}
                          rules={[
                            {
                              required: true,
                              message: "Tolong diisi input nomor HP",
                            },
                            {
                              min: 10,
                              message: "Nomor HP harus min. 10 huruf.",
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
                        <div className="mt-2 text-gray-400">
                          <small>Contoh: (+62) 812345678</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* pria loop */}

              {pria &&
                pria[0].map((e, i) => (
                  <>
                    <div>
                      <div className="Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0">
                        <h1 className="text-sm font-bold text-slate-500">
                          PRIA PASSENGER
                        </h1>
                        <small className="text-gray-500">
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
                                <div className="text-gray-500 text-sm">
                                  Titel Anda
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
                                    <Select
                                      style={{ width: 120 }}
                                      options={data}
                                      value={e.usia}
                                      size="large"
                                      onChange={handleUsiasubCatagoryChange(
                                        e,
                                        i,
                                        "usia",
                                        "pria"
                                      )}
                                    />
                                  </FormControl>
                                </div>
                                <div className="block xl:hidden">
                                  <FormControl
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    fullWidth
                                  >
                                    <Select
                                      style={{ width: 120 }}
                                      options={data}
                                      value={e.usia}
                                      size="large"
                                      onChange={handleUsiasubCatagoryChange(
                                        e,
                                        i,
                                        "usia",
                                        "pria"
                                      )}
                                    />
                                  </FormControl>
                                </div>
                                <div className="w-full grid grid-cols-1 mt-4">
                                  <div className="w-full">
                                    <div className="text-gray-500 text-sm">
                                      Nama Lengkap
                                    </div>
                                    <Form.Item
                                      name={`namalengkapPria${i}`}
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
                                          max: 50,
                                          message:
                                            "Nama Lengkap maksimal 50 karakter.",
                                        },
                                        {
                                          pattern: /^[A-Za-z\s]+$/,
                                          message: 'Nama Lengkap hanya boleh terdiri dari huruf alfabet.',
                                        },
                                      ]}
                                    >
                                      <Input
                                        size="large"
                                        className="mt-2"
                                        value={e.nama_lengkap}
                                        onChange={handleUsiasubCatagoryChange(
                                          e,
                                          i,
                                          "nama_lengkap",
                                          "pria"
                                        )}
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        id="default-input"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-8 mt-0">
                            <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                              {/* mobile & desktop NIK*/}
                              <div className="w-full px-4 xl:px-0">
                                <div className="xl:px-0 w-full text-gray-500 text-sm mb-2">
                                  Tanggal Lahir
                                </div>
                                <Form.Item
                                  name={`tanggalPria${i}`}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Harap input Tanggal Lahir.",
                                    },
                                  ]}
                                >
                                  <DatePicker
                                    size="large"
                                    className="w-full"
                                    value={dayjs(e.birthdate, "YYYY/MM/DD")}
                                    format={"YYYY/MM/DD"}
                                    onChange={handleUsiasubCatagoryChange(
                                      e,
                                      i,
                                      "birthdate",
                                      "pria"
                                    )}
                                    disabledDate={(current) => {
                                      if (e.usia === "infant") {
                                        return disabledDate(current, e, i);
                                      } else {
                                        return disabledDateAdult(current, e, i);
                                      }
                                    }}
                                  />
                                </Form.Item>
                                <small className="block -mt-4 text-gray-400">
                                  Contoh: dd-mm-yyyy
                                </small>
                              </div>
                              <div className="w-full">
                                <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                  <div className="text-gray-500 text-sm">
                                    No. Ktp
                                  </div>
                                  <Form.Item
                                    name={`nikPria${i}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "NIK tidak boleh kosong.",
                                      },
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          if (!isNaN(value) && value !== null && value.toString().length === 16) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject("Panjang NIK harus 16 digit.");
                                        },
                                      }),
                                    ]}
                                  >
                                    <InputNumber
                                      name={`nikPria${i}`}
                                      style={{ width: '100%' }}
                                      size="lg"
                                      className="mt-2"
                                      value={e.identityNumber}
                                      min={0}
                                      onChange={handleUsiasubCatagoryChange(
                                        e,
                                        i,
                                        "identityNumber",
                                        "pria"
                                      )}
                                      type="text"
                                      placeholder="No. Ktp / NIK"
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
                    </div>
                  </>
                ))}

              {/* wanita loop */}
              {wanita &&
                wanita[0].map((e, i) => (
                  <>
                    <div>
                      <div className="Booking  mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0">
                        <h1 className="text-sm font-bold text-slate-500">
                          WANITA PASSENGER
                        </h1>
                        <small className="text-gray-500">
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
                                <div className="text-gray-500 text-sm">
                                  Titel Anda
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
                                    <Select
                                      style={{ width: 120 }}
                                      options={data}
                                      value={e.usia}
                                      size="large"
                                      onChange={handleUsiasubCatagoryChange(
                                        e,
                                        i,
                                        "usia",
                                        "wanita"
                                      )}
                                    />
                                  </FormControl>
                                </div>
                                <div className="block xl:hidden">
                                  <FormControl
                                    sx={{ marginTop: 2, marginBottom: 2 }}
                                    fullWidth
                                  >
                                    <Select
                                      style={{ width: 120 }}
                                      options={data}
                                      value={e.usia}
                                      size="large"
                                      onChange={handleUsiasubCatagoryChange(
                                        e,
                                        i,
                                        "usia",
                                        "wanita"
                                      )}
                                    />
                                  </FormControl>
                                </div>
                                <div className="w-full grid grid-cols-1 mt-4">
                                  <div className="w-full">
                                    <div className="text-gray-500 text-sm">
                                      Nama Lengkap
                                    </div>
                                    <Form.Item
                                      name={`namalengkapWanita${i}`}
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
                                          max: 50,
                                          message:
                                            "Nama Lengkap maksimal 50 karakter.",
                                        },
                                        {
                                          pattern: /^[A-Za-z\s]+$/,
                                          message: 'Nama Lengkap hanya boleh terdiri dari huruf alfabet.',
                                        },
                                      ]}
                                    >
                                      <Input
                                        size="large"
                                        className="mt-2"
                                        value={e.nama_lengkap}
                                        onChange={handleUsiasubCatagoryChange(
                                          e,
                                          i,
                                          "nama_lengkap",
                                          "wanita"
                                        )}
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        id="default-input"
                                      />
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-8 mt-0">
                            <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                              {/* mobile & desktop NIK*/}
                              <div className="w-full px-4 xl:px-0">
                                <div className="xl:px-0 w-full text-gray-500 text-sm mb-2">
                                  Tanggal Lahir
                                </div>
                                <Form.Item
                                  name={`tanggalWanita${i}`}
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "Harap input Tanggal Lahir.",
                                    },
                                  ]}
                                >
                                  <DatePicker
                                    size="large"
                                    className="w-full"
                                    value={dayjs(e.birthdate, "YYYY/MM/DD")}
                                    format={"YYYY/MM/DD"}
                                    onChange={handleUsiasubCatagoryChange(
                                      e,
                                      i,
                                      "birthdate",
                                      "wanita"
                                    )}
                                    disabledDate={(current) => {
                                      if (e.usia === "infant") {
                                        return disabledDate(current, e, i);
                                      } else {
                                        return disabledDateAdult(current, e, i);
                                      }
                                    }}
                                  />
                                </Form.Item>
                                <small className="block -mt-4 text-gray-400">
                                  Contoh: dd-mm-yyyy
                                </small>
                              </div>
                              <div className="w-full">
                                <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                  <div className="text-gray-500 text-sm">
                                    No. Ktp
                                  </div>
                                  <Form.Item
                                    name={`nikWanita${i}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "NIK tidak boleh kosong.",
                                      },
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          if (!isNaN(value) && value !== null && value.toString().length === 16) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject("Panjang NIK harus 16 digit.");
                                        },
                                      }),
                                    ]}
                                  >
                                    <InputNumber
                                      name={`nikWanita${i}`}
                                      style={{ width: '100%' }}
                                      size="lg"
                                      className="mt-2"
                                      value={e.identityNumber}
                                      min={0}
                                      onChange={handleUsiasubCatagoryChange(
                                        e,
                                        i,
                                        "identityNumber",
                                        "wanita"
                                      )}
                                      type="text"
                                      placeholder="No. Ktp / NIK"
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
                    </div>
                  </>
                ))}

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
            {/* sidebar desktop*/}
            <div className="w-1/2 xl:mt-12">
              <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm">
                <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                  <div className="text-gray-700 text-sm font-bold">
                    Keberangkatan Kapal
                  </div>
                  <small className="text-xs text-gray-700">{duration}</small>
                </div>
                <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                  <div className="text-xs">
                    <div className="font-bold text-slate-600">
                      {dataDetailPelni && dataDetailPelni.pelabuhan_asal}
                    </div>
                    <small className="text-xs text-gray-700">
                      ({tanggal_keberangkatan_pelni})
                    </small>
                  </div>
                  <div className="rounded-full p-1 bg-blue-500 ">
                    <IoArrowForwardOutline className="text-white" size={18} />
                  </div>
                  <div className="text-xs">
                    <div className=" font-bold text-slate-600">
                      {dataDetailPelni && dataDetailPelni.pelabuhan_tujuan}
                    </div>
                    <small className="text-xs text-gray-700">
                      ({tanggal_tujuan_pelni})
                    </small>
                  </div>
                </div>

                <div className="p-4 pl-8 text-gray-700">
                  <div className=" text-xs font-bold">
                    {dataDetailPelni && dataDetailPelni.shipName}
                  </div>
                  <small>
                    <span>{dataDetailPelni.class}</span> / Subclass (
                    {dataDetailPelni.subClass})
                  </small>
                </div>
                <div className="p-4 pl-12 mb-4">
                  <ol class="relative border-l-2 border-dotted border-gray-300 ">
                    <li class="mb-10 ml-4 text-sm">
                      <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 "></div>
                      <div className="flex space-x-12">
                        <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">
                          {dataDetailPelni && dataDetailPelni.departureTime}
                        </time>
                        <div className="">
                          <h3 class="text-left text-xs font-bold text-slate-600 ">
                            {dataDetailPelni && dataDetailPelni.pelabuhan_asal}
                          </h3>
                        </div>
                      </div>
                    </li>
                    <li class="ml-4 text-sm mt-10">
                      <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                      <div className="flex space-x-12">
                        <time class="mb-1 text-xs font-bold leading-none text-gray-400 ">
                          {dataDetailPelni && dataDetailPelni.arrivalTime}
                        </time>
                        <div className="">
                          <h3 class="text-left text-xs font-bold text-slate-600 ">
                            {dataDetailPelni &&
                              dataDetailPelni.pelabuhan_tujuan}
                          </h3>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

        </div>
        </>
      )
      
      }
    </>
  );
}
