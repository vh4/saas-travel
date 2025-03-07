import { useState } from "react";
import { Button, SwipeableDrawer } from "@mui/material";
import PropTypes from "prop-types";
import { BsSearch } from "react-icons/bs";
import { FaPlaneDeparture } from "react-icons/fa";
import { message } from "antd";
import { RiShipLine } from "react-icons/ri";

const PelniDrawerMobile = ({
  openDrawer,
  toggleDrawer,
  pelniData,
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

  const filteredData = pelniData.filter((e) =>
    e.NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularAirports = pelniData.filter((e) =>
    ["946", "144", "431"].includes(e.CODE)
  );

  const handleSelect = (selected) => {
    if (type === "keberangkatan") {
      if (tujuan && selected.CODE === tujuan.CODE) {
        errorBerangkat();
        return;
      }
      setKeberangkatan(selected);
    } else if (type === "tujuan") {
      if (keberangkatan && selected.CODE === keberangkatan.CODE) {
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
          <h4>Pilih Pelabuhan</h4>
          {/* xx */}
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
          <div className="py-4 font-bold">Pelabuhan Populer</div>
          {popularAirports.map((e, i) => (
            <div
              key={i}
              className="card mt-2 mb-6"
              onClick={() => handleSelect(e)}
            >
              <div className="title flex space-x-4 items-start cursor-pointer">
                <RiShipLine size={22} className="text-gray-400 mt-2" />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{e.NAME}</div>
                  </div>
                  <div className="mt-2 text-xs">{e.NAME}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="py-4 font-bold">Semua Stasiub</div>
          {filteredData.map((e, i) => (
            <div
              key={i}
              className="card mt-2 mb-6"
              onClick={() => handleSelect(e)}
            >
              <div className="title flex space-x-4 items-start cursor-pointer">
                <RiShipLine size={22} className="text-gray-400 mt-2" />
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-sm">{e.NAME}</div>
                  </div>
                  <div className="mt-2 text-xs">{e.NAME}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SwipeableDrawer>
  );
};

PelniDrawerMobile.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  pelniData: PropTypes.array.isRequired,
  setKeberangkatan: PropTypes.func.isRequired,
  setTujuan: PropTypes.func.isRequired,
  keberangkatan: PropTypes.object,
  tujuan: PropTypes.object,
  type: PropTypes.string.isRequired,
};

export default PelniDrawerMobile;
