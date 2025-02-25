import {
	Alert,
	Box,
	SwipeableDrawer,
} from "@mui/material";
import * as React from "react";
import { BsFillTrainFrontFill } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import DetailKereta from "./DetailKereta";
import { PiDownloadSimple } from "react-icons/pi";

export default function ListKereta({ data }) {
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
				<div className="m-2 border border-gray-200 rounded-t-2xl rounded-b-[10px]">
				{/* Header */}
				<Box
					className="px-5 py-2 border-b"
					sx={{
					borderTopLeftRadius: "10px",
					borderTopRightRadius: "10px",
					cursor: "pointer",
					}}
				>
					<div className="flex justify-between items-center text-xs py-2">
					<div>
						<div>
						ID Transaksi: <span className="font-bold">{e.id_transaksi}</span>
						</div>
					</div>
					<div className="flex space-x-2 items-center">
						<div className="py-1 px-4 bg-green-100 text-green-500 rounded-sm">
						Sukses
						</div>
					</div>
					</div>
				</Box>
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
						{e.kode_kereta.split("/")[1]}
					</small>
					<div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
					<small className="text-xs text-gray-500">{e.tanggal_transaksi}</small>
					</div>
				</div>

				{/* Body */}
				<div className="mb-6">
					<div className="flex justify-between items-center px-6">
					<div className="flex space-x-2 items-center text-xs">
						<div>{e.origin}</div>
						<div>
						<IoIosArrowRoundForward size={24} />
						</div>
						<div>{e.destination}</div>
					</div>
					</div>

					{/* Button Download */}
					<div className="px-5 flex items-center justify-end">
					<a
						href={`https://rajabiller.fastpay.co.id/travel/app/generate_etiket?id_transaksi=${e.id_transaksi}`}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(event) => event.stopPropagation()} // Menghentikan event bubbling ke parent
						className="cursor-pointer"
					>
					</a>
					</div>
				</div>
				</div>

				{/* Drawer Detail Kereta */}
				<DetailKereta
				openDetail={openDetailIndex === i}
				toggleDrawerDetail={toggleDrawerDetail(i)}
				data={e}
				/>
			</div>
			))}

		</>
	);
}
