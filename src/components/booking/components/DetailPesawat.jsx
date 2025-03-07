import { SwipeableDrawer, Box, Divider } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { Button, Typography, message } from "antd";
import { toRupiah } from "../../../helpers/rupiah";
import { FaPlaneDeparture } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { callbackFetchData } from "../../../features/callBackSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  setBookDataLanjutBayar,
  setDataSearchPesawat,
} from "../../../features/createSlice";

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

export default function DetailPesawat({
  data,
  openDetail,
  toggleDrawerDetail,
}) {
  const { Paragraph } = Typography;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDetail = async () => {
    setIsLoading(true);
    try {
      dispatch(
        callbackFetchData({ type: "plane", id_transaksi: data.id_transaksi })
      );
      dispatch(setBookDataLanjutBayar(data));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(true);
    navigate({
      pathname: `/flight/detail/payment`,
    });
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={openDetail}
      onClose={toggleDrawerDetail}
      onOpen={toggleDrawerDetail}
    >
      <StyledBox sx={{ right: 0, left: 0, paddingTop: 0 }}>
        <Puller sx={{ marginTop: 2 }} />
      </StyledBox>
      <StyledBox sx={{ py: 4, pt: 6, px: 2, height: "100%", overflow: "auto" }}>
        {/* **ID Transaksi** */}
        <div className="m-2 p-4 py-2 border-l-4 border-l-blue-500 border-b-gray-100">
          <div className="flex justify-between items-center">
            <div className="-mt-4 text-gray-700">ID Transaksi</div>
            <div className="text-blue-500 font-bold">
              <Paragraph copyable className="">
                {data.id_transaksi}
              </Paragraph>
            </div>
          </div>
        </div>

        {/* **Detail Penumpang** */}
        <div className="p-4 text-lg font-bold">
          <h5>Detail Penumpang</h5>
        </div>
        <div className="penumpang">
          {data.penumpang.map((penumpang, index) => (
            <React.Fragment key={index}>
              <div className="p-4 flex items-start space-x-2">
                <div className="font-bold">{index + 1}.</div>
                <div>
                  <div className="flex space-x-2 items-center">
                    <div className="title font-bold">{penumpang.nama}</div>
                    <div className="bg-blue-100 py-1 px-2 text-xs">
                      {penumpang.status}
                    </div>
                  </div>
                  <div className="flex space-x-3 items-center mt-2">
                    <div className="mt-2">{penumpang.nik}</div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center space-x-1">
                      <CiCalendarDate className="mt-2" size={18} />
                      <div className="mt-2">{penumpang.tgl_lahir}</div>
                    </div>
                  </div>
                </div>
              </div>
              <Divider
                component="div"
                sx={{ width: "100%", display: "block" }}
              />
            </React.Fragment>
          ))}
        </div>

        {/* **Pembayaran** */}
        <div className="p-4">
          <div className="mt-4">
            <h5>Pembayaran</h5>
            <div className="p-2 mt-4 w-full rounded-md border-b xl:border xl:border-gray-200">
              <div className="p-2">
                <div className="text-xs text-black font-medium flex justify-between">
                  <div>Nominal</div>
                  <div>Rp. {toRupiah(parseInt(data.nominal))}</div>
                </div>
                <div className="mt-4 text-xs text-black font-medium flex justify-between">
                  <div>Admin</div>
                  <div>Rp. {toRupiah(parseInt(data.nominal_admin))}</div>
                </div>
                <div className="mt-4 pt-2 border-t border-gray-200 text-sm text-black font-medium flex justify-between">
                  <div>Total Harga</div>
                  <div>
                    Rp.{" "}
                    {toRupiah(
                      parseInt(data.nominal) + parseInt(data.nominal_admin)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-center w-full">
              <Button
                onClick={handleDetail}
                size="large"
                key="submit"
                type="primary"
                className="bg-blue-500 px-12 font-semibold w-full"
                loading={isLoading}
              >
                Lanjut Bayar
              </Button>
            </div>
          </div>
        </div>
      </StyledBox>
    </SwipeableDrawer>
  );
}

DetailPesawat.propTypes = {
  openDetail: PropTypes.bool.isRequired,
  toggleDrawerDetail: PropTypes.func.isRequired,
};
