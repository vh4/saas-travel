import { useState } from "react";
import { Whisper } from "rsuite";
import { BsSortDown } from "react-icons/bs";
import { LiaSlidersHSolid } from "react-icons/lia";
import { TbListSearch } from "react-icons/tb";
import { FilterMobilePlaneDrawer, SortMobilePlaneDrawer, SearchMobilePlaneDrawer } from "./FilterMobilePlaneDrawer";

export default function FilterMobilePlane(
	{
		langsung, setLangsung, transit, setTransit,
		waktuFilter, handleWaktuFilterChange,
		valHargaRange, hargraRangeChange,
		HargaTerendahTinggiPlane, setHargaTerendahTinggiPlane 
	}
) {
  const [openDrawer, setOpenDrawer] = useState(null);

  const toggleDrawer = (type) => {
    setOpenDrawer(type);
  };

  return (
    <div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white border shadow xl:relative xl:shadow-none max-h-[70px] flex justify-center items-center w-[300px] p-4 rounded-full">
        <div className="grid grid-cols-3 gap-4">
          <div className="cursor-pointer" onClick={() => toggleDrawer("sort")}>
            <div className="flex space-x-2 items-center">
              <BsSortDown className="text-black" size={18} />
              <div className="text-black text-sm">Sort</div>
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => toggleDrawer("filter")}>
            <div className="flex space-x-2 items-center">
              <LiaSlidersHSolid className="text-black" size={18} />
              <div className="text-black text-sm">Filter</div>
            </div>
          </div>
          <div className="cursor-pointer" onClick={() => toggleDrawer("search")}>
            <div className="flex space-x-2 items-center">
              <TbListSearch className="text-black" size={18} />
              <div className="text-black text-sm">Search</div>
            </div>
          </div>
        </div>
      </div>
      <FilterMobilePlaneDrawer
	  langsung={langsung} setLangsung={setLangsung} transit={transit} setTransit={setTransit}
	  waktuFilter={waktuFilter} handleWaktuFilterChange={handleWaktuFilterChange}
	  valHargaRange={valHargaRange} 
	  hargraRangeChange={hargraRangeChange}
	  openDrawer={openDrawer === "filter"} toggleDrawer={() => setOpenDrawer(null)} />
      <SortMobilePlaneDrawer 
	  HargaTerendahTinggiPlane={HargaTerendahTinggiPlane} 
	  setHargaTerendahTinggiPlane={setHargaTerendahTinggiPlane} 
	  openDrawer={openDrawer === "sort"} toggleDrawer={() => setOpenDrawer(null)} />
      <SearchMobilePlaneDrawer openDrawer={openDrawer === "search"} toggleDrawer={() => setOpenDrawer(null)} />
    </div>
  );
}
