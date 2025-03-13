import React, { useEffect, useState } from "react";
import { MdHorizontalRule } from "react-icons/md";
import "react-phone-number-input/style.css";
import "../../index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RxCrossCircled } from "react-icons/rx";
import "react-phone-input-2/lib/bootstrap.css";
import { Button, DatePicker, Modal, Popover, Table } from "antd";
import dayjs from "dayjs";
import PhoneInput from "react-phone-input-2";
import { Input, Form } from "antd";
import { notification } from "antd";
import FormControl from "@mui/material/FormControl";
import { Select } from "antd";
import { parseDate, getCurrentDate } from "../../helpers/date";
import Page400 from "../components/400";
import Page500 from "../components/500";
import BookingLoading from "../components/pelniskeleton/booking";
import ManyRequest from "../components/Manyrequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { IoArrowForwardOutline, IoPricetagOutline } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import { CiBoxList, CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataBookPelni,
  setisOkBalancePelni,
} from "../../features/createSlice";
import { callbackFetchData } from "../../features/callBackSlice";
import { AiOutlineClockCircle } from "react-icons/ai";
import { toRupiah } from "../../helpers/rupiah";

export default function BookingPelni() {
  const dataSearch = useSelector((state) => state.bookpelni.searchDataPelni);
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };
  const navigate = useNavigate();
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
    window.scrollTo(0, 0);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [dataDetailPelni, setdataDetailPelni] = useState(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [manyRequestBook, setmanyRequestBook] = useState(false);

  const [err, setErr] = useState(false);
  const [errPage, setErrPage] = useState(false);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );
  const [isDatePickerOpenPria, setisDatePickerOpenPria] = useState(null);
  const [isDatePickerOpenWanita, setisDatePickerOpenWanita] = useState(null);

  const [email, setEmail] = useState();
  const [hp, setHp] = useState();
  const [wanita, setWanita] = useState([]);
  const [pria, setPria] = useState([]);
  const [tanggal_keberangkatan_pelni, Settanggal_keberangkatan_pelni] =
    useState(null);
  const [tanggal_tujuan_pelni, Settanggal_tujuan_pelni] = useState(null);
  const [duration, setDuration] = useState(null);
  const [TotalPria, setTotalPria] = useState(0);
  const [TotalWanita, setTotalWanita] = useState(0);

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }
  }, [token]);

  const columns = [
    {
      title: "Nama",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Type",
      dataIndex: "tipe",
      key: "tipe",
    },
  ];

  useEffect(() => {
    Promise.all([getDataPelniSearch()])
      .then(([bookResponse]) => {
        if (bookResponse) {
          setdataDetailPelni(bookResponse);

          const TotalWanita = parseInt(bookResponse.female) || 0;
          const TotalPria = parseInt(bookResponse.male) || 0;

          setisDatePickerOpenPria(Array(TotalPria.length).fill(false));
          setisDatePickerOpenWanita(Array(TotalWanita.length).fill(false));

          setTotalPria(TotalPria);
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

          const date_Keberangkatan = new Date(bookResponse.departureDate);

          const date_tujuan = new Date(bookResponse.arrivalDate);

          const duration = bookResponse.duration;

          const tanggal_keberangkatan_pelni = parseDate(date_Keberangkatan);
          const tanggal_tujuan_pelni = parseDate(date_tujuan);

          Settanggal_keberangkatan_pelni(tanggal_keberangkatan_pelni);
          Settanggal_tujuan_pelni(tanggal_tujuan_pelni);
          setDuration(duration);
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
  }, []);

  async function getDataPelniSearch() {
    try {
      const response = dataSearch;
      return response;
    } catch (error) {
      return null;
    }
  }

  const handleUsiasubCatagoryChange = (e, i, category, type) => (e) => {
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

    const adults = Array();
    const children = [];
    const infants = Array();

    pria[0].forEach((x) => {
      const passengers = {
        name: x.nama_lengkap,
        birthDate: x.birthdate,
        gender: x.gender,
      };

      if (x.usia == "adult") {
        passengers["identityNumber"] = x.identityNumber; // update
        adults.push(passengers);
      } else if (x.usia == "infant") {
        passengers["identityNumber"] = x.identityNumber;
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
      } else if (x.usia == "infant") {
        passengers["identityNumber"] = x.identityNumber;
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

    if (response.data.rc !== "00") {
      if (response.data.rc === "11") {
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
        const idtrx = data.transactionId;
        const allowPayment = data.is_allowed_pay;
        const resps = {
          ...params,
          arrivalDate: dataDetailPelni.arrivalTime,
          departureTime: dataDetailPelni.departureTime,
          transactionId: data.transactionId,
          book: response,
          infobooking: infobooking,
        };

        dispatch(setDataBookPelni(resps));
        dispatch(setisOkBalancePelni(allowPayment));

        //set data callback
        dispatch(callbackFetchData({ type: "pelni", id_transaksi: idtrx }));

        if (response.data.callback === null) {
          navigate(`/pelni/payment`);
        } else {
          //loloskan aja njir
          navigate(`/pelni/payment`);
        }

        setIsLoading(false);
      }
    }

    hideModal();
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

  /* list penumpang */
  const [existingPenumpang, setExistingPenumpang] = useState([]);
  const [originalPenumpang, setOriginalPenumpang] = useState([]); // Data awal
  const [loadingExistingPenumpang, setLoadingExistingPenumpang] =
    useState(false);

  const previousDataPenumpang = async () => {
    try {
      setLoadingExistingPenumpang(true);
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/app/history_idpel`,
        {
          token,
          type: "SHPPELNI",
        }
      );

      let parsing = response.data || [];
      parsing.data = parsing.data.map((x, i) => ({
        ...x,
        key: i,
      }));

      setExistingPenumpang(parsing.data);
      setOriginalPenumpang(parsing.data);
      setLoadingExistingPenumpang(false);
    } catch (error) {
      setExistingPenumpang([]);
      setLoadingExistingPenumpang(false);
      throw error;
    }
  };

  const [isModalOpenListPenumpang, setIsModalListOpenPenumpang] =
    useState(false);
  const [indexPreviousPenumpang, setIndexPreviousPenumpang] = useState({
    index: 0,
    type: "adult",
  });
  const [selectedPassenger, setSelectedPassenger] = useState(null); // State untuk menyimpan data yang dipilih

  const showModalListPenumpang = (i, type) => {
    previousDataPenumpang();
    setIndexPreviousPenumpang({ index: i, type });
    setIsModalListOpenPenumpang(true);
  };

  const handleCancelListPenumpang = () => {
    setIsModalListOpenPenumpang(false);
  };

  const handleOkListPenumpang = (selectedPassenger) => {
    // Update form data saat klik submit berdasarkan `selectedPassenger`
    if (selectedPassenger) {
      if (indexPreviousPenumpang.type === "pria") {
        const priaCategory = pria[0];

        const birthDate = dayjs(selectedPassenger.ttl, "YYYY/MM/DD");

        form.setFields([
          {
            name: [`tanggalPria${indexPreviousPenumpang.index}`],
            value: birthDate,
          },
        ]);

        priaCategory[indexPreviousPenumpang.index]["birthdate"] =
          selectedPassenger.ttl;

        priaCategory[indexPreviousPenumpang.index]["nama_lengkap"] =
          selectedPassenger.nama;
        priaCategory[indexPreviousPenumpang.index]["usia"] =
          selectedPassenger.tipe.toLowerCase() == "dewasa" ? "adult" : "infant";
        priaCategory[indexPreviousPenumpang.index]["identityNumber"] =
          selectedPassenger.nik;
        setPria([priaCategory]);

        form.setFields([
          {
            name: [`namalengkapPria${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nama,
          },
          {
            name: [`nikPria${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nik,
          },
        ]);
      } else if (indexPreviousPenumpang.type === "wanita") {
        const wanitaCategory = wanita[0];

        const birthDate = dayjs(selectedPassenger.ttl, "YYYY/MM/DD");

        form.setFields([
          {
            name: [`tanggalWanita${indexPreviousPenumpang.index}`],
            value: birthDate,
          },
        ]);

        wanitaCategory[indexPreviousPenumpang.index]["birthdate"] =
          selectedPassenger.ttl;

        wanitaCategory[indexPreviousPenumpang.index]["nama_lengkap"] =
          selectedPassenger.nama;
        wanitaCategory[indexPreviousPenumpang.index]["usia"] =
          selectedPassenger.tipe.toLowerCase() == "dewasa" ? "adult" : "infant";
        wanitaCategory[indexPreviousPenumpang.index]["identityNumber"] =
          selectedPassenger.nik;
        setWanita([wanitaCategory]);

        form.setFields([
          {
            name: [`namalengkapWanita${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nama,
          },
          {
            name: [`nikWanita${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nik,
          },
        ]);
      }
    }

    setIsModalListOpenPenumpang(false);
  };

  const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    if (selectedRows.length > 0) {
      const selectedPassenger = selectedRows[0];
      setSelectedPassenger(selectedPassenger);
      handleOkListPenumpang(selectedPassenger);
    }
  };

  const disabledDate = (current, e, i) => {
    const twoYearsAgo = dayjs().subtract(2, "year");
    // const endOfMonth = twoYearsAgo.endOf("month");
    const endOfDays = twoYearsAgo.subtract(2, "day");

    const currentDate = dayjs();

    return current && (current < endOfDays || current > currentDate);
  };

  const disabledDateAdult = (current, e, i) => {
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

  const searchIdpelHistory = (query) => {
    if (!query.trim()) {
      setExistingPenumpang(originalPenumpang);
      return;
    }

    const filtered = originalPenumpang.filter((e) =>
      e.name.toLowerCase().includes(query.toLowerCase())
    );
    setExistingPenumpang(filtered);
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
      ) : manyRequestBook === true ? (
        <>
          <ManyRequest />
        </>
      ) : (
        <>
          <div className="xl:mt-0">
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

            {/* modal for list penumpang */}
            <Modal
              open={isModalOpenListPenumpang}
              onOk={handleOkListPenumpang}
              onCancel={handleCancelListPenumpang}
              maskClosable={false}
              footer={false}
            >
              {loadingExistingPenumpang && (
                <>
                  <Skeleton width={"100%"} height={12} />
                  <Skeleton width={"80%"} height={12} />
                  <Skeleton width={"100%"} height={12} />
                  <Skeleton width={"80%"} height={12} />
                  <Skeleton width={"100%"} height={12} />
                </>
              )}
              {loadingExistingPenumpang == false && (
                <>
                  <div>
                    <div className="w-full flex justify-end mt-6">
                      <Input
                        className="w-1/2 mt-2 mb-4"
                        prefix={<CiSearch />}
                        placeholder="Searching...."
                        onChange={(e) => searchIdpelHistory(e.target.value)}
                        size="middle"
                      />
                    </div>
                    <Table
                      onRow={(record) => ({
                        onClick: () => {
                          handleRowSelectionChange([record.key], [record]); // Trigger selection manually
                        },
                        style: { cursor: "pointer" },
                      })}
                      expandable={{
                        expandedRowRender: (record) => (
                          <>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 ml-8">
                              <div className="my-2">
                                <p style={{ margin: 0 }} className="text-xs">
                                  <strong>NIK:</strong> {record.nik}
                                </p>
                              </div>
                              <div className="my-2">
                                <p style={{ margin: 0 }} className="text-xs">
                                  <strong>Nomor HP:</strong>
                                  <div>
                                    {record.hp && record.hp !== ""
                                      ? record.hp
                                      : "-"}
                                  </div>
                                </p>
                              </div>
                              <div className="my-2">
                                <p style={{ margin: 0 }} className="text-xs">
                                  <strong>Tanggal Lahir:</strong>{" "}
                                  {dayjs(record.ttl).format("DD/MM/YYYY")}
                                </p>
                              </div>
                            </div>
                          </>
                        ),
                      }}
                      columns={columns}
                      dataSource={existingPenumpang}
                      pagination={{ pageSize: 5 }}
                    />
                  </div>
                </>
              )}
            </Modal>
            {/* header  flow */}

            <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-2 xl:space-x-8 items-center">
              <div className="hidden xl:flex space-x-2 items-center ">
                <AiOutlineClockCircle size={20} className="" />
                <div className="hidden xl:flex font-medium ">
                  Detail pesanan
                </div>
              </div>
              <div>
                <MdHorizontalRule size={20} className="hidden xl:flex " />
              </div>
              <div className="hidden xl:flex space-x-2 items-center">
                <RxCrossCircled size={20} className="" />
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
                <BookingLoading
                  total={parseInt(TotalPria) + parseInt(TotalWanita)}
                />
              </>
            ) : (
              <>
                {/* sidebar mobile pelni*/}
                <div className="mt-0 xl:mt-8 block xl:hidden w-full rounded-md border-b xl:border xl:border-gray-200 xl:shadow-sm">
                  <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                    <div className="text-black font-medium ">
                      Keberangkatan Kapal
                    </div>
                    <small className="text-xs text-black ">{duration}</small>
                  </div>
                  <div className="p-4 px-4 flex justify-between space-x-12 items-center">
                    <div className="text-black text-xs">
                      <div>
                        {dataDetailPelni && dataDetailPelni.pelabuhan_asal}
                      </div>
                      <div>{tanggal_keberangkatan_pelni}</div>
                    </div>
                    <div className="rounded-full p-2 bg-blue-500">
                      <IoArrowForwardOutline className="text-white" size={18} />
                    </div>
                    <div className="text-black text-xs">
                      <div>
                        {dataDetailPelni && dataDetailPelni.pelabuhan_tujuan}
                      </div>
                      <div>{tanggal_tujuan_pelni}</div>
                    </div>
                  </div>
                  <div className="p-4 pl-8  text-black">
                    <div className="text-xs font-medium ">
                      {dataDetailPelni.shipName}
                    </div>
                    <small>
                      <span>{dataDetailPelni.class}</span> Subclass (
                      {dataDetailPelni.subClass})
                    </small>
                  </div>
                  <div className="p-4 pl-8 mb-4">
                    <ol class="relative border-l-2 border-dotted border-gray-800">
                      <li class="mb-10 ml-4">
                        <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                        <div className="flex space-x-12">
                          <time class="mb-1 text-sm font-normal leading-none text-black ">
                            {dataDetailPelni && dataDetailPelni.departureTime}
                          </time>
                          <div className="-mt-2">
                            <div class="text-left text-xs text-black">
                              {dataDetailPelni &&
                                dataDetailPelni.pelabuhan_asal}
                            </div>
                          </div>
                        </div>
                      </li>
                      <li class="ml-4">
                        <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                        <div className="flex space-x-12">
                          <time class="mb-1 text-sm leading-none text-black ">
                            {dataDetailPelni && dataDetailPelni.arrivalTime}
                          </time>
                          <div className="-mt-2">
                            <div class="text-left text-xs  text-black ">
                              {dataDetailPelni &&
                                dataDetailPelni.pelabuhan_tujuan}
                            </div>
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
                {/* for mobile */}
                <div className="flex xl:hidden justify-between items-center mb-4 border-b px-2 py-4">
                  <div className="flex space-x-2 items-center text-gry-400 text-sm ">
                    <IoPricetagOutline className="text-gray-500" size={18} />
                    <div className="text-gray-500">Harga Dewasa</div>
                  </div>
                  <small className="text-sm font-medium">
                    Rp. {toRupiah(dataDetailPelni.harga_dewasa)}
                  </small>
                </div>
                <div className="flex xl:hidden justify-between items-center mb-4 border-b px-2 py-4">
                  <div className="flex space-x-2 items-center text-gry-400 text-sm ">
                    <IoPricetagOutline className="text-gray-500" size={18} />
                    <div className="text-gray-500">Harga Infant</div>
                  </div>
                  <small className="text-sm font-medium">
                    Rp. {toRupiah(dataDetailPelni.harga_infant)}
                  </small>
                </div>
                <div className="w-full mb-24 block xl:flex xl:space-x-10">
                  {/* detail passengger kai*/}
                  <Form
                    form={form}
                    onFinish={showModal}
                    className="block w-full mt-2 mb-4 xl:mt-12"
                  >
                    <div className="w-full mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-2 gap-12">
                      <div className="">
                        <div className="p-4 xl:p-8 form block xl:flex xl:space-x-2">
                          {/* mobile & desktop Nama*/}
                          <div className="xl:w-full mt-4 xl:mt-0">
                            <div className="text-black text-sm">
                              Email Address
                            </div>
                            <div className="block xl:flex xl:space-x-6">
                              <div className="w-full">
                                <Form.Item
                                  name={`emailAdult`}
                                  rules={[
                                    {
                                      required: true,
                                      type: "email",
                                      message: "Format Email tidak sesuai.",
                                    },
                                    {
                                      max: 150,
                                      message: "Email maksimal 150 karakter.",
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
                              <div className="text-black text-sm mb-2 ml-2">
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
                                    message:
                                      "Minimal Nomor HP pemesan adalah 10 digit",
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
                            <div className="Booking mt-4 mb-0 xl:mb-4 xl:mt-12 ml-2 xl:ml-0">
                              <h1 className="text-sm font-medium  text-black">
                                PRIA PASSENGER
                              </h1>
                              <small className="text-black">
                                Isi sesuai dengan data anda
                              </small>
                            </div>
                            {/* Detailt */}
                            <div className="flex space-x-12">
                              {/* form detailt kontal */}
                              <div className="w-full mt-4 xl:mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-1">
                                <div className="">
                                  <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                    {/* mobile & desktop Nama*/}
                                    <div className="xl:w-full mt-4 xl:mt-0">
                                      <div className="text-black text-sm">
                                        Title Anda
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <Popover
                                          className="hidden xl:block"
                                          placement="topLeft"
                                          content={
                                            <>
                                              <div>
                                                Pilih otomatis data penumpang
                                                sebelumnya.
                                              </div>
                                            </>
                                          }
                                        >
                                          <div
                                            onClick={() =>
                                              showModalListPenumpang(i, "pria")
                                            }
                                            className="cursor-pointer"
                                          >
                                            <CiBoxList size={22} />
                                          </div>
                                        </Popover>
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
                                      </div>
                                      <div className="flex items-center space-x-4 pb-4">
                                        <Popover
                                          className="block xl:hidden"
                                          placement="topLeft"
                                          content={
                                            <>
                                              <div>
                                                Pilih otomatis data penumpang
                                                sebelumnya.
                                              </div>
                                            </>
                                          }
                                        >
                                          <div
                                            onClick={() =>
                                              showModalListPenumpang(i, "pria")
                                            }
                                            className="cursor-pointer"
                                          >
                                            <CiBoxList size={22} />
                                          </div>
                                        </Popover>
                                        <div className="block xl:hidden">
                                          <FormControl
                                            sx={{
                                              marginTop: 2,
                                              marginBottom: 2,
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
                                      </div>
                                      <div className="w-full grid grid-cols-1 mt-4">
                                        <div className="w-full">
                                          <div className="text-black text-sm">
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
                                                message:
                                                  "Nama Lengkap hanya boleh terdiri dari huruf alfabet.",
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
                                      <div className="xl:px-0 w-full text-black text-sm mb-2">
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
                                          value={dayjs(
                                            e.birthdate,
                                            "YYYY/MM/DD"
                                          )}
                                          format={"DD/MM/YYYY"}
                                          open={isDatePickerOpenPria[i]} // Pass the state to the open prop
                                          // inputReadOnly={true}
                                          onOpenChange={(status) => {
                                            const newOpenState = [
                                              ...isDatePickerOpenPria,
                                            ]; // Create a copy of the array
                                            newOpenState[i] = status; // Update the state for the specific index
                                            setisDatePickerOpenPria(
                                              newOpenState
                                            ); // Set the updated array as the new state
                                          }}
                                          onChange={handleUsiasubCatagoryChange(
                                            e,
                                            i,
                                            "birthdate",
                                            "pria"
                                          )}
                                          disabledDate={(current) => {
                                            if (e.usia === "infant") {
                                              return disabledDate(
                                                current,
                                                e,
                                                i
                                              );
                                            } else {
                                              return disabledDateAdult(
                                                current,
                                                e,
                                                i
                                              );
                                            }
                                          }}
                                        />
                                      </Form.Item>
                                      <small className="block -mt-4 text-gray-400">
                                        Contoh: dd/mm/yyyy
                                      </small>
                                    </div>
                                    <div className="w-full">
                                      <div className="px-4 xl:px-0 w-full block mt-8 xl:mt-0">
                                        <div className="text-black text-sm mb-2">
                                          No. Ktp
                                        </div>
                                        <Form.Item
                                          name={`nikPria${i}`}
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
                                            name={`nikPria${i}`}
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
                                            onChange={handleUsiasubCatagoryChange(
                                              e,
                                              i,
                                              "identityNumber",
                                              "pria"
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
                            <div className="Booking mt-4 mb-0 xl:mb-4 xl:mt-12 ml-2 xl:ml-0">
                              <h1 className="text-sm font-medium  text-black">
                                WANITA PASSENGER
                              </h1>
                              <small className="text-black">
                                Isi sesuai dengan data anda
                              </small>
                            </div>
                            {/* Detailt */}
                            <div className="flex space-x-12">
                              {/* form detailt kontal */}
                              <div className="w-full mt-4 xl:mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-1">
                                <div className="">
                                  <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                    {/* mobile & desktop Nama*/}
                                    <div className="xl:w-full mt-4 xl:mt-0">
                                      <div className="text-black text-sm">
                                        Title Anda
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <Popover
                                          className="hidden xl:block"
                                          placement="topLeft"
                                          content={
                                            <>
                                              <div>
                                                Pilih otomatis data penumpang
                                                sebelumnya.
                                              </div>
                                            </>
                                          }
                                        >
                                          <div
                                            onClick={() =>
                                              showModalListPenumpang(
                                                i,
                                                "wanita"
                                              )
                                            }
                                            className="cursor-pointer"
                                          >
                                            <CiBoxList size={22} />
                                          </div>
                                        </Popover>
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
                                      </div>
                                      <div className="flex items-center space-x-4 pb-4">
                                        <Popover
                                          className="block xl:hidden"
                                          placement="topLeft"
                                          content={
                                            <>
                                              <div>
                                                Pilih otomatis data penumpang
                                                sebelumnya.
                                              </div>
                                            </>
                                          }
                                        >
                                          <div
                                            onClick={() =>
                                              showModalListPenumpang(
                                                i,
                                                "wanita"
                                              )
                                            }
                                            className="cursor-pointer"
                                          >
                                            <CiBoxList size={22} />
                                          </div>
                                        </Popover>
                                        <div className="block xl:hidden">
                                          <FormControl
                                            sx={{
                                              marginTop: 2,
                                              marginBottom: 2,
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
                                      </div>
                                      <div className="w-full grid grid-cols-1 mt-4">
                                        <div className="w-full">
                                          <div className="text-black text-sm">
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
                                                message:
                                                  "Nama Lengkap hanya boleh terdiri dari huruf alfabet.",
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
                                      <div className="xl:px-0 w-full text-black text-sm mb-2">
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
                                          value={dayjs(
                                            e.birthdate,
                                            "YYYY/MM/DD"
                                          )}
                                          format={"DD/MM/YYYY"}
                                          open={isDatePickerOpenWanita[i]} // Pass the state to the open prop
                                          // inputReadOnly={true}
                                          onOpenChange={(status) => {
                                            const newOpenState = [
                                              ...isDatePickerOpenWanita,
                                            ]; // Create a copy of the array
                                            newOpenState[i] = status; // Update the state for the specific index
                                            setisDatePickerOpenWanita(
                                              newOpenState
                                            ); // Set the updated array as the new state
                                          }}
                                          onChange={handleUsiasubCatagoryChange(
                                            e,
                                            i,
                                            "birthdate",
                                            "wanita"
                                          )}
                                          disabledDate={(current) => {
                                            if (e.usia === "infant") {
                                              return disabledDate(
                                                current,
                                                e,
                                                i
                                              );
                                            } else {
                                              return disabledDateAdult(
                                                current,
                                                e,
                                                i
                                              );
                                            }
                                          }}
                                        />
                                      </Form.Item>
                                      <small className="block -mt-4 text-gray-400">
                                        Contoh: dd/mm/yyyy
                                      </small>
                                    </div>
                                    <div className="w-full">
                                      <div className="px-4 xl:px-0 w-full block mt-8 xl:mt-0">
                                        <div className="text-black text-sm mb-2">
                                          No. Ktp
                                        </div>
                                        <Form.Item
                                          name={`nikWanita${i}`}
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
                                            name={`nikWanita${i}`}
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
                                            onChange={handleUsiasubCatagoryChange(
                                              e,
                                              i,
                                              "identityNumber",
                                              "wanita"
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
                              </div>
                            </div>
                          </div>
                        </>
                      ))}

                    <div className="flex justify-end mr-2 mt-8 w-full xl:w-auto">
                      <Button
                        htmlType="submit"
                        size="large"
                        key="submit"
                        type="primary"
                        className="bg-blue-500 mx-2 font-semibold w-full xl:w-auto"
                      >
                        Booking Sekarang
                      </Button>
                    </div>
                  </Form>
                  {/* sidebar desktop*/}
                  <div className="w-full xl:w-2/3 2xl:w-1/2 xl:mt-12">
                    <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm">
                      <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                        <div className="text-black text-sm font-medium ">
                          Keberangkatan Kapal
                        </div>
                        <small className="text-xs text-black">{duration}</small>
                      </div>
                      <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                        <div className="text-xs">
                          <div className="font-medium  text-black">
                            {dataDetailPelni && dataDetailPelni.pelabuhan_asal}
                          </div>
                          <small className="text-xs text-black">
                            ({tanggal_keberangkatan_pelni})
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
                            {dataDetailPelni &&
                              dataDetailPelni.pelabuhan_tujuan}
                          </div>
                          <small className="text-xs text-black">
                            ({tanggal_tujuan_pelni})
                          </small>
                        </div>
                      </div>

                      <div className="p-4 pl-8 text-black">
                        <div className="text-xs font-medium ">
                          {dataDetailPelni && dataDetailPelni.shipName}
                        </div>
                        <small>
                          <span>{dataDetailPelni.class}</span> / Subclass (
                          {dataDetailPelni.subClass})
                        </small>
                      </div>
                      <div className="p-4 pl-12 mb-4">
                        <ol class="relative border-l-2 border-dotted border-gray-800 ">
                          <li class="mb-10 ml-4 text-sm">
                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                {dataDetailPelni &&
                                  dataDetailPelni.departureTime}
                              </time>
                              <div className="">
                                <h3 class="text-left text-xs font-medium  text-black ">
                                  {dataDetailPelni &&
                                    dataDetailPelni.pelabuhan_asal}
                                </h3>
                              </div>
                            </div>
                          </li>
                          <li class="ml-4 text-sm mt-10">
                            <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                {dataDetailPelni && dataDetailPelni.arrivalTime}
                              </time>
                              <div className="">
                                <h3 class="text-left text-xs font-medium  text-black ">
                                  {dataDetailPelni &&
                                    dataDetailPelni.pelabuhan_tujuan}
                                </h3>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                    {/* for desktop */}
                    <div className="mt-4 hidden xl:flex justify-between items-center mb-4 px-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-black-500 border-b-gray-100">
                      <div className="flex space-x-2 items-center text-gry-400 text-sm ">
                        <IoPricetagOutline
                          className="text-gray-500"
                          size={18}
                        />
                        <div className="text-gray-500">Harga Dewasa</div>
                      </div>
                      <small className="text-sm font-medium">
                        Rp. {toRupiah(dataDetailPelni.harga_dewasa)}
                      </small>
                    </div>
                    <div className="hidden xl:flex justify-between items-center mb-4 px-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-black-500 border-b-gray-100">
                      <div className="flex space-x-2 items-center text-gry-400 text-sm ">
                        <IoPricetagOutline
                          className="text-gray-500"
                          size={18}
                        />
                        <div className="text-gray-500">Harga Infant</div>
                      </div>
                      <small className="text-sm font-medium">
                        Rp. {toRupiah(dataDetailPelni.harga_infant)}
                      </small>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
