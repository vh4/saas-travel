import Skeleton from "react-loading-skeleton";
import { Button } from "antd";
import { IoArrowForwardOutline } from "react-icons/io5";

const Body = ({ TotalAdult, TotalChild, TotalInfant, totalKendaraan }) => {
  return (
    <>
      <div className="mt-12 w-full border pl-8 pr-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <div className="col">
            <div className="mt-2 w-36 mb-4">
              <Skeleton className="h-4" />
            </div>
            <div className="bg-gray-100">
              <Skeleton className="h-8" />
            </div>
            <div className="mt-2 w-48 mb-4">
              <Skeleton className="h-4" />
            </div>
          </div>
          <div className="col">
            <div className="mt-2 w-36 mb-4">
              <Skeleton className="h-4" />
            </div>
            <div className="bg-gray-100">
              <Skeleton className="h-8" />
            </div>
            <div className="mt-2 w-48 mb-4">
              <Skeleton className="h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* form */}
	  {Array.from({ length: (parseInt(TotalChild) + parseInt(TotalInfant) + parseInt(TotalAdult) + (parseInt(totalKendaraan) || 0 )) }, (_, i) => (
		<>
		<div className="mt-8 mb-4 xl:mt-12">
			<div className="w-48">
			<Skeleton className="h-4" />
			</div>
			<div className="mt-1 w-36">
			<Skeleton className="h-3" />
			</div>
		</div>

		<div className="mt-8 mb-4 xl:mt-12 ml-2 xl:ml-0 w-full border pl-8 pr-6 py-6">
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
				<div className="col-span-1 xl:col-span-2">
					<div>
						<div className='mt-2 w-36 mb-4'>
							<Skeleton className='h-4'/>
						</div>
						<div className="bg-gray-100 w-56">
							<Skeleton className='h-8'/>
						</div>
					</div>

				</div>
			<div className="col">
				<div className="mt-2 w-36 mb-4">
				<Skeleton className="h-4" />
				</div>
				<div className="bg-gray-100">
				<Skeleton className="h-8" />
				</div>
				<div className="mt-2 w-48 mb-4">
				<Skeleton className="h-4" />
				</div>
			</div>
			<div className="col">
				<div className="mt-2 w-36 mb-4">
				<Skeleton className="h-4" />
				</div>
				<div className="bg-gray-100">
				<Skeleton className="h-8" />
				</div>
				<div className="mt-2 w-48 mb-4">
				<Skeleton className="h-4" />
				</div>
			</div>
			<div className="col">
				<div className="mt-2 w-36 mb-4">
				<Skeleton className="h-4" />
				</div>
				<div className="bg-gray-100">
				<Skeleton className="h-8" />
				</div>
				<div className="mt-2 w-48 mb-4">
				<Skeleton className="h-4" />
				</div>
			</div>
			<div className="col">
				<div className="mt-2 w-36 mb-4">
				<Skeleton className="h-4" />
				</div>
				<div className="bg-gray-100">
				<Skeleton className="h-8" />
				</div>
				<div className="mt-2 w-48 mb-4">
				<Skeleton className="h-4" />
				</div>
			</div>
			</div>
		</div>
		</>
	  ))}
    </>
  );
};

const Sidebar = () => {
  return (
    <>
      {/* sidebra desktop */}
      <div className="w-1/2">
        <div className="hidden xl:block rounded-md border border-gray-200 shadow-sm mb-4">
          <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
            <div className="text-black text-sm ">
              {/* Skeleton Placeholder for Keberangkatan Pesawat */}
              <Skeleton width={150} height={12} />
            </div>
            <small className="text-xs text-black">
              {/* Skeleton Placeholder for Tanggal Keberangkatan */}
              <Skeleton width={80} height={10} />
            </small>
          </div>
          <div className="px-4 p-8 flex justify-between space-x-8 mx-4 items-center">
            <div className="text-xs  text-black">
              <div>
                {/* Skeleton Placeholder for Keberangkatan Kota */}
                <Skeleton width={80} height={12} />
              </div>
              <div>
                {/* Skeleton Placeholder for Keberangkatan Kode Kota */}
                <Skeleton width={50} height={10} />
              </div>
            </div>
            <div className="rounded-full p-1 bg-blue-500 ">
              <IoArrowForwardOutline className="text-white" size={18} />
            </div>
            <div className="text-xs  text-black">
              <div>
                {/* Skeleton Placeholder for Kedatangan Kota */}
                <Skeleton width={80} height={12} />
              </div>
              <div>
                {/* Skeleton Placeholder for Kedatangan Kode Kota */}
                <Skeleton width={50} height={10} />
              </div>
            </div>
          </div>
          <div className="p-2 -mt-2 mb-2 relative px-4 text-black">
            <div className="flex items-center space-x-2">
			<div className="p-2 -mt-2 mb-2 relative px-4 text-black">
				<div className="flex items-center">
					<div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
				</div>
			</div>
              <div className="text-black text-xs ">
                {/* Skeleton Placeholder for Nama Maskapai */}
                <Skeleton width={120} height={12} />
              </div>
            </div>
          </div>
          <div className="p-4 pl-8 pt-4 px-6 mb-4">
            <ol className="relative border-l-2 border-dotted border-gray-300 ">
              <li className="mb-10 ml-4 text-sm">
                <div className="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400  "></div>
                <div className="flex space-x-12">
                  <time className="mb-1 text-xs  leading-none text-gray-400 ">
                    {/* Skeleton Placeholder for Waktu Keberangkatan */}
                    <Skeleton width={40} height={10} />
                  </time>
                  <div className="-mt-2">
                    <h3 className="text-left text-xs  text-black ">
                      {/* Skeleton Placeholder for Nama Keberangkatan Kota */}
                      <Skeleton width={80} height={12} />
                    </h3>
                    <p className="text-left text-xs  text-black ">
                      {/* Skeleton Placeholder for Kode Keberangkatan Kota */}
                      <Skeleton width={40} height={10} />
                    </p>
                  </div>
                </div>
              </li>
              <li className="ml-4 text-sm mt-10">
                <div className="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white  "></div>
                <div className="flex space-x-12">
                  <time className="mb-1 text-xs  leading-none text-gray-400 ">
                    {/* Skeleton Placeholder for Waktu Kedatangan */}
                    <Skeleton width={40} height={10} />
                  </time>
                  <div className="-mt-2">
                    <h3 className="text-left text-xs  text-black ">
                      {/* Skeleton Placeholder for Nama Kedatangan Kota */}
                      <Skeleton width={80} height={12} />
                    </h3>
                    <p className="text-left text-xs  text-black ">
                      {/* Skeleton Placeholder for Kode Kedatangan Kota */}
                      <Skeleton width={40} height={10} />
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

const BookingLoading = ({ TotalAdult, TotalChild, TotalInfant, totalKendaraan }) => {
  return (
    <>
      <div className="mt-8 xl:mt-0 block xl:hidden rounded-md border border-gray-200 shadow-sm">
        <div className="p-4 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
          <div className="text-black text-sm ">
            {/* Skeleton Placeholder for Keberangkatan Pesawat */}
            <Skeleton width={150} height={12} />
          </div>
          <small className="text-xs text-black">
            {/* Skeleton Placeholder for Tanggal Keberangkatan */}
            <Skeleton width={80} height={10} />
          </small>
        </div>
        <div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
          <div className="text-xs  text-black">
            <div>
              {/* Skeleton Placeholder for Keberangkatan Kota */}
              <Skeleton width={50} height={12} />
            </div>
            <div>
              {/* Skeleton Placeholder for Keberangkatan Kode Kota */}
              <Skeleton width={50} height={10} />
            </div>
          </div>
          <div className="rounded-full p-1 bg-blue-500 ">
            <IoArrowForwardOutline className="text-white" size={18} />
          </div>
          <div className="text-xs  text-black">
            <div>
              {/* Skeleton Placeholder for Kedatangan Kota */}
              <Skeleton width={50} height={12} />
            </div>
            <div>
              {/* Skeleton Placeholder for Kedatangan Kode Kota */}
              <Skeleton width={50} height={10} />
            </div>
          </div>
        </div>
		<div className="p-2 -mt-2 mb-2 relative px-4 text-black">
            <div className="flex items-center space-x-2">
			<div className="p-2 -mt-2 mb-2 relative px-4 text-black">
				<div className="flex items-center">
					<div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse"></div>
				</div>
			</div>
              <div className="text-black text-xs ">
                {/* Skeleton Placeholder for Nama Maskapai */}
                <Skeleton width={120} height={12} />
              </div>
            </div>
          </div>
        <div className="p-4 pl-12 mb-4">
          <ol class="relative border-l-2 border-dotted border-gray-300">
            <li class="mb-10 ml-4 text-sm">
              <div class="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400"></div>
              <div className="flex space-x-12">
                <time class="mb-1 text-xs  leading-none text-gray-400">
                  {/* Skeleton Placeholder for Waktu Keberangkatan */}
                  <Skeleton width={40} height={10} />
                </time>
                <div className="-mt-2">
                  <h3 class="text-left text-xs  text-black">
                    {/* Skeleton Placeholder for Nama Keberangkatan Kota */}
                    <Skeleton width={80} height={12} />
                  </h3>
                  <p class="text-left text-xs  text-black">
                    {/* Skeleton Placeholder for Kode Keberangkatan Kota */}
                    <Skeleton width={40} height={10} />
                  </p>
                </div>
              </div>
            </li>
            <li class="ml-4 text-sm mt-10">
              <div class="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white"></div>
              <div className="flex space-x-12">
                <time class="mb-1 text-xs  leading-none text-gray-400">
                  {/* Skeleton Placeholder for Waktu Kedatangan */}
                  <Skeleton width={40} height={10} />
                </time>
                <div className="-mt-2">
                  <h3 class="text-left text-xs  text-black">
                    {/* Skeleton Placeholder for Nama Kedatangan Kota */}
                    <Skeleton width={80} height={12} />
                  </h3>
                  <p class="text-left text-xs  text-black">
                    {/* Skeleton Placeholder for Kode Kedatangan Kota */}
                    <Skeleton width={40} height={10} />
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
      <div className=" w-full mb-24 block xl:flex xl:space-x-10">
        <div className="w-full">
          <Body TotalAdult={TotalAdult} TotalChild={TotalChild} TotalInfant={TotalInfant} totalKendaraan={totalKendaraan} />
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default BookingLoading;
