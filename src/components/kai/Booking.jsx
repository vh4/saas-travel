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
import { Button, DatePicker, Modal, Popover, Table, Form } from "antd";
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
import { CiBoxList } from "react-icons/ci";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setDataBookKereta } from "../../features/createSlice";

export default function BookingKai() {
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

  const dispatch = useDispatch();
  const dataSearch = useSelector((state) => state.bookkereta.searchDataKereta);

  const columns = [
    Table.SELECTION_COLUMN,
    Table.EXPAND_COLUMN,
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
          const dataTrainDetail = trainDataResponse.train_detail[0];

          const classTrain =
            dataTrain.seats.grade === "E"
              ? "Eksekutif"
              : dataTrain.seats.grade === "B"
              ? "Bisnis"
              : "Ekonomi";

          setclassTrain(classTrain);

          setdataBookingTrain([dataTrain]);
          setdataDetailTrain([dataTrainDetail]);

          const TotalAdult = parseInt(dataTrainDetail.adult);
          const TotalInfant = parseInt(dataTrainDetail.infant);

          setTotalAdult(TotalAdult);
          setTotalInfant(TotalInfant);

          setIsDatePickerOpen(Array(TotalInfant.length).fill(false));

          const AdultArr = Array.from({ length: TotalAdult }, () => ({
            name: "",
            birthdate: "",
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
      .catch(() => {
        setIsLoadingPage(false);
        setErrPage(true);
      });
  }, [id, token]);

  async function getDataTrain() {
    try {
      const response = dataSearch;
      return response;
    } catch (error) {
      return null;
    }
  }

  /* list penumpang */

  const [existingPenumpang, setExistingPenumpang] = useState([]);
  const [loadingExistingPenumpang, setLoadingExistingPenumpang] =
    useState(false);

  const previousDataPenumpang = async () => {
    try {
      setLoadingExistingPenumpang(true);
      const response = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/app/history_idpel`,
        {
          token,
          type: "WKAI",
        }
      );

      let parsing = response.data || [];
      parsing.data = parsing.data.map((x, i) => ({
        ...x,
        key: i,
      }));

      setExistingPenumpang(parsing.data);
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

  const handleOkListPenumpang = () => {
    // Update form data saat klik submit berdasarkan `selectedPassenger`
    if (selectedPassenger) {
      if (indexPreviousPenumpang.type === "adult") {
        const adultCategory = adult[0];

        const list_prefix = ["08"];
        const hp = list_prefix.some((prefix) =>
          selectedPassenger.hp.startsWith(prefix)
        )
          ? `628${selectedPassenger.hp.slice(2)}`
          : selectedPassenger.hp;

        adultCategory[indexPreviousPenumpang.index]["name"] =
          selectedPassenger.nama;
        adultCategory[indexPreviousPenumpang.index]["phone"] = hp;
        adultCategory[indexPreviousPenumpang.index]["idNumber"] =
          selectedPassenger.nik;
        setAdult([adultCategory]);

        form.setFields([
          {
            name: [`adultNameLengkap${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nama,
          },
          { name: [`nomorHPAdult${indexPreviousPenumpang.index}`], value: hp },
          {
            name: [`niktpAdult${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nik,
          },
        ]);
      } else if (indexPreviousPenumpang.type === "infant") {
        const infantCategory = infant[0];

        const birthDate = dayjs(selectedPassenger.ttl, "YYYY/MM/DD");
        if (!disabledDate(birthDate)) {
          // If birthDate is valid, set it in the form
          // form.setFields([
          //   {
          //     name: [`infanttanggallhr${indexPreviousPenumpang.index}`],
          //     value: birthDate,
          //   },
          // ]);

          infantCategory[indexPreviousPenumpang.index]["birthdate"] = selectedPassenger.ttl;
        } else {
          // If birthDate is not valid, clear the field
          // form.setFields([
          //   {
          //     name: [`infanttanggallhr${indexPreviousPenumpang.index}`],
          //     value: null,
          //   },
          // ]);

          // infantCategory[indexPreviousPenumpang.index]["birthdate"] = birthDate;
        }

        infantCategory[indexPreviousPenumpang.index]["name"] =
          selectedPassenger.nama;
        infantCategory[indexPreviousPenumpang.index]["idNumber"] =
          selectedPassenger.nik;
        setInfant([infantCategory]);

        form.setFields([
          {
            name: [`infantNamaLengkap${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nama,
          },
          {
            name: [`infantktpnik${indexPreviousPenumpang.index}`],
            value: selectedPassenger.nik,
          },
        ]);
      }
    }

    setIsModalListOpenPenumpang(false);
  };

  const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    if (selectedRows.length > 0) {
      setSelectedPassenger(selectedRows[0]); // Set data sementara tanpa mengubah form
    }
  };

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

    var priceInfantChild;
    TotalInfant > 0
      ? (priceInfantChild = dataBookingTrain[0].seats[0].priceAdult)
      : (priceInfantChild = "-");

    adult[0].map((data) => {
      if (data.phone.substring(0, 2) == "62") {
        data.phone = data.phone.replace("62", "0");
      } else {
        data.phone = data.phone;
      }
    });

    const response = await axios.post(
      `${process.env.REACT_APP_HOST_API}/travel/train/book`,
      {
        productCode: "WKAI",
        origin: dataDetailTrain[0].berangkat_id_station,
        destination: dataDetailTrain[0].tujuan_id_station,
        date: dataBookingTrain[0].departureDate,
        trainNumber: parseInt(dataBookingTrain[0].trainNumber),
        grade: dataBookingTrain[0].seats[0].grade,
        class: dataBookingTrain[0].seats[0].class,
        adult: TotalAdult,
        infant: TotalInfant,
        trainName: dataBookingTrain[0].trainName,
        departureStation: dataDetailTrain[0].stasiunBerangkat,
        departureTime: dataBookingTrain[0].departureTime,
        arrivalStation: dataDetailTrain[0].stasiunTujuan,
        arrivalTime: dataBookingTrain[0].arrivalTime,
        priceAdult: parseInt(dataBookingTrain[0].seats[0].priceAdult),
        priceInfant: "-",
        passengers: {
          adults: adult[0],
          infants: TotalInfant > 0 ? infant[0] : [],
        },
        token: token,
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
      const resp = {
          passengers: {
            adults: adult[0],
            infants: TotalInfant > 0 ? infant[0] : [],
          },
          hasil_book: hasilDataBooking,
      }

      dispatch(setDataBookKereta(resp));

      setTimeout(() => {
        navigate({
          pathname: `/train/konfirmasi`,
        });
      }, 1000);

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

          {/* modal for list penumpang */}
          <Modal
            open={isModalOpenListPenumpang}
            onOk={handleOkListPenumpang}
            onCancel={handleCancelListPenumpang}
            okText="Cancel"
            cancelText="Submit"
            maskClosable={false}
            footer={
              <>
                <div className="blok mt-8">
                  <div className="flex justify-end space-x-2">
                    <Button key="back" onClick={handleCancelListPenumpang}>
                      Cancel
                    </Button>
                    <Button
                      htmlType="submit"
                      key="submit"
                      type="primary"
                      className="bg-blue-500"
                      loading={isLoading}
                      onClick={handleOkListPenumpang}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            }
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
                  <Table
                    rowSelection={{
                      type: "radio",
                      onChange: handleRowSelectionChange,
                    }}
                    expandable={{
                      expandedRowRender: (record) => (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-8">
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
                Konfirmasi pesanan
              </div>
            </div>
            <div>
              <MdHorizontalRule
                size={20}
                className="text-black hidden xl:flex"
              />
            </div>
            <div className="hidden xl:flex space-x-2 items-center">
              <RxCrossCircled size={20} className="text-black" />
              <div className="hidden xl:block text-black">Pembayaran tiket</div>
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
                    <div className="mt-0 md:mt-8 block xl:hidden w-full rounded-md border-b xl:border xl:border-gray-200 xl:shadow-sm">
                      <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                        <div className="text-black font-medium ">
                          Keberangkatan kereta
                        </div>
                        <small className="text-black">
                          {tanggal_keberangkatan_kereta}
                        </small>
                      </div>
                      <div className="p-4 px-4 flex justify-between space-x-12 items-center">
                        <div className="text-black text-xs">
                          <div>
                            {dataDetailTrain &&
                              dataDetailTrain[0].berangkat_nama_kota}
                          </div>
                          <div>
                            (
                            {dataDetailTrain &&
                              dataDetailTrain[0].berangkat_id_station}
                            )
                          </div>
                        </div>
                        <div className="rounded-full p-2 bg-blue-500">
                          <IoArrowForwardOutline
                            className="text-white"
                            size={18}
                          />
                        </div>
                        <div className="text-black text-xs">
                          <div>
                            {dataDetailTrain &&
                              dataDetailTrain[0].tujuan_nama_kota}
                          </div>
                          <div>
                            (
                            {dataDetailTrain &&
                              dataDetailTrain[0].tujuan_id_station}
                            )
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pl-8 text-black">
                        <div className="text-xs">
                          {dataBookingTrain[0].trainName}
                        </div>
                        <small>
                          {classTrain} class{" "}
                          {dataBookingTrain &&
                            dataBookingTrain[0].seats[0].class}
                        </small>
                      </div>
                      <div className="p-4 pl-8 mb-4">
                        <ol class="relative border-l-2 border-dotted border-gray-800 ">
                          <li class="mb-10 ml-4">
                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-sm leading-none text-black ">
                                {dataBookingTrain &&
                                  dataBookingTrain[0].departureTime}
                              </time>
                              <div className="-mt-2">
                                <div class="text-left text-xs text-black ">
                                  {dataDetailTrain &&
                                    dataDetailTrain[0].berangkat_nama_kota}
                                </div>
                                <p class="text-left text-xs text-black ">
                                  (
                                  {dataDetailTrain &&
                                    dataDetailTrain[0].berangkat_id_station}
                                  )
                                </p>
                              </div>
                            </div>
                          </li>
                          <li class="ml-4">
                            <div class="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-sm leading-none text-black ">
                                {dataBookingTrain &&
                                  dataBookingTrain[0].arrivalTime}
                              </time>
                              <div className="-mt-2">
                                <div class="text-left text-xs  text-black ">
                                  {dataDetailTrain &&
                                    dataDetailTrain[0].tujuan_nama_kota}
                                </div>
                                <p class="text-left text-xs text-black ">
                                  (
                                  {dataDetailTrain &&
                                    dataDetailTrain[0].tujuan_id_station}
                                  )
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
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
                                <div className="Booking ml-2 md:ml-0 mt-8 mb-0 xl:mb-4 xl:mt-4">
                                  <h1 className="text-sm font-medium  text-black">
                                    ADULT PASSENGER
                                  </h1>
                                  <small className="text-black">
                                    Isi sesuai dengan data anda
                                  </small>
                                </div>
                                {/* Detailt */}
                                <div className="flex space-x-12">
                                  {/* form detailt kontal */}
                                  <div className="w-full mt-4 xl:mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-2">
                                    <div className="">
                                      <div className="mt-4 xl:mt-8 px-4 xl:px-8 form block xl:flex space-x-2 xl:space-x-8">
                                        {/* mobile & desktop Nama*/}
                                        <div className="xl:w-full xl:mt-0">
                                          <div className="flex items-center space-x-4">
                                            <Popover
                                              className=""
                                              placement="topLeft"
                                              content={
                                                <>
                                                  <div>
                                                    Pilih otomatis data
                                                    penumpang sebelumnya.
                                                  </div>
                                                </>
                                              }
                                            >
                                              <div
                                                onClick={() =>
                                                  showModalListPenumpang(
                                                    i,
                                                    "adult"
                                                  )
                                                }
                                                className="cursor-pointer"
                                              >
                                                <CiBoxList size={22} />
                                              </div>
                                            </Popover>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                        {/* mobile & desktop Nama*/}
                                        <div className="xl:w-full mt-4 xl:mt-0 ">
                                          <div className="w-full">
                                            <div className="text-black text-sm">
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
                                          <div className="text-black text-sm mb-2">
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
                                          <div className="text-black text-sm mb-2">
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
                                <div className="Booking ml-2  md:ml-0 mt-8 mb-0 xl:mb-4 xl:mt-12">
                                  <h1 className="xl:text-sm font-medium  text-black text-sm">
                                    INFANT PASSENGER
                                  </h1>
                                  <small className="text-black">
                                    isi dengan detail pemesanan kereta
                                  </small>
                                </div>
                                {/* Detailt */}
                                <div className="flex space-x-12">
                                  {/* form detailt kontal */}
                                  <div className="w-full mt-4 xl:mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-2">
                                    <div className="">
                                      <div className="mt-4 xl:mt-8 px-4 xl:px-8 form block xl:flex space-x-2 xl:space-x-8">
                                        {/* mobile & desktop Nama*/}
                                        <div className="xl:w-full xl:mt-0">
                                          <div className="flex items-center space-x-4">
                                            <Popover
                                              className=""
                                              placement="topLeft"
                                              content={
                                                <>
                                                  <div>
                                                    Pilih otomatis data
                                                    penumpang sebelumnya.
                                                  </div>
                                                </>
                                              }
                                            >
                                              <div
                                                onClick={() =>
                                                  showModalListPenumpang(
                                                    i,
                                                    "infant"
                                                  )
                                                }
                                                className="cursor-pointer"
                                              >
                                                <CiBoxList size={22} />
                                              </div>
                                            </Popover>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="">
                                      <div className="p-4 xl:p-8 form block xl:flex space-x-2 xl:space-x-8">
                                        {/* mobile & desktop Nama*/}
                                        <div className="xl:w-full mt-4 xl:mt-0">
                                          <div className="w-full">
                                            <div className="text-black text-sm">
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
                                          <div className="text-black text-sm mb-2">
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
                                            // inputReadOnly={true}
                                            onOpenChange={(status) => {
                                              const newOpenState = [
                                                ...isDatePickerOpen,
                                              ]; // Create a copy of the array
                                              newOpenState[i] = status; // Update the state for the specific index
                                              setIsDatePickerOpen(newOpenState); // Set the updated array as the new state
                                            }}
                                          />
                                          <small className="block mt-2 text-gray-400">
                                            Contoh: dd/mm/yyyy
                                          </small>
                                        </div>
                                        {/* mobile & desktop NIK*/}
                                        <div className="p-4 xl:p-0 w-full">
                                          <div className="text-black text-sm mb-2">
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
                      <div className="w-full md:w-2/3 2xl:w-1/2 md:mt-8">
                        <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm">
                          <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                            <div className="text-black text-sm font-medium ">
                              Keberangkatan kereta
                            </div>
                            <small className="text-xs text-black">
                              {tanggal_keberangkatan_kereta}
                            </small>
                          </div>
                          <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                            <div className="text-xs font-medium  text-black">
                              <div>
                                {dataDetailTrain &&
                                  dataDetailTrain[0].berangkat_nama_kota}
                              </div>
                              <div>
                                (
                                {dataDetailTrain &&
                                  dataDetailTrain[0].berangkat_id_station}
                                )
                              </div>
                            </div>
                            <div className="rounded-full p-1 bg-blue-500 ">
                              <IoArrowForwardOutline
                                className="text-white"
                                size={18}
                              />
                            </div>
                            <div className="text-xs font-medium  text-black">
                              <div>
                                {dataDetailTrain &&
                                  dataDetailTrain[0].tujuan_nama_kota}
                              </div>
                              <div>
                                (
                                {dataDetailTrain &&
                                  dataDetailTrain[0].tujuan_id_station}
                                )
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pl-8 text-black">
                            <div className=" text-xs font-medium ">
                              {dataBookingTrain &&
                                dataBookingTrain[0].trainName}
                            </div>
                            <small>
                              {classTrain} Class{" "}
                              {dataBookingTrain &&
                                dataBookingTrain[0].seats[0].class}
                            </small>
                          </div>
                          <div className="p-4 pl-12 mb-4">
                            <ol class="relative border-l-2 border-dotted border-gray-800">
                              <li class="mb-10 ml-4 text-sm">
                                <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800 "></div>
                                <div className="flex space-x-12">
                                  <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                    {dataBookingTrain &&
                                      dataBookingTrain[0].departureTime}
                                  </time>
                                  <div className="-mt-2">
                                    <h3 class="text-left text-xs font-medium  text-black ">
                                      {dataDetailTrain &&
                                        dataDetailTrain[0].berangkat_nama_kota}
                                    </h3>
                                    <p class="text-left text-xs font-medium  text-black ">
                                      (
                                      {dataDetailTrain &&
                                        dataDetailTrain[0].berangkat_id_station}
                                      )
                                    </p>
                                  </div>
                                </div>
                              </li>
                              <li class="ml-4 text-sm mt-10">
                                <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
                                <div className="flex space-x-12">
                                  <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                    {dataBookingTrain &&
                                      dataBookingTrain[0].arrivalTime}
                                  </time>
                                  <div className="-mt-2">
                                    <h3 class="text-left text-xs font-medium  text-black">
                                      {dataDetailTrain &&
                                        dataDetailTrain[0].tujuan_nama_kota}
                                    </h3>
                                    <p class="text-left text-xs font-medium  text-black">
                                      (
                                      {dataDetailTrain &&
                                        dataDetailTrain[0].tujuan_id_station}
                                      )
                                    </p>
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
