import { useState } from "react";
import { Button, SwipeableDrawer } from "@mui/material";
import PropTypes from "prop-types";
import { BsSearch } from "react-icons/bs";
import { FaPlaneDeparture } from "react-icons/fa";
import { message } from "antd";

const MaskapaiDrawerMobile = ({ openDrawer, toggleDrawer, pesawatData, setKeberangkatan, setTujuan, keberangkatan, tujuan, type }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const errorBerangkat = () => {
    messageApi.open({
      type: "error",
      content: "Kota Asal tidak boleh sama dengan Kota Tujuan.",
      duration: 10,
      top: "50%",
      className: "custom-message",
    });
  };

  const errorTujuan = () => {
    messageApi.open({
      type: "error",
      content: "Kota Tujuan tidak boleh sama dengan Kota Asal.",
      duration: 10,
      top: "50%",
      className: "custom-message",
    });
  };
  
  const filteredData = pesawatData.filter(e =>
    e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.bandara.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const popularAirports = pesawatData.filter(e => ["CGK", "SUB", "DPS"].includes(e.code));
  
  const handleSelect = (selected) => {
    if (type === "keberangkatan") {
      if (tujuan && selected.code === tujuan.code) {
        errorBerangkat();
        return;
      }
      setKeberangkatan(selected);
    } else if (type === "tujuan") {
      if (keberangkatan && selected.code === keberangkatan.code) {
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
          <h4>Pilih Bandara</h4>
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
          <div className="py-4 font-bold">Bandara Populer</div>
          {popularAirports.map((e, i) => (
            <div key={i} className="card mt-2 mb-6" onClick={() => handleSelect(e)}>
              <div className="title flex space-x-4 items-start cursor-pointer">
                <FaPlaneDeparture size={22} className="text-gray-400 mt-2" />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{e.bandara}</div>
                    <div className="py-2 px-4 bg-gray-100 text-xs">{e.code}</div>
                  </div>
                  <div className="mt-2 text-xs">{e.name}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="py-4 font-bold">Semua bandara</div>
          {filteredData.map((e, i) => (
            <div key={i} className="card mt-2 mb-6" onClick={() => handleSelect(e)}>
              <div className="title flex space-x-4 items-start cursor-pointer">
                <FaPlaneDeparture size={22} className="text-gray-400 mt-2" />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{e.bandara}</div>
                    <div className="py-2 px-4 bg-gray-100 text-xs">{e.code}</div>
                  </div>
                  <div className="mt-2 text-xs">{e.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SwipeableDrawer>
  );
};

MaskapaiDrawerMobile.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  pesawatData: PropTypes.array.isRequired,
  setKeberangkatan: PropTypes.func.isRequired,
  setTujuan: PropTypes.func.isRequired,
  keberangkatan: PropTypes.object,
  tujuan: PropTypes.object,
  type: PropTypes.string.isRequired,
};

export default MaskapaiDrawerMobile;