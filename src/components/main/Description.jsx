import React from 'react';

export default function Description(){
    return(
        <>
            <div className='mt-24 md:mt-36 title text-center text-lg md:text-2xl font-bold text-gray-600 md:text-gray-800'>
                Temukan Jadwal Tiket Pesawat
            </div>
            <div className='p-4 md:p-0 md:mt-0'>
            <div className='mt-16 md:mt-24 lg:mt-36  block lg:grid lg:grid-cols-2 xl:items-center'>
                <div className='flex md:hidden lg:flex justify-center md:justify-start'>
                    <img src="trav.png" width={"80%"} alt="Travel.png" />
                </div>
                <div className='hidden md:flex lg:hidden justify-center md:justify-start'>
                    <img src="trav.png" width={"50%"} className='mx-auto' alt="Travel.png" />
                </div>
                <div className='w-full mt-4 lg:mt-0'>
                    <div className='flex justify-start font-bold text-md md:text-xl text-gray-600'>
                        Dapatkan Harga Tiket Pesawat Murah dan Cepat Tanpa Ribet.
                    </div>
                    <div className='flex justify-start mt-4 text-sm text-gray-500'>
                        Nikmati Harga tiket pesawat dengan murah meriah hanya di fastravel.com. kamu bisa dengan cepat memesan tiket pesawat tanpa ribet.
                    </div>
                    <div className='flex justify-start mt-4 text-sm text-gray-500'>
                        Kamu juga bisa membandikan jawal tiket pesawat secara online dan memberikan kamu keuntungan untuk memilih harga yang lebih murah. dan kamu juga bisa mendapatkan promo lebih dengan melakukan transaksi secara terus menerus. jangan lupa untuk mengecek promo tiket pesawat supaya kamu bisa lebih hemat.
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>
                        Nikmati kemudahan pembelian tiket anda hanya di <a href="/">fastravel.com</a>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}