import React from "react";

const Page500 = () => {
  return (
    <div
      style={{
        height: 'calc(100vh - 64px - 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="text-center max-w-none md:max-w-[280px]">
        <img
          src="/error.png"
          alt="Session Expired"
          className="flex justify-center w-full md:h-none"
        />
        <div className="mt-4">
          Maaf, terjadi kesalahan. Silakan login kembali.
        </div>
      </div>
    </div>
  );
};

export default Page500;
