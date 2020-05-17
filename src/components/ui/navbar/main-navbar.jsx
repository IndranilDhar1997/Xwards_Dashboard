import React, { Component } from "react";

import Config from "../../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {BrandDropDown, UserDropDown, SideNavBarToggler} from './navbar';

var MainNavBar__Toast = function (type, str) {
	switch (type) {
		case 'success':
				toast.success(str, {
					position: toast.POSITION.TOP_RIGHT
				});
			break;
		case 'error':
		case 'err':
				toast.error(str, {
					position: toast.POSITION.TOP_RIGHT
				});
			break;
		case 'warn':
		case 'warning':
				toast.warn(str, {
					position: toast.POSITION.TOP_RIGHT
				});
			break;
		case 'info':
		case 'log':
		default:
				toast.info(str, {
					position: toast.POSITION.TOP_RIGHT
				});
			break;
	}
}

class MainNavBar extends Component {
	constructor(props) {
		super(props);
		this.ImageUrl = Config[Config.env].url;
		MainNavBar__Toast = MainNavBar__Toast.bind(this);
	}

	render() {
		return (
			<React.Fragment>
				<ToastContainer autoClose={4000} />
				<div className="container-fluid bg-white nav-container">
					<div className="row">
						<div className="col col-12">
							<nav className="navbar navbar-expand-lg">
								<SideNavBarToggler />
								<a className="navbar-brand mr-auto" href="/">
									<img className="logo" src={this.ImageUrl + "/images/xds-nav.svg"} height="30" alt="logo" />
								</a>
								<BrandDropDown />
								<UserDropDown />
							</nav>
						</div>
					</div>
				</div>
			</React.Fragment >
		);
	}
}
export {MainNavBar, MainNavBar__Toast};
