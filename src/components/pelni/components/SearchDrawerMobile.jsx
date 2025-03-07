import React from "react";
import PropTypes from "prop-types";
import { Button, SwipeableDrawer, styled } from "@mui/material";
import { grey } from "@mui/material/colors";
import { IoCloseOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { parseTanggal } from "../../../helpers/date";
import { Timeline } from "antd";

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

function SearchDrawerMobile({
  data,
  openDetail,
  toggleDrawerDetail,
  pelniStatiun,
}) {
  const { DEP_DATE, ARV_DATE, ROUTE } = data;

  return (
    <SwipeableDrawer
      PaperProps={{ sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30 } }}
      anchor="bottom"
      open={openDetail}
      onClose={() => toggleDrawerDetail(false)}
      onOpen={() => toggleDrawerDetail(true)}
    >
      <StyledBox sx={{ right: 0, left: 0, paddingTop: 0 }}>
        <Puller sx={{ marginTop: 2 }} />
      </StyledBox>
      <StyledBox sx={{ py: 2, pt: 6, px: 2, height: "100%", overflow: "auto" }}>
        <div className="header">
          <div className="px-4 text-lg font-bold flex justify-between items-center">
            <h6>Detail Pelabuhan</h6>
            <div
              onClick={() => toggleDrawerDetail(false)}
              className="cursor-pointer"
            >
              <IoCloseOutline size={22} className="text-gray-900" />
            </div>
          </div>
        </div>
        <div className="px-4 mt-8">
          <div className="mb-2 text-sm font-bold">Tanggal Keberangkatan</div>
          <div className="block mb-10">
            <div className="text-xs">
              {parseTanggal(dayjs(DEP_DATE, "YYYYMMDD").format("YYYY-MM-DD"))}{" "}
              s.d{" "}
              {parseTanggal(dayjs(ARV_DATE, "YYYYMMDD").format("YYYY-MM-DD"))}
            </div>
          </div>
          <Timeline>
            {ROUTE.split(/\/\d-/)
              .filter((item) => item !== "")
              .map((h) => (
                <Timeline.Item key={h}>
                  {
                    pelniStatiun.find((z) => parseInt(z.CODE) === parseInt(h))
                      ?.NAME
                  }
                </Timeline.Item>
              ))}
          </Timeline>
        </div>
        <footer className="footer">
          <div className="min-w-full p-4">
            <Button
              onClick={() => toggleDrawerDetail(false)}
              className="w-full"
              variant="contained"
            >
              Tutup
            </Button>
          </div>
        </footer>
      </StyledBox>
    </SwipeableDrawer>
  );
}

SearchDrawerMobile.propTypes = {
  data: PropTypes.object.isRequired,
  openDetail: PropTypes.bool.isRequired,
  toggleDrawerDetail: PropTypes.func.isRequired,
  pelniStatiun: PropTypes.array.isRequired,
};

export default SearchDrawerMobile;
