import React from "react";

export default function Seats(){
    return(
        <>
        <div classvName="">
            <div className="judul-header font-bold text-slate-700">
                Pilih Kursi
            </div>
            <div className="grid grid-cols-2 mt-10">
                {/* seats cols and rows kereta premium  dan bisnis */}
                <div className="">
                    <div className="seats flex items-center space-x-28">                     
                        <div className="col-ab flex space-x-4 text-blue-500">
                            <div className="pl-3">A</div>
                            <div className="pl-6">B</div>
                        </div>
                        <div className="col-cd flex space-x-4 text-blue-500">
                            <div className="pl-5">C</div>
                            <div className="pl-6">D</div>
                        </div>
                    </div>
                    <div className="seats flex space-x-12 mt-6">                     
                        <div className="col-ab flex space-x-4">
                            <input className="bg-blue-600 border-blue-600 focus:ring-0 p-4 rounded-lg" type="checkbox" />
                            <input className="bg-blue-600  border-blue-600 focus:ring-0 p-4 rounded-lg" type="checkbox" />
                        </div>
                        <div className="mt-2 text-blue-700">1</div>
                        <div className="col-cd flex space-x-4">
                            <input className="bg-blue-600  border-blue-600 focus:ring-0 p-4 rounded-lg" type="checkbox" />
                            <input className="bg-blue-600  border-blue-600 focus:ring-0 p-4 rounded-lg" type="checkbox" />
                        </div>
                    </div>
                </div>
                <div className="sidebar"></div>
            </div>
        </div>
        </>
    )
}