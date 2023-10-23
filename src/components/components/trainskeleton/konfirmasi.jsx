import Skeleton from "react-loading-skeleton";
import { TbArrowsLeftRight } from "react-icons/tb";
import { Button } from "antd";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { IoIosArrowDropright } from "react-icons/io";

const Body1 = () => {
  return (
    <>
      <div className="mt-8 w-full rounded-md border border-gray-200 shadow-sm">
        <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
          <div className="text-slate-700">
            {/* Skeleton Placeholder */}
            <Skeleton width={120} height={24} />
          </div>
          <small className="text-gray-700">
            {/* Skeleton Placeholder */}
            <Skeleton width={100} height={12} />
          </small>
        </div>
        <div className="p-4 pl-8 text-gray-700">
          <div className="text-xs ">
            {/* Skeleton Placeholder */}
            <Skeleton width={200} height={16} />
          </div>
          <small>
            {/* Skeleton Placeholder */}
            <Skeleton width={80} height={12} />
          </small>
        </div>
        <div className="mt-2"></div>
        <div className="p-4 pl-8 mb-4">
          <ol className="relative border-l border-dashed border-gray-500">
            <li className="mb-10 ml-4">
              <div className="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-500"></div>
              <div className="flex space-x-12">
                <time className="mb-1 text-sm font-normal leading-none text-gray-400">
                  {/* Skeleton Placeholder */}
                  <Skeleton width={80} height={12} />
                </time>
                <div className="-mt-2">
                  <h3 className="text-left text-xs text-slate-600 ">
                    {/* Skeleton Placeholder */}
                    <Skeleton width={120} height={16} />
                  </h3>
                  <p className="text-left text-xs text-gray-500">
                    {/* Skeleton Placeholder */}
                    <Skeleton width={60} height={12} />
                  </p>
                </div>
              </div>
            </li>
            <li className="ml-4">
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full mt-0 -left-2 border border-white "></div>
              <div className="flex space-x-12">
                <time className="mb-1 text-sm leading-none text-gray-400">
                  {/* Skeleton Placeholder */}
                  <Skeleton width={80} height={12} />
                </time>
                <div className="-mt-2">
                  <h3 className="text-left text-xs text-slate-600 ">
                    {/* Skeleton Placeholder */}
                    <Skeleton width={120} height={16} />
                  </h3>
                  <p className="text-left text-xs text-gray-500">
                    {/* Skeleton Placeholder */}
                    <Skeleton width={60} height={12} />
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

const Sidebar = () => {
  return (
    <>
      {/* desktop sidebar */}
      <div className="sidebar w-full xl:w-1/2">
        <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
          <div className="text-gray-500 text-sm">Transaksi ID</div>
            {/* <div className="text-gray-500 text-sm">Booking ID</div> */}
            <div className=" text-blue-500 ">
              <Skeleton width={50} height={12} />
            </div>
          </div>
        </div>
        <button className="block w-full">
          <div className="mt-2 rounded-md border border-gray-200 shadow-sm  hover:bg-gray-100">
            <div className="flex items-center justify-between space-x-2 p-4 pr-2 xl:pr-4">
              <div className="flex space-x-2 items-center">
                <div>
                  <MdOutlineAirlineSeatReclineExtra
                    size={28}
                    className="text-blue-500"
                  />
                </div>
                <div className="block text-gray-500 text-sm">
                  <div className="text-sm ">Pindah Kursi</div>
                  <small>available seats</small>
                </div>
              </div>
              <div>
                <IoIosArrowDropright size={28} className="text-blue-500" />
              </div>
            </div>
          </div>
        </button>
        <div></div>
      </div>
    </>
  );
};

const KonfirmasiLoading = ({ TotalAdult, TotalInfant }) => {
  return (
    <>
      <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
        <div className="w-full mx-0 2xl:mx-4">
          <Body1 />
          <div className="text-sm xl:text-sm  text-slate-600 mt-12">
            <Skeleton width={120} height={16} />
          </div>

          {Array.from({ length: TotalAdult }, (_, i) => (
            <>
              <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
                <div className="p-2">
                  <div className="px-2 xl:px-4 py-2 text-gray-500 border-b border-gray-200 text-sm ">
                    {/* Skeleton Placeholder */}
                    <Skeleton width={120} height={16} />
                  </div>
                  <div className="mt-2 block md:flex md:space-x-8">
                    <div className="px-2 md:px-4 py-2 text-sm ">
                      <div className="text-gray-500">NIK</div>
                      <div className="text-gray-600">
                        {/* Skeleton Placeholder */}
                        <Skeleton width={100} height={12} />
                      </div>
                    </div>
                    <div className="px-2 md:px-4 py-2 text-sm ">
                      <div className="text-gray-500">Nomor HP</div>
                      <div className="text-gray-600">
                        {/* Skeleton Placeholder */}
                        <Skeleton width={100} height={12} />
                      </div>
                    </div>
                    <div className="px-2 md:px-4 py-2 text-sm ">
                      <div className="text-gray-500">Kursi</div>
                      <div className="text-gray-600">
                        {/* Skeleton Placeholder */}
                        <Skeleton width={120} height={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}

          {Array.from({ length: TotalInfant }, (_, i) => (
            <>
            <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
              <div className="p-4">
                {/* Skeleton Placeholder for the name */}
                <Skeleton width={100} height={16} />
                <div className="mt-2 flex space-x-8">
                  <div className="px-4 py-2 text-sm ">
                    <div className="text-gray-500">NIK</div>
                    {/* Skeleton Placeholder for NIK */}
                    <Skeleton width={100} height={12} />
                  </div>
                  <div className="px-4 py-2 text-sm ">
                    <div className="text-gray-500">Tanggal Lahir</div>
                    {/* Skeleton Placeholder for Tanggal Lahir */}
                    <Skeleton width={100} height={12} />
                  </div>
                  <div className="px-4 py-2 text-sm ">
                    <div className="text-gray-500">Kursi</div>
                    {/* Skeleton Placeholder for Kursi */}
                    <Skeleton width={100} height={12} />
                  </div>
                </div>
              </div>
            </div>
            </>
          ))}

          <div className="text-sm xl:text-sm  text-slate-600 mt-12">
            {/* Skeleton Placeholder for the heading */}
            <Skeleton width={100} height={16} />
          </div>
          <div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
            <div className="p-4">
              {/* Skeleton Placeholder for the content */}
              <div className="text-xs text-slate-500  flex justify-between">
                <Skeleton width={150} height={12} />
                <Skeleton width={50} height={12} />
              </div>
              <div className="mt-2 text-xs text-slate-500  flex justify-between">
                <Skeleton width={120} height={12} />
                <Skeleton width={50} height={12} />
              </div>
              <div className="mt-2 text-xs text-slate-500  flex justify-between">
                <Skeleton width={100} height={12} />
                <Skeleton width={50} height={12} />
              </div>
              <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-slate-500  flex justify-between">
                <div>Total Harga</div>
                <Skeleton width={70} height={12} />
              </div>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default KonfirmasiLoading;
