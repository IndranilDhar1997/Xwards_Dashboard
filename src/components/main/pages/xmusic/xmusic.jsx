import React, { Component } from "react";
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import Config from "../../../../config";

class XMusic extends Component {

	constructor() {
		super();
		AjaxService.get(Routes.XMUSIC_AUTH(), function (response) {
			window.location.replace(Config[Config.env].url+"/xmusic/audios");
		}, function(error){
			window.location.replace(Config[Config.env].url+"/xmusic/request");
		});
	}

	render() {
		return <div></div>
	}
}

export default XMusic;
