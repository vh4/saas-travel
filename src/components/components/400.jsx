import React from "react";
import { BsArrowBarLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const Page400 = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 64px - 32px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <div className="text-center max-w-[280px]">
          <img
            src="/error1.png"
            alt="Session Expired"
            className="mx-auto" // Tambahkan class mx-auto untuk memastikan gambar berada di tengah secara horizontal
          />
          <div className="mt-4">
              Terjadi Kesalahan pada page. Silahkan lakukan booking ulang.
          </div>
          <Link to={'/'}>
            <div className="flex justify-center mt-4 space-x-2 items-center text-blue-500 cursor-pointer">
              <BsArrowBarLeft size={20} />
              <div>Kembali</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page400;
