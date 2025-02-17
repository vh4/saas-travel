import { SwipeableDrawer, Box, Divider, Button } from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { PiChairDuotone, PiDownloadSimple } from "react-icons/pi";
import { Typography } from "antd";
import { toRupiah } from "../../../helpers/rupiah";

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

export default function SearchDrawerMobile({ data, openDetail, toggleDrawerDetail }) {
  const { Paragraph } = Typography;

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
		xaxax
      </StyledBox>
    </SwipeableDrawer>
  );
}

SearchDrawerMobile.propTypes = {
  openDetail: PropTypes.bool.isRequired,
  toggleDrawerDetail: PropTypes.func.isRequired,
};
