import React, { Component } from "react";
import {Form, Modal, OverlayTrigger, Button, Tooltip} from 'react-bootstrap';
import Config from "../../../../config";

import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../ui/navbar/navbar";
import utility from '../../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes,  } from '../../../../js/ajax/ajax';
import Card from "react-bootstrap/Card";


class XMusicRequest extends Component {
	constructor(props) {
		super(props);
		SideNavBar__SetActiveMenu('/xmusic');
		this.state = {
			show: false,
		}

		AjaxService.get(Routes.XMUSIC_AUTH(), function (response) {
			console.log(response);
			window.location.replace(Config[Config.env].url+"/xmusic/audios");
		}, function(err){
			console.log(err)
			switch (err.status) {
				case 401:
					//Request Already Send
					$('button#xMusic_enable_button').attr('disabled', 'disabled');
					$('button#xMusic_enable_button').html('Already Requested');
					break;
				case 403:
					//X-Play Account Suspended
					$('button#xMusic_enable_button').attr('disabled', 'disabled');
					$('button#xMusic_enable_button').html('Your access to X-Music has been suspended.');
					break;
				case 404:
					//User has never requested for X-Play Account
					$('button#xMusic_enable_button').html('Request Access for X-Music');
					break;
				default:
					MainNavBar__Toast('err', "Unable to fetch information on your X-Music Account");
					break;
			}
		});
	}

	handleClose = (e) => {
		if (e)
			e.preventDefault();
		this.setState({ show: false });
	}
	
	handleShow = (e) => {
		e.preventDefault();
		this.setState({ show: true });
	}

	sendRequest = (event) => {
		event.preventDefault();
		
		let formData = utility.getFormData(($('form#xMusicRequestModalForm').serializeArray()));
		console.log(formData);

		if (formData.description === null || formData.description === "" || formData.description === null) {
            MainNavBar__Toast('err', "Error. You must have description");
            return false;
		}
		
		if (formData.emailId === null || formData.emailId === "" || formData.emailId === null) {
            MainNavBar__Toast('err', "Error. You must have emailId");
            return false;
		}
		
		if (formData.phoneNumber === null || formData.phoneNumber === "" || formData.phoneNumber === null) {
            MainNavBar__Toast('err', "Error. You must have Phone Number");
            return false;
		}

		AjaxService.post(Routes.XMUSIC_REQUEST(), formData, function (response) {
			MainNavBar__Toast('success', "Request has been sent to the Administrator. Please check your email for response.");
			window.location.reload();
		}, function (error) {
			MainNavBar__Toast('err', 'There was some error');
			window.location.reload();
		}, {
				onComplete: function () {
					$('button#xMusicRequestModalForm__btnSendRequest').removeAttr('disabled');
					$('button#xMusicRequestModalForm__btnSendRequest').html('Send Request');
					$('button#xMusicRequestModalForm__btnSendRequest').attr('disabled', 'disabled');
					this.setState({show:false});
				}.bind(this),
				beforeSend: function () {
					$('button#xMusicRequestModalForm__btnSendRequest').html('Sending Request..');
					$('button#xMusicRequestModalForm__btnSendRequest').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
					$('button#xMusic_enable_button').attr('disabled', 'disabled');
				}
			}
		);
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="flex-row align-items-center margin-top-5">
					<Card className="text-center h-100">
						<Card.Body>
							<h2 className="text-x-love margin-bottom-20">X-Music Account Not Activated</h2>
							<h6 className="text-x-default max-width-70 margin-auto">
								X-Music is an entertainment song listening facility inside Xplore Tablets.
							</h6>
							<h6 className="text-x-default max-width-70 margin-auto imp-margin-top-20">
								X-Music is a public screen and in order to regulate the standard of video contents going online, the access to
								X-Music is granted to exclusive partners on request. You can contact us to request an access.
							</h6>
							<Button variant="x-love" className="margin-top-30" type="submit" id="xMusic_enable_button" onClick={(e) => this.handleShow(e)}>
								Request Access for X-Music
							</Button>
						</Card.Body>
					</Card>
					<div>
						<Modal id="xMusic__requestModal" centered show={this.state.show} onHide={() => this.handleClose()}>
							<Modal.Header closeButton={true} >
								<h4 className="montserrat-light">Request for X-Music Access</h4>
							</Modal.Header>
							<Modal.Body className="padding-top-0">
								<Form name="xMusicRequestModalForm" id="xMusicRequestModalForm" onSubmit={this.sendRequest}>
									<Form.Group controlId="xMusicRequestModalForm__description">
										<OverlayTrigger
											placement="right"
											overlay={
												<Tooltip>
													Please tell us something about yourself. 
												</Tooltip>
											}
													>
										<Form.Label className="text-x-default">Description</Form.Label>
										</OverlayTrigger>
										<Form.Control name="description" as="textarea" rows="2" />
										<span className="text-x-love text-md" id="xMusicRequestModalForm__description__msg"></span>
									</Form.Group>
									<Form.Group controlId="xMusicRequestModalForm__phoneNumber">
										<OverlayTrigger
											placement="right"
											overlay={
												<Tooltip>
													We might need to call you.
												</Tooltip>
											}
													>
											<Form.Label className="text-x-default">Phone Number</Form.Label>
										</OverlayTrigger>
										<Form.Control name="phoneNumber" type="number"/>
										<span className="text-x-love text-md" id="xMusicRequestModalForm__phone_number__msg"></span>
									</Form.Group>
									<Form.Group controlId="xMusicRequestModalForm__email">
										<OverlayTrigger
											placement="right"
											overlay={
												<Tooltip>
													Your email id.
												</Tooltip>
											}
										>
											<Form.Label className="text-x-default">Email ID</Form.Label>
										</OverlayTrigger>
										<Form.Control name="emailId" type="email"/>
										<span className="text-x-love text-md" id="xMusicRequestModalForm__email_id__msg"></span>
									</Form.Group>
									<Button variant="x-dark-default" type="submit" id="xMusicRequestModalForm__btnSendRequest" className="right margin-left-5" onClick={(e) => this.sendRequest(e)} >
										Request Access
									</Button>
									<Button variant="outline-x-love" className="right margin-right-5" onClick={(e) => this.handleClose(e)}>
										Close
									</Button>
								</Form>	
							</Modal.Body>
						</Modal>
					</div>
				</div>
			</div>
		);
	}
}

export default XMusicRequest;
