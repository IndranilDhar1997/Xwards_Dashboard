import React, { Component } from "react";
import {Image, Button, Dropdown, DropdownButton, Tabs, Tab} from 'react-bootstrap';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import {XPlayCoverPhoto} from '../../../ui/xplay/xplay-coverphoto';
import XPlayVideoList from '../../../ui/xplay/xplay-video-list';
import {XPlayEditChannel, ShowEditChannelModal} from '../../../ui/xplay/xplay-edit-channel';
import {XPlayDeleteChannel, ShowDeleteChannelModal} from '../../../ui/xplay/xplay-delete-channel';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../ui/navbar/navbar";

class XPlayChannelID extends Component {
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/xplay');
        this.state = {
            channel : {},
            photo: null,
        }
    }  

    componentDidMount() {
        //Route fetching all the details of channel videos
        AjaxService.get(Routes.XPLAY_GET_CHANNEL_DETAILS(this.props.match.params.channel_id), function (response) {
            MainNavBar__Toast('log', 'Fetching information on this channel');
			this.setState({channel: response});
		}.bind(this), function(error){
            MainNavBar__Toast('err', "Error. Please Try Again...");
		});
    }
     
	render() {  
		return (
			<React.Fragment>
                <div className="container-fluid">
                    {/* Displaying Cover Image */}
                    <XPlayCoverPhoto
                        channelId={this.props.match.params.channel_id}
                        imageSrc={this.state.channel.cover_photo} 
                    />
                    <div className="row">
                        <div className="col col-12" style={{zIndex: 900}}>
                            {/* Image Box for Channel logo */}
                            <Image className="img-thumbnail channel-display-pic" src={this.state.channel.photo} />
                            {/* DropDown for edit/delete option of channel */}
                            <DropdownButton id="xPlay__channelEditDropdown" className="margin-top-10 right" alignRight title={<i className="fas fa-cog"></i>} variant="light">
                                <Dropdown.Item onClick={() => ShowEditChannelModal()}>Edit Channel</Dropdown.Item>
                                <Dropdown.Item onClick={() => ShowDeleteChannelModal()}>Delete Channel</Dropdown.Item>
                            </DropdownButton>
                            <Button variant="x-love" className="right" id="uploadVideoForm__btnUploadVideo" className="margin-right-10 right margin-top-10" href={this.props.match.params.channel_id+"/upload-video"}>
                                <i className="fas fa-plus margin-right-10"></i> Upload Video
                            </Button>
                        </div>
                        <div className="col col-8">
                            <h2 className="text-x-default margin-top-10 margin-bottom-20 montserrat-light strong">{this.state.channel.name}</h2>
                            <h5>About</h5>
                            <p>{this.state.channel.description}</p>
                        </div>
                    </div>
                    {/* Video or Tab section for listing the live/in-review videos */}
                    <div className="row padding-bottom-50">
                        <div className="col col-12">
                            <h4 className="text-x-default margin-bottom-20">Videos</h4>
                        </div>
                        <div className="col col-12 padding-bottom-50">
                            <Tabs defaultActiveKey="liveVideos" transition={false} id="uncontrolled-tab-example">
                                <Tab eventKey="liveVideos" title="Live Videos" className="text-x-default">
                                    <XPlayVideoList channelId={this.props.match.params.channel_id} type="live"/>
                                </Tab>
                                <Tab eventKey="reviewVideos" title="Videos In Review" className="text-x-default">
                                    <XPlayVideoList channelId={this.props.match.params.channel_id} type="review"/>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    {/* Modals/Files for updating channels */}
                    <XPlayEditChannel channelId={this.props.match.params.channel_id} channel={this.state.channel} />
                    <XPlayDeleteChannel channelId={this.props.match.params.channel_id} />
                </div>
            </React.Fragment>
		);
	}
}

export default XPlayChannelID;
