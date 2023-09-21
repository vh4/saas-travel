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
                    Nikmati penawaran tiket pesawat yang terjangkau dan cepat hanya di Rajabiller.com. Kamu bisa dengan mudah memesan tiket pesawat tanpa kerumitan.
                    </div>
                    <div className='flex justify-start mt-4 text-sm text-gray-500'>
                    Kamu juga dapat membandingkan berbagai pilihan tiket pesawat secara online, memberikanmu keunggulan dalam memilih harga yang lebih terjangkau.Selain itu, kamu juga bisa mendapatkan promo tambahan dengan melakukan transaksi secara rutin. Jangan lupa untuk selalu memeriksa promo tiket pesawat agar kamu bisa menghemat lebih banyak.
                    </div>
                    <div className='mt-4 text-sm text-gray-500'>
                    Nikmati kemudahan pembelian tiketmu hanya di <a href="/">rajabiller.com</a>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}