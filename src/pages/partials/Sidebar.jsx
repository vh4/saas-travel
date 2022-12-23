import {GiCommercialAirplane} from 'react-icons/gi'
import {RiHotelLine} from 'react-icons/ri'
import {IoBoatOutline, IoBusOutline} from 'react-icons/io5'
import {MdOutlineTrain} from 'react-icons/md' 
import {FaUmbrellaBeach} from 'react-icons/fa'

export default function Sidebar() {
    return (
        <aside className="md:w-64 lg:w-64 mt-20" aria-label="Sidebar">
            <div className="overflow-y-auto py-4 px-3 bg-gray-100 xl:bg-gray-50 rounded dark:bg-gray-800 h-full md:h-screen" >
                <ul className="space-y-2 mt-8">
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <RiHotelLine size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Hotel</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <GiCommercialAirplane size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Plane</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <IoBoatOutline size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Pelni</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MdOutlineTrain size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Train</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <IoBusOutline size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Travel Bus</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FaUmbrellaBeach size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Wisata</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}