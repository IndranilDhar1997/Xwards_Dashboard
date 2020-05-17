import React, { Component } from "react";
import { Table, Card, Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import BrandService from '../../../../../js/services/brandService';
import Utility from '../../../../../js/lib/utility'; //Utility functions
import { SideNavBar__SetActiveMenu, MainNavBar__Toast } from "../../../../ui/navbar/navbar";
import Pagination from "react-js-pagination";
import { AjaxService, Routes } from "../../../../../js/ajax/ajax";

class CampaignManager extends Component {

	constructor() {
		super();
		this.state = { 
			campaignList: [],
			userBrandListLength: BrandService.getBrandList().length,
			selectedBrand: BrandService.getSelectedBrand(),
			totalItemsCount: '', 
			activePage: 1
		}
		SideNavBar__SetActiveMenu('/brands/campaigns');
	}

	componentDidMount() {
		if(this.state.selectedBrand !== null) {
			AjaxService.get(Routes.GET_CAMPAIGN(this.state.selectedBrand.id)+"?page="+this.state.activePage, function (response) {
				this.setState({ campaignList: response.campaign, totalItemsCount: response.campaignCount });
			}.bind(this), function(error){
				console.log(error);
				MainNavBar__Toast('err', "Some error occured while fetching your campaigns.");
			});
		} else {
			MainNavBar__Toast('info', "Please select a brand to go for a campaign.");
		}
	}

	handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_CAMPAIGN(this.state.selectedBrand.id)+"?page="+pageNumber, function (response) {
			this.setState({ campaignList: response.campaign, totalItemsCount: response.campaignCount });
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your campaigns.");
		});
    }

	gotoCreativeManagement = e => {
		e.preventDefault();
		this.props.history.push({ pathname : "/brands/campaigns/creative-managements/collections/"});
	}

	addCampaignManager = e => {
		e.preventDefault();
		this.props.history.push({ pathname : "/campaign/create/"});
	}

	changeCampaignStatus = (e, campaignId) => {
		let verify = window.prompt("Type 'CONFIRM' to change the status.");
        if (!(verify === 'CONFIRM')) {
            MainNavBar__Toast('err', 'ERR. Please type "CONFIRM"...');
            return false;
		}
		let data = {
			checkedValue: e.target.checked
		}
		AjaxService.put(Routes.UPDATE_CAMPAIGN_STATUS(this.state.selectedBrand.id, campaignId), data, function(response){
			console.log(response);
			window.location.reload();
			MainNavBar__Toast('success', "Campaign Status Updated.");
		}, function(error) {
			console.log(error);
			MainNavBar__Toast('err', "Error occured while updating your campaign status.");
		})
	}

	render() {
		return (
			<React.Fragment>
				{(this.state.userBrandListLength === 0 && (
					<Card className="text-center margin-top-20">
						{/* No Brands Created */}
						<Card.Body>
							<h2 className="text-x-love margin-bottom-20">No Brands Created</h2>
							<h6 className="text-x-default max-width-70 margin-auto">
							To create your own brand, please visit the dropdown of the brands and add brand there. Creating a brand will make you brand owner.
							</h6>
						</Card.Body>
					</Card>
				))}
				{(this.state.userBrandListLength !== 0 && (
					this.state.selectedBrand !== null ? (
						<div className="container-fluid margin-bottom-50">
							<div className="row margin-top-5">
								<div className="col col-3">
									<Button variant="x-love" type="submit" id="add_campaign_manager" sm="4" onClick={(e) => this.addCampaignManager(e)}>
										<i className = "fas fa-plus"></i> Campaign Manager
									</Button>
								</div>
								<div className="col col-3">
									<Button variant="x-default" type="submit" id="creative_management" sm="4" onClick={(e) => this.gotoCreativeManagement(e)}>
										<i className = "fas fa-plus"></i> Creative Management
									</Button>
								</div>
							</div>
							{(this.state.campaignList.length !== 0) ? (
								<React.Fragment>
									<div className="row margin-top-20">
										<div className="col col-12">
											<h4>Summary of Campaigns</h4>
											<Table striped={true} bordered={true} hover={true} id="campaign-summary" className="center-align">
												<thead>
													<tr>
														<th></th>
														<th>Campaign Name</th>
														<th>Brand</th>
														<th>Status</th>
														<th>Starts</th>
														<th>Validity</th>
													</tr>
												</thead>
												<tbody>
													{this.state.campaignList.map(campaign => (
														<tr key= {campaign.id}>
															{campaign.status !== 'Terminated' && (
																<td>
																	<OverlayTrigger
																		placement="right"
																		overlay={
																			<Tooltip>
																				Pause or Resume your Campaign from live
																			</Tooltip>
																		}
																	>
																		<label className="switch margin-top-5">
																			<input type="checkbox" checked={campaign.status === 'Paused' ? false : true } onChange={(e)=> this.changeCampaignStatus(e, campaign.id)} />
																			<span className="slider round"></span>
																		</label>
																	</OverlayTrigger>
																</td>
															)}
															{campaign.status === 'Terminated' && (
																<td className="font-weight-700 text-x-love">NA</td>
															)}
															<td className="text-x-default">{campaign.name}</td>
															<td>{this.state.selectedBrand.name}</td>
															{campaign.status === 'Paused' && (
																<td className="font-weight-700" style={{ color: '#FFC300'}}>{campaign.status}</td>
															)}
															{campaign.status === 'Running' && (
																<td className="font-weight-700" style={{ color: 'green'}}>{campaign.status}</td>
															)}
															{campaign.status === 'Terminated' && (
																<td className="font-weight-700" style={{ color: 'red'}}>{campaign.status}</td>
															)}
															<td>{Utility.toDateFormat(campaign.start_date)}</td>
															<td>{campaign.total_days} days</td>
														</tr>
													))}
												</tbody>
											</Table>
										</div>
									</div>
									<div className="row margin-top-20 margin-bottom-20">
									<Pagination
										activePage={this.state.activePage}
										itemsCountPerPage={10}
										totalItemsCount={this.state.totalItemsCount}
										pageRangeDisplayed={5}
										itemClass="page-item"
										linkClass="page-link"
										onChange={(e) => this.handlePageChange(e)}
									/>
									</div>
								</React.Fragment>
							): (
								<div className="row margin-top-30 margin-left-5">
									<Card className="text-center w-100">
										<Card.Body>
											<h2 className="text-x-love margin-bottom-20">No Campaign Created under {this.state.selectedBrand.name}.</h2>
											<h6 className="text-x-default max-width-70 margin-auto">
												To create a campaign, please click on the <strong>Campaign Manager</strong> button.
											</h6>
										</Card.Body>
									</Card>
								</div>		
							)}
						</div>
					) : (
						<Card className="text-center margin-top-20">
							{/* If selected brand is null */}
							<Card.Body>
								<h2 className="text-x-love margin-bottom-20">No Brands Selected</h2>
								<h6 className="text-x-default max-width-70 margin-auto">
									To create a campaign, please select a brand to proceed further.
								</h6>
							</Card.Body>
						</Card>
					)
				))}
			</React.Fragment>
		);
	}
}

export default CampaignManager;