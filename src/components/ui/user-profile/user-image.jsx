import React, { Component } from "react";
import {Form, Button, Col, Image, Row} from 'react-bootstrap';

import profileImage from "./profile.png";
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
// import { couldStartTrivia } from "typescript";

class UserImage extends Component {
	constructor() {
		super();	
		this.state = {imgSrc : profileImage}
    }
    
    componentDidMount() {
        var temp = localStorage.getItem('user')
        var userData = JSON.parse(temp)
        this.setState({imgSrc: userData.avatar_url})
	}

    fileSelectHandler = event => {
		var file = this.refs.fileInput.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = function (e) {
			this.setState({
				imgSrc: [reader.result]
			})
		}.bind(this);
		console.log(this.state.imgSrc);
    }

	uploadUserImage = (event) => {
		event.preventDefault();
        let imageUrl = {userImage: this.state.imgSrc};
		AjaxService.put(Routes.UPDATEUSERIMAGE(), imageUrl, function (response) {
            
        }, function (error) {

        }, {
                onComplete: function () {
                    $('button#uploadImageForm__btnUpdateUserImage').removeAttr('disabled');
                    $('button#uploadImageForm__btnUpdateUserImage').html('Upload');
                },
                beforeSend: function () {
                    $('button#uploadImageForm__btnUpdateUserImage').html('Uploading...');
                    $('button#uploadImageForm__btnUpdateUserImage').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#uploadImageForm__btnUpdateUserImage').attr('disabled', 'disabled');
                }
			}
		);
    }

    render() {
        return (
            <div>
                <Form name="uploadImageForm" id="uploadImageForm" onSubmit={this.uploadUserImage}>
                    <Form.Group as={Row} controlId="myProfileForm__userImage">
                        <Form.Label column  sm="3" className="">
                            Profile Picture
                        </Form.Label>
                        <Col className="text-left">
                            <Image src={this.state.imgSrc} alt="" style={{width:100, height:100}} rounded />
                            <div className="display-block margin-top-10">
                                <input style={{display: "none"}} name="userImage" ref="fileInput" type="file" onChange={this.fileSelectHandler} />
                                <Button variant="x-default" className="btn-sm" onClick={() => this.refs.fileInput.click()}>Change</Button>
                                <Button variant="x-dark-default" className="btn-sm margin-left-10" id="uploadImageForm__btnUpdateUserImage" type="submit" >Upload</Button>
                            </div>
                            <div className="text-success font-weight-800 margin-top-10 margin-bottom-10" id="success-message"></div>
                            <div className="text-x-love font-weight-800 margin-top-10 margin-bottom-10" id="error-message"></div>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}

export {UserImage}