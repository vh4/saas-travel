import { useState } from "react";
import KeretaDrawerMobile from "./KeretaDrawerMobile";
import { RiArrowUpDownLine } from "react-icons/ri";
import { PiTrainLight } from "react-icons/pi";

const KeretaMobile = ({
  kaiData,
  keberangkatan,
  tujuan,
  setKeberangkatan,
  setTujuan,
  changeStatiun,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [type, setType] = useState(null);
  const toggleDrawer = (newOpen) => {
    setOpenDrawer(newOpen);
  };

  return (
    <div className="">
      <small className="block m-2 text-black">Dari dan Tujuan</small>
      <div className="m-2 relative z-10 py-2 px-2 bg-white border border-gray-200 rounded-lg">
        <ul className="list-none space-y-2 max-w-sm mx-auto group relative">
          {/* Icon Arrow */}
          <div
            onClick={changeStatiun}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer bg-gray-100 py-3 px-3 rounded-full"
          >
            <div>
              <RiArrowUpDownLine size={18} className="text-blue-400" />
            </div>
          </div>
          {/* Booking Saya */}
          <div className="block">
            <div
              onClick={() => {
                toggleDrawer(true);
                setType("keberangkatan");
              }}
              className="py-2 px-1 flex items-center justify-between cursor-pointer rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <PiTrainLight className="text-gray-400" />
                <span className="text-sm text-gray-900">
                  {keberangkatan ? keberangkatan.nama_stasiun : "Keberangkatan"}
                </span>
              </div>
            </div>
          </div>
          <div className="block">
            <div
              onClick={() => {
                toggleDrawer(true);
                setType("tujuan");
              }}
              className="pt-4 px-1 flex items-center justify-between border-t cursor-pointer rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <PiTrainLight className="text-gray-400" />
                <span className="text-sm text-gray-900">
                  {tujuan ? tujuan.nama_stasiun : "Tujuan"}
                </span>
              </div>
            </div>
          </div>
        </ul>
      </div>
      <KeretaDrawerMobile
        type={type}
        setKeberangkatan={setKeberangkatan}
        setTujuan={setTujuan}
        kaiData={kaiData}
        keberangkatan={keberangkatan}
        tujuan={tujuan}
        openDrawer={openDrawer}
        toggleDrawer={toggleDrawer}
      />
    </div>
  );
};

export default KeretaMobile;
