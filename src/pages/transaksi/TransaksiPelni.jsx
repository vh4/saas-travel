//make create function reactjs

import React, { useEffect } from "react";
import TransaksiPelniComponent from "../../components/transaksi_list/ListPelni";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { useMediaQuery } from "@mui/material";
import Page404 from "../partials/404";
import { useTheme } from "@mui/material/styles";

export default function TransaksiKapal() {
  const location = useLocation();
  const path = _.startCase(location.pathname.toString()).split("  ").join("/");
  const theme = useTheme();
  const isXL = useMediaQuery(theme.breakpoints.down("xl"));

  useEffect(() => {
    document.title = "Travel - list transaksi pelni";
  }, []);
  
  if (isXL) {
    return <Page404 />;
  }

  return (
    <>
      <Layout>
        <div className="mt-0 mb-24 xl:mb-0 xl:mt-4 px-4 xl:px-12">
          {/* Profile fitur  */}
          <TransaksiPelniComponent path={path} />
        </div>
      </Layout>
    </>
  );
}
