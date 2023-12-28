import React, { useContext } from "react";
import { LogoutContent } from "../App";

import Page404 from "./partials/404";
import ExpiredLogin from './partials/ExpiredLogin'

const Logout = () => {

	const {logout} = useContext(LogoutContent);

	return(
		<>
			{logout.IsLogout === true ? (
				<>
					<ExpiredLogin />
				</>
			)  : (
				<>
					<Page404 />
				</>
			) 
		}
		</>
	)
}

export default Logout;