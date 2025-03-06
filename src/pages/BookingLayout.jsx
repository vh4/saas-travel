import React from "react";
import Header from "./partials/Header";

export default function BookingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow mt-8">
        <div className="container mx-auto px-0 xl:px-32">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
