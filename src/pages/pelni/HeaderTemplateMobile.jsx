import React from "react";
import { IoArrowBack } from "react-icons/io5";

export default function HeaderTemplateMobile({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <div className="block md:hidden mb-2">
          <div className="flex space-x-3.5 items-center w-ful text-black px-2 py-[18px]">
            <div className="ml-2" onClick={() => window.history.back()}>
              <div className="flex space-x-2 items-center">
                <IoArrowBack size={22} />
                 <div className="text-md font-medium">Previous</div>
              </div>
            </div>
            <div className="my-2 border-t"></div>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <div className="container mx-auto px-0 xl:px-32">
          <main>{children}</main>
        </div>
      </div>
      {/* <footer className="border-t text-sm text-black py-6">
        <div className="container mx-auto">
          <p className="text-center">
            © 2015-2023 rajabiller.com. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
