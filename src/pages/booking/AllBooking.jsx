import React, { useEffect, useState } from "react";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import BookingAll from "../../components/booking/BookingAll";
import Page404 from "../partials/404";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BookingAllPage() {
    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split("  ").join("/");
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const isXL = useMediaQuery(theme.breakpoints.up("lg"));

    useEffect(() => {
        document.title = "Travel - List Booking";
    }, []);

    if (isXL) {
        return <Page404 />;
    }

    return (
        <Layout>
            <div className="mt-0 mb-24 md:mb-0 md:mt-4 px-4 md:px-12">
                < BookingAll path={path} />
            </div>
        </Layout>
    );
}
