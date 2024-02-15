import {GiCommercialAirplane} from 'react-icons/gi'
import {IoBoatOutline} from 'react-icons/io5'
import {MdOutlineTrain} from 'react-icons/md' 

export default function Sidebar({nameMenu, setNameMenu}) {
    return (
        <aside className="w-full" aria-label="Sidebar">
            <div className="flex justify-start w-full overflow-y-auto py-4 px-3 xl:bg-gray-50 rounded" >
                <ul className="w-full grid grid-cols-3 lg:grid-cols-4 xl:flex xl:space-x-4 gap-4 xl:gap-0">
                    <li>
                        <div onClick={() => setNameMenu('plane')} className={`flex cursor-pointer px-4 ${ nameMenu === 'plane' ? 'border-b-2 border-blue-500' : ''} items-center p-2 text-base font-normal text-gray-900   hover:border-blue-500 hover:border-b-2`}>
                        <GiCommercialAirplane className='text-red-500 text-[28px]' size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-black">Pesawat</span>
                        </div>
                    </li>                    
                    <li>
                        <div onClick={() => setNameMenu('train')} className={`flex cursor-pointer px-4 ${ nameMenu === 'train' ? 'border-b-2 border-blue-500' : ''} items-center p-2 text-base font-normal text-gray-900   hover:border-blue-500 hover:border-b-2 `}>
                        <MdOutlineTrain className='text-orange-500' size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-black">Kereta Api</span>
                        </div>
                    </li>
                    <li>
                        <div onClick={() => setNameMenu('pelni')} className={`flex cursor-pointer px-4 ${ nameMenu === 'pelni' ? 'border-b-2 border-blue-500' : ''} items-center p-2 text-base font-normal text-gray-900   hover:border-blue-500 hover:border-b-2 `}>
                        <IoBoatOutline className='text-fuchsia-500' size={20} />
                            <span className="flex-1 ml-3 whitespace-nowrap font-semibold text-[15px] text-black">Pelni Kapal</span>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    )
}