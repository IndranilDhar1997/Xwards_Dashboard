import React, { Component } from 'react';
import BrandService from '../../../../../../../js/services/brandService';
import {OverlayTrigger, Tooltip, Button, Form} from 'react-bootstrap';
import {AjaxService, Routes} from "../../../../../../../js/ajax/ajax";
import $ from 'jquery';
import Config from '../../../../../../../config';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../../../../ui/navbar/navbar";
import XUploadVideo from '../../../../../../ui/utility/XUploadVideo';
import utility from '../../../../../../../js/lib/utility';

export default class AddCreatives extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            video: null,
            creativeTitle: '',
            brandId: BrandService.getSelectedBrand().id,
            collectionId: this.props.match.params.collectionId
        }
        SideNavBar__SetActiveMenu('/brands/campaigns');

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

    //Function to go back from the uploading video page
    goBack(e) {
        e.preventDefault();
        var channel_id = this.props.match.params.channel_id;
        this.props.history.push({ pathname : "/brands/campaigns/creative-managements/" +this.state.collectionId+ "/creatives/"});
    }

    handleCreativeNameChange = e => {
        this.setState({ creativeTitle: e.target.value });
    }

    //Validating the file size
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
                this.props.history.push({ pathname : "/brands/campaigns/creative-managements/" +this.state.collectionId+ "/creatives/"});
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
            <React.Fragment>
                <div className="container-fluid">
                    <div className="row margin-top-5 margin-bottom-30">
                        <div className="col col-6">
                            <h4 className="montserrat-light margin-bottom-20">Add a Creative</h4>
                            <Form name="addCreativeForm" id="addCreativeForm" className="row" onSubmit={(e)=> this.addCreatives(e)}>
                                <Form.Group className="col col-12" controlId="addCreativeForm__creativeTitle">
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                Your creative must have a title. 
                                            </Tooltip>
                                        }
                                    >
                                        <Form.Label className="text-x-default margin-left-5">Title</Form.Label>
                                    </OverlayTrigger>
                                    <Form.Control name="creativeTitle" type="text" placeholder="Title" value={this.state.creativeTitle || ''} onChange={(e)=> this.handleCreativeNameChange(e)}/>
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="col col-6" id="xVideoHolder">
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
                    </div>
                    <div className="row">
                        <div className="col col-12 form-group">
                            <Button variant="outline-x-love" id="addCreativeForm__backBtn" onClick={(e) => this.goBack(e)} className="margin-right-10">
                                <i className="fas fa-chevron-left margin-right-10"></i> Go Back 
                            </Button>
                            <Button variant="x-default" type="submit" id="addCreativeForm__btnAddCreative" onClick={(e) => this.addCreatives(e)}>
                                <i className="fas fa-cloud-upload-alt margin-right-10"></i> Create 
                            </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}