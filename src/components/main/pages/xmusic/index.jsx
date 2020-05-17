import React, { Component } from "react";
import {Card, Button, Tab, Tabs} from 'react-bootstrap';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";

import { AjaxService, Routes } from '../../../../js/ajax/ajax';

import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import XMusicAudioList from "../../../ui/xmusic/xmusic-audio-list";

class XMusicChannel extends Component {
	
	constructor(props) {
		super(props);
		SideNavBar__SetActiveMenu('/xmusic');
		this.state = {
			xMusicLength : null,
			image: null
		}
	}

	componentDidMount = () => {
		AjaxService.get(Routes.XMUSIC_GET_MUSIC_COUNT(), function (response) {
			console.log(response.count);
			this.setState({xMusicLength: response.count});
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your X-Music Songs.");
		});
	}
	
	uploadAudio = e => {
		e.preventDefault();
		this.props.history.push("/xmusic/audios/upload-audio");
	}

	render() {
		return (
			<div className="container-fluid margin-top-5">
				<div className="row padding-bottom-20">
					<div className="col col-12 ">
						{(this.state.xMusicLength === 0) ?
							<Card className="text-center h-100">
								<Card.Body>
									<h2 className="text-x-love margin-bottom-20">No Songs Uploaded</h2>
									<h6 className="text-x-default max-width-70 margin-auto">
										To start with X-Music you need to upload a song at X-Music. 
									</h6>
									<Button variant="x-love" className="margin-top-30" type="submit" id="xMusic_upload_song_button" sm="4" onClick={(e) => this.uploadAudio(e)}>
										<i className = "fas fa-plus"></i>  Upload New Song
									</Button>
								</Card.Body>
							</Card>
							:
							<React.Fragment>
								<Button variant="x-love" type="submit" id="xMusic_upload_song_button" sm="4" onClick={(e) => this.uploadAudio(e)}>
									<i className = "fas fa-plus"></i>  Upload New Song
								</Button>
								<h4 className="margin-top-20 margin-bottom-20">Your Uploaded Songs</h4>
								<div className="col col-12 padding-bottom-50">
									<Tabs defaultActiveKey="liveMusic" transition={false} id="uncontrolled-tab-example">
										<Tab eventKey="liveMusic" title="Live Music" className="text-x-default">
											<XMusicAudioList type="live"/>
										</Tab>
										<Tab eventKey="reviewMusic" title="Music In Review" className="text-x-default">
											<XMusicAudioList type="review"/>
										</Tab>
									</Tabs>
								</div>
							</React.Fragment>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default XMusicChannel;
