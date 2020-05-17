import React, { Component } from 'react';
import Pagination from "react-js-pagination";

import Table from 'react-bootstrap/Table';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import {Card} from "react-bootstrap";

import utility from "../../../../js/lib/utility";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import Config from '../../../../config';
import ContentDataService from '../../../../js/services/contentDataService';
import ContentTopBar from "../../../ui/content/content-top-bar";

class ContentManager extends Component {
    constructor(props) {
        super(props);
        this.state = { contentDetails: [], totalItemsCount: '', activePage: 1  };
        ContentDataService.removeContentData();
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_CONTENTS()+"?page="+this.state.activePage, function(response) {
            console.log(response);
            this.setState({contentDetails: response.contents, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_CONTENTS()+"?page="+pageNumber, function(response) {
            this.setState({contentDetails: response.contents, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    //Click the eye to get the preview of content
    getPreview(contentId) {
        AjaxService.get(Routes.GET_CONTENT(contentId), function(response) {
            //let contentData = JSON.parse(response.data);
            console.log(response.contents[0]);
            // contentData.id = response.id;
            ContentDataService.saveContentData(response.contents[0]);
            window.location.replace(Config[Config.env].url+"/content-marketing/preview");
        }, function(error) {
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        })
    }

    //Click the slider to change the running status of content
    changeContentStatus(e, contentId) {
        let contentStatus = {
            status: e.target.checked
        }
        AjaxService.put(Routes.CHANGE_CONTENT_STATUS(contentId), contentStatus, function(response) {
            window.location.reload();
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some Error! You cannot live this content");
        })
    }

    render() { 
        return ( 
            <div className="container-fluid margin-bottom-50" id= "contents">
                <ContentTopBar toShow={[{label: 'In Review', name: 'review', route: '/content-marketing/in-review'}, {label: 'Show Drafts', name: 'draft', route: '/content-marketing/drafts'}]} />
                { this.state.contentDetails.length != 0 && (
				<div className="row margin-top-20">
					<div className="col col-12">
						<h4 className="margin-bottom-20">Summary of Live Contents</h4>
                        <Table striped={true} bordered={true} hover={true} id="campaign-summary">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Approved On</th>
                                <th>Impressions</th>
                                <th>Viewing Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.contentDetails.map(contentProperty => (
                                    <tr key= {contentProperty.id}>
                                        <td>
											<OverlayTrigger
												placement="right"
												overlay={
													<Tooltip>
														Pause or Resume your Content from live
													</Tooltip>
												}
											>
												<label className="switch margin-top-5">
                                                    <input type="checkbox" checked={contentProperty.liveStatus === true} onChange={(e)=> this.changeContentStatus(e, contentProperty.id)} />
													<span className="slider round"></span>
                                                </label>
											</OverlayTrigger>
										</td>
                                        <td>{contentProperty.contentType}</td>
                                        <td>
                                            <a className="text-x-default cursor-pointer margin-left-15" onClick={() => this.getPreview(contentProperty.id)} >
                                                {contentProperty.contentTitle}
                                            </a>
                                        </td>
                                        {contentProperty.liveStatus === true && (
                                            <td>Running</td>
                                        )}
                                         {contentProperty.liveStatus === false && (
                                            <td>Paused</td>
                                        )}
                                        <td>{utility.toDateFormat(contentProperty.createdAt)}</td>

                                        <td>{contentProperty.impressions}</td>
                                        <td>{contentProperty.totalViewingTime}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                    
				</div>
                <div className="col col-12 margin-top-30" >
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
			</div>
        )}
        { this.state.contentDetails.length == 0 && (
            <Card className="text-center margin-top-20">
                <Card.Body>
                    <h5 className="text-secondary">No content created. Create a content</h5>
                </Card.Body>
            </Card>
        )}
	</div>
    )}
}
 
export default ContentManager;