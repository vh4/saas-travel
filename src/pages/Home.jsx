//make create function reactjs

import React from "react";
import Layout from "./Layout";

export default function Home(){
    return(
        <Layout >
            <div className="bg-blue-600">
                <div className="grid grid-cols-2 space-x-80">
                    <div className="text-white mt-10 ml-5">
                        <h1 className="text-4xl font-extrabold tracking-tight leading-none">Selamat Datang Di Sate Kuda</h1>
                        <p className="text-lg font-normal">Nikmati sate daging kuda terlengkap dan termurah di Indonesia</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
