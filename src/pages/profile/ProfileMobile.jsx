import React, { useEffect} from "react";
import Layout from "../LayoutUser";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import Page404 from "../partials/404";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ProfileMobile from "../../components/profile/ViewProfileMobile";

export default function ProfilePage() {
    const location = useLocation();
    const path = _.startCase(location.pathname.toString()).split("  ").join("/");

    const theme = useTheme();
    const isXL = useMediaQuery(theme.breakpoints.up("lg"));

    useEffect(() => {
        document.title = "Travel - Profile";
    }, []);

    if (isXL) {
        return <Page404 />;
    }

    return (
        <Layout>
            <div className="mt-0">
                <ProfileMobile path={path} />
            </div>
        </Layout>
    );
}
