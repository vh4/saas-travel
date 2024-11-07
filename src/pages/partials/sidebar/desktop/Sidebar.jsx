import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoAirplaneOutline, IoBoatOutline, IoTrainOutline } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchDataType } from '../../../../features/createSlice';
import { useSearchParams } from 'react-router-dom';

export default function Sidebar({ nameMenu, setNameMenu }) {
    const dispatch = useDispatch();
    const type = useSelector((state) => state.type.data.type);
    const isLoading = useSelector((state) => state.type.isLoading);
    const [searchParams, setSearchParams] = useSearchParams();
    const urlForLogin = window.location.pathname;
    useEffect(() => {

        if(urlForLogin === "/" && searchParams.size == 0){
            dispatch(fetchDataType());
            setNameMenu(type)
        }

    }, [dispatch, type]); //

    return (
        <aside className="w-full" aria-label="Sidebar">
            <div className="flex justify-start w-full overflow-y-auto py-4 px-3 xl:bg-gray-50 rounded">
                <ul className="w-full grid grid-cols-3 lg:grid-cols-4 xl:flex xl:space-x-4 gap-4 xl:gap-0">
                    {(isLoading || type === 'auth' || type === 'pesawat') && (
                        <li>
                            {isLoading ? (
                                <Skeleton height={30} width={100} />
                            ) : (
                                <div
                                    onClick={() => setNameMenu('pesawat')}
                                    className={`flex cursor-pointer px-4 ${nameMenu === 'pesawat' ? 'border-b-2 border-blue-500' : ''} items-center p-2 text-base font-normal text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                                    <IoAirplaneOutline className="text-black text-[28px]" size={20} />
                                    <span className="flex-1 ml-3 whitespace-nowrap text-[15px] text-black">Pesawat</span>
                                </div>
                            )}
                        </li>
                    )}
                    {(isLoading || type === 'auth' || type === 'kereta') && (
                        <li>
                            {isLoading ? (
                                <Skeleton height={30} width={100} />
                            ) : (
                                <div
                                    onClick={() => setNameMenu('kereta')}
                                    className={`flex cursor-pointer px-4 ${nameMenu === 'kereta' ? 'border-b-2 border-blue-500' : ''} items-center p-2 text-base font-normal text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                                    <IoTrainOutline className="text-black" size={20} />
                                    <span className="flex-1 ml-3 whitespace-nowrap text-[15px] text-black">Kereta Api</span>
                                </div>
                            )}
                        </li>
                    )}
                    {(isLoading || type === 'auth' || type === 'pelni') && (
                        <li>
                            {isLoading ? (
                                <Skeleton height={30} width={100} />
                            ) : (
                                <div
                                    onClick={() => setNameMenu('pelni')}
                                    className={`flex cursor-pointer px-4 ${nameMenu === 'pelni' ? 'border-b-2 border-blue-500' : ''} items-center p-2 text-base font-normal text-gray-900 hover:border-blue-500 hover:border-b-2`}>
                                    <IoBoatOutline className="text-black" size={20} />
                                    <span className="flex-1 ml-3 whitespace-nowrap text-[15px] text-black">Pelni Kapal</span>
                                </div>
                            )}
                        </li>
                    )}
                </ul>
            </div>
        </aside>
    );
}
