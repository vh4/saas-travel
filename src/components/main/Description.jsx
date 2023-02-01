import React from 'react';

export default function Description(){
    return(
        <>
            <div className='mt-36 title text-center text-2xl font-bold text-gray-800'>
                Temukan Semua Jadwal Tiket Pesawat
            </div>
            <div className=''>
            <div className='mt-36  block lg:grid lg:grid-cols-2 xl:items-center'>
                <div className='flex'>
                    <img src="trav.png" width="80%" alt="Travel.png" />
                </div>
                <div className='w-full'>
                    <div className='flex justify-start font-bold text-xl text-gray-700'>
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