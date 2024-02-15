import Skeleton from 'react-loading-skeleton'
import { IoArrowForwardOutline } from 'react-icons/io5';

const Body = () => {
	return(
	<>
		<div className="mt-14 mb-6">
				<div className='w-48'>
					<Skeleton className='h-4'/>
				</div>
				<div className='mt-1 w-36'>
					<Skeleton className='h-3'/>
				</div>
			</div>
			<div className="w-full border pl-8 pr-6 py-6">
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
				<div className="col-span-1 xl:col-span-2">
					<div className='mt-2 w-24 mb-4'>
						<Skeleton className='h-4'/>
					</div>
					<div className="w-36 bg-gray-100 mb-4">
						<Skeleton className='h-8'/>
					</div>
				</div>
				<div className="col col-span-2">
					<div className='mt-2 w-36 mb-4'>
						<Skeleton className='h-4'/>
					</div>
					<div className="bg-gray-100 mb-4">
						<Skeleton className='h-8'/>
					</div>
				</div>
				<div className="col col-span-2 md:col-span-1">
					<div className='mt-2 w-36 mb-4'>
						<Skeleton className='h-4'/>
					</div>
					<div className="bg-gray-100">
						<Skeleton className='h-8'/>
 					</div>
					<div className='mt-2 w-48 mb-4'>
						<Skeleton className='h-4'/>
					</div>
				</div>
				<div className="col col-span-2 md:col-span-1">
					<div className='mt-2 w-36 mb-4'>
						<Skeleton className='h-4'/>
					</div>
					<div className="bg-gray-100">
						<Skeleton className='h-8'/>
					</div>
					<div className='mt-2 w-48 mb-4'>
						<Skeleton className='h-4'/>
					</div>
				</div>
				</div>
			</div>
	</>
	)
}

const Sidebar = () => {

	return(
		<div>
		<div className="hidden xl:block rounded-md border border-gray-200 shadow-sm">
		<div className="p-2 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
		<div className="text-black text-sm ">
			<Skeleton width={150} />
		</div>
		<small className="text-xs text-black">
			<Skeleton width={100} />
		</small>
		</div>
		<div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
		<div className="text-xs  text-black">
			<div>
			<Skeleton width={100} />
			</div>
			<div>
			<Skeleton width={50} />
			</div>
		</div>
		<div className="rounded-full p-2 bg-blue-500 text-white">
			<IoArrowForwardOutline />
		</div>
		<div className="text-xs  text-black">
			<div>
			<Skeleton width={100} />
			</div>
			<div>
			<Skeleton width={50} />
			</div>
		</div>
		</div>

		<div className="p-4 pl-8 text-black">
		<div className="text-xs ">
			<Skeleton width={150} />
		</div>
		<small>
			<Skeleton width={100} />
		</small>
		</div>
		<div className="p-4 pl-12 mb-4">
		<ol className="relative border-l-2 border-dotted border-gray-300 ">
			<li className="mb-10 ml-4 text-sm">
			<div className="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 "></div>
			<div className="flex space-x-12">
				<time className="mb-1 text-xs  leading-none text-gray-400 ">
				<Skeleton width={100} />
				</time>
				<div className="-mt-2">
				<h3 className="text-left text-xs  text-black ">
					<Skeleton width={100} />
				</h3>
				<p className="text-left text-xs  text-black ">
					<Skeleton width={50} />
				</p>
				</div>
			</div>
			</li>
			<li className="ml-4 text-sm mt-10">
			<div className="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
			<div className="flex space-x-12">
				<time className="mb-1 text-xs  leading-none text-gray-400 ">
				<Skeleton width={100} />
				</time>
				<div className="-mt-2">
				<h3 className="text-left text-xs  text-black ">
					<Skeleton width={100} />
				</h3>
				<p className="text-left text-xs  text-black ">
					<Skeleton width={50} />
				</p>
				</div>
			</div>
			</li>
		</ol>
		</div>
		</div>
		</div>
	)

}

const SidebarMobile = () => {

	return(
		<div>
		<div className="block xl:hidden rounded-md border border-gray-200 shadow-sm">
		<div className="p-2 py-4 border-t-0 border-b border-r-0 border-l-4 border-l-blue-500 border-b-gray-100">
		<div className="text-black text-sm ">
			<Skeleton width={150} />
		</div>
		<small className="text-xs text-black">
			<Skeleton width={100} />
		</small>
		</div>
		<div className="px-4 xl:px-8 p-4 flex justify-between space-x-12 items-center">
		<div className="text-xs  text-black">
			<div>
			<Skeleton width={50} />
			</div>
			<div>
			<Skeleton width={50} />
			</div>
		</div>
		<div className="rounded-full p-2 bg-blue-500 text-white">
			<IoArrowForwardOutline />
		</div>
		<div className="text-xs  text-black">
			<div>
			<Skeleton width={50} />
			</div>
			<div>
			<Skeleton width={50} />
			</div>
		</div>
		</div>

		<div className="p-4 pl-8 text-black">
		<div className="text-xs ">
			<Skeleton width={150} />
		</div>
		<small>
			<Skeleton width={100} />
		</small>
		</div>
		<div className="p-4 pl-12 mb-4">
		<ol className="relative border-l-2 border-dotted border-gray-300 ">
			<li className="mb-10 ml-4 text-sm">
			<div className="absolute w-4 h-4 rounded-full mt-0 bg-white -left-2 border border-gray-400 "></div>
			<div className="flex space-x-12">
				<time className="mb-1 text-xs  leading-none text-gray-400 ">
				<Skeleton width={100} />
				</time>
				<div className="-mt-2">
				<h3 className="text-left text-xs  text-black ">
					<Skeleton width={100} />
				</h3>
				<p className="text-left text-xs  text-black ">
					<Skeleton width={50} />
				</p>
				</div>
			</div>
			</li>
			<li className="ml-4 text-sm mt-10">
			<div className="absolute mt-2 w-4 h-4 bg-blue-500 rounded-full -left-2 border border-white "></div>
			<div className="flex space-x-12">
				<time className="mb-1 text-xs  leading-none text-gray-400 ">
				<Skeleton width={100} />
				</time>
				<div className="-mt-2">
				<h3 className="text-left text-xs  text-black ">
					<Skeleton width={100} />
				</h3>
				<p className="text-left text-xs  text-black ">
					<Skeleton width={50} />
				</p>
				</div>
			</div>
			</li>
		</ol>
		</div>
		</div>
		</div>
	)

}

const BookingLoading = ({total}) => {
	return(
		<>
			<div >
				<div className="w-full block xl:flex xl:space-x-10 mb-24 ">
					<div className='w-full'>
					<div className="mt-14 w-full">
						<SidebarMobile />
					</div>
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
					{Array.from({ length: total }, (_, i) => (
						<Body />
					))}
					</div>
					<div className="mt-14 w-1/2">
						<Sidebar />
					</div>
				</div>
			</div>
		</>
	)
}

export default BookingLoading;