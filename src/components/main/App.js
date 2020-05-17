//Importing Core React Modules
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

//UI Components
import { MainNavBar, SideNavBar } from '../ui/navbar/navbar';

//Define Pages
import Dashboard from './pages/dashboard';
import ManageBrands from './pages/brands/manage-brands';
import CampaignManager from './pages/brands/campaign/campaign-manager';
import BillingManager from './pages/user/billing'
import DeveloperOptions from './pages/developer-options'
import HelpPage from './pages/help-page'
import MyProfile from './pages/user/profile/profile';
import TeamManagement from './pages/user/team';
import Error from "./pages/error";
import CreateCampaign from "./pages/brands/campaign/create-campaign";

//XPlay Manager
import XPlay from './pages/xplay/xplay';
import XPlayChannelID from './pages/xplay/xplay-channel-id';
import XPlayChannel from './pages/xplay';
import XPlayRequest from './pages/xplay/xplay-request';
import XPlayUploadVideo from './pages/xplay/xplay-upload-video';
import XPlayVideo from './pages/xplay/xplay-video';
import XPlayLiveVideo from './pages/xplay/xplay-live-video';

//XMusic Manager
import XMusic from './pages/xmusic/xmusic';
import XMusicChannel from './pages/xmusic';
import XMusicRequest from './pages/xmusic/xmusic-request';
import XMusicUploadSong from './pages/xmusic/xmusic-upload-audio';

//Content Manager 
import ContentManager from "./pages/content/index";
import CreateContent from "./pages/content/create-content";
import CreateContentAddImage from "./pages/content/create-add-image";
import DraftContent from './pages/content/draft-contents';
import InReviewContents from './pages/content/review-contents';
import ContentPreviewContent from './pages/content/preview';

//Creative Managements
import Collections from './pages/brands/campaign/creative-managements/collections';
import Creatives from './pages/brands/campaign/creative-managements/creatives/index';
import AddCreatives from './pages/brands/campaign/creative-managements/creatives/add-creatives';
import EditCreatives from './pages/brands/campaign/creative-managements/creatives/edit-creatives';

//User Profile Service Files
import UserProfileService from "../../js/services/userProfile";

//Import Core files
import {UserDropDown__LoadUserData, BrandDropDown__LoadBrandData} from "../ui/navbar/navbar";
import Routes from "../../js/ajax/routes";
import Config from "../../config";
import Utility from '../../js/lib/utility';
import $ from 'jquery';

class App extends Component {

	constructor() {
		super();

		let urlParams = Utility.getUrlParams();
		let verifyurl = null; //Verify if the person should be on this page or not

		//Check for Token
		if ("token" in urlParams) {
			//Verify URL
			verifyurl = Routes.LOGIN_VERIFY_URL(urlParams.token);
			console.log("params:",urlParams);
		} else {
			if (localStorage.getItem('userId') && localStorage.getItem('token')) {
				//If the person was already loggedin
				verifyurl = Routes.LOGIN_VERIFY_LOCAL(localStorage.getItem('userId'), localStorage.getItem('token'));
			} else { //if the person was never logged in - LOGOUT
				UserProfileService.logout();
				window.location.replace(Config[Config.env].MAINSITE);
			}
		}
		// Check url with token
		if (verifyurl != null) {
			$.ajax({
				url: verifyurl,
				method: 'GET',
				error: function (err, type, execption) {
					// UserProfileService.logout();
					window.location.replace(Config[Config.env].MAINSITE);
				},
				success: function (data, status, req) {
					UserProfileService.setLoggedInUser(data.user);
					UserDropDown__LoadUserData();
					BrandDropDown__LoadBrandData();
				}
			});
		} else {
			// Verification fails => remove localstorage to logout the user
			localStorage.removeItem('userId');
			localStorage.removeItem('token');
			window.location.replace(Config[Config.env].MAINSITE);
		}
	}

	render() {
		return (
			<React.Fragment>
				<BrowserRouter>
					<MainNavBar />
					<div className="container-fluid">
						<div className="row">
							<div className="col col-md-4 col-lg-3 col-xl-2 d-none d-md-block padding-left-0 padding-right-0 dashboard-menuholder">
								<SideNavBar />
							</div>
							<div className="col col-md-8 col-lg-9 col-xl-10 main-body-holder">
								<div id="main-spinner-content-holder">
									<div className="center-align" id="spinner-holder">
										<div id="main-spinner" className="spinner-border text-x-default" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									</div>
								</div>
								<Switch>
									<Route exact path="/" component={Dashboard} />
									<Route exact path="/developer-options" component={DeveloperOptions} />
									<Route exact path="/help-and-support" component={HelpPage} />
									
									
									{/* Content Routes */}
									<Route exact path="/content-marketing" component={ContentManager} />
									<Route exact path="/content-marketing/create" component={CreateContent} />
									<Route exact path="/content-marketing/create/images" component={CreateContentAddImage} />
									<Route exact path="/content-marketing/drafts" component={DraftContent} />
									<Route exact path="/content-marketing/in-review" component={InReviewContents} />
									<Route exact path="/content-marketing/preview" component={ContentPreviewContent} />

									{/* Brands Routes */}
									<Route exact path="/brands" component={ManageBrands} />
									<Route exact path="/brands/campaigns" component={CampaignManager} />

									{/* Billing Manager Route */}
									<Route exact path="/user/billing" component={BillingManager} />
									{/* User Profile Route */}
									<Route exact path="/user/profile" component={MyProfile} />
									{/* Team Management Route */}
									<Route exact path="/user/team" component={TeamManagement} />

									{/* Campaign Routes	 */}
									<Route exact path="/campaign/create/" component={CreateCampaign} />
									
									{/* Route for Xplay */}
									<Route exact path="/xplay" component={XPlay} />
									<Route exact path="/xplay/request" component={XPlayRequest} />
									<Route exact path="/xplay/channel" component={XPlayChannel} />
									<Route exact path="/xplay/channel/:channel_id" component={XPlayChannelID} />
									<Route exact path="/xplay/channel/:channel_id/upload-video" component={XPlayUploadVideo} />
									<Route exact path="/xplay/channel/:channel_id/video/:video_id" component={XPlayVideo} />
									<Route exact path="/xplay/channel/:channel_id/live-video/:video_id" component={XPlayLiveVideo} />

									{/* Route for XMusic */}
									<Route exact path= "/xmusic" component={XMusic} />
									<Route exact path="/xmusic/request" component={XMusicRequest} />
									<Route exact path="/xmusic/audios" component={XMusicChannel} />
									<Route exact path="/xmusic/audios/upload-audio" component={XMusicUploadSong} />

									<Route exact path="/brands/campaigns/creative-managements/collections/" component = {Collections} />
									<Route exact path = "/brands/campaigns/creative-managements/:collectionId/creatives" component = {Creatives} />
									<Route exact path = "/brands/campaigns/creative-managements/:collectionId/creatives/add/" component = {AddCreatives} />
									<Route exact path = "/brands/campaigns/creative-managements/:collectionId/creatives/edit/:creativeId" component = {EditCreatives} />
									<Route component={Error} />
								</Switch>
							</div>
						</div>
					</div>
				</BrowserRouter>
			</React.Fragment>
		);
	}
}

export default App;
