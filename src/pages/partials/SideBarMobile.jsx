import {GiCommercialAirplane} from 'react-icons/gi'
import {RiHotelLine} from 'react-icons/ri'
import {IoBoatOutline, IoBusOutline} from 'react-icons/io5'
import {MdOutlineTrain} from 'react-icons/md' 
import {FaUmbrellaBeach} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function SideBarMobile() {
    return (
        <aside className="w-full" aria-label="Sidebar">
            <div className="flex w-full overflow-y-auto py-4 px-1" >
                <ul className="w-full grid grid-cols-4 gap-2">
                    <li>
                        <div className={`mt-2 block center cursor-pointer items-center p-2 text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                            <GiCommercialAirplane className='ml-6 text-red-500 text-[28px]' size={28} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-slate-800">Pesawat</span>
                        </div>
                    </li>                    
                    <li>
                        <div className={`mt-2 block cursor-pointer items-center p-2 text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                            <RiHotelLine className='ml-4 text-blue-700' size={28} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-slate-800">Hotel</span>
                        </div>
                    </li>
                    <li>
                        <div className={`mt-2 block cursor-pointer items-center p-2 text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                        <IoBoatOutline className='ml-4 text-fuchsia-500' size={28} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-slate-800">Kapal</span>
                        </div>
                    </li>
                    <li>
                        <div className={`mt-2 block cursor-pointer items-center p-2 text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                        <MdOutlineTrain className='ml-5 text-orange-500' size={28} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-slate-800">Kereta</span>
                        </div>
                    </li>
                    <li>
                    <div className={`mt-2 block cursor-pointer items-center p-2 text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                        <IoBusOutline className='ml-6 text-green-500' size={28} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-slate-800">Travel</span>
                        </div>
                    </li>
                    <li>
                        <div className={`mt-2 block cursor-pointer items-center p-2 text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                        <FaUmbrellaBeach className='ml-6 text-lime-500' size={28} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-slate-800">Wisata</span>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}