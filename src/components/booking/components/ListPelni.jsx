import { Box, SwipeableDrawer } from "@mui/material";
import * as React from "react";
import { FaShip } from "react-icons/fa";
import { formatDate, remainingTimeAllBook } from "../../../helpers/date";
import DetailPelni from "./DetailPelni";

export default function ListPelni({ data, remainingPelni }) {
  // State untuk mengontrol drawer detail per pelni
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
                <FaShip className="text-gray-500" size={20} />
                <h1 className="text-sm font-bold mt-2">{e.nama_kapal}</h1>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <small className="text-xs">SubClass {e.subClass}</small>
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
                    {e.jam_keberangkatan}
                  </div>
                  <div className="my-3">
                    <div className="text-xs text-gray-800">{e.origin}</div>
                    <small className="text-xs text-gray-800">
                      {formatDate(e.tanggal_keberangkatan)}
                    </small>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="my-3 text-sm font-bold text-gray-800">
                    {e.jam_kedatangan}
                  </div>
                  <div className="my-2">
                    <div className="text-xs text-gray-800">{e.destination}</div>
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
                    {remainingPelni[i] !== undefined && remainingPelni[i] > 0
                      ? remainingTimeAllBook(remainingPelni[i])
                      : "Habis"}
                  </div>
                </div>
              </Box>
            </Box>
          </div>

          {/* Drawer Detail Pelni */}
          <DetailPelni
            openDetail={openDetailIndex === i}
            toggleDrawerDetail={toggleDrawerDetail(i)}
            data={e}
          />
        </div>
      ))}
    </>
  );
}
