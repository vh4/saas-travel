import { useState } from "react";
import { Button, SwipeableDrawer } from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { SlClose } from "react-icons/sl";
import { IoCloseOutline } from "react-icons/io5";

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 30,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const DetailPassengersDrawer = ({ openDrawer, toggleDrawer, dataDetailPassenger}) => {

  return (
    <SwipeableDrawer
      anchor="bottom"
      PaperProps={{ sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30 } }}
      open={openDrawer}
      onClose={() => toggleDrawer(false)}
      onOpen={() => toggleDrawer(true)}
    >
      <StyledBox sx={{ right: 0, left: 0, paddingTop: 0 }}>
        <Puller sx={{ marginTop: 2 }} />
      </StyledBox>
        <div className="header p-4 mt-8 xl:container xl:px-64">
          <div className="px-4 text-lg font-bold flex justify-between items-center">
            <h6>Detail Penumpang</h6>
            <div onClick={() => toggleDrawer(false)} className="cursor-pointer"><IoCloseOutline size={22} className="text-gray-900" /></div>
          </div>
        </div>
        <div className="body px-4">
          {/* body */}
          <div className="w-full mx-0 px-4">    
              {/* adult */}
              {dataDetailPassenger && dataDetailPassenger.adults.length > 0
                ? dataDetailPassenger.adults.map((e, i) => (
                    <>
                      <div className="my-2 text-xs font-bold">
                        Dewasa {i + 1}
                      </div>                    
                      <div className="p-0 w-full rounded-md  border-gray-200 shadow-sm">
                        <div className="">
                          <div className="w-full py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Nama Lengkap</div>
                            <div>{e.nama_depan} {e.nama_belakang}</div>
                          </div>
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>NIK</div>
                            <div>{e.idNumber}</div>
                          </div>
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Email</div>
                            <div>{e.email}</div>
                          </div>    
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Nomor HP</div>
                            <div>{e.nomor}</div>
                          </div>    
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Tanggal Lahir</div>
                            <div>{e.birthdate}</div>
                          </div>                    
                        </div>
                      </div>
                    </>
                  ))
                : ""}

              {/* Childs */}
              <div className="mt-6"></div>
              {dataDetailPassenger &&
              dataDetailPassenger.children.length > 0
                ? dataDetailPassenger.children.map((e, i) => (
                    <>
                      <div className="my-2 text-xs font-bold">
                        Anak {i + 1}
                      </div>                    
                      <div className="p-0 w-full rounded-md  border-gray-200 shadow-sm">
                        <div className="">
                          <div className="w-full py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Nama Lengkap</div>
                            <div>{e.nama_depan} {e.nama_belakang}</div>
                          </div>
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>NIK</div>
                            <div>{e.idNumber}</div>
                          </div>      
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Tanggal Lahir</div>
                            <div>{e.birthdate}</div>
                          </div>                    
                        </div>
                      </div>
                    </>
                  ))
                : ""}

              {/* infants */}
              <div className="mt-6"></div>
              {dataDetailPassenger && dataDetailPassenger.infants.length > 0
                ? dataDetailPassenger.infants.map((e, i) => (
                    <>
                      <div className="my-2 text-xs font-bold">
                        Bayi {i + 1}
                      </div>                    
                      <div className="p-0 w-full rounded-md  border-gray-200 shadow-sm">
                        <div className="">
                          <div className="w-full py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Nama Lengkap</div>
                            <div>{e.nama_depan} {e.nama_belakang}</div>
                          </div>
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>NIK</div>
                            <div>{e.idNumber}</div>
                          </div>       
                          <div className="w-full  py-2 grid grid-cols-2 text-gray-500 border-b border-gray-200 text-xs">
                            <div>Tanggal Lahir</div>
                            <div>{e.birthdate}</div>
                          </div>                    
                        </div>
                      </div>
                    </>
                  ))
                : ""}
            </div>
        </div>
        <footer className="footer">
          <div className="min-w-full p-4">
             <Button onClick={() => toggleDrawer(false)} className="w-full" variant="contained">Tutup</Button>
          </div>
        </footer>
    </SwipeableDrawer>
  );
};

DetailPassengersDrawer.propTypes = {
  openDrawer: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default DetailPassengersDrawer;