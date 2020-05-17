import React, { Component } from "react";
import {Modal, Form, Button} from 'react-bootstrap';
import $ from 'jquery';
import ModalHeader from 'react-bootstrap/ModalHeader';
import utility from '../../../js/lib/utility';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import { MainNavBar__Toast} from "../../ui/navbar/navbar";
import XUploadVideo from '../../ui/utility/XUploadVideo';
import BrandService from '../../../js/services/brandService';

var AddCreativeShowModal = function (e, collectionId) {
    if(e) {
        e.preventDefault();
    }
    console.log(collectionId);
    this.setState({ show: true, collectionId: collectionId });
}

class AddCreativeModal extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false, 
            collectionId: null, 
            creativeTitle: '', 
            video: null,
            brandId: BrandService.getSelectedBrand().id, 
        }
        AddCreativeShowModal = AddCreativeShowModal.bind(this);
    }

    componentDidMount() {
        let width = $('#xVideoHolder').width();
        let calculatedHeight = (720*width)/1280;        
        this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
        $("input[type='file']#newChannelModalForm__photo").hover(function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
        }, function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
        })
    }

    hideModal() {
        this.setState({ show: false, collectionId: null, creativeTitle: '', video: null });
    }

    handleCreativeTitleChange = e => {
        this.setState({ creativeTitle: e.target.value });
    }

    maxFileSize(e){
        MainNavBar__Toast('err', "File is too big to upload.");
    }

    //Getting the video and setting to state
    getVideo(video) {
        this.setState({video: video});
    }

    //Validating the file size of video and returning the error
    errorVideoUploading(err) {
        switch(err) {
            case 'MAX_FILE_SIZE':
                MainNavBar__Toast('err', "File is too big to upload.");
                break;
            default:
                break;
        }
    }



    createDataForUploading() {
        
        let creativeTitle = this.state.creativeTitle;
        let video = this.state.video;

        if (creativeTitle === null || creativeTitle === undefined || creativeTitle === '') {
            MainNavBar__Toast('err', "Error. Title Cannot be Empty");
            return false;
        }

        if (this.state.video === null) {
            MainNavBar__Toast('err', "Error. You must upload video");
            return false;
        }

        let data = {
            title: creativeTitle,
            file: this.state.video
        }

        return data;
    }

    addCreatives = e => {
        e.preventDefault();
        var creativeDataToSave = this.createDataForUploading();

        if (creativeDataToSave === false) {
            return false;
        }

        let formData = new FormData();
        for (let key in creativeDataToSave) {
            formData.append(key, creativeDataToSave[key]);
        }

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        if (formData) {
            utility.showLoader();
            AjaxService.postImageData(Routes.Create_Creative(this.state.brandId, this.state.collectionId), formData, function(response) {
                MainNavBar__Toast('success', "Successfully Created");
                this.setState({ show: false, collectionId: null, creativeTitle: '', video: null, brandId: null });
                window.location.reload();
            }.bind(this), function(error) {
                MainNavBar__Toast('err', "Some error while saving data");
            },{
                timeout: 10000000,
                onComplete: function () {
                    $('button#addCreativeForm__btnAddCreative').removeAttr('disabled');
                    $('button#addCreativeForm__backBtn').removeAttr('disabled');
                    $('button#addCreativeForm__btnAddCreative').html('Create ');
                },
                beforeSend: function () {
                    $('button#addCreativeForm__btnAddCreative').html('Uploading your creative... it might take time.');
                    $('button#addCreativeForm__btnAddCreative').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#addCreativeForm__btnAddCreative').attr('disabled', 'disabled');
                    $('button#addCreativeForm__backBtn').attr('disabled', 'disabled')
                }
            });
        }
    }

    render() {
        return (
            <Modal show={this.state.show} id="creativeAddModal" centered={true} onHide={() => this.hideModal()}>
                <ModalHeader closeButton={true}>
                    <h4 className="montserrat-light">Add a Creative</h4>
                </ModalHeader>
                <Modal.Body className="padding-top-0">
                    <Form name="addCreativeForm" id="addCreativeForm">
                        <Form.Group controlId="addCreativeForm__creativeTitle">
                            <Form.Text className="text-muted margin-bottom-10 padding-left-5">
                                You can add creatives related to your selected collection.
                            </Form.Text>
                            <Form.Label className="padding-left-5">Creative Title</Form.Label>
                            <Form.Control type="text" placeholder="Creative Title" name="creativeTitle" value={this.state.creativeTitle || ''} onChange={(e)=> this.handleCreativeTitleChange(e)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Text>
                                Upload a video for creative
                            </Form.Text>
                            <Form.Label ></Form.Label>
                            <div className="col col-12" id="xVideoHolder">
                                <XUploadVideo
                                    width={this.state.videoUploadWidth}
                                    height={this.state.videoUploadHeight}
                                    title="Upload Video"
                                    subtitle="Max 360dp MP4 Video Format (Max File Size: 400MB)"
                                    id="addCreativeForm__video"
                                    name="addCreativeForm__video"
                                    callBack={(video) => this.getVideo(video)}
                                    maxFileSize={419430400}
                                    errCallBack={(err) => this.errorVideoUploading(err)}
                                /> 
                            </div>
                        </Form.Group>
                        <Button variant="x-dark-default" className="right margin-left-5" id="addCreativeForm__btnAddCreative" onClick={(e) => this.addCreatives(e)}>
                            <i className="fas fa-plus margin-right-10"></i>Add
                        </Button>
                        <Button variant="outline-x-love" className="right margin-right-5" onClick={() => this.hideModal()}>
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export { AddCreativeModal, AddCreativeShowModal };