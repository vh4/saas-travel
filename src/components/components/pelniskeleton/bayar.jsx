import Skeleton from 'react-loading-skeleton'
import { Button as ButtonAnt } from 'antd';
import { IoArrowForwardOutline } from 'react-icons/io5';

const BayarLoading = ({total}) => {
	return(
		<>
                <div className="block xl:flex xl:justify-around mb-24 xl:space-x-4">
                  	<div className="mt-4 w-full mx-0 2xl:mx-4">
					  {Array.from({ length: total }, (_, i) => (
						<div className="p-2 md:p-8 mt-4 w-full rounded-md border-b border-gray-200 shadow-sm">
						<div className="p-2">
							<div className="px-2 xl:px-4 py-2 text-black border-b border-gray-200 text-sm">
							<Skeleton width={80} />
							</div>
							<div className="mt-2 block md:flex md:space-x-8">
							<div className="px-2 md:px-4 py-2">
								<div className="text-black text-sm">Nomor HP</div>
								<div className=" text-xs text-black">
								<Skeleton width={80} />
								</div>
							</div>
							<div className="px-2 md:px-4 py-2">
								<div className="text-black text-sm">Kursi</div>
								<div className=" text-xs text-black">
								<Skeleton width={80} />
								</div>
							</div>
							<div className="px-2 md:px-4 py-2">
								<div className="text-sm text-black">Kelas</div>
								<div className=" text-xs text-black">
								<Skeleton width={120} />
								</div>
							</div>
							</div>
						</div>
						</div>
					  ))}

						<div className="p-2 md:p-8 mt-2 w-full rounded-md border-b border-gray-200 shadow-sm">
						<div className="p-4">
							<div className="text-xs text-black  flex justify-between">
							<div>
								<Skeleton width={150} height={16} />
							</div>
							<div>
								<Skeleton width={80} height={16} />
							</div>
							</div>
							<div className="mt-2 text-xs text-black  flex justify-between">
							<div>
								<Skeleton width={120} height={16} />
							</div>
							<div>
								<Skeleton width={60} height={16} />
							</div>
							</div>
							<div className="mt-2 text-xs text-black  flex justify-between">
							<div>Diskon (Rp.)</div>
							<div>Rp. <Skeleton width={40} height={16} /></div>
							</div>
							<div className="mt-4 pt-2 border-t border-gray-200 text-sm text-black  flex justify-between">
							<div>Total Harga</div>
							<div>
								<Skeleton width={80} height={16} />
							</div>
							</div>
						</div>
						</div>

					</div>
					<div className="sidebar w-full xl:w-1/2">
					<div className="mt-8 py-2 rounded-md border-b border-gray-200 shadow-sm">
					<div className="px-4 py-2">
					{/* <div className="text-black text-xs">Booking ID</div> */}
					<div className="text-black text-xs">Transaksi ID</div>
					{/* Skeleton Placeholder for Booking ID */}
					<Skeleton width={100} height={12} />
					 <div className="text-grapy-500 text-xs">
                        Gunakan kode bayar ini sebagai nomor tujuan pada menu
                        pembayaran di aplikasi.
                      </div>
					</div>
					<div className="p-4 border-t">
					<div className="text-xs text-black">PELNI DESCRIPTION</div>
					{/* Skeleton Placeholder for Train Description */}
					<Skeleton width={200} height={12} />
					<div className="mt-1 text-xs text-black ">
						{/* Skeleton Placeholder for Train Route */}
						<Skeleton width={150} height={12} />
					</div>
					<div className="mt-3 text-xs text-black">
						{/* Skeleton Placeholder for Departure Date */}
						<Skeleton width={100} height={12} />
					</div>
					<div className="mt-1 text-xs text-black">
						{/* Skeleton Placeholder for Departure and Arrival Time */}
						<Skeleton width={120} height={12} />
					</div>
					</div>
					<div className="p-4 border-t">
					<div className="text-xs text-black">LIST PASSENGERS</div>
					{/* Skeleton Placeholder for Passengers */}
					<div className="mt-3 text-xs text-black ">
						<Skeleton width={150} height={12} />
					</div>
					{/* Repeat this line for each passenger */}
					{/* <div className="mt-3 text-xs text-black ">
						<Skeleton width={150} height={12} />
					</div> */}
					<div className="hidden md:block mt-2">
						<Skeleton width={350} height={12} />
                  	</div>
					</div>
					</div>
					{/* <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
						<div className="px-8 py-4 text-sm text-black">
						Untuk payment silahkan menggunakan api, atau silahkan hubungi tim bisnis untuk info lebih lanjut
						</div>
						<div className="flex justify-center">
						<ButtonAnt
							size="large"
							key="submit"
							type="primary"
							className="bg-blue-500 mx-2 font-semibold mt-4"
							disabled
						>
							Langsung Bayar
						</ButtonAnt>
						</div>
					</div> */}
					</div>


				</div>
		</>
	)
}

export default BayarLoading;