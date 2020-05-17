import React, { Component } from 'react';
import { Button, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import utility from '../../../js/lib/utility';
import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import XUploadImage from '../utility/XUploadImage';
import {MainNavBar__Toast} from "../../ui/navbar/navbar";
import 'react-toastify/dist/ReactToastify.css';

// Opening the modal to edit the channel details
var ShowEditChannelModal = function() {
    this.setState({ show: true});
}


class XPlayEditChannel extends Component {
    constructor(props) {
        super(props);	
        this.state = {
            show: false, 
        }
        ShowEditChannelModal = ShowEditChannelModal.bind(this);
    }

    //Closing the modal to edit the channel details
    handleCloseModal = () => {
        this.setState({ show: false})
	}

    // Getting the channel logo
	getImage = (image) => {
        var img = new Image();
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (data) => {
            img.src = data.srcElement.result;
            img.onload = () => {
                var b64 = data.srcElement.result;
                var image = new Image();
                image.src = b64;
                let ImageURL = img.src;
                var block = ImageURL.split(";"); // Get the content type of the image
                var contentType = block[0].split(":")[1]; // In this case "image/png"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    
                // Convert it to a blob to upload
                var blob = utility.b64toBlob(realData, contentType);
                this.setState({photo: blob})
            }
        }
    }
    
    // Preparing the data to update the channel
    prepareDataForUpload() {
        let data = utility.getFormData(($('form#editChannelModalForm').serializeArray()));
        var channelName = data.channelName;
        var channelDescription = data.description;
        if (channelName === null || channelName === undefined || channelName === '') {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 30 characters.");
            return false;
        }
        channelName = channelName.trim().replace(/\s\s+/g, ' ');
        if (channelName.length < 10 && channelName.length < 31) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 30 characters.");
            return false;
        }
        if (channelDescription.length === null || channelDescription === undefined || channelDescription === '') {
            MainNavBar__Toast('err', "Error. Description is required");
            return false;
        }

        let values = {
            channelName: channelName,
            channelDescription: channelDescription,
            image: this.state.photo === undefined ? this.props.channel.photo : this.state.photo
        }
        return values;
	}
    
    // Sending the changed data to the server to update the in-review video details
    handleUpdateChannel = (event) => {
        event.preventDefault();
        let updateChannelContent = this.prepareDataForUpload();
        if (updateChannelContent === false) {
            return false;
        }
        let formData = new FormData();
        for (let key in updateChannelContent) {
            formData.append(key,updateChannelContent[key]);
        }
        AjaxService.putImageData(Routes.XPLAY_UPDATE_CHANNEL(this.props.channelId), formData, function (response) {
            console.log(response);
            MainNavBar__Toast('success', "Channel Updated");
            this.setState({ show: false });
            window.location.reload();
        }.bind(this), function (error) {
            console.log(error)
            MainNavBar__Toast('err', "Error. Some Error. Try Again");
        }, {
                onComplete: function () {
                    $('button#editChannelModalForm__btnUpdateChannel').removeAttr('disabled');
                    $('button#editChannelModalForm__btnUpdateChannel').html('Update Channel Details');
                },
                beforeSend: function () {
                    $('button#editChannelModalForm__btnUpdateChannel').html('Updating Channel Details...');
                    $('button#editChannelModalForm__btnUpdateChannel').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#editChannelModalForm__btnUpdateChannel').attr('disabled', 'disabled');
                }
            }
        );
    }

    render() {
        return (
            <React.Fragment>
                <Modal id="xPlay__editChannelModal" centered show={this.state.show} onHide={() => this.handleCloseModal()}>
                    <Modal.Header closeButton={true} >
                        <h4 className="montserrat-light">Edit channel</h4>
                    </Modal.Header>
                    <Modal.Body className="padding-top-0">
                        <Form name="editChannelModalForm" id="editChannelModalForm" onSubmit={this.handleUpdateChannel}>
                            <Form.Group controlId="editChannelModalForm__channelName">
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
                                <Form.Control name="channelName" type="text" defaultValue={this.props.channel.name} maxLength="30"/>
                                <Form.Text className="text-muted">
                                        Maximun 30 characters
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="editChannelModalForm__photo">
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
                                    name="editChannelModalForm__photo"
                                    id="editChannelModalForm__photo"
                                    callBack={(data) => this.getImage(data)}
                                    imageSrc={this.props.channel.photo}
                                    />
                            </Form.Group>
                            <Form.Group controlId="editChannelModalForm__description">
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
                                <Form.Control name="description" as="textarea" rows="2" defaultValue={this.props.channel.description} />
                                <span className="text-x-love text-md" id="editChannelModalForm__description__msg"></span>
                            </Form.Group>
                            <Button variant="x-dark-default" type="submit" id="editChannelModalForm__btnUpdateChannel" className="right margin-left-5">
                                Update Channel Details
                            </Button>
                            <Button variant="outline-x-love" className="right margin-right-5" onClick={this.handleCloseModal}>
                                Close
                            </Button>
                        </Form>	
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

export {XPlayEditChannel, ShowEditChannelModal};