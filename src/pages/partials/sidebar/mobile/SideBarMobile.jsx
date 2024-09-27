import {GiCommercialAirplane} from 'react-icons/gi'
import {IoAirplaneOutline, IoBoatOutline, IoBoatSharp, IoTrainOutline} from 'react-icons/io5'
import {MdOutlineTrain} from 'react-icons/md' 

export default function SideBarMobile({nameMenu, setNameMenu}) {
    return (
        <aside className="w-full" aria-label="Sidebar">

            <div className="mt-4 md:mt-0 -mb-4 md:mb-0 flex justify-center w-full overflow-y-auto py-4 px-1" >
                <ul className="p-4 w-full grid grid-cols-4 gap-2">
                    <li>
                        <div onClick={() => setNameMenu('plane')} className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${ nameMenu === 'plane' ? 'border-b-2 border-blue-500' : ''}`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <IoAirplaneOutline className='text-red-500' size={24} />
                            </div>
                            <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black ">Pesawat</span>
                        </div>
                    </li>    
                    <li>                
                        <div onClick={() => setNameMenu('pelni')} className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${ nameMenu === 'pelni' ? 'border-b-2 border-blue-500' : ''}`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <IoBoatOutline className='text-fuchsia-500' size={24} />
                            </div>
                            <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black">Pelni</span>
                        </div>
                    </li> 
                    <li>                
                        <div onClick={() => setNameMenu('train')} className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${ nameMenu === 'train' ? 'border-b-2 border-blue-500' : ''}`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <IoTrainOutline className='text-orange-500' size={24} />
                            </div>
                            <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black">Kereta Api</span>
                        </div>
                    </li>
                    {/* <li>                
                        <div onClick={() => setNameMenu('dlu')} className={`mt-4 block center cursor-pointer items-center text-sm font-bold text-gray-900 ${ nameMenu === 'dlu' ? 'border-b-2 border-blue-500' : ''}`}>
                            <div className='bg-gray-100 mx-4 py-3 flex justify-center rounded-xl'>
                                <IoBoatSharp className='text-green-500' size={24} />
                            </div>
                            <span className="block text-xs text-center font-normal mt-4 flex-1 whitespace-nowrap text-[15px] text-black">Dlu</span>
                        </div>
                    </li>  */}
                </ul>
            </div>
        </aside>
    )
}