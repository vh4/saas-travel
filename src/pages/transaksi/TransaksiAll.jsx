import React, { useEffect, useState } from "react";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import Page404 from "../partials/404";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TransaksiAll from "../../components/transaksi/TransaksiAll";

export default function TransaksiAllPage() {
    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split("  ").join("/");
    const [open, setOpen] = useState(false);

    const theme = useTheme();
    const isXL = useMediaQuery(theme.breakpoints.up("xl"));

    useEffect(() => {
        document.title = "Travel - List Transaksi";
    }, []);

    if (isXL) {
        return <Page404 />;
    }

    return (
        <Layout>
            <div className="mt-0 mb-24 xl:mb-0 xl:mt-4 px-4 xl:px-12">
                <TransaksiAll path={path} />
            </div>
        </Layout>
    );
}
