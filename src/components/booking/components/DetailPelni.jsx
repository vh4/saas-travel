import { SwipeableDrawer, Box, Divider } from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { Button, Typography } from "antd";
import { toRupiah } from "../../../helpers/rupiah";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setBookDataLanjutBayarPelni } from "../../../features/createSlice";
import { callbackFetchData } from "../../../features/callBackSlice";

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

export default function DetailPelni({ data, openDetail, toggleDrawerDetail }) {
  const { Paragraph } = Typography;

  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDetail = async () => {
    setIsLoading(true);
    try {
      dispatch(
        callbackFetchData({ type: "pelni", id_transaksi: data.id_transaksi })
      );
      dispatch(setBookDataLanjutBayarPelni(data));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(true);
    navigate({
      pathname: `/pelni/detail/payment`,
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
                  <div className="title font-bold">{penumpang.nama}</div>
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

DetailPelni.propTypes = {
  openDetail: PropTypes.bool.isRequired,
  toggleDrawerDetail: PropTypes.func.isRequired,
};
