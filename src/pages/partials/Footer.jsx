//make create function reactjs

import React from "react";

export default function Footer() {
  return (
    <>
      <footer className={`container ${localStorage.getItem("hdrs_c") == "false" ? "" : "" } mx-auto px-0 xl:px-16 bg-white text-center text-gray-600 lg:text-left`}>
        <div className="mt-24"></div>
        {/* {localStorage.getItem("hdrs_c") != "false" && (<>
          <div class="container mx-auto flex items-center justify-center border-b-2 border-neutral-200 p-6 lg:justify-between">
            <div class="mr-12 hidden lg:block">
              <span>Terhubunglah dengan kami di jaringan sosial:</span>
            </div>
            <div class="flex justify-center">
              <a
                href="https://twitter.com/h2hrajabiller"
                class="mr-6 text-neutral-600 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/rajabiller"
                target="_blank"
                class="mr-6 text-neutral-600 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/rajabiller/"
                target="_blank"
                class="mr-6 text-neutral-600 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  z
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
              </a>
            </div>
          </div>
        </>)}
        {localStorage.getItem("hdrs_c") == "false" ? (<><div className="mt-24"></div></>) : (<>
          <div class="container mx-auto py-10 text-center md:text-left">
            <div class="mx-6 grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div class="">
                <h6 class="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
                  <div className="flex">
                    <img width={"24px"} src="/favicon.ico" alt="favicon.ico" />
                    <p className="pl-2">rajabiller.com</p>
                  </div>
                </h6>
                <p>
                  Rajabiller merupakan lini layanan PPOB (Payment Point on
                  Banking) dari PT. Bimasakti Multi Sinergi yang berfokus pada
                  Sistem Host to Host.
                </p>
              </div>
              <div class="">
                <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                  Kantor Pusat
                </h6>
                <div>
                  PT. Bimasakti Multi Sinergi Delta Raya Utara Kav. 49-51
                  Deltasari Baru, Waru Sidoarjo 61256.
                </div>
              </div>
              <div class="">
                <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                  Navigasi
                </h6>
                <p class="mb-4">
                  <a
                    href="https://wr.rajabiller.com/index.php/modulorder/modulTopup"
                    class="text-neutral-600 "
                  >
                    Tata Cara Deposit
                  </a>
                </p>
                <p class="mb-4">
                  <a
                    href="https://www.rajabiller.com/docs/json"
                    class="text-neutral-600 "
                  >
                    Cek Format Transaksi
                  </a>
                </p>
                <p class="mb-4">
                  <a
                    href="https://api.whatsapp.com/send?phone=6282228740993"
                    class="text-neutral-600 "
                  >
                    Live Chat
                  </a>
                </p>
                <p>
                  <a
                    href="https://wr.rajabiller.com/index.php/login/index/noredirect"
                    class="text-neutral-600 "
                  >
                    Web Report
                  </a>
                </p>
              </div>
              <div>
                <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start">
                  Hubungi Kami
                </h6>
                <p class="mb-4 flex items-center justify-center md:justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-3 h-5 w-5"
                  >
                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                  </svg>
                  Delta raya utara No. 49-51, Sidoarjo.
                </p>
                <p class="mb-4 flex items-center justify-center md:justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-3 h-5 w-5"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                  admin@rajabiller.com
                </p>
                <p class="mb-4 flex items-center justify-center md:justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="mr-3 h-5 w-5"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  + 62 812 330 14 144
                </p>
              </div>
            </div>
          </div>  
          <div className="border-t text-sm text-gray-500 py-6">
            <div className="container mx-auto">
              <p className="text-center">
                © 2015-2023 rajabiller.com. All rights Reserved.
              </p>
            </div>
          </div>
        </>)} */}
      </footer>
    </>
  );
}
