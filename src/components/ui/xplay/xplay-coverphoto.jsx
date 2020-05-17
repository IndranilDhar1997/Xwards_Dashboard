import React, { Component } from "react";

import $ from 'jquery';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import XUploadImage from '../utility/XUploadImage';

import {MainNavBar__Toast} from "../../ui/navbar/navbar";


class XPlayCoverPhoto extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            imageUploadWidth: '856px',
            imageUploadHeight: '220px',
            coverPhoto: this.props.imageSrc
        }
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.imageSrc !== this.state.coverPhoto) {
            this.setState({ coverPhoto: nextProps.imageSrc });
        }
    }

    componentDidMount() {
        let width = $('#xImageHolder').width();
        let calculatedHeight = (220*width)/856;        
        this.setState({imageUploadWidth: width+'px', imageUploadHeight: calculatedHeight+'px'});
        $("input[type='file']#newChannelModalForm__photo").hover(function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
        }, function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
        })
    }

    //get the image and update the image
    getImage = (image) => {
        let formData = new FormData();
        formData.append('coverPhoto', image);
        this.setState({ coverPhoto: image });
        
        //Update the cover image
        AjaxService.putImageData(Routes.XPLAY_UPDATE_CHANNEL_COVER_PHOTO(this.props.channelId), formData, function (response) {
            MainNavBar__Toast('success', 'Successfully updated the cover photo');
        }, function () {
            MainNavBar__Toast('err', 'Some error while uploading the cover photo');
        }, {
            onComplete: function () {
                $('button#xPlay__btnUploadCoverPhoto').html('Click to change the cover photo');
                $('button#xPlay__btnUploadCoverPhoto').removeAttr('disabled');
    		},
    		beforeSend: function () {
    			$('button#xPlay__btnUploadCoverPhoto').html('Uploading...');
    			$('button#xPlay__btnUploadCoverPhoto').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
    			$('button#xPlay__btnUploadCoverPhoto').attr('disabled', 'disabled');
    		}
        });
	}

    render() {
        return (
            <React.Fragment>
                <div className="row margin-top-5">
                    <div id="xImageHolder" className="col col-12 position-relative">
                        <XUploadImage
                            width={this.state.imageUploadWidth}
                            height={this.state.imageUploadHeight}
                            title="Cover Photo"
                            subtitle="Width X Height (856px X 220px)"
                            class=""
                            name="newChannelModalForm__photo"
                            id="newChannelModalForm__photo"
                            callBack={(data) => this.getImage(data)}
                            imageSrc={this.state.coverPhoto}
                        />
                        {this.state.coverPhoto!==null ?
                            <div className="right btn btn-x-default cursor-pointer" id="xPlay__btnUploadCoverPhoto">
                                Click to change the cover photo
                            </div>
                            :
                            null
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export {XPlayCoverPhoto}