import { Box, Checkbox, FormControlLabel, FormGroup, SwipeableDrawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import PelniSearch from "../PelniSearch";
import { Spin } from "antd";

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

const FilterMobilePelniDrawer = ({ 
  openDrawer, 
  toggleDrawer, 
  filterNamaKapalList,
  filterNamaKapal,
  handleFilterKapalChange,
  isLoading
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
        <div className="px-4 mb-8">
            <div className="py-4 text-lg font-bold">
              <h6>Filter Kapal</h6>
            </div>
            <div className="block text-xs ">
            <Box >
              <FormGroup>
                {!isLoading ? (
                  <>
                    {filterNamaKapalList !== null && filterNamaKapalList.length > 0 ? (
                      <>
                        {                                    
                          filterNamaKapalList.map((x, i) => (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={filterNamaKapal[i].split(':')[1] === 'true'}
                                  onChange={() => handleFilterKapalChange(x.SHIP_NAME, i)}
                                  size="small"
                                />
                              }
                              label={<span style={{ fontSize: "12px" }}>{x.SHIP_NAME}</span>}
                            />
                          </>
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="text center">
                            <small>Data tidak ada!.</small>
                        </div>
                      </>
                    )}
                </>
                ) :
                (
                <>
                    <div className="p-4 mt-4 mb-4">
                      <Spin tip="Loading...">
                          <div className="content" />
                      </Spin>
                    </div>                           
                </>)}
              </FormGroup>
            </Box>
            </div>
        </div>
      </div>
    </SwipeableDrawer>
  );
};

const SearchMobilePelniDrawer = ({ openDrawer, toggleDrawer }) => {
  return (
      <SwipeableDrawer
        anchor="bottom"
        PaperProps={{ sx: { borderTopLeftRadius: 30, borderTopRightRadius: 30, zIndex:1 } }}
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <StyledBox sx={{ right: 0, left: 0, paddingTop: 0 }}>
          <Puller sx={{ marginTop: 2 }} />
        </StyledBox>
        <div className="p-4 mt-2 xl:container xl:px-64 z-50">
          <div className="p-4 z-50">
            <PelniSearch />
          </div>
        </div>
      </SwipeableDrawer>
  );
};

// Pastikan setiap komponen diekspor dengan benar
export { FilterMobilePelniDrawer, SearchMobilePelniDrawer };
