/**
 * Developed by Veer Shrivastav
 * Date: 25th May 2019
 * 
 * Purpose: When you click add brand anywhere then this modal pops up.
 */
import React, { Component } from "react";
import {Form, Modal, OverlayTrigger, Button, Tooltip} from 'react-bootstrap';
import $ from 'jquery';
import utility from '../../../js/lib/utility';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import XUploadImage from '../utility/XUploadImage';
import {MainNavBar__Toast} from "../navbar/navbar";

// Open up the modal to create the channel
var XPlayCreateChannel__OpenModal = function (e) {
    if (e) {
        e.preventDefault();
    }
	this.setState({ modalShow: true });
}

class XPlayCreateChannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow : false,
        }
        XPlayCreateChannel__OpenModal = XPlayCreateChannel__OpenModal.bind(this);
    }

    // Close the modal of creating channel
    hideModalToCreateChannel = (e) => {
		if (e) {
			e.preventDefault();
		}

		this.setState({
			modalShow: false,
		});
	}

    // Get the uploaded image and set it to state
    getImage = (image) => {
		this.setState({image: image});
	}

    // Getting and preparing the formdata to send to server
	prepareDataForUpload() {
		let formData = new FormData();
		let data = utility.getFormData(($('form#newChannelModalForm').serializeArray()));
		/**
		 * Put validations
		 */
        let channelName = data.channelName;
        if (channelName === null || channelName === undefined || channelName === '') {
            MainNavBar__Toast('err', "Error. Name must be between 10 to 30 characters.");
            return false;
        }
        
        channelName = channelName.trim().replace(/\s\s+/g, ' ');

        if (channelName.length < 10 && channelName.length < 31) {
            MainNavBar__Toast('err', "Error. Name must be between 10 to 30 characters.");
            return false;
        }


		for (let name in data) {
			let value = data[name].trim().replace(/\s\s+/g, ' ');
			if (value.length <= 0) {
				MainNavBar__Toast('err', "All the information is required");
				return false;
			}
			formData.append(name, value);
		}
		formData.append('photo', this.state.image);

		return formData;
	}

    // Sending the channel details to server to create the channel
    handleCreateChannel =(event) => {
		event.preventDefault();

		let formData = this.prepareDataForUpload();

		if (formData !== false) {
			AjaxService.postImageData(Routes.XPLAY_CREATE_CHANNEL(), formData, function (response) {
				MainNavBar__Toast('success', "Channel created successfully");
                this.setState({modalShow: false});
                setTimeout(function(){ window.location.reload() }, 1500);
			}.bind(this), function (error) {
				MainNavBar__Toast('err', "Some error occured");
			}, {
					onComplete: function () {
						$('button#newChannelModalForm__btnCreateChannel').removeAttr('disabled');
						$('button#newChannelModalForm__btnCreateChannel').html('Create Channel');
					},
					beforeSend: function () {
						$('button#newChannelModalForm__btnCreateChannel').html('Creating Channel...');
						$('button#newChannelModalForm__btnCreateChannel').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
						$('button#newChannelModalForm__btnCreateChannel').attr('disabled', 'disabled');
					}
				}
			);
		}
	}

    render() {
        return (
            <Modal id="xPlay__newChannelModal" centered show={this.state.modalShow} onHide={() => this.hideModalToCreateChannel()}>
                <Modal.Header closeButton={true} >
                    <h4 className="montserrat-light">Create a channel</h4>
                </Modal.Header>
                <Modal.Body className="padding-top-0">
                    <Form name="newChannelModalForm" id="newChannelModalForm" onSubmit={this.handleCreateChannel}>
                        <Form.Group controlId="newChannelModalForm__channelName">
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Provide the channel name. This name will be used 
                                    </Tooltip>
                                }
                            >
                            <Form.Label className="text-x-default">Channel Name</Form.Label>
                            </OverlayTrigger>
                            <Form.Control name="channelName" type="text" maxLength="30"/>
                            <Form.Text className="text-muted">
                                Maximun 30 characters
                            </Form.Text>
                            <span className="text-x-love text-md" id="newChannelModalForm__createChannel__msg"></span>
                        </Form.Group>
                        <Form.Group controlId="newChannelModalForm__photo">
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Provide the channel logo.
                                    </Tooltip>
                                }
                            >
                            <Form.Label className="text-x-default">Channel Photo </Form.Label>
                            </OverlayTrigger>
                            <XUploadImage
                                width="224px" 
                                height="224px"
                                title="Channel Logo"
                                subtitle="Width X Height (224px X 224px)"
                                class="imp-margin-left-0"
                                name="newChannelModalForm__photo"
                                id="newChannelModalForm__photo"
                                callBack={(data) => this.getImage(data)}
                            />
                        </Form.Group>
                        <Form.Group controlId="newChannelModalForm__description">
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Please provide a brief description about your channel.
                                    </Tooltip>
                                }
                            >
                            <Form.Label className="text-x-default">About Us</Form.Label>
                            </OverlayTrigger>
                            <Form.Control name="description" as="textarea" rows="2" />
                        </Form.Group>
                        <Button variant="x-dark-default" type="submit" id="newChannelModalForm__btnCreateChannel" className="right margin-left-5">
                            Create Channel
                        </Button>
                        <Button variant="outline-x-love" className="right margin-right-5" onClick={(e) => this.hideModalToCreateChannel(e)}>
                            Close
                        </Button>
                    </Form>	
                </Modal.Body>
            </Modal>
        );
    }
}

export { XPlayCreateChannel, XPlayCreateChannel__OpenModal };