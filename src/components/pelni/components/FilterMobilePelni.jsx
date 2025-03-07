import { useState } from "react";
import { LiaSlidersHSolid } from "react-icons/lia";
import { TbListSearch } from "react-icons/tb";
import {
  FilterMobilePelniDrawer,
  SearchMobilePelniDrawer,
} from "./FilterMobilePelniDrawer";

export default function FilterMobilePelni({
  filterNamaKapalList,
  filterNamaKapal,
  handleFilterKapalChange,
  isLoading,
}) {
  const [openDrawer, setOpenDrawer] = useState(null);

  const toggleDrawer = (type) => {
    setOpenDrawer(type);
  };

  return (
    <div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white border shadow xl:relative xl:shadow-none max-h-[70px] flex justify-center items-center w-[200px] p-4 rounded-full">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="cursor-pointer"
            onClick={() => toggleDrawer("filter")}
          >
            <div className="flex space-x-2 items-center">
              <LiaSlidersHSolid className="text-black" size={18} />
              <div className="text-black text-sm">Filter</div>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => toggleDrawer("search")}
          >
            <div className="flex space-x-2 items-center">
              <TbListSearch className="text-black" size={18} />
              <div className="text-black text-sm">Search</div>
            </div>
          </div>
        </div>
      </div>
      <FilterMobilePelniDrawer
        filterNamaKapalList={filterNamaKapalList}
        filterNamaKapal={filterNamaKapal}
        handleFilterKapalChange={handleFilterKapalChange}
        isLoading={isLoading}
        openDrawer={openDrawer === "filter"}
        toggleDrawer={() => setOpenDrawer(null)}
      />
      <SearchMobilePelniDrawer
        openDrawer={openDrawer === "search"}
        toggleDrawer={() => setOpenDrawer(null)}
      />
    </div>
  );
}
