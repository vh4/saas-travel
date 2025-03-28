import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  SwipeableDrawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { toRupiah } from "../../../helpers/rupiah";
import Slider from "@mui/material/Slider";
import { Space } from "antd";
import { Radio } from "antd";
import KAISearch from "../KAISearch";

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

const FilterMobileKeretaDrawer = ({
  openDrawer,
  toggleDrawer,
  waktuFilter,
  handleWaktuFilterChange,
  valHargaRange,
  hargraRangeChange,
}) => {
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
      <div className="px-4 mt-8">
        {/* <div className="header">
        <div className="px-2 text-lg font-bold flex justify-between items-center">
          <h6></h6>
          <div onClick={() => toggleDrawer(false)} className="cursor-pointer"><IoCloseCircle size={28} className="text-red-500" /></div>
        </div>
        </div> */}
        <div className="px-4">
          <div className="py-4 text-lg font-bold">
            <h6>Filter Waktu</h6>
          </div>
          <Box sx={{ width: 120 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={waktuFilter[0]}
                    value="06:00-11:59"
                    onChange={handleWaktuFilterChange}
                    size="small"
                  />
                }
                label={<span style={{ fontSize: "12px" }}>06.00 - 12.00</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={waktuFilter[1]}
                    value="12:00-17:59"
                    onChange={handleWaktuFilterChange}
                    size="small"
                  />
                }
                label={<span style={{ fontSize: "12px" }}>12.00 - 18.00</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={waktuFilter[2]}
                    value="18:00-23:59"
                    onChange={handleWaktuFilterChange}
                    size="small"
                  />
                }
                label={<span style={{ fontSize: "12px" }}>18.00 - 00.00</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={waktuFilter[3]}
                    value="00:00-05:59"
                    onChange={handleWaktuFilterChange}
                    size="small"
                  />
                }
                label={<span style={{ fontSize: "12px" }}>00.00 - 06.00</span>}
              />
            </FormGroup>
          </Box>
        </div>
        <div className="px-4 mb-8">
          <div className="py-4 text-lg font-bold">
            <h6>Filter Harga</h6>
          </div>
          <div className="block text-xs">
            <div>
              Range antara Rp.{toRupiah(valHargaRange[0])} - Rp.
              {toRupiah(valHargaRange[1])}
            </div>
            <Slider
              min={0}
              max={10000000}
              value={valHargaRange}
              onChange={hargraRangeChange}
              step={1000}
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      </div>
    </SwipeableDrawer>
  );
};

const SortMobileKeretaDrawer = ({
  openDrawer,
  toggleDrawer,
  HargaTerendahTinggi,
  setHargaTerendahTinggi,
}) => {
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
      <div className="p-4 mt-2 xl:container xl:px-64">
        <div className="px-4 mt-8 text-lg font-bold">
          <h6>Sortir Penerbangan</h6>
        </div>
        <div className="px-4">
          <div className="">
            <Box sx={{ width: 150 }}>
              <Radio.Group
                className="mt-2"
                onChange={(e) => setHargaTerendahTinggi(e.target.value)}
                value={HargaTerendahTinggi}
              >
                <Space direction="vertical">
                  <Radio value={1} className="mt-2">
                    Harga Terendah
                  </Radio>
                  <Radio value={2} className="mt-2">
                    Harga Tertinggi
                  </Radio>
                </Space>
              </Radio.Group>
            </Box>
          </div>
        </div>
      </div>
    </SwipeableDrawer>
  );
};

const SearchMobileKeretaDrawer = ({ openDrawer, toggleDrawer }) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      PaperProps={{
        sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30, zIndex: 1 },
      }}
      open={openDrawer}
      onClose={() => toggleDrawer(false)}
      onOpen={() => toggleDrawer(true)}
    >
      <StyledBox sx={{ right: 0, left: 0, paddingTop: 0 }}>
        <Puller sx={{ marginTop: 2 }} />
      </StyledBox>
      <div className="p-4 mt-2 xl:container xl:px-64 z-50">
        <div className="p-4 z-50">
          <KAISearch />
        </div>
      </div>
    </SwipeableDrawer>
  );
};

// Pastikan setiap komponen diekspor dengan benar
export {
  FilterMobileKeretaDrawer,
  SortMobileKeretaDrawer,
  SearchMobileKeretaDrawer,
};
