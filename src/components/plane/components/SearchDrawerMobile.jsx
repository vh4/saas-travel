import { SwipeableDrawer, Box, Divider, Button } from "@mui/material";
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { Typography } from "antd";
import { toRupiah } from "../../../helpers/rupiah";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent/TimelineContent";
import { parseTanggal } from "../../../helpers/date";
import Timeline from "@mui/lab/Timeline/Timeline";
import { IoMdTimer } from "react-icons/io";
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

export default function SearchDrawerMobile({ data, openDetail, toggleDrawerDetail, adult, child, infant, detailTiket, index }) {
  const { Paragraph } = Typography;
  const e = data;
  
  return (
    <SwipeableDrawer
	  PaperProps={{ sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30 } }}
      anchor="bottom"
      open={openDetail}
      onClose={toggleDrawerDetail}
      onOpen={toggleDrawerDetail}
    >
      <StyledBox sx={{ right: 0, left: 0, paddingTop: 0 }}>
        <Puller sx={{ marginTop: 2 }} />
      </StyledBox>
      <StyledBox sx={{ py: 2, pt: 6, px: 2, height: "100%", overflow: "auto" }}>
			<div className="header mt-4">
			<div className="px-4 text-lg font-bold flex justify-between items-center">
				<h6>Detail Penerbangan</h6>
				<div onClick={() => toggleDrawerDetail(false)} className="cursor-pointer"><IoCloseOutline size={22} className="text-gray-900" /></div>
			</div>
			</div>
			<>
			{e.isTransit === true ? (
				e.classes.map((x, i) => (
				<div className="p-4 flex justify-between items-center mt-4 xl:hidden">
					<div className="">
					<div className="">
						<div className="text-black text-xs font-medium ">
						{x[0].departureTime}
						</div>
						<div className="text-black text-xs">
						{parseTanggal(
							x[0].departureDate
						)}
						</div>
					</div>
					<div className="mt-4 text-black">
						<Timeline
						sx={{
							[`& .${timelineItemClasses.root}:before`]:
							{
								flex: 0,
								padding: 0,
								borderColor: "black",
							},
						}}
						>
						<TimelineItem>
							<TimelineSeparator>
							<TimelineDot />
							<TimelineConnector />
							</TimelineSeparator>
							<TimelineContent
							sx={{
								py: "16px",
								px: 2,
								color: "black",
							}}
							>
							<Typography
								sx={{
								fontSize: 12,
								color: "black",
								}}
								component="span"
							>
								{x[0].departure}
							</Typography>
							<Typography
								sx={{
								fontSize: 12,
								color: "black",
								}}
							>
								{x[0].departureName}
							</Typography>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem>
							<TimelineDot
							sx={{
								backgroundColor: "orange",
							}}
							>
							<IoMdTimer />
							</TimelineDot>
							<TimelineContent
							sx={{
								py: "12px",
								px: 2,
								color: "black",
							}}
							>
							<Typography
								sx={{
								fontSize: 12,
								color: "black",
								}}
								component="span"
							>
								{x[0].duration}
							</Typography>
							</TimelineContent>
						</TimelineItem>
						<TimelineItem>
							<TimelineSeparator>
							<TimelineConnector />
							<TimelineDot />
							</TimelineSeparator>
							<TimelineContent
							sx={{
								px: 2,
								color: "black",
							}}
							>
							<Typography
								sx={{
								fontSize: 12,
								color: "black",
								}}
								component="span"
							>
								{x[0].arrival}
							</Typography>
							<Typography
								sx={{
								fontSize: 12,
								color: "black",
								}}
							>
								{x[0].arrivalName}
							</Typography>
							</TimelineContent>
						</TimelineItem>
						</Timeline>
					</div>
					<div className="">
						<div className="text-xs ">
						{x[0].arrivalTime}
						</div>
						<div className="text-xs">
						{parseTanggal(x[0].arrivalDate)}
						</div>
					</div>
					</div>
					{/* <div className="mt-4 text-black">
					<div className="items-center">
					<div>
						<CiRollingSuitcase size={32} />
					</div>
					<div className="text-xs">
						<div>
						Berat Bagasi maks.{" "}
						<span className="font-normal ">
							20 kg
						</span>
						</div>
						<div className="mt-1">
						Jika {">"} 20 kg akan dikenakan
						biaya.
						</div>
					</div>
					</div>
				</div> */}
				</div>
				))
			) : (
				<div className="flex justify-between items-center p-4 mt-6 border-t xl:hidden">
				<div>
					<div className="">
					<div className="text-xs font-medium ">
						{e.classes[0][0].departureTime}
					</div>
					<div className="text-xs">
						{parseTanggal(
						e.classes[0][0].departureDate
						)}
					</div>
					</div>
					<div className="mt-4">
					<Timeline
						sx={{
						[`& .${timelineItemClasses.root}:before`]:
							{
							flex: 0,
							padding: 0,
							borderColor: "black",
							},
						}}
					>
						<TimelineItem>
						<TimelineSeparator>
							<TimelineDot />
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent
							sx={{
							py: "16px",
							px: 2,
							color: "black",
							}}
						>
							<Typography
							sx={{
								fontSize: 12,
								color: "black",
							}}
							component="span"
							>
							{e.classes[0][0].departure}
							</Typography>
							<Typography
							sx={{
								fontSize: 12,
								color: "black",
							}}
							>
							{
								e.classes[0][0]
								.departureName
							}
							</Typography>
						</TimelineContent>
						</TimelineItem>
						<TimelineItem>
						<TimelineDot
							sx={{
							backgroundColor: "orange",
							}}
						>
							<IoMdTimer />
						</TimelineDot>
						<TimelineContent
							sx={{
							py: "12px",
							px: 2,
							color: "black",
							}}
						>
							<Typography
							sx={{
								fontSize: 12,
								color: "black",
							}}
							component="span"
							>
							{e.classes[0][0].duration}
							</Typography>
						</TimelineContent>
						</TimelineItem>
						<TimelineItem>
						<TimelineSeparator>
							<TimelineConnector />
							<TimelineDot />
						</TimelineSeparator>
						<TimelineContent
							sx={{ px: 2, color: "black" }}
						>
							<Typography
							sx={{
								fontSize: 12,
								color: "black",
							}}
							component="span"
							>
							{e.classes[0][0].arrival}
							</Typography>
							<Typography
							sx={{
								fontSize: 12,
								color: "black",
							}}
							>
							{
								e.classes[0][0]
								.arrivalName
							}
							</Typography>
						</TimelineContent>
						</TimelineItem>
					</Timeline>
					<div className="block mt-4">
						<div className="text-xs font-normal ">
						{e.classes[0][0].arrivalTime}
						</div>
						<div className="text-xs">
						{parseTanggal(
							e.classes[0][0].arrivalDate
						)}
						</div>
					</div>
					</div>
				</div>
				{/* 
				<div className="mt-4 text-black">
				<div className="items-center">
					<div>
					<CiRollingSuitcase size={32} />
					</div>
					<div className="text-xs">
					<div>
						Berat Bagasi maks.{" "}
						<span className="font-normal ">
						20 kg
						</span>
					</div>
					<div className="mt-1">
						Jika {">"} 20 kg akan dikenakan
						biaya.
					</div>
					</div>
				</div>
				</div> */}
				</div>
			)}
			</>

		{/* mobile detail harga */}
			<>
			{e.isTransit === true ? (
				<>
				{e.classes.map((z, w) => (
					<>
					<div className="p-4 flex space-x-4 justify-between items-start mt-2 border-t xl:hidden">
						<div className="mt-4">
						<div className="text-xs font-normal ">
							{e.detailTitle[w].flightName}{" "}
						</div>
						<div className="text-xs">
							{e.detailTitle[w].flightCode}
						</div>
						<div>
							<img
							src={
								e.detailTitle[w]
								.flightIcon
							}
							width={60}
							alt="image.png"
							/>
						</div>
						</div>
						<div className="mt-8">
						<div className="text-xs text-black">
							<div className="">
							<div className="text-xs">
								{" "}
								Harga Tiket Adult ({adult}
								x){" "}
							</div>
							<div className="text-xs">
								{" "}
								Rp.
								{toRupiah(
								e.classes.reduce((sum, item) => sum + item[0].price, 0) * adult
								)}
							</div>
							</div>
							{child > 0 ? (
							<div className="mt-4">
								<div className="text-xs">
								{" "}
								Harga Tiket Child (
								{child}
								x){" "}
								</div>
								<div>
								{" "}
								Tergantung jenis
								maskapai yang dipilih.
								</div>
							</div>
							) : null}
							{infant > 0 ? (
							<div className="mt-4">
								<div className="text-xs">
								Harga Tiket Infant (
								{infant}x){" "}
								</div>
								<div className="text-xs">
								Tergantung jenis
								maskapai yang dipilih.
								</div>
							</div>
							) : null}
						</div>
						</div>
					</div>
					</>
				))}
				</>
			) : (
				<div className="text-black p-4 flex space-x-4 justify-between items-start mt-6 border-t xl:hidden">
				<div className="mt-4">
					<div className="text-black text-xs font-medium ">
					{e.airlineName}{" "}
					</div>
					<div className="text-black text-xs">
					{e.classes[0][0].flightCode}
					</div>
					<div>
					<img
						src={e.airlineIcon}
						width={60}
						alt="image.png"
					/>
					</div>
				</div>
				<div className="mt-4">
					<div className="text-xs text-black">
					<div className="">
						<div className="text-xs">
						{" "}
						Harga Tiket Adult ({
							adult
						}x){" "}
						</div>
						<div>
						{" "}
						Rp.
						{toRupiah(
							e.classes.reduce((sum, item) => sum + item[0].price, 0) * adult
						)}
						</div>
					</div>
					{child > 0 ? (
						<div className="mt-4">
						<div className="text-xs">
							{" "}
							Harga Tiket Child ({
							child
							}x){" "}
						</div>
						<div>
							{" "}
							Tergantung jenis maskapai yang
							dipilih.
						</div>
						</div>
					) : null}
					{infant > 0 ? (
						<div className="mt-4">
						<div className="text-xs">
							Harga Tiket Infant ({infant}x){" "}
						</div>
						<div className="text-xs">
							Tergantung jenis maskapai yang
							dipilih.
						</div>
						</div>
					) : null}
					</div>
				</div>
				</div>
			)}
			</>
      </StyledBox>
    </SwipeableDrawer>
  );
}

SearchDrawerMobile.propTypes = {
  openDetail: PropTypes.bool.isRequired,
  toggleDrawerDetail: PropTypes.func.isRequired,
};
