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
                <ul className="p-4 w-full grid grid-cols-4 gap-2">
                    <li>
                        <div className={`mt-2 block center cursor-pointer items-center text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <GiCommercialAirplane className='text-red-500' size={24} />
                            </div>
                            <span className="block text-center font-normal mt-2 flex-1 whitespace-nowrap text-[15px] text-gray-500 ">Pesawat</span>
                        </div>
                    </li>    
                    <li>                
                        <div className={`mt-2 block center cursor-pointer items-center text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <IoBoatOutline className='text-fuchsia-500' size={24} />
                            </div>
                            <span className="block text-center font-normal mt-2 flex-1 whitespace-nowrap text-[15px] text-gray-500">Pelni</span>
                        </div>
                    </li> 
                    <li>                
                        <div className={`mt-2 block center cursor-pointer items-center text-sm font-bold text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <MdOutlineTrain className='text-orange-500' size={24} />
                            </div>
                            <span className="block text-center font-normal mt-2 flex-1 whitespace-nowrap text-[15px] text-gray-500">Kereta Api</span>
                        </div>
                    </li> 
                </ul>
            </div>
        </aside>
    )
}