import React, { useState, useEffect, useRef } from "react";
import { MdHorizontalRule } from "react-icons/md";
import FormControl from "@mui/material/FormControl";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import "react-phone-input-2/lib/bootstrap.css";
import { Button, DatePicker, Modal, Popover, Table } from "antd";
import { Input, Form } from "antd";
import { Select as SelectAnt } from "antd";
import dayjs from "dayjs";
import { notification } from "antd";
import {
  getCurrentDate,
  parseTanggal as tanggalParse,
} from "../../helpers/date";
import BookingLoading from "../components/planeskeleton/booking";
import Page500 from "../components/500";
import Page400 from "../components/400";
import ManyRequest from "../components/Manyrequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { IoArrowForwardOutline, IoPricetagOutline } from "react-icons/io5";
import { CiBoxList, CiSearch } from "react-icons/ci";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { callbackFetchData } from "../../features/callBackSlice";
import { setDataBookPesawat, setisOkBalance } from "../../features/createSlice";
import { AiOutlineClockCircle } from "react-icons/ai";
import { toRupiah } from "../../helpers/rupiah";

export default function BookingPesawat() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [form] = Form.useForm();
  const onReset = () => {
    form.resetFields();
  };

  const dataSearch = useSelector((state) => state.bookpesawat.searchData);
  const token = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
  );

  const [dataDetail, setdataDetail] = React.useState(null);
  const [dataDetailForBooking, setdataDetailForBooking] = React.useState(null);
  const [isInternational, setIsInternational] = React.useState(0);
  const [TotalAdult, SetTotalAdult] = React.useState(null);
  const [TotalChild, setTotalChild] = React.useState(null);
  const [TotalInfant, setTotalInfant] = React.useState(null);
  const [adult, setAdult] = useState(null);
  const [child, setChild] = useState(null);
  const [infant, setInfant] = useState(null);
  const [manyRequestBook, setmanyRequestBook] = useState(false);
  const formRef = useRef();

  const [isDatePickerOpenAdult, setIsDatePickerOpenAdult] = useState(null);
  const [isDatePickerOpenChild, setIsDatePickerOpenChild] = useState(null);
  const [isDatePickerOpenInfant, setIsDatePickerOpenInfant] = useState(null);


  const [isDatePickerOpenAdultExpiredDate, setIsDatePickerOpenAdultExpiredDate] = useState(null);
  const [isDatePickerOpenChildExpiredDate, setIsDatePickerOpenChildExpiredDate] = useState(null);
  const [isDatePickerOpenInfantExpiredDate, setIsDatePickerOpenInfantExpiredDate] = useState(null);

  const [email, setEmail] = useState();
  const [hp, setHp] = useState();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errPage, setErrPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();

  const data = [
    {
      label: "Tuan.",
      value: "MR",
    },
    {
      label: "Nyonya.",
      value: "MRS",
    },
    {
      label: "Nona.",
      value: "MS",
    },
  ];

  const dataInfChld = [
    {
      label: "Tuan.",
      value: "MR",
    },
    {
      label: "Nona.",
      value: "MS",
    },
  ];

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "tipe",
      key: "tipe",
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

  useEffect(() => {
    if (token === null || token === undefined) {
      setErr(true);
    }
  }, [token]);

  const [selectedCountry, setSelectedCountry] = useState({});
  const [countries, setCountries] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_HOST_API}/travel/country`
        );
        const data = response.data;
        setCountries(data.countries);
        setSelectedCountry(data.userCountryCode);
      } catch (error) {
        setErrPage(true);
        console.log(error.message || "An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Promise.all([getDataPesawatSearch()])
      .then(([bookResponse]) => {
        if (bookResponse) {
          const dataDetailForBooking = bookResponse._flight_forBooking;
          const dataDetail = bookResponse._flight;

          setdataDetailForBooking(dataDetailForBooking);
          setIsInternational(dataDetailForBooking.isInternational);
          setdataDetail(dataDetail);

          const TotalAdult = parseInt(dataDetailForBooking.adult) || 0;
          const TotalChild = parseInt(dataDetailForBooking.child) || 0;
          const TotalInfant = parseInt(dataDetailForBooking.infant) || 0; //

          setIsDatePickerOpenAdult(Array(TotalAdult).fill(false));
          setIsDatePickerOpenChild(Array(TotalChild).fill(false));
          setIsDatePickerOpenInfant(Array(TotalInfant).fill(false));

          setIsDatePickerOpenAdultExpiredDate(Array(TotalAdult).fill(false));
          setIsDatePickerOpenChildExpiredDate(Array(TotalChild).fill(false));
          setIsDatePickerOpenInfantExpiredDate(Array(TotalInfant).fill(false));

          SetTotalAdult(TotalAdult);
          setTotalChild(TotalChild);
          setTotalInfant(TotalInfant);

          const AdultArr = Array.from({ length: TotalAdult }, () => ({
            gender: "MR",
            nama_depan: "broowww",
            nama_belakang: "",
            birthdate: getCurrentDate(),
            idNumber: "",
          }));

          const InfantArr = Array.from({ length: TotalInfant }, () => ({
            gender: "MR",
            nama_depan: "",
            nama_belakang: "",
            birthdate: getCurrentDate(),
          }));

          const ChildArr = Array.from({ length: TotalChild }, () => ({
            gender: "MR",
            nama_depan: "",
            nama_belakang: "",
            birthdate: getCurrentDate(),
            idNumber: "",
          }));

          setInfant([InfantArr]);
          setChild([ChildArr]);
          setAdult([AdultArr]);
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

  async function getDataPesawatSearch() {
    try {
      const response = dataSearch;
      return response;
    } catch (error) {
      return null;
    }
  }

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
          type: "TP",
        }
      );

      let parsing = response.data || [];
      parsing.data = parsing.data.map((x, i) => ({
        ...x,
        key: i,
      }));

      parsing.data = parsing.data.map((x, i) => ({
        ...x,
        name: x.nama_depan + ' ' +  x.nama_belakang,
        }))

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
  const [indexPreviousPenumpang, setIndexPreviousPenumpang] = useState({ index: 0, type: "adult" });
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
    if (selectedPassenger) {

      if (indexPreviousPenumpang.type === 'adult') {

      const adultCategory = adult[0];

      const birthDate = dayjs(selectedPassenger.ttl, "YYYY/MM/DD");
      if (!disabledDateAdult(birthDate)) {
        // If birthDate is valid, set it in the form
        form.setFields([
          {
            name: [`tanggalAdult${indexPreviousPenumpang.index}`],
            value: birthDate,
          },
        ]);

        adultCategory[indexPreviousPenumpang.index]['birthdate'] = selectedPassenger.ttl

      } else {
        // If birthDate is not valid, clear the field
        form.setFields([
          {
            name: [`tanggalAdult${indexPreviousPenumpang.index}`],
            value: null,
          },
        ]);
      }
  
      adultCategory[indexPreviousPenumpang.index]['nama_depan'] = selectedPassenger.nama_depan;
      adultCategory[indexPreviousPenumpang.index]['nama_belakang'] = selectedPassenger.nama_belakang;
      adultCategory[indexPreviousPenumpang.index]['idNumber'] = selectedPassenger.nik;
  
      setAdult([adultCategory]);

      form.setFields([
        { name: [`namadepanAdult${indexPreviousPenumpang.index}`], value: selectedPassenger.nama_depan },
        { name: [`namabelakangAdult${indexPreviousPenumpang.index}`], value: selectedPassenger.nama_belakang },
        { name: [`nikAdult${indexPreviousPenumpang.index}`], value: selectedPassenger.nik },
      ]);

      } else if (indexPreviousPenumpang.type === 'child') {


        const childCategory = child[0];

        const birthDate = dayjs(selectedPassenger.ttl, "YYYY/MM/DD");
        if (!disabledDateChild(birthDate)) {
          // If birthDate is valid, set it in the form

          form.setFields([
            {
              name: [`tanggallahirChild${indexPreviousPenumpang.index}`],
              value: birthDate,
            },
          ]);
  
          childCategory[indexPreviousPenumpang.index]['birthdate'] = selectedPassenger.ttl
  
        } else {
          // If birthDate is not valid, clear the field
          form.setFields([
            {
              name: [`tanggallahirChild${indexPreviousPenumpang.index}`],
              value: null,
            },
          ]);
        }

        childCategory[indexPreviousPenumpang.index]['nama_depan'] = selectedPassenger.nama_depan;
        childCategory[indexPreviousPenumpang.index]['nama_belakang'] = selectedPassenger.nama_belakang;
        childCategory[indexPreviousPenumpang.index]['idNumber'] = selectedPassenger.nik;

        setChild([childCategory]);

        form.setFields([
          { name: [`namadepanChild${indexPreviousPenumpang.index}`], value: selectedPassenger.nama_depan },
          { name: [`namabelakangChild${indexPreviousPenumpang.index}`], value: selectedPassenger.nama_belakang },
          { name: [`noktpChild${indexPreviousPenumpang.index}`], value: selectedPassenger.nik },
        ]);


      } else if (indexPreviousPenumpang.type === 'infant') {

        const infantCategory = infant[0];

        const birthDate = dayjs(selectedPassenger.ttl, "YYYY/MM/DD");
        if (!disabledDate(birthDate)) {
          // If birthDate is valid, set it in the form
          form.setFields([
            {
              name: [`infanttanggallhr${indexPreviousPenumpang.index}`],
              value: birthDate,
            },
          ]);
  
          infantCategory[indexPreviousPenumpang.index]['birthdate'] = selectedPassenger.ttl
  
        } else {
          // If birthDate is not valid, clear the field
          form.setFields([
            {
              name: [`infanttanggallhr${indexPreviousPenumpang.index}`],
              value: null,
            },
          ]);
        }
        
        infantCategory[indexPreviousPenumpang.index]['nama_depan'] = selectedPassenger.nama_depan;
        infantCategory[indexPreviousPenumpang.index]['nama_belakang'] = selectedPassenger.nama_belakang;
        infantCategory[indexPreviousPenumpang.index]['idNumber'] = selectedPassenger.nik;

        setInfant([infantCategory]);

        form.setFields([
          { name: [`infantnamadepan${indexPreviousPenumpang.index}`], value: selectedPassenger.nama_depan },
          { name: [`infantnamabelakang${indexPreviousPenumpang.index}`], value: selectedPassenger.nama_belakang },
          { name: [`infantktp${indexPreviousPenumpang.index}`], value: selectedPassenger.nik },
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

  

  /* end of list penumpang */

  const handleAdultsubCatagoryChange = (i, category) => (e) => {
    let adultCategory = adult[0];

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

      adultCategory[i][category] = tanggalParse;
    } else if (category == "kewenegaraan" || category == "issuingpassport") {
      adultCategory[i][category] = e.value;
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

      childCategory[i][category] = tanggalParse;
    } else if (category == "kewenegaraan" || category == "issuingpassport") {
      childCategory[i][category] = e.value;
    } else if (category == "gender") {
      childCategory[i][category] = e;
    } else {
      childCategory[i][category] = e.target.value;
    }
    setChild([childCategory]);
  };

  const handleInfantsubCatagoryChange = (i, category) => (e) => {
    let infantCategory = infant[0];

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
    } else if (category == "kewenegaraan" || category == "issuingpassport") {
      infantCategory[i][category] = e.value;
    } else if (category == "gender") {
      infantCategory[i][category] = e;
    } else {
      infantCategory[i][category] = e.target.value;
    }

    setInfant([infantCategory]);
  };

  const onFinishFailed = (errorInfo) => {
    const firstErrorField = Object.keys(errorInfo.errorFields[0])[0];

    const inputInstance = formRef.current.getFieldInstance(firstErrorField);

    inputInstance.focus();
  };

  const handlerBookingSubmit = async (errorInfo) => {
    try {
      let end_adult = [];
      let end_child = [];
      let end_infant = [];

      onReset();

      setIsLoading(true);

      let email_hp = {
        email: email,
        nomor: hp,
      };

      let data_adult = adult[0].map((item) => ({ ...item, ...email_hp }));
      child[0].forEach((item) => {
        let date = new Date(item.birthdate);
        let dateString =
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getDate().toString().padStart(2, "0") +
          "/" +
          date.getFullYear();

        //"CHD;".$child_title.";".$child_firstname.";".$child_lastname.";".$child_birthdate.";".$child_no_passport.";".$child_nationality.";".$child_issueby.";".$child_expdate.";".$child_issuedate.";".$child_issueby.";".$child_baggage

        end_child.push(
          `CHD;${
            item.gender
          };${item.nama_depan};${item.nama_belakang};${dateString};${
            item.idNumber
          };${item?.kewenegaraan ? item?.kewenegaraan : "ID"};${
            item?.issuingpassport ? item?.issuingpassport : "ID"
          };${item?.expireddate ? item?.expireddate : ""};;ID;`
        );
      });

      infant[0].forEach((item) => {
        let date = new Date(item.birthdate);
        let dateString =
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getDate().toString().padStart(2, "0") +
          "/" +
          date.getFullYear();
        end_infant.push(
          `INF;${
            item.gender
          };${item.nama_depan};${item.nama_belakang};${dateString};${
            item.idNumber
          };${item?.kewenegaraan ? item?.kewenegaraan : "ID"};${
            item?.issuingpassport ? item?.issuingpassport : "ID"
          };${item?.expireddate ? item?.expireddate : ""};;ID`
        );
      }); //kok error jadinya

      data_adult.forEach((item) => {
        let date = new Date(item.birthdate);
        let dateString =
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "/" +
          date.getDate().toString().padStart(2, "0") +
          "/" +
          date.getFullYear();
        // end_adult.push(`ADT;${item.gender};${item.nama_depan.split(" ")[0].toLowerCase()};${item.nama_belakang.toLowerCase()};${dateString};${item.idNumber};::${item.nomor};::${item.nomor};;;;${item.email};KTP;ID;ID;;;;`);
        end_adult.push(
          `ADT;${
            item.gender
          };${item.nama_depan};${item.nama_belakang};${dateString};${
            item.idNumber
          };::${item.nomor};::${item.nomor};;;;${item.email};1;${
            item?.kewenegaraan ? item?.kewenegaraan : "ID"
          };${item?.issuingpassport ? item?.issuingpassport : "ID"};${
            item?.expireddate ? item?.expireddate : ""
          };${item?.issuingpassport ? item?.issuingpassport : "ID"};ID;`
        );
      });

      let seats = dataDetail.map((item, i) => item.seats[i]);

      const book = {
        airline: dataDetailForBooking.airline,
        departure: dataDetailForBooking.departure,
        arrival: dataDetailForBooking.arrival,
        departureDate: dataDetailForBooking.departureDate,
        returnDate: dataDetailForBooking.returnDate,
        adult: TotalAdult,
        child: TotalChild,
        infant: TotalInfant,
        flights: seats,
        buyer: "",
        passengers: {
          adults: end_adult,
          children: end_child,
          infants: end_infant,
        },
        token: token,
      };

      const bookingResponse = await axios.post(
        `${process.env.REACT_APP_HOST_API}/travel/flight/book`,
        book,
        {
          timeout: 3600000,
        }
      );

      if (bookingResponse.data.rc === "00") {

        const idtrx = bookingResponse.data.data.transactionId;
        const allowPayment = bookingResponse.data.data.is_allowed_pay;
        const data = {
          _DetailPassenger: {
            adults: data_adult,
            children: child[0],
            infants: infant[0],
          },
          _Bookingflight: bookingResponse.data.data
        }

        //set booking data
        dispatch(setDataBookPesawat(data));
        dispatch(setisOkBalance(allowPayment));

        //set data callback
        dispatch(callbackFetchData({ type: 'plane', id_transaksi:idtrx  }));
        setIsLoading(false);

        if (bookingResponse.data.callback === null) { //loloskan aja njir
          navigate({
            pathname: `/flight/payment`,
          });
        } else {
          navigate({
            pathname: `/flight/payment`,
          });
        }
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
    if (isInternational == 1) {
      const dayBook = dayjs(
        dataDetail[dataDetail.length - 1]?.departureDate
      ).add(1, "day");

      const twoYearsAgo = dayjs(dayBook).subtract(2, "year");
      const endOfDays = twoYearsAgo.subtract(1, "day");

      const currentDate = dayjs(dayBook).subtract(10, "day");

      return current && (current < endOfDays || current > currentDate);
    } else {
      const currentDay = dayjs().add(1, "day");

      const dayBookStart = dayjs(
        dataDetail[dataDetail.length - 1]?.departureDate
      ).add(1, "day");
      const twoYearsAgo = dayjs(dayBookStart).subtract(2, "year");
      const endOfDays = twoYearsAgo.subtract(1, "day");

      const currentDate = dayjs(currentDay).subtract(1, "day");

      return current && (current < endOfDays || current > currentDate);
    }
  };

  const disabledDateExpiredDate = (current) => {
    const lastDepartureDate = dayjs(
      dataDetail[dataDetail.length - 1]?.departureDate
    ).add(1, "day");
    const minDate = lastDepartureDate.add(6, "month");

    const maxDate = lastDepartureDate.add(10, "year");
    const maxDateMonth = maxDate.subtract(1, "month");
    const maxDateDays = maxDateMonth.subtract(2, "day");

    return current && (current < minDate || current > maxDateDays);
  };

  const disabledDateAdult = (current) => {
    const dayBook = dayjs(dataDetail[dataDetail.length - 1]?.departureDate).add(
      1,
      "day"
    );

    const TenYearsAgo = dayjs(dayBook).subtract(12, "year");

    // const endOfMonth = TenYearsAgo.endOf("month");
    // const endOfDays = endOfMonth.subtract(1, "day");

    return current && current > TenYearsAgo;
  };

  const disabledDateChild = (current) => {
    const dayBook = dayjs(dataDetail[dataDetail.length - 1]?.departureDate).add(
      1,
      "day"
    );
    const twoYearsAgo = dayjs(dayBook).subtract(2, "year");
    const TenYearsAgo = dayjs(dayBook).subtract(12, "year");

    // const startOfMonth = TenYearsAgo.endOf("month");
    // const endOfDays = startOfMonth.subtract(1, "day");
    // const endOfMonth = twoYearsAgo.endOf("month");
    // const endOfMonth = twoYearsAgo.subtract(1, "day");
    const startOfMonth = TenYearsAgo.subtract(1, "day");

    return current && (current < startOfMonth || current > twoYearsAgo);
  };

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

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
            {/* modal for  */}
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

            {/* modal for list penumpang */}
            <Modal
            open={isModalOpenListPenumpang} 
            onOk={handleOkListPenumpang} 
            onCancel={handleCancelListPenumpang}
            maskClosable={false}
            footer={false}
            >
              {
                loadingExistingPenumpang  && (
                  <>
                  <Skeleton width={'100%'} height={12} />
                  <Skeleton width={'80%'} height={12} />
                  <Skeleton width={'100%'} height={12} />
                  <Skeleton width={'80%'} height={12} />
                  <Skeleton width={'100%'} height={12} />
                  </>
                )
              }
              {
                loadingExistingPenumpang == false && (
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
                        style:{cursor: 'pointer'}
                      })}
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
                                      <div>{record.hp && record.hp !== '' ? record.hp : '-'}</div>
                                    </p>
                                  </div>
                                  <div className="my-2">
                                    <p style={{ margin: 0 }}  className="text-xs">
                                      <strong>Tanggal Lahir:</strong> {dayjs(record.ttl).format("DD/MM/YYYY")}
                                    </p>
                                  </div>
                                </div>
                            </>
                          ),
                        }}
                        columns={columns}
                        dataSource={existingPenumpang}
                        pagination={{pageSize:5}}
                      />
                      </div>
                 </>
                )
              }
            </Modal>
            {/* header  flow */}
            <div className="flex justify-start jalur-payment-booking text-xs xl:text-sm space-x-4 items-center">
              <div className="hidden xl:flex space-x-2 items-center">
                <AiOutlineClockCircle size={20} className="" />
                <div className="hidden xl:flex font-medium ">
                  Detail pesanan
                </div>
              </div>
              <div>
                <MdHorizontalRule
                  size={20}
                  className="hidden xl:flex "
                />
              </div>
              <div className="hidden xl:flex space-x-2 items-center">
                <RxCrossCircled size={20} className="" />
                <div className="hidden xl:block ">
                  Pembayaran tiket
                </div>
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
            {/* sidebar mobile plane*/}

            {isLoadingPage === true ? (
              <>
                <BookingLoading
                  TotalAdult={TotalAdult}
                  TotalChild={TotalChild}
                  TotalInfant={TotalInfant}
                />
              </>
            ) : (
              <>
                {dataDetail &&
                  dataDetail.map((dataDetail) => (
                    <div className="mt-0 mb-4 md:mb-0 md:mt-8 xl:mt-0 block xl:hidden border-b">
                      <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                        <div className="text-black text-sm font-medium ">
                          Keberangkatan Pesawat
                        </div>
                        <small className="text-xs text-black">
                          {tanggalParse(dataDetail.departureDate)}
                        </small>
                      </div>
                      <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
                        <div className="text-xs text-black">
                          <div>{dataDetail.departureName}</div>
                          <div>({dataDetail.departure})</div>
                        </div>
                        <div className="rounded-full p-1 bg-blue-500 ">
                          <IoArrowForwardOutline
                            className="text-white"
                            size={18}
                          />
                        </div>
                        <div className="text-xs text-black">
                          <div>{dataDetail.arrivalName}</div>
                          <div>({dataDetail.arrival})</div>
                        </div>
                      </div>

                      <div className="p-2 -mt-2 mb-2  pl-8 relative px-4 text-black">
                        <div className="flex items-center space-x-2">
                          <img
                            src={dataDetail.airlineIcon}
                            width={50}
                            alt="icon.png"
                          />
                          <div className="text-black text-xs font-medium ">
                            {dataDetail.airlineName} ({dataDetail.airline})
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pl-12 mb-4">
                        <ol class="relative border-l-2 border-dotted border-gray-800 ">
                          <li class="mb-10 ml-4 text-sm">
                            <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800  "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-xs leading-none text-black ">
                                {dataDetail.departureTime}
                              </time>
                              <div className="-mt-2">
                                <div class="text-left text-sm text-black ">
                                  {dataDetail.departureName}
                                </div>
                                <p class="text-left text-xs text-black ">
                                  ({dataDetail.departure})
                                </p>
                              </div>
                            </div>
                          </li>
                          <li class="ml-4 text-sm mt-10">
                            <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white  "></div>
                            <div className="flex space-x-12">
                              <time class="mb-1 text-xs leading-none text-black ">
                                {dataDetail.arrivalTime}
                              </time>
                              <div className="-mt-2">
                                <div class="text-left text-sm text-black ">
                                  {dataDetail.arrivalName}
                                </div>
                                <p class="text-left text-xs text-black ">
                                  ({dataDetail.arrival})
                                </p>
                              </div>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  ))}
                  {/* for mobile */}
                  <div className="flex xl:hidden justify-between items-center mb-4 border-b px-2 py-4">
                    <div className="flex space-x-2 items-center text-gry-400 text-sm ">
                      <IoPricetagOutline className="text-gray-500" size={18} />
                      <div className="text-gray-500">Harga Fare</div>
                  </div>
                  <small className="text-sm text-blue-500 font-bold">
                    Rp. {toRupiah(dataDetailForBooking.priceTotal)}
                  </small>
                </div>

                <div className="w-full mb-24 block xl:flex xl:space-x-10">
                  {/* detail passengger Pesawat*/}
                  <Form
                    form={form}
                    ref={formRef}
                    onFinish={showModal}
                    onFinishFailed={onFinishFailed}
                    className="block w-full  mt-8 mb-4 xl:mt-12"
                  >
                    <div className="w-full mt-4 xl:mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-2 gap-12">
                      <div className="">
                        <div className="p-2 xl:p-8 form block xl:flex xl:space-x-2">
                          {/* mobile & desktop Nama*/}
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
                                <div className="mt-2 text-gray-400">
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
                              <div className="mt-2 text-gray-400">
                                <small>Contoh: (+62) 812345678</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {adult[0].map((e, i) => (
                      <>
                        <div>
                          <div className="Booking mt-8 mb-0 xl:mb-4 xl:mt-12 ml-2 xl:ml-0">
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
                                            showModalListPenumpang(i, "adult")
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
                                            showModalListPenumpang(i, "adult")
                                          }
                                          className="cursor-pointer"
                                        >
                                          <CiBoxList size={22} />
                                        </div>
                                      </Popover>
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
                                        format={"YYYY/MM/DD"}
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
                                      Contoh: yyyy/mm/dd
                                    </small>
                                  </div>
                                  <div className="w-full">
                                    <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                      <div className="text-black text-sm mb-2">
                                        {isInternational == 1
                                          ? "No. Passport"
                                          : "No. Ktp"}
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

                              {/* passport */}
                              {isInternational === 1 && (
                                <>
                                  {/* passport */}
                                  <div className="mt-8 mb-8 xl:mt-16">
                                    <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Kewarganegaraan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kewenegaraanAdult${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Kewenegaraan.",
                                            },
                                          ]}
                                        >
                                          <Select
                                            options={countries}
                                            value={e.kewenegaraan}
                                            onChange={handleAdultsubCatagoryChange(
                                              i,
                                              "kewenegaraan"
                                            )}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: indonesia
                                        </small>
                                      </div>
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Issuing Passport
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`issuingpassportAdult${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Issuing Passport.",
                                            },
                                          ]}
                                        >
                                          <Select
                                            options={countries}
                                            value={e.issuingpassport}
                                            onChange={handleAdultsubCatagoryChange(
                                              i,
                                              "issuingpassport"
                                            )}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: indonesia
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                  {/* passport */}
                                  <div className="mt-8 mb-8 xl:mt-16">
                                    <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Expired Date
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`expiredDateAdult${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Expired Date.",
                                            },
                                          ]}
                                        >
                                          <DatePicker
                                            size="large"
                                            className="w-full"
                                            value={dayjs(
                                              e.expireddate,
                                              "YYYY/MM/DD"
                                            )}
                                            format={"YYYY/MM/DD"}
                                            onChange={handleAdultsubCatagoryChange(
                                              i,
                                              "expireddate"
                                            )}
                                            disabledDate={
                                              disabledDateExpiredDate
                                            }
                                            open={isDatePickerOpenAdultExpiredDate[i]} // Pass the state to the open prop
                                            // inputReadOnly={true}
                                            onOpenChange={(status) => {
                                              const newOpenState = [
                                                ...isDatePickerOpenAdultExpiredDate,
                                              ]; // Create a copy of the array
                                              newOpenState[i] = status; // Update the state for the specific index
                                              setIsDatePickerOpenAdultExpiredDate(
                                                newOpenState
                                              ); // Set the updated array as the new state
                                            }}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: yyyy/mm/dd
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
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
                            <div className="w-full mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-1">
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
                                            showModalListPenumpang(i, "child")
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
                                            showModalListPenumpang(i, "child")
                                          }
                                          className="cursor-pointer"
                                        >
                                          <CiBoxList size={22} />
                                        </div>
                                      </Popover>
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
                                        format={"YYYY/MM/DD"}
                                        onChange={handleChildsubCatagoryChange(
                                          i,
                                          "birthdate"
                                        )}
                                        disabledDate={disabledDateChild}
                                        open={isDatePickerOpenChild[i]} // Pass the state to the open prop
                                        // inputReadOnly={true}
                                        onOpenChange={(status) => {
                                          const newOpenState = [
                                            ...isDatePickerOpenChild,
                                          ]; // Create a copy of the array
                                          newOpenState[i] = status; // Update the state for the specific index
                                          setIsDatePickerOpenChild(
                                            newOpenState
                                          ); // Set the updated array as the new state
                                        }}
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: yyyy/mm/dd
                                    </small>
                                  </div>
                                  <div className="w-full">
                                    <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                      <div className="text-black text-sm mb-2">
                                        {isInternational == 1
                                          ? "No. Passport"
                                          : "No. Ktp"}
                                      </div>
                                      <Form.Item
                                        required={true}
                                        hasFeedback
                                        name={`noktpChild${i}`}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              isInternational == 1
                                                ? "Passport tidak boleh kosong."
                                                : "NIK tidak boleh kosong.",
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
                                          onChange={handleChildsubCatagoryChange(
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
                              {/* passport */}
                              {isInternational === 1 && (
                                <>
                                  {/* passport */}
                                  <div className="mt-8 mb-8 xl:mt-16">
                                    <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Kewarganegaraan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kewenegaraanChild${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Kewenegaraan.",
                                            },
                                          ]}
                                        >
                                          <Select
                                            options={countries}
                                            value={e.kewenegaraan}
                                            onChange={handleChildsubCatagoryChange(
                                              i,
                                              "kewenegaraan"
                                            )}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: indonesia
                                        </small>
                                      </div>
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Issuing Passport
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`issuingpassportChild${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Issuing Passport.",
                                            },
                                          ]}
                                        >
                                          <Select
                                            options={countries}
                                            value={e.issuingpassport}
                                            onChange={handleChildsubCatagoryChange(
                                              i,
                                              "issuingpassport"
                                            )}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: indonesia
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                  {/* passport */}
                                  <div className="mt-8 mb-8 xl:mt-16">
                                    <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Expired Date
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`expiredDateChild${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Expired Date.",
                                            },
                                          ]}
                                        >
                                          <DatePicker
                                            size="large"
                                            className="w-full"
                                            value={dayjs(
                                              e.expireddate,
                                              "YYYY/MM/DD"
                                            )}
                                            format={"YYYY/MM/DD"}
                                            onChange={handleChildsubCatagoryChange(
                                              i,
                                              "expireddate"
                                            )}
                                            disabledDate={
                                              disabledDateExpiredDate
                                            }
                                            open={isDatePickerOpenChildExpiredDate[i]} // Pass the state to the open prop
                                            // inputReadOnly={true}
                                            onOpenChange={(status) => {
                                              const newOpenState = [
                                                ...isDatePickerOpenChildExpiredDate,
                                              ]; // Create a copy of the array
                                              newOpenState[i] = status; // Update the state for the specific index
                                              setIsDatePickerOpenChildExpiredDate(
                                                newOpenState
                                              ); // Set the updated array as the new state
                                            }}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: yyyy/mm/dd
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
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
                            <div className="w-full mt-0 border-b xl:border xl:border-gray-200 xl:shadow-sm col-span-1 xl:col-span-1">
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
                                            showModalListPenumpang(i, "infant")
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
                                            showModalListPenumpang(i, "infant")
                                          }
                                          className="cursor-pointer"
                                        >
                                          <CiBoxList size={22} />
                                        </div>
                                      </Popover>
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
                                        format={"YYYY/MM/DD"}
                                        onChange={handleInfantsubCatagoryChange(
                                          i,
                                          "birthdate"
                                        )}
                                        disabledDate={disabledDate}
                                        open={isDatePickerOpenInfantExpiredDate[i]} // Pass the state to the open prop
                                        // inputReadOnly={true}
                                        onOpenChange={(status) => {
                                          const newOpenState = [
                                            ...isDatePickerOpenInfantExpiredDate,
                                          ]; // Create a copy of the array
                                          newOpenState[i] = status; // Update the state for the specific index
                                          setIsDatePickerOpenInfantExpiredDate(
                                            newOpenState
                                          ); // Set the updated array as the new state
                                        }}
                                      />
                                    </Form.Item>
                                    <small className="block -mt-4 text-gray-400">
                                      Contoh: yyyy/mm/dd
                                    </small>
                                  </div>
                                  <div className="w-full">
                                    <div className="px-4 xl:px-0 w-full block mt-4 xl:mt-0">
                                      <div className="text-black text-sm mb-2">
                                        {isInternational == 1
                                          ? "No. Passport"
                                          : "No. Ktp"}
                                      </div>
                                      <Form.Item
                                        required={true}
                                        hasFeedback
                                        name={`infantktp${i}`}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              isInternational == 1
                                                ? "Passport tidak boleh kosong."
                                                : "NIK tidak boleh kosong.",
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
                                          onChange={handleInfantsubCatagoryChange(
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

                              {/* passport */}
                              {isInternational === 1 && (
                                <>
                                  {/* passport */}
                                  <div className="mt-8 mb-8 xl:mt-16">
                                    <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Kewarganegaraan
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`kewenegaraanInfant${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Kewenegaraan.",
                                            },
                                          ]}
                                        >
                                          <Select
                                            options={countries}
                                            value={e.kewenegaraan}
                                            onChange={handleInfantsubCatagoryChange(
                                              i,
                                              "kewenegaraan"
                                            )}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: indonesia
                                        </small>
                                      </div>
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Issuing Passport
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`issuingpassportInfant${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Issuing Passport.",
                                            },
                                          ]}
                                        >
                                          <Select
                                            options={countries}
                                            value={e.issuingpassport}
                                            onChange={handleInfantsubCatagoryChange(
                                              i,
                                              "issuingpassport"
                                            )}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: indonesia
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                  {/* passport */}
                                  <div className="mt-8 mb-8 xl:mt-16">
                                    <div className="block py-0 px-0 xl:px-8 xl:grid xl:grid-cols-2 gap-2 mt-0 xl:-mt-6">
                                      <div className="w-full px-4 xl:px-0">
                                        <div className="xl:px-0 w-full text-black text-sm mb-2">
                                          Expired Date
                                        </div>
                                        <Form.Item
                                          required={true}
                                          hasFeedback
                                          name={`expiredDateInfant${i}`}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Harap input Expired Date.",
                                            },
                                          ]}
                                        >
                                          <DatePicker
                                            size="large"
                                            className="w-full"
                                            value={dayjs(
                                              e.expireddate,
                                              "YYYY/MM/DD"
                                            )}
                                            format={"YYYY/MM/DD"}
                                            onChange={handleInfantsubCatagoryChange(
                                              i,
                                              "expireddate"
                                            )}
                                            disabledDate={
                                              disabledDateExpiredDate
                                            }
                                            open={isDatePickerOpenInfant[i]} // Pass the state to the open prop
                                            // inputReadOnly={true}
                                            onOpenChange={(status) => {
                                              const newOpenState = [
                                                ...isDatePickerOpenInfant,
                                              ]; // Create a copy of the array
                                              newOpenState[i] = status; // Update the state for the specific index
                                              setIsDatePickerOpenInfant(
                                                newOpenState
                                              ); // Set the updated array as the new state
                                            }}
                                          />
                                        </Form.Item>
                                        <small className="block -mt-4 text-gray-400">
                                          Contoh: yyyy/mm/dd
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    ))}

                    <div className="w-full xl:w-auto flex justify-end mr-2 mt-8">
                      <Button
                        htmlType="submit"
                        size="large"
                        key="submit"
                        type="primary"
                        className="bg-blue-500 mx-2 font-medium w-full xl:w-auto"
                      >
                        Booking Sekarang
                      </Button>
                    </div>
                  </Form>

                  {/* sidebra desktop*/}
                  <div className="w-full md:w-2/3 2xl:w-1/2 md:mt-8">
                    {dataDetail &&
                      dataDetail.map((dataDetail) => (
                        <>
                          <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm mb-4">
                            <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
                              <div className="text-black text-sm font-medium ">
                                Keberangkatan Pesawat
                              </div>
                              <small className="text-xs text-black">
                                {tanggalParse(dataDetail.departureDate)}
                              </small>
                            </div>
                            <div className="px-4 p-8 flex justify-between space-x-8 mx-4 items-center">
                              <div className="text-xs font-medium  text-black">
                                <div>{dataDetail.departureName}</div>
                                <div>({dataDetail.departure})</div>
                              </div>
                              <div className="rounded-full p-1 bg-blue-500 ">
                                <IoArrowForwardOutline
                                  className="text-white"
                                  size={18}
                                />
                              </div>
                              <div className="text-xs font-medium  text-black">
                                <div>{dataDetail.arrivalName}</div>
                                <div>({dataDetail.arrival})</div>
                              </div>
                            </div>

                            <div className="p-2 -mt-2 mb-2  pl-8 relative px-4 text-black">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={dataDetail.airlineIcon}
                                  width={50}
                                  alt="icon.png"
                                />
                                <div className="text-black text-xs font-medium ">
                                  {dataDetail.airlineName} ({dataDetail.airline}
                                  )
                                </div>
                              </div>
                            </div>
                            <div className="p-4 pl-8 pt-4 px-6 mb-4">
                              <ol class="relative border-l-2 border-dotted border-gray-800 ">
                                <li class="mb-10 ml-4 text-sm">
                                  <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-800  "></div>
                                  <div className="flex space-x-12">
                                    <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                      {dataDetail.departureTime}
                                    </time>
                                    <div className="-mt-2">
                                      <h3 class="text-left text-xs font-medium  text-black ">
                                        {dataDetail.departureName}
                                      </h3>
                                      <p class="text-left text-xs font-medium  text-black ">
                                        ({dataDetail.departure})
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                <li class="ml-4 text-sm mt-10">
                                  <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white  "></div>
                                  <div className="flex space-x-12">
                                    <time class="mb-1 text-xs font-medium  leading-none text-black ">
                                      {dataDetail.arrivalTime}
                                    </time>
                                    <div className="-mt-2">
                                      <h3 class="text-left text-xs font-medium  text-black ">
                                        {dataDetail.arrivalName}
                                      </h3>
                                      <p class="text-left text-xs font-medium  text-black ">
                                        ({dataDetail.arrival})
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              </ol>
                            </div>
                          </div>
                        </>
                      ))}
                      {/* for desktop */}
                      <div className="hidden xl:flex justify-between items-center mb-4 px-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-black-500 border-b-gray-100">
                        <div className="flex space-x-2 items-center text-gry-400 text-sm ">
                          <IoPricetagOutline className="text-gray-500" size={18} />
                          <div className="text-gray-500">Harga Fare</div>
                      </div>
                      <small className="text-lg text-blue-500 font-bold">
                        Rp. {toRupiah(dataDetailForBooking.priceTotal)}
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
