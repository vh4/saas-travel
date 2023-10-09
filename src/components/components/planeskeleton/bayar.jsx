import Skeleton from 'react-loading-skeleton'
import { TbArrowsLeftRight } from "react-icons/tb";
import { Alert, Button } from 'antd';
import Marquee from 'react-fast-marquee';

const Body = ({TotalAdult, TotalChild, TotalInfant}) => {
	return(
		<>
			{/* adult */}
			{Array.from({ length: TotalAdult }, (_, i) => (
				<div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
				<div className="p-2">
				<div className="px-2 xl:px-4 py-2 text-gray-500 border-b border-gray-200 text-sm font-bold">
					{/* Skeleton Placeholder for Full Name */}
					<Skeleton width={150} height={12} />
				</div>
				<div className="mt-2 block md:flex md:space-x-8">
					<div className="px-2 md:px-4 py-2 text-sm">
					<div className="text-gray-500 font-medium">
						NIK
					</div>
					<div className="text-gray-500">
						{/* Skeleton Placeholder for NIK */}
						<Skeleton width={80} height={12} />
					</div>
					</div>
					<div className="px-2 md:px-4 py-2 text-sm">
					<div className="text-gray-500  font-medium">
						Nomor HP
					</div>
					<div className="text-gray-500">
						{/* Skeleton Placeholder for Nomor HP */}
						<Skeleton width={80} height={12} />
					</div>
					</div>
					<div className="px-2 md:px-4 py-2 text-sm">
					<div className="text-gray-500  font-medium">
						Email
					</div>
					<div className="text-gray-500">
						{/* Skeleton Placeholder for Email */}
						<Skeleton width={120} height={12} />
					</div>
					</div>
				</div>
				<div className="px-2 md:px-4 py-2 text-sm">
					<div className="text-gray-500 font-medium">
					Tanggal Lahir
					</div>
					<div className="text-gray-500">
					{/* Skeleton Placeholder for Tanggal Lahir */}
					<Skeleton width={80} height={12} />
					</div>
				</div>
				</div>
			</div>
			))}
			
			{/* infant dan child */}
			{Array.from({ length: (parseInt(TotalChild) + parseInt(TotalInfant)) }, (_, i) => (
				<div className="p-2 mt-4 w-full rounded-md border border-gray-200 shadow-sm">
				<div className="p-2">
					<div className="p-4 text-gray-500 border-b border-gray-200 text-sm font-bold">
					{/* Skeleton Placeholder for Full Name */}
					<Skeleton width={150} height={12} />
					</div>
					<div className="mt-2 flex space-x-8">
					<div className="px-4 py-2 text-sm">
						<div className="text-gray-500 font-medium">
						NIK/ No.Ktp
						</div>
						<div className="text-gray-600">
						{/* Skeleton Placeholder for NIK/No.Ktp */}
						<Skeleton width={80} height={12} />
						</div>
					</div>
					<div className="px-4 py-2 text-sm">
						<div className="text-gray-500 font-medium">
						Tanggal Lahir
						</div>
						<div className="text-gray-600">
						{/* Skeleton Placeholder for Tanggal Lahir */}
						<Skeleton width={80} height={12} />
						</div>
					</div>
					</div>
				</div>
			</div>
			))}
			
		  {/* list pay */}

		  <div className="p-2 mt-2 w-full rounded-md border border-gray-200 shadow-sm">
			<div className="p-4">
				<div className="text-xs text-slate-500 font-bold flex justify-between">
				<div>
					{/* Skeleton Placeholder for Airline Name */}
					<Skeleton width={100} height={12} />
				</div>
				<div>
					{/* Skeleton Placeholder for Nominal */}
					<Skeleton width={50} height={12} />
				</div>
				</div>
				<div className="mt-2 text-xs text-slate-500 font-bold flex justify-between">
				<div>Biaya Admin (Fee)</div>
				<div>
					{/* Skeleton Placeholder for Nominal Admin */}
					<Skeleton width={50} height={12} />
				</div>
				</div>
				<div className="mt-4 pt-2 border-t border-gray-200 text-sm text-slate-500 font-bold flex justify-between">
				<div>Total Harga</div>
				<div>
					{/* Skeleton Placeholder for Total Harga */}
					<Skeleton width={50} height={12} />
				</div>
				</div>
			</div>
			</div>
		</>
	)
}

const Sidebar = () => {

	return(
		<>
		</>
	)

}

const BayarLoading = ({TotalAdult, TotalChild, TotalInfant}) => {
	return(
		<>
	       <div className="block xl:flex xl:justify-around mb-24 xl:space-x-12 xl:mx-12">
                <div className="mt-4 w-full mx-0 2xl:mx-4">
					<Body TotalAdult={TotalAdult} TotalChild={TotalChild} TotalInfant={TotalInfant} />
				</div>
					<div className="sidebar w-full xl:w-1/2">
						<div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
							<div className="px-4 py-2">
							<div className="text-gray-500 text-xs">Booking ID</div>
							<div className="mt-1 font-bold text-blue-500 text-xs">
								{/* Skeleton Placeholder for Booking Code */}
								<Skeleton width={100} height={12} />
							</div>
							</div>
							<div className="p-4 border-t">
							<div className="text-xs text-gray-500">PESAWAT DESCRIPTION</div>
							{/* Skeleton Placeholder for Pesawat Description */}
							<Skeleton width={100} height={12} count={5} />
							</div>
							<div className="p-4 border-t">
							<div className="text-xs text-gray-500">LIST PASSENGERS</div>
							{/* Skeleton Placeholder for List Passengers */}
							<Skeleton width={100} height={12} count={5} />
							</div>
						</div>
						<div className="mt-8 py-2 rounded-md border border-gray-200 shadow-sm">
							<div className="px-4 py-2 text-sm text-gray-500">
							<Alert
								banner
								message={
								<Marquee pauseOnHover gradient={false}>
									<span>
									Untuk menu pembayaran, masih dalam proses
									pengembangan.{" "}
									</span>
								</Marquee>
								}
							/>
							</div>
							<div className="flex justify-center">
							<div className="flex justify-center px-8 py-4 text-sm text-gray-500">
								<div className="">
								Tekan tombol{" "}
								<span className="text-center text-blue-500">
									bayar langsung
								</span>{" "}
								untuk melakukan pembayaran secara tunai.
								</div>
							</div>
							</div>
							<div className="flex justify-center mb-4">
							{/* Skeleton Placeholder for Bayar Langsung Button */}
							<Button
								key="submit"
								size="large"
								type="primary"
								className="bg-blue-500"
								disabled
							>
								Bayar Langsung
							</Button>
							</div>
						</div>
					</div>

			</div>
		</>
	)
}

export default BayarLoading;