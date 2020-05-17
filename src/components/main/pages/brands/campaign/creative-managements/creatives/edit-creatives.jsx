import React, { Component } from 'react';
import BrandService from '../../../../../../../js/services/brandService';
import {OverlayTrigger, Tooltip, Button, Form} from 'react-bootstrap';
import {AjaxService, Routes} from "../../../../../../../js/ajax/ajax";
import $ from 'jquery';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../../../../ui/navbar/navbar";
import XUploadVideo from '../../../../../../ui/utility/XUploadVideo';
import utility from '../../../../../../../js/lib/utility';


export default class EditCreatives extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            video: null,
            creativeTitle: '',
            brandId: BrandService.getSelectedBrand().id,
            collectionId: this.props.match.params.collectionId,
            creativeId: this.props.match.params.creativeId,
        }
        SideNavBar__SetActiveMenu('/brands/campaigns');
    }

    componentDidMount() {
        AjaxService.get(Routes.Get_Creative_By_Id(this.state.brandId,this.state.collectionId, this.state.creativeId), function (response) {
            console.log(response);
            this.setState({ video: "http://"+response.url, creativeTitle: response.title });
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your creatives.");
        });
        let width = $('#xVideoHolder').width();
        let calculatedHeight = (720*width)/1280;        
        this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
        $("input[type='file']#newChannelModalForm__photo").hover(function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
        }, function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
        })
    }

    goBack(e) {
        e.preventDefault();
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

    createDataForUpdating() {
        
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

    updateCreative = e => {
        e.preventDefault();
        var creativeDataToUpdate = this.createDataForUpdating();

        if (creativeDataToUpdate === false) {
            return false;
        }

        let formData = new FormData();
        for (let key in creativeDataToUpdate) {
            formData.append(key, creativeDataToUpdate[key]);
        }

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        if (formData) {
            utility.showLoader();
            AjaxService.putImageData(Routes.Update_Creative(this.state.brandId, this.state.collectionId, this.state.creativeId), formData, function(response) {
                MainNavBar__Toast('success', "Successfully Updated");
                this.props.history.push({ pathname : "/brands/campaigns/creative-managements/" +this.state.collectionId+ "/creatives/"});
            }.bind(this), function(error) {
                MainNavBar__Toast('err', "Some error while updating data");
            },{
                timeout: 10000000,
                onComplete: function () {
                    $('button#updateCreativeForm__btnUpdateCreative').removeAttr('disabled');
                    $('button#updateCreativeForm__backBtn').removeAttr('disabled');
                    $('button#updateCreativeForm__btnUpdateCreative').html('Update');
                },
                beforeSend: function () {
                    $('button#updateCreativeForm__btnUpdateCreative').html('Updating your creative... it might take time.');
                    $('button#updateCreativeForm__btnUpdateCreative').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#updateCreativeForm__btnUpdateCreative').attr('disabled', 'disabled');
                    $('button#updateCreativeForm__backBtn').attr('disabled', 'disabled')
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
                            <h4 className="montserrat-light margin-bottom-20">Update your Creative</h4>
                            <Form name="updateCreativeForm" id="updateCreativeForm" className="row" onSubmit={(e)=> this.updateCreative(e)}>
                                <Form.Group className="col col-12" controlId="updateCreativeForm__creativeTitle">
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
                                videoSrc={this.state.video}
                                width={this.state.videoUploadWidth}
                                height={this.state.videoUploadHeight}
                                title="Upload Video"
                                subtitle="Max 360dp MP4 Video Format (Max File Size: 400MB)"
                                id="updateCreativeForm__video"
                                name="updateCreativeForm__video"
                                callBack={(video) => this.getVideo(video)}
                                maxFileSize={419430400}
                                errCallBack={(err) => this.errorVideoUploading(err)}
                            /> 
                        </div>
                    </div>
                    <div className="row">
                        <div className="col col-12 form-group">
                            <Button variant="outline-x-love" id="updateCreativeForm__backBtn" onClick={(e) => this.goBack(e)} className="margin-right-10">
                                <i className="fas fa-chevron-left margin-right-10"></i> Go Back 
                            </Button>
                            <Button variant="x-default" type="submit" id="updateCreativeForm__btnUpdateCreative" onClick={(e) => this.updateCreative(e)}>
                                <i className="fas fa-cloud-upload-alt margin-right-10"></i> Update 
                            </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}