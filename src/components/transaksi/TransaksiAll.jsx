import React, { useState, useEffect, useRef } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BsArrowRightShort, BsFilterCircle, BsSearch } from "react-icons/bs";
import { PiTrainLight } from "react-icons/pi";
import axios from "axios";
import { Placeholder } from "rsuite";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Button, Modal, message } from "antd";
import { toRupiah } from "../../helpers/rupiah";
import { remainingTime } from "../../helpers/date";
import Page500 from "../components/500";
import { Input } from "@mui/material";
import { CiFilter } from "react-icons/ci";
import ListKereta from "./components/ListKereta";
import SwipeableEdgeDrawer from "./components/Filter"
import ListPesawat from "./components/ListPesawat";
import ListPelni from "./components/ListPelni";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

const harcodeDataPayKai = {
  id_transaksi: 293822043,
  tanggal_transaksi: "Jumat, 22 Maret 2024",
  kode_booking: "H1E74EW",
  origin: "PASAR SENEN",
  destination: "SURABAYA GUBENG",
  tanggal_keberangkatan: "20240325",
  hari_keberangkatan: "Senin",
  jam_keberangkatan: "1100",
  tanggal_kedatangan: "",
  hari_kedatangan: "",
  jam_kedatangan: "0013",
  kode_kereta: "EKO-1/3B",
  nama_kereta: "GAYA BARU MALAM SELATAN (106)",
  classes: "EKO",
  penumpang: [
    {
      nama: "Komang J",
      kursi: "EKO-1/3B",
      telepon: "08981231333",
      nomor_identitas: "3313112410990051",
    },
  ],
  nominal: "340000",
  nominal_admin: "7500",
  komisi: 0,
  expiredDate: dayjs().add(1, "hours"),
  status: {
    id_transaksi: 293822043,
    bookCode: "H1E74EW",
    Produk: "Kereta Api",
    Status: "Payment",
    status_booking: "Sukses",
    status_payment: "Sukses",
  },
};


const harcodeDataPayPesawat = {
  id_transaksi: 293388411,
  tanggal_transaksi: "Jum'at, 22 Maret 2026",
  kode_booking: "5GVS11",
  origin: "Jakarta (CGK)",
  destination: "Surabaya (SUB)",
  tanggal_keberangkatan: "18 April 2024",
  hari_keberangkatan: "Kamis",
  jam_keberangkatan: "08:40",
  tanggal_kedatangan: "18 April 2024",
  hari_kedatangan: "Kamis",
  jam_kedatangan: "11:15",
  id_produk: "TPGA",
  kode_maskapai: "GA304",
  nama_maskapai: "Garuda Indonesia",
  penumpang: [
    {
      status: "DEWASA",
      nama: "fathoni waseso jati",
      title: "MR",
      nik: "3313112410990022",
      tgl_lahir: "03/29/2001",
      no_hp: "62898537912",
    },
  ],
  url_etiket:
    "https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=293388431",
  url_struk:
    "https://rajabiller.fastpay.co.id/travel/app/generate_struk?id_transaksi=293388431",
  airlineIcon:
    "https://storage.googleapis.com/static-sbf/fastravel/assets/images/flighticons/GA.png",
  subClass: "S",
  nominal: "1188020",
  nominal_admin: "0",
  komisi: 29680,
  duration: "2j35m",
  expiredDate: dayjs().add(1, "hours"),
  status: {
    id_transaksi: 293388466,
    bookCode: "5GVSXX",
    Produk: "Garuda Indonesia",
    Status: "Payment",
    status_booking: "Sukses",
    status_payment: "Success",
  },
};

const harcodeDataPayPelni = {
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


export default function TransaksiAll({ path }) {

  const [searchParams, setSearchParams] = useSearchParams();
    const hardcode_pay = searchParams.get("q");
    const [dataTransport, setDataTransport] = useState({
        kereta: [],
        pesawat: [],
        pelni: []
    });

	//drawer filter
	const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState("Semua"); // Default: Semua
  const [filteredData, setFilteredData] = useState({
    kereta: [],
    pesawat: [],
    pelni: [],
  });


	const toggleDrawer = (newOpen) => () => setOpen(newOpen);

    // State untuk loading & error
    const [state, setState] = useState({
        isLoading: false,
        err: false,
        errPage: false,
    });

    // State untuk waktu tersisa
    const [remainingTimes, setRemainingTimes] = useState({
        kereta: [],
        pesawat: [],
        pelni: []
    });

    // Refs untuk interval
    const intervalRefs = {
        kereta: useRef(null),
        pesawat: useRef(null),
        pelni: useRef(null)
    };

	const token = JSON.parse(
		localStorage.getItem(process.env.REACT_APP_SECTRET_LOGIN_API)
	);
	
	useEffect(() => {
		if (token === undefined || token === null) {
            setState(prev => ({ ...prev, err: true }));
		}
	}, [token]);

    // Notifikasi
    const [messageApi, contextHolder] = message.useMessage();
    
    const success = () => {
        messageApi.open({
            type: "success",
            content: "Pembayaran anda berhasil, silahkan check tiket anda di menu transaksi.",
            duration: 7
        });
    };

    const gagal = (rd) => {
        messageApi.open({
            type: "error",
            content: `Failed, ${rd.charAt(0).toUpperCase() + rd.slice(1).toLowerCase()}`,
            duration: 7
        });
    };

    // Fetch transaksi
    useEffect(() => {
        const getTransaksiList = async () => {
            setState(prev => ({ ...prev, isLoading: true }));

            try {
                const { data } = await axios.post(
                    `${process.env.REACT_APP_HOST_API}/travel/app/transaction_book_list/all`,
                    { token, jenis:'transaksi' }
                );

                // Cek error pada response
                const errStatus = ["kereta", "pesawat", "pelni"].some(type =>
                    data[type]?.rc !== "00" && data[type]?.rc !== "33"
                );

                if (errStatus) setState(prev => ({ ...prev, errPage: true }));

                setDataTransport({
                    kereta: hardcode_pay === "2" ? [harcodeDataPayKai, ...data.kereta?.data] : data.kereta?.data || [],
                    pesawat: hardcode_pay === "2" ? [harcodeDataPayPesawat, ...data.pesawat?.data] : data.pesawat?.data || [],
                    pelni: hardcode_pay === "2" ? [harcodeDataPayPelni, ...data.pelni?.data] : data.pelni?.data || [],
                });

                setFilteredData({
                  kereta: hardcode_pay === "2" ? [harcodeDataPayKai, ...data.kereta?.data] : data.kereta?.data || [],
                  pesawat: hardcode_pay === "2" ? [harcodeDataPayPesawat, ...data.pesawat?.data] : data.pesawat?.data || [],
                  pelni: hardcode_pay === "2" ? [harcodeDataPayPelni, ...data.pelni?.data] : data.pelni?.data || [],
                }); // Default: Semua data ditampilkan

            } catch (error) {
                setState(prev => ({ ...prev, errPage: true }));
            } finally {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        getTransaksiList();
    }, []);


	useEffect(() => {
		if (dataTransport['kereta'].length > 0) {
		  const y = [];
	
		  dataTransport['kereta'].forEach((x, i) => {
			const res = x?.expiredDate;
			y.push(res);
		  });
	
		  setRemainingTimes(
			prev => ({
				...prev,
				kereta:y
			})
		  );
		}
	  }, [dataTransport]);


	  useEffect(() => {
		if (dataTransport['pesawat'].length > 0) {
		  const y = [];
	
		  dataTransport['pesawat'].forEach((x, i) => {
			const res = x?.expiredDate;
			y.push(res);
		  });
	
		  setRemainingTimes(
			prev => ({
				...prev,
				pesawat:y
			})
		  );
		}
	  }, [dataTransport]);


	  useEffect(() => {
		if (dataTransport['pelni'].length > 0) {
		  const y = [];
	
		  dataTransport['pelni'].forEach((x, i) => {
			const res = x?.expiredDate;
			y.push(res);
		  });
	
		  setRemainingTimes(
			prev => ({
				...prev,
				pelni:y
			})
		  );
		}
	  }, [dataTransport]);

	  useEffect(() => {
		const remainingFetch = (type) => {
			if (dataTransport[type]?.length > 0) {
				const y = [];
				for(const params of dataTransport[type]){
					const res = params?.expiredDate;
					y.push(res);
				}
	
				setRemainingTimes((prev) => ({
					...prev,
					[type]: y,
				}));
			}
		};
	
		["kereta", "pesawat", "pelni"].forEach(remainingFetch);
	}, [dataTransport]);
	
    // Update remaining time
    useEffect(() => {
        const updateRemainingTimes = (type) => {
            if (dataTransport[type].length > 0) {
                intervalRefs[type].current = setInterval(() => {
                    setRemainingTimes(prev => ({
                        ...prev,
                        [type]: prev[type].map(time => {
                            const targetTime = new Date(time).getTime();
                            const now = new Date().getTime();
                            return targetTime > now ? targetTime - 1000 : 0;
                        })
                    }));
                }, 1000);
            }
        };

        ["kereta", "pesawat", "pelni"].forEach(type => {
            updateRemainingTimes(type);
        });

        return () => {
            ["kereta", "pesawat", "pelni"].forEach(type => {
                if (intervalRefs[type].current) {
                    clearInterval(intervalRefs[type].current);
                }
            });
        };
    }, [dataTransport]);


    useEffect(() => {
      let newFilteredData = { kereta: [], pesawat: [], pelni: [] };
  
      if (selectedValue === "Semua") {
        newFilteredData = { ...dataTransport };
      } else {
        newFilteredData = {
          kereta: selectedValue === "kereta" ? dataTransport.kereta : [],
          pesawat: selectedValue === "pesawat" ? dataTransport.pesawat : [],
          pelni: selectedValue === "pelni" ? dataTransport.pelni : [],
        };
      }
  
      setFilteredData(newFilteredData);
    }, [selectedValue, dataTransport]);


  const [searchQuery, setSearchQuery] = useState("");

     // Handle perubahan input pencarian
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredKereta = filteredData.kereta.filter(
    (item) =>
      item.origin.toLowerCase().includes(searchQuery) ||
      item.destination.toLowerCase().includes(searchQuery)
  );

  const filteredPesawat = filteredData.pesawat.filter(
    (item) =>
      item.origin.toLowerCase().includes(searchQuery) ||
      item.destination.toLowerCase().includes(searchQuery)
  );

  const filteredPelni = filteredData.pelni.filter(
    (item) =>
      item.origin.toLowerCase().includes(searchQuery) ||
      item.destination.toLowerCase().includes(searchQuery)
  );


  const handleFilterChange = (filter) => {
    setSelectedValue(filter);

    if (filter === "Semua") {
      setFilteredData(dataTransport);
    } else {
      setFilteredData({
        kereta: filter === "kereta" ? dataTransport.kereta : [],
        pesawat: filter === "pesawat" ? dataTransport.pesawat : [],
        pelni: filter === "pelni" ? dataTransport.pelni : [],
      });
    }
  };


  return (
    <>
      {/* meessage bayar */}
      {contextHolder}
      <div className="">
        {state.err === true ? (
          <>
            <Page500 />
          </>
        ) : state.errPage === true ? (
          <>
            <Page500 />
          </>
        ) : (
          <>
            <div className="mt-2">
              <div className="w-full">
				{/* headear */}
				<div className="w-full grid grid-cols-12 gap-1 items-center">
					
					{/* Ikon di sebelah kanan dengan ukuran besar */}
          <div className="col-span-10">
                    <form className="flex items-center">
                      <div className="relative w-full rounded-2xl">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <BsSearch className="text-blue-500" size={20} />
                        </div>
                        <input
                          type="text"
                          className="bg-gray-100 border rounded-2xl border-gray-100 text-sm focus:ring-gray-100 focus:border-gray-100 outline-none block w-full pl-10 p-2.5"
                          placeholder="Cari berdasarkan asal atau tujuan"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="col-span-2 flex justify-end cursor-pointer">
						<CiFilter 
						onClick={toggleDrawer(true)}
						size={24} className="w-6 h-6 text-gray-500" />
					</div>
				</div>

              </div>
            </div>

            {state.isLoading === false ? (
				<>
        {(filteredKereta.length === 0 &&  filteredPesawat.length === 0 && filteredPelni.length === 0) && (
          <>
            <div className="flex justify-center items-center mt-12">
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
                Maaf, History Data Transaksi tidak ditemukan. Lakukan
                Booking terlebih dahulu.
              </div>
            </div>
          </div>
          </>
        )}
					<ListKereta 
					data={filteredKereta} 
					remainingKereta={remainingTimes.kereta}
					open={open}
					setOpen={setOpen}
					toggleDrawer={toggleDrawer}
					setSelectedValue={setSelectedValue}
					selectedValue={selectedValue}
					/>
          <ListPesawat
					data={filteredPesawat} 
					remainingPesawat={remainingTimes.pesawat}
					open={open}
					setOpen={setOpen}
					toggleDrawer={toggleDrawer}
					setSelectedValue={setSelectedValue}
					selectedValue={selectedValue}
					/>
          <ListPelni
					data={filteredPelni} 
					remainingPelni={remainingTimes.pelni}
					open={open}
					setOpen={setOpen}
					toggleDrawer={toggleDrawer}
					setSelectedValue={setSelectedValue}
					selectedValue={selectedValue}
					/>
          <SwipeableEdgeDrawer
          open={open}
          toggleDrawer={toggleDrawer} 
          selectedValue={selectedValue} 
          setSelectedValue={setSelectedValue} 
		  />
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
