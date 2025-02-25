import {
	Alert,
	Box,
	SwipeableDrawer,
  } from "@mui/material";
  import * as React from "react";
  import { BsFillTrainFrontFill } from "react-icons/bs";
  import { formatDate, remainingTimeAllBook } from "../../../helpers/date";
  import DetailKereta from "./DetailKereta";
  
  export default function ListKereta({ data, remainingKereta }) {
	// State untuk mengontrol drawer detail per kereta
	const [openDetailIndex, setOpenDetailIndex] = React.useState(null);
  
	const toggleDrawerDetail = (index) => () => {
	  setOpenDetailIndex(openDetailIndex === index ? null : index);
	};
  
	return (
	  <>
		{data.map((e, i) => (
		  <div
			key={i}
			onClick={toggleDrawerDetail(i)}
			className="w-full text-gray-800 mt-8 cursor-pointer"
		  >
			<div className="m-2 border border-gray-200 rounded-t-2xl rounded-b-[30px]">
			  {/* Header */}
			  <div className="header px-6 py-4">
				<div className="flex items-center space-x-2">
				 <img src="/kai.png" width={25} />
				  <h1 className="text-sm font-bold mt-2">{e.nama_kereta}</h1>
				</div>
				<div className="flex items-center space-x-2 mt-2">
				  <small className="text-xs">
					{e.classes === "EKS"
					  ? "Eksekutif"
					  : e.classes === "EKO"
					  ? "Ekonomi"
					  : "Bisnis"}{" "}
					{e.kode_kereta.substring(4, 5)}
				  </small>
				  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
				  <small className="text-xs text-gray-500">
					{e.tanggal_transaksi}
				  </small>
				</div>
			  </div>
  
			  {/* Body */}
			  <div className="grid grid-cols-12 gap-1 mb-4 ml-2">
				<div className="col my-4">
				  <div className="mx-3 my-1 block w-2.5 h-2.5 rounded-full border border-gray-500"></div>
				  <div className="mx-4 h-12 border-l-2 border-gray-400 border-dashed"></div>
				  <div className="mx-3 my-1 block w-2.5 h-2.5 rounded-full border border-blue-500 bg-blue-500"></div>
				</div>
				<div className="col-span-10">
				  <div className="flex space-x-4">
					<div className="my-4 text-sm font-bold text-gray-800">
					  {e.jam_keberangkatan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}
					</div>
					<div className="my-3">
					  <div className="text-xs text-gray-800 ">{e.origin}</div>
					  <small className="text-xs text-gray-800">
						{formatDate(e.tanggal_keberangkatan)}
					  </small>
					</div>
				  </div>
				  <div className="flex space-x-4">
					<div className="my-3 text-sm font-bold text-gray-800">
					  {e.jam_kedatangan.toString().padStart(4, "0").replace(/(\d{2})(\d{2})/, "$1:$2")}
					</div>
					<div className="my-2">
					  <div className="text-xs text-gray-800 ">{e.destination}</div>
					  <small className="text-xs text-gray-800">
						{formatDate(e.tanggal_kedatangan)}
					  </small>
					</div>
				  </div>
				</div>
			  </div>
  
			  {/* Footer */}
			  <Box
			  className="text-indigo-500 bg-indigo-100"
				sx={{
				  textAlign: "center",
				  paddingY: "16px",
				  borderBottomLeftRadius: "30px",
				  borderBottomRightRadius: "30px",
				  cursor: "pointer",
				}}
			  >
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				  <div className="flex items-center space-x-2 justify-center w-full px-4 font-semibold">
					<div className="">Sisa Waktu Pembayaran</div>
					<div className="">
					  {remainingKereta[i] !== undefined && remainingKereta[i] > 0
						? remainingTimeAllBook(remainingKereta[i])
						: "Habis"}
					</div>
				  </div>
				</Box>
			  </Box>
			</div>
  
			{/* Drawer Detail Kereta */}
			<DetailKereta openDetail={openDetailIndex === i} toggleDrawerDetail={toggleDrawerDetail(i)} data={e} />
		  </div>
		))}
	  </>
	);
  }
  