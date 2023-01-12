import {GiCommercialAirplane} from 'react-icons/gi'
import {RiHotelLine} from 'react-icons/ri'
import {IoBoatOutline, IoBusOutline} from 'react-icons/io5'
import {MdOutlineTrain} from 'react-icons/md' 
import {FaUmbrellaBeach} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function SidebarUser({nameMenu}) {

    return (
        <aside className="md:w-64 mt-12 xl:mt-24 xl:w-72" aria-label="Sidebar">
            <div className="overflow-y-auto py-4 px-3 bg-gray-100 xl:bg-gray-50 rounded dark:bg-gray-800 h-full md:h-screen" >
                <ul className="space-y-2 mt-8 xl:mt-10 pl-0 xl:pl-24 relative xl:fixed">
                    <li>
                        <div  className={`flex cursor-pointer ${ nameMenu === 'plane' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                            <RiHotelLine size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Plane</span>
                        </div>
                    </li>
                    <li>
                        <div  className={`flex cursor-pointer ${ nameMenu === 'hotel' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <GiCommercialAirplane size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Hotel</span>
                        </div>
                    </li>
                    <li>
                        <div className={`flex cursor-pointer ${ nameMenu === 'pelni' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <IoBoatOutline size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Pelni</span>
                        </div>
                    </li>
                    <li>
                        <div  className={`flex cursor-pointer ${ nameMenu === 'train' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <MdOutlineTrain size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Train</span>
                        </div>
                    </li>
                    <li>
                        <div className={`flex cursor-pointer ${ nameMenu === 'travel' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <IoBusOutline size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Travel Bus</span>
                        </div>
                    </li>
                    <li>
                        <div className={`flex cursor-pointer ${ nameMenu === 'wisata' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <FaUmbrellaBeach size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Wisata</span>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}