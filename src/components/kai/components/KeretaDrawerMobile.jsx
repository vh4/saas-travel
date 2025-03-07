import { useState } from "react";
import { SwipeableDrawer } from "@mui/material";
import PropTypes from "prop-types";
import { BsSearch } from "react-icons/bs";
import { message } from "antd";
import { PiTrainLight } from "react-icons/pi";

const KeretaDrawerMobile = ({
  openDrawer,
  toggleDrawer,
  kaiData,
  setKeberangkatan,
  setTujuan,
  keberangkatan,
  tujuan,
  type,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const errorBerangkat = () => {
    messageApi.open({
      type: "error",
      content: "Dari tidak boleh sama dengan Tujuan.",
      duration: 10,
      top: "50%",
      className: "custom-message",
    });
  };

  const errorTujuan = () => {
    messageApi.open({
      type: "error",
      content: "Tujuan tidak boleh sama dengan Dari.",
      duration: 10,
      top: "50%",
      className: "custom-message",
    });
  };

  const filteredData = kaiData.filter(
    (e) =>
      e.id_stasiun.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nama_kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nama_stasiun.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularAirports = kaiData.filter((e) =>
    ["BD", "SGU", "PSE", "GMR"].includes(e.id_stasiun)
  );

  const handleSelect = (selected) => {
    if (type === "keberangkatan") {
      if (tujuan && selected.id_stasiun === tujuan.id_stasiun) {
        errorBerangkat();
        return;
      }
      setKeberangkatan(selected);
    } else if (type === "tujuan") {
      if (keberangkatan && selected.id_stasiun === keberangkatan.id_stasiun) {
        errorTujuan();
        return;
      }
      setTujuan(selected);
    }
    toggleDrawer(false);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      PaperProps={{ sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30 } }}
      open={openDrawer}
      onClose={() => toggleDrawer(false)}
      onOpen={() => toggleDrawer(true)}
    >
      {contextHolder}
      <div className="p-4 mt-2 xl:container xl:px-64">
        <div className="p-4 text-lg font-bold">
          <h4>Pilih Stasiun</h4>
        </div>
        <div className="p-4 text-lg">
          <form className="flex items-center">
            <div className="relative w-full rounded-2xl">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <BsSearch className="text-blue-500" size={20} />
              </div>
              <input
                type="text"
                className="bg-gray-100 border rounded-2xl border-gray-100 text-sm focus:ring-gray-100 focus:border-gray-100 outline-none block w-full pl-10 p-2.5"
                placeholder="Input nama bandara"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <div className="py-4 font-bold">Stasiun Populer</div>
          {popularAirports.map((e, i) => (
            <div
              key={i}
              className="card mt-2 mb-6"
              onClick={() => handleSelect(e)}
            >
              <div className="title flex space-x-4 items-start cursor-pointer">
                <PiTrainLight size={22} className="text-gray-400 mt-2" />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{e.nama_stasiun}</div>
                    <div className="py-2 px-4 bg-gray-100 text-xs">
                      {e.id_stasiun}
                    </div>
                  </div>
                  <div className="mt-2 text-xs">{e.nama_kota}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="py-4 font-bold">Semua Stasiun</div>
          {filteredData.map((e, i) => (
            <div
              key={i}
              className="card mt-2 mb-6"
              onClick={() => handleSelect(e)}
            >
              <div className="title flex space-x-4 items-start cursor-pointer">
                <PiTrainLight size={22} className="text-gray-400 mt-2" />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{e.nama_stasiun}</div>
                    <div className="py-2 px-4 bg-gray-100 text-xs">
                      {e.id_stasiun}
                    </div>
                  </div>
                  <div className="mt-2 text-xs">{e.nama_kota}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SwipeableDrawer>
  );
};

KeretaDrawerMobile.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  kaiData: PropTypes.array.isRequired,
  setKeberangkatan: PropTypes.func.isRequired,
  setTujuan: PropTypes.func.isRequired,
  keberangkatan: PropTypes.object,
  tujuan: PropTypes.object,
  type: PropTypes.string.isRequired,
};

export default KeretaDrawerMobile;
