import Skeleton from 'react-loading-skeleton'
import { Button as ButtonAnt } from 'antd';
import { IoArrowForwardOutline } from 'react-icons/io5';

const BayarLoading = ({total}) => {
	return(
		<>
                <div className="block xl:flex xl:justify-around mb-24 xl:mx-16 xl:space-x-4">
                  	<div className="mt-4 w-full mx-0 2xl:mx-4">
					  {Array.from({ length: total }, (_, i) => (
						<div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
						<div className="p-2">
							<div className="px-2 xl:px-4 py-2 text-gray-600 border-b border-gray-200 text-sm">
							<Skeleton width={80} />
							</div>
							<div className="mt-2 block md:flex md:space-x-8">
							<div className="px-2 md:px-4 py-2">
								<div className="text-gray-500 text-sm">Nomor HP</div>
								<div className=" text-xs text-gray-800">
								<Skeleton width={80} />
								</div>
							</div>
							<div className="px-2 md:px-4 py-2">
								<div className="text-gray-500 text-sm">Kursi</div>
								<div className=" text-xs text-gray-800">
								<Skeleton width={80} />
								</div>
							</div>
							<div className="px-2 md:px-4 py-2">
								<div className="text-sm text-gray-500">Kelas</div>
								<div className=" text-xs text-gray-800">
								<Skeleton width={120} />
								</div>
							</div>
							</div>
						</div>
						</div>
					  ))}

						<div className="p-2 mt-2 w-full rounded-md border border-gray-200 shadow-sm">
						<div className="p-4">
							<div className="text-xs text-gray-800  flex justify-between">
							<div>
								<Skeleton width={150} height={16} />
							</div>
							<div>
								<Skeleton width={80} height={16} />
							</div>
							</div>
							<div className="mt-2 text-xs text-gray-800  flex justify-between">
							<div>
								<Skeleton width={120} height={16} />
							</div>
							<div>
								<Skeleton width={60} height={16} />
							</div>
							</div>
							<div className="mt-2 text-xs text-gray-800  flex justify-between">
							<div>Diskon (Rp.)</div>
							<div>Rp. <Skeleton width={40} height={16} /></div>
							</div>
							<div className="mt-4 pt-2 border-t border-gray-200 text-sm text-gray-800  flex justify-between">
							<div>Total Harga</div>
							<div>
								<Skeleton width={80} height={16} />
							</div>
							</div>
						</div>
						</div>

					</div>
					<div className="sidebar w-full xl:w-1/2">
					<div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
						<div className="px-4 py-2">
						{/* <div className="text-gray-500 text-xs">Status Booking</div> */}
						<div className="text-gray-500 text-xs">Transaksi ID</div>
						<div className="mt-1  text-blue-500 text-xs">
							<Skeleton width={100} height={16} />
						</div>
						</div>
						<div className="p-4 border-t">
						<div className="text-xs text-gray-500">PELNI DESCRIPTION</div>
						<div className="w-full flex space-x-4">
							<div className="mt-1 text-xs text-gray-800 ">
							<Skeleton width={130} height={16} />
							</div>
							<IoArrowForwardOutline className="text-gray-500" size={18} />
							<div className="mt-1 text-xs text-gray-800 ">
							<Skeleton width={130} height={16} />
							</div>
						</div>
						<div className="mt-3 text-xs text-gray-800">
							<Skeleton width={"100%"} height={16} />
						</div>
						<div className="text-xs text-gray-800">
							<Skeleton width={48} height={16} />
						</div>
						</div>
						<div className="p-4 border-t">
						<div className="text-xs text-gray-500">LIST PASSENGERS</div>
						<Skeleton width={150} height={16} />
						<Skeleton width={150} height={16} />
						</div>
					</div>
					{/* <div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
						<div className="px-8 py-4 text-sm text-gray-500">
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