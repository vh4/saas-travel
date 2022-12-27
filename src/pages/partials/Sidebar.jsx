import {GiCommercialAirplane} from 'react-icons/gi'
import {RiHotelLine} from 'react-icons/ri'
import {IoBoatOutline, IoBusOutline} from 'react-icons/io5'
import {MdOutlineTrain} from 'react-icons/md' 
import {FaUmbrellaBeach} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Sidebar({pathSidebar}) {

    return (
        <aside className="pl-24 mt-8" aria-label="Sidebar">
            <div className="flex pb-12 justify-center md:w-64 xl:w-72 overflow-y-auto py-4 px-3 bg-gray-100 xl:bg-gray-50 rounded dark:bg-gray-800" >
                <ul className="space-y-2 mt-8 xl:mt-10">
                    <li>
                        <Link to='/' className={`flex ${ pathSidebar === '/' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                            <RiHotelLine size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Plane</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/hotel' className={`flex ${ pathSidebar === '/hotel' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <GiCommercialAirplane size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Hotel</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/pelni' className={`flex ${ pathSidebar === '/pelni' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <IoBoatOutline size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Pelni</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/train' className={`flex ${ pathSidebar === '/train' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <MdOutlineTrain size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Train</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/travel' className={`flex ${ pathSidebar === '/travel' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <IoBusOutline size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Travel Bus</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/wisata' className={`flex ${ pathSidebar === '/wisata' ? 'bg-gray-200' : ''} items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}>
                        <FaUmbrellaBeach size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap">Wisata</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}