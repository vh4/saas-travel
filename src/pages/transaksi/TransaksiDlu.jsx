//make create function reactjs

import React, { useEffect } from "react";
import TransaksiDluComponent from "../../components/transaksi_list/ListDlu";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { useTheme } from "@mui/material/styles";
import Page404 from "../partials/404";
import { useMediaQuery } from "@mui/material";

export default function TransaksiDlu() {
  const location = useLocation();
  const path = _.startCase(location.pathname.toString()).split("  ").join("/");

  const theme = useTheme();
  const isXL = useMediaQuery(theme.breakpoints.down("xl"));

  useEffect(() => {
    document.title = "Travel - list transaksi dlu";
  }, []);
  
  if (isXL) {
    return <Page404 />;
  }

  return (
    <>
      <Layout>
        <div className="mt-0 mb-24 xl:mb-0 xl:mt-4 px-4 xl:px-12">
          {/* Profile fitur  */}
          <TransaksiDluComponent path={path} />
        </div>
      </Layout>
    </>
  );
}
