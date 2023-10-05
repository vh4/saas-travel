import React from "react";
import Header from "./partials/Header";

export default function BookingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow mt-8">
        <div className="container mx-auto px-0 xl:px-36">
          <main>{children}</main>
        </div>
      </div>
      <footer className="border-t text-sm text-gray-500 py-6">
        <div className="container mx-auto">
          <p className="text-center">
            © 2015-2023 rajabiller.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
