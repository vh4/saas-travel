import Skeleton from "react-loading-skeleton";

const Body = ({ TotalAdult, TotalChild, TotalInfant }) => {
  return (
    <>
      {/* adult */}
      {Array.from({ length: TotalAdult }, (_, i) => (
        <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
          <div className="p-2">
            <div className="px-2 xl:px-4 py-2 text-black border-b border-gray-200 text-sm ">
              <Skeleton width={150} height={12} />
            </div>
            <div className="mt-2 block md:flex md:space-x-8">
              <div className="px-2 md:px-4 py-2 text-sm">
                <div className="text-black">NIK</div>
                <div className="text-black">
                  <Skeleton width={80} height={12} />
                </div>
              </div>
              <div className="px-2 md:px-4 py-2 text-sm">
                <div className="text-black">Nomor HP</div>
                <div className="text-black">
                  <Skeleton width={80} height={12} />
                </div>
              </div>
              <div className="px-2 md:px-4 py-2 text-sm">
                <div className="text-black">Email</div>
                <div className="text-black">
                  <Skeleton width={120} height={12} />
                </div>
              </div>
              <div className="px-2 md:px-4 py-2 text-sm">
                <div className="text-black">Tanggal Lahir</div>
                <div className="text-black">
                  <Skeleton width={80} height={12} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* infant dan child */}
      {Array.from(
        { length: parseInt(TotalChild) + parseInt(TotalInfant) },
        (_, i) => (
          <div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
            <div className="p-2">
              <div className="p-4 text-black border-b border-gray-200 text-sm ">
                <Skeleton width={150} height={12} />
              </div>
              <div className="mt-2 flex space-x-8">
                <div className="px-4 py-2 text-sm">
                  <div className="text-black">NIK/ No.Ktp</div>
                  <div className="text-black">
                    <Skeleton width={80} height={12} />
                  </div>
                </div>
                <div className="px-4 py-2 text-sm">
                  <div className="text-black">Tanggal Lahir</div>
                  <div className="text-black">
                    <Skeleton width={80} height={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* list pay */}

      <div className="p-2 md:p-8 mt-2 w-full rounded-md border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="text-xs text-black  flex justify-between">
            <div>
              <Skeleton width={100} height={12} />
            </div>
            <div>
              <Skeleton width={50} height={12} />
            </div>
          </div>
          <div className="mt-2 text-xs text-black  flex justify-between">
            <div>Biaya Admin (Fee)</div>
            <div>
              <Skeleton width={50} height={12} />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-black  flex justify-between">
            <div>Total Harga</div>
            <div>
              <Skeleton width={50} height={12} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Sidebar = () => {
  return <></>;
};

const BayarLoading = ({ TotalAdult, TotalChild, TotalInfant }) => {
  return (
    <>
      <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
        <div className="mt-4 w-full mx-0 2xl:mx-4">
          <Body
            TotalAdult={TotalAdult}
            TotalChild={TotalChild}
            TotalInfant={TotalInfant}
          />
        </div>
        <div className="sidebar w-full xl:w-1/2">
          <div className="mt-8 py-2 rounded-md border-b border-gray-200 shadow-sm">
            <div className="px-4 py-2">
              <div className="text-black text-xs">Transaksi ID</div>
              <Skeleton width={100} height={12} />
              <div className="text-grapy-500 text-xs">
                Gunakan kode bayar ini sebagai nomor tujuan pada menu pembayaran
                di aplikasi.
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="text-xs text-black">PESAWAT DESCRIPTION</div>
              <Skeleton width={200} height={12} />
              <div className="mt-1 text-xs text-black ">
                <Skeleton width={150} height={12} />
              </div>
              <div className="mt-3 text-xs text-black">
                <Skeleton width={100} height={12} />
              </div>
              <div className="mt-1 text-xs text-black">
                <Skeleton width={120} height={12} />
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="text-xs text-black">LIST PASSENGERS</div>
              <div className="mt-3 text-xs text-black ">
                <Skeleton width={150} height={12} />
              </div>
              <div className="hidden md:block mt-2">
                <Skeleton width={350} height={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BayarLoading;
