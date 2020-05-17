import React, { Component } from 'react';
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';

import {AjaxService, Routes} from "../../../../js/ajax/ajax";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";
import XwardsImageUploader from "../../../ui/content/imageUploader";
import ContentDataService from "../../../../js/services/contentDataService";
import domtoimage from 'dom-to-image';
import Utility from '../../../../js/lib/utility';
import { Prompt } from 'react-router-dom';
import Config from "../../../../config";

class CreateContent extends Component {

    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/content-marketing');
        var contentData = ContentDataService.getContentData();
        this.state = {
            success: false,
            imgTitle: localStorage.getItem('contentData') != null ? contentData.contentTitle : ''
        };
    }

    componentDidMount() {
        if(!(JSON.parse(localStorage.getItem('contentData')))) {
            this.props.history.push("/content-marketing/create");
        }
    }

    componentWillMount() {
        if (!this.state.success) {
            this.unlisten = this.props.history.listen((location, action) => {
                if (location.pathname !== '/content-marketing/create' && location.pathname !== '/content-marketing/create/images') {
                    ContentDataService.removeContentData();
                }
            });
        }
    }

    titleChange() {
        this.setState({
            imgTitle: $('#createContentForm__contentTitle').val()
        });
    }

    goBack() {
        this.props.history.push("/content-marketing/create");
    }

    getImage(divId) {
        var node = document.getElementById(divId+"_imageContent");
        return new Promise(function (resolve, reject) {
            domtoimage.toPng(node).then(function (dataUrl) {
                var img = new Image(); //New Image Object
                img.src = dataUrl; //Take the Data URL in Base64
                let ImageURL = img.src;
    
                var block = ImageURL.split(";"); // Get the content type of the image
                var contentType = block[0].split(":")[1]; // In this case "image/png"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
    
                // Convert it to a blob to upload
                var blob = Utility.b64toBlob(realData, contentType);
                resolve(blob);

            }).catch(function(err){
                reject(err);
            });
        });
    }

    prepareImages(saveFunction) {
        let images = ContentDataService.getImageSizes();
        let counter = 0; //Count the number of array elements read
        images.forEach(function(image) {
            this.getImage(image.name).then(function(blob) {
                counter++; //Increase the counter on created image
                image.image = blob;
                if (counter >= images.length) {
                    saveFunction(); //Callback function when every image has been converted
                }
            }).catch(function (err){
                counter++; //Increase the counter even if there is an error - no image uplaoded
                if (counter >= images.length) {
                    saveFunction(); //Callback function when every image has been converted
                }
            });
        }.bind(this));
    }

    saveContent(e) {
        Utility.showLoader();
        e.preventDefault();
        this.prepareImages(function() {
            let that = this;
            let contentDataToSave = {
                contentHtml: ContentDataService.getContentData().contentHtml,
                contentTitle: ContentDataService.getContentData().contentTitle,
                contentType: ContentDataService.getContentData().contentType,
                expiryDate: ContentDataService.getContentData().expiryDate,
                id: ContentDataService.getContentData().id,
                keywords: ContentDataService.getContentData().keywords,
            }
            /**
             * images: ContentDataService.getNonNullImages()
             */
            let images = ContentDataService.getNonNullImages();
            for (let i in images) {
                contentDataToSave[images[i].name] = images[i].image;
                delete images[i].image;
                let dataKey = images[i].name+"_data";
                contentDataToSave[dataKey] = images[i];
            }

            //Prepare the FormData
            let formData = new FormData();
            for (let key in contentDataToSave) {
                if (typeof (contentDataToSave[key]) == 'object' && key.includes('_data')) {
                    formData.append(key, JSON.stringify(contentDataToSave[key]))
                } else {
                    formData.append(key, contentDataToSave[key]);
                }
            }
            var contentId = ContentDataService.getContentData().id;
            AjaxService.postImageData(Routes.SAVE_FINAL_CONTENT(contentId), formData, function(response) {
                ContentDataService.removeContentData();
                //this.success = true;
                that.setState({success: true});
                window.location.replace(Config[Config.env].url+"/content-marketing");
                MainNavBar__Toast('success', "Successfully Created");
            }.bind(that), function(error) {
                MainNavBar__Toast('err', "Some error while saving data");
            }, {
                onComplete: function () {
                    $('button#createContentForm__btnAddContent').removeAttr('disabled');
                    $('button#createContentForm__btnAddContent').html('<i class="fas fa-plus margin-right-10"></i>Save');
                },
                beforeSend: function () {
                    $('button#createContentForm__btnAddContent').html('Saving your images... it might take time.');
                    $('button#createContentForm__btnAddContent').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                    $('button#createContentForm__btnAddContent').attr('disabled', 'disabled');
                }
            });
        }.bind(this));
    }
   

    render() { 
        return ( 
            <React.Fragment>
                <Prompt message="Are you sure you want to leave this page?" />
                <div className="container-fluid margin-top-5" id="createContentForm">
                    <div className="row">
                        <div className="col col-12 margin-bottom-10">
                            <h3>Add Cover Images</h3>
                            <h6 className="max-width-70">
                                You can add images of different sizes for your content. Adding images of different 
                                dimensions boosts your contents and thus gets more visibility and impressions.
                            </h6>
                        </div>
                        <div className="col col-12 margin-bottom-50">
                            <Form name="createContentForm" id="createContentForm">
                                <div className="row margin-bottom-30">
                                    <div className="col col-12">
                                        <Form.Group controlId="createContentForm__contentTitle">
                                            <OverlayTrigger
                                                    placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Choose the most suitable click-baiting title for your content.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">Title</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control type="text" placeholder="Content Title" name="contentTitle" maxLength="60" value={this.state.imgTitle} onChange={() => this.titleChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximun 60 characters
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12">
                                        <Form.Group controlId="createContentForm__contentLabel">
                                            <OverlayTrigger
                                                    placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Upload different size images. These images will be placed on the digital screen based 
                                                        on the availability of space on the screen.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">Upload Images of Different Sizes</Form.Label>
                                            </OverlayTrigger>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12">
                                        <XwardsImageUploader
                                            id="wide"
                                            width="852px" 
                                            height="210px"
                                            title="Wide Panel Cover Image"
                                            subtitle="Width X Height (852px X 210px)"
                                            imgTitle={this.state.imgTitle}
                                        />
                                    </div>
                                    <div className="col col-6">
                                        <XwardsImageUploader
                                            id="small"
                                            width="426px" 
                                            height="210px"
                                            title="Small Cover Image"
                                            subtitle="Width X Height (426px X 210px)"
                                            imgTitle={this.state.imgTitle}
                                        />
                                    </div>
                                    <div className="col col-6">
                                        <XwardsImageUploader
                                            id="mid"
                                            width="426px" 
                                            height="315px"
                                            title="Mid Size Cover Image"
                                            subtitle="Width X Height (426px X 315px)"
                                            imgTitle={this.state.imgTitle}
                                        />
                                    </div>
                                </div>
                                <Button variant="outline-x-dark-default" className="margin-right-20" id="createContentForm__btnGoBack" onClick={() => this.goBack()}>
                                    <i className="fas fa-chevron-left margin-right-10"></i> Back
                                </Button>

                                <Button variant="x-dark-default" id="createContentForm__btnAddContent" onClick={(e) => this.saveContent(e)}>
                                    <i className="fas fa-plus margin-right-10"></i>Save
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default CreateContent;