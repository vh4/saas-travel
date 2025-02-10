import { List, ListItem, ListItemButton, ListItemText, SwipeableDrawer, Divider } from "@mui/material";
import * as React from "react";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import PropTypes from "prop-types";

export default function SwipeableEdgeDrawer({ open, toggleDrawer, selectedValue, setSelectedValue }) {
  const handleChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <div className="bg-white px-2 py-2">
        <nav aria-label="filter-transport">
          <List>
            {["Semua", "pesawat", "kereta", "pelni"].map((item) => (
              <React.Fragment key={item}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleChange(item)}>
                    <ListItemText primary={item.charAt(0).toUpperCase() + item.slice(1)} />
                    {selectedValue === item ? (
                      <FaCircleCheck className="text-blue-500 ml-2" size={20} />
                    ) : (
                      <MdRadioButtonUnchecked className="text-gray-500 ml-2" size={20} />
                    )}
                  </ListItemButton>
                </ListItem>
                <Divider component="li" sx={{ width: "100%" }} />
              </React.Fragment>
            ))}
          </List>
        </nav>
      </div>
    </SwipeableDrawer>
  );
}

SwipeableEdgeDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
  setSelectedValue: PropTypes.func.isRequired,
};
