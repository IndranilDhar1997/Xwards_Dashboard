import React, { Component } from "react";
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import Config from "../../../../config";

class XPlay extends Component {

	constructor() {
		super();
		//Check whether the logged-user have the access to xplay
		AjaxService.get(Routes.XPLAY_AUTH(), function (response) {
			window.location.replace(Config[Config.env].url+"/xplay/channel");
		}, function(error){
			window.location.replace(Config[Config.env].url+"/xplay/request");
		});
	}

	render() {
		return <div></div>
	}
}

export default XPlay;
