import React, { Component } from "react";
import { Form, Button, Col, Row } from 'react-bootstrap';
import { UserImage } from "../../../../ui/user-profile/user-image";

import { ChangePasswordModal, ChangePasswordShowModal } from "../../../../ui/user-profile/change-password-modal";
import { EmailUpdateModal, EmailUpdateShowModal } from "../../../../ui/user-profile/email-update-modal";

import utility from '../../../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../../../js/ajax/ajax';


class MyProfile extends Component {
	constructor() {
		super();
		this.state = { 
			userData : {},
			fullName : ""			  
		};
		AjaxService.get(Routes.GETUSERDATA(), function (response) {
			this.setState({userData: response});
			this.setState({ fullName : (this.state.userData.first_name + " " + this.state.userData.last_name)});
		}.bind(this), function(error){
			console.log(error);
		});
	}
	
		
	updateProfileForm = (event) => {
		event.preventDefault();
		let data = utility.getFormData(($('form#myProfileForm').serializeArray()));
		console.log(data)

		AjaxService.put(Routes.UPDATEUSERPROFILE(), data, function (response) {
			$('#myProfileForm #success-message').html(response.message);
            $('#myProfileForm #error-message').html('');	
		}, function (error) {
			$('#myProfileForm #error-message').html(error.responseJSON.message);
            $('#myProfileForm #success-message').html('');
		}, {
				onComplete: function () {
					$('button#myProfileForm__btnUpdateUserProfile').removeAttr('disabled');
					$('button#myProfileForm__btnUpdateUserProfile').html('Update User Profile');
				},
				beforeSend: function () {
					$('button#myProfileForm__btnUpdateUserProfile').html('Updating User Profile...');
					$('button#myProfileForm__btnUpdateUserProfile').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
					$('button#myProfileForm__btnUpdateUserProfile').attr('disabled', 'disabled');
				}
			}
		);
	}

	render() {
		return (
			<div className="container-fluid margin-top-5  padding-bottom-20" id="myProfile">
				<div className="row">
					<div className="col col-12">
						<h4>My profile</h4>
					</div>
					<div className="col col-8">
						<UserImage />
						<Form name="myProfileForm" id="myProfileForm" onSubmit={this.updateProfileForm}>
							<Form.Group as={Row} controlId="myProfileForm__userName" required>
								<Form.Label column sm="3" className="">
									Name
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="userName" defaultValue={this.state.fullName} type="text" />
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="myProfileForm__userEmail" required>
								<Form.Label column sm="3" className="">
									Email Address
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="userEmail" plaintext readOnly defaultValue={this.state.userData.email} className="max-width-80 display-inline" />
									<Button variant="outline-secondary" size="sm" className="right" onClick={() => EmailUpdateShowModal()}>
										<i className="fas fa-edit"></i>
									</Button>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="myProfileForm__userPassword" required>
								<Form.Label column sm="3" className="">
									Password
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="password" plaintext readOnly value="password" type="password" className="max-width-80 display-inline" />
									<Button variant="outline-secondary" size="sm" className="right" onClick={() => ChangePasswordShowModal()}>
										<i className="fas fa-edit"></i>
									</Button>
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="myProfileForm__userNumber" required>
								<Form.Label column sm="3" className="">
									Phone Number
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="userNumber" defaultValue={this.state.userData.phone_number} type="tel" />
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="myProfileForm__websiteURL">
								<Form.Label column sm="3" className="">
									Website URL
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="websiteURL" defaultValue={this.state.userData.website_url} type="url" />
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="myProfileForm__userOrganization" required>
								<Form.Label column sm="3" className="">
									Organization
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="userOrganization" defaultValue={this.state.userData.organization} type="text" />
								</Col>
							</Form.Group>
							<Form.Group as={Row} controlId="myProfileForm__userLocation" required>
								<Form.Label column sm="3" className="">
									Location
								</Form.Label>
								<Col className="text-left">
									<Form.Control name="userLocation" defaultValue={this.state.userData.location} type="text" />
								</Col>
							</Form.Group>
							<Button variant="x-dark-default" type="submit" id="myProfileForm__btnUpdateUserProfile" sm="2" className="right" >
								Update User Profile
							</Button>
							<div className="right text-success font-weight-800 margin-right-20 margin-top-10 margin-bottom-10" id="success-message"></div>
                        	<div className="right text-x-love font-weight-800 margin-right-20 margin-top-10 margin-bottom-10" id="error-message"></div>
						</Form>
						<EmailUpdateModal />
						<ChangePasswordModal />
					</div>
				</div>
			</div>
		);
	}
}

export default MyProfile;
