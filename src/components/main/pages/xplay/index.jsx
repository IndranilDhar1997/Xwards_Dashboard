import React, { Component } from "react";
import {Card, Button} from 'react-bootstrap';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";
import {Link} from 'react-router-dom';

import { AjaxService, Routes } from '../../../../js/ajax/ajax';

import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import {XPlayCreateChannel, XPlayCreateChannel__OpenModal} from "../../../ui/xplay/xplay-create-channel-modal";
	

class XPlayChannel extends Component {
	
	constructor(props) {
		super(props);
		SideNavBar__SetActiveMenu('/xplay');
		this.state = {
			channelList : [],
			image: null
		}
	}

	componentDidMount = () => {
		//Fetching details of channel
		AjaxService.get(Routes.XPLAY_GET_CHANNEL_LIST(), function (response) {
			this.setState({channelList: response});
		}.bind(this), function(error){
			MainNavBar__Toast('err', "Some error occured while fetching your X-Play channels.");
		});
	}

	render() {
		return (
			<div className="container-fluid margin-top-5">
				<div className="row padding-bottom-20">
					<div className="col col-12 ">
						{/* Check if any channels available or not */}
						{(this.state.channelList.length === 0) ?
							<Card className="text-center h-100">
								{/* If channel list is zero */}
								<Card.Body>
									<h2 className="text-x-love margin-bottom-20">No Channels Created</h2>
									<h6 className="text-x-default max-width-70 margin-auto">
										To start with X-Play you need to create a channel at X-Play. X-Play channel is a collection 
										of videos hosted by a particular artist or entertainment media company.
									</h6>
									<Button variant="x-love" className="margin-top-30" type="submit" id="xPlay_create_channel_button" sm="4" onClick={(e) => XPlayCreateChannel__OpenModal(e)}>
										<i className = "fas fa-plus"></i>  Create new channel
									</Button>
								</Card.Body>
							</Card>
							:
							<React.Fragment>
								{/* If channel list is  more than zero */}
								<Button variant="x-love" type="submit" id="xPlay_create_channel_button" sm="4" onClick={(e) => XPlayCreateChannel__OpenModal(e)}>
									<i className = "fas fa-plus"></i>  Create new channel
								</Button>
								<h4 className="margin-top-20 margin-bottom-20">Your Channels</h4>
								<div className="row" >
									{this.state.channelList.map(channel =>(
										<div className="col col-xs-12 col-sm-6 col-md-4 col-lg-3" key={channel.id}>
											<Link variant="x-default" to={`channel/${channel.id}`}>
												<Card className="ChannelCard">
													<Card.Img variant="top" src={channel.photo} className="img-thumbnail" />
													<Card.Body className="center-align padding-10 text-x-default strong">
														{channel.name}
													</Card.Body>
												</Card>
											</Link>
										</div>
									))}
								</div>
							</React.Fragment>
						}
					</div>
				</div>
				<XPlayCreateChannel />
			</div>
		);
	}
}

export default XPlayChannel;
