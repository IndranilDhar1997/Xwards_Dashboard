import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Form, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Map, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import $ from 'jquery';
import utility from '../../../../../js/lib/utility';
import { AjaxService, Routes } from "../../../../../js/ajax/ajax";
import Select from 'react-select';
import Chips from 'react-chips';
import {SideNavBar__SetActiveMenu, MainNavBar__Toast} from "../../../../ui/navbar/navbar";
import BrandService from '../../../../../js/services/brandService';
import { AddCreativeModal, AddCreativeShowModal } from '../../../../ui/creative-management/create-creative-modal';

const categoryTheme = {
	control: (base, state) => ({
		...base,
	}),
	option: (base, state) => ({
		...base,
		background: state.isFocused ? '#0350a4' : '#fff',
		fontWeight: state.isFocused ? 'bold' : '',
		color: state.isFocused ? '#fff' : '#000',
		"&:hover": {
			background: state.isFocused ? '#0350a4' : '#fff',
			fontWeight: state.isFocused ? 'bold' : '',
			color: state.isFocused ? '#fff' : '#000',
			cursor: state.isFocused ? 'pointer' : 'initial',
		}
	})
};

var updateCategory = function (category) {
    this.setState({areas: this.state.areas, category: category, pictures: this.state.pictures});
}

var updateSubCategory = function (category) {
    this.setState({areas: this.state.areas, category: this.state.category, subCategory: category, pictures: this.state.pictures});
}

export default class CreateCampaign extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            areas: [], 
            category: [], 
            subCategory: [], 
            pictures: [],
            categoryIds: [],
            subCategoryIds: [],
            brandName: BrandService.getSelectedBrand().name,
            brandId: BrandService.getSelectedBrand().id,
            startDate: '',
            totalDays: null,
            collections: [],
            selectedCollection: null,
            creatives: [],
            selectedCreative: null,
            campaignName: '',
            campaignDescription: '',
            minAge: '',
            maxAge: '',
            gender: ''
        }
        SideNavBar__SetActiveMenu('/brands/campaigns');
        updateCategory = updateCategory.bind(this);
        updateSubCategory = updateSubCategory.bind(this);
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_CAMPAIGN_CATEGORY(this.state.brandId), function(response) {
            response = response.map(category => {
                return {value: category.id, label: category.display_name, child: category.ChildCategory}
            });
            updateCategory(response);
        }, function (error) {
            console.log(error);
            MainNavBar__Toast('err', "Some error while fetching data");
        })
        AjaxService.get(Routes.Get_All_Collections(this.state.brandId), function (response) {
            let collectionsFromApi = response.map(col=> {
                return { value: col.collection_name, label: col.collection_name, id: col.id }
            })
            this.setState({ collections: collectionsFromApi });
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your collections.");
		});
    }

    handleCollectionSelect = selectedCollection => {
        this.setState({ selectedCollection: selectedCollection });
        AjaxService.get(Routes.Get_All_Creatives(this.state.brandId, selectedCollection.id), function (response) {
            this.setState({ creatives: response });
		}.bind(this), function(error){
			console.log(error);
			MainNavBar__Toast('err', "Some error occured while fetching your creatives.");
		});
    }

    handleCreativeChange = selectedCreative => {
        this.setState({ selectedCreative: selectedCreative });
    }

    onChange = chips => {
        this.setState({ chips });
    }

    selectCategory(categories) {
        let subCategoriesResponse = [];
        var catIds = [];
        if (categories !== null && categories.length > 0) {
            
            categories.forEach(category => {
                catIds.push(category.value);
                this.setState({ categoryIds: catIds});
                let subCategories = category.child;
                subCategories = subCategories.map(subCategory => {
                    subCategoriesResponse.push({value: subCategory.id, label: subCategory.display_name})
                    return subCategory;
                });
            });
        } else {
            subCategoriesResponse = [];
        }
        updateSubCategory(subCategoriesResponse);
    }

    selectSubCategory(subCategories) {
        var subCatIds = [];
        if(subCategories !== null && subCategories.length > 0) {
            subCategories.forEach(subCategory => {
                subCatIds.push(subCategory.value);
                this.setState({ subCategoryIds: subCatIds });
            })
        }
    }

    drawCircle(e) {
        let circle = {};
        circle.id = e.layer._leaflet_id;
        circle.lat = e.layer._latlng.lat; //Lat of the circle
        circle.lng = e.layer._latlng.lng; //Long of the circle
        circle.radius = e.layer._mRadius; //Radius of the circle in meters
        let areas = this.state.areas;
        areas[e.layer._leaflet_id] = circle;
        this.setState({areas: areas, category: this.state.category, subCategory: this.state.subCategory, pictures: this.state.pictures});
    }

    updateCircles(e) {
        let areas = this.state.areas;
        e.layers.eachLayer(a => {
            let circle = {};
            circle.id = a._leaflet_id;
            circle.lat = a._latlng.lat; //Lat of the circle
            circle.lng = a._latlng.lng; //Long of the circle
            circle.radius = a._mRadius; //Radius of the circle in meters
            areas[a._leaflet_id] = circle;
        });
        this.setState({areas: areas, category: this.state.category, subCategory: this.state.subCategory, pictures: this.state.pictures});
    }

    deleteCircles(e) {
        let areas = this.state.areas;
        e.layers.eachLayer(a => {
            delete areas[a._leaflet_id];
        })
        this.setState({areas: areas, category: this.state.category, subCategory: this.state.subCategory, pictures: this.state.pictures});
    }

    handleDateChange = date => {
        this.setState({ startDate: date });
        this.calculateEndDate(date, this.state.totalDays);
    };

    handleTotalDaysChange = e => {
        this.setState({ totalDays: e.target.value, date: this.state.date });
        this.calculateEndDate(this.state.startDate, e.target.value);
    }

    calculateEndDate(date, totalDays) {
        if(date !== '' && totalDays !== null) {
            let endDate = utility.addDays(date, totalDays);
            $('#calculatedEndDate').html('<i class="fas fa-info-circle margin-right-10"></i> Your campaign will end by <span class="strong italics">'+endDate.toDateString()+"</span>");
            $('#calculatedEndDate').css('display', 'block');
        }
    }

    goBack = e => {
        e.preventDefault();
        this.props.history.push({ pathname: "/brands/campaigns/"});
    }

    addCampaign() {
        if(this.state.campaignName === '' || this.state.campaignName === null) {
            MainNavBar__Toast('err', "Campaign Name Cannot be Null");
            return false;
        }
        if(this.state.campaignDescription === '' || this.state.campaignDescription === null) {
            MainNavBar__Toast('err', "Campaign Description Cannot be Null");
            return false;
        }
        if(this.state.areas.length === 0 ) {
            MainNavBar__Toast('err', "Please select an area for the campaign");
            return false;
        }
        if(this.state.totalDays === '' || this.state.totalDays === null) {
            MainNavBar__Toast('err', "Total Days Cannot be Null");
            return false;
        }
        if(this.state.startDate === '' || this.state.startDate === null) {
            MainNavBar__Toast('err', "Please Select a Date to start a campaign");
            return false;
        }
        if(this.state.chips === [] || this.state.chips === undefined || this.state.chips === null) {
            MainNavBar__Toast('err', "Please provide keywords to this campaign");
            return false;
        }
        if(this.state.selectedCollection.id === null || this.state.selectedCollection.id === undefined || this.state.selectedCollection.id === '') {
            MainNavBar__Toast('err', "Please select a collection");
            return false;
        }
        if(this.state.selectedCreative.id === null || this.state.selectedCreative.id === undefined || this.state.selectedCreative.id === '') {
            MainNavBar__Toast('err', "Please select a creative or create it");
            return false;
        }
        if(this.state.categoryIds === [] || this.state.categoryIds === undefined) {
            MainNavBar__Toast('err', "Please select a category for this campaign");
            return false;
        }
        if(this.state.minAge === '' || this.state.minAge === undefined || this.state.minAge === null) {
            MainNavBar__Toast('err', "Please select Minimum Age Range");
            return false;
        }
        if(this.state.maxAge === '' || this.state.maxAge === undefined || this.state.maxAge === null) {
            MainNavBar__Toast('err', "Please select Maximum Age Range");
            return false;
        }
        if(this.state.gender === '' || this.state.gender === undefined || this.state.gender === null) {
            MainNavBar__Toast('err', "Please select Targeting Gender for this campaign");
            return false;
        }
        let campaignData = {
            brandId: this.state.brandId,
            areas: this.state.areas,
            description: this.state.campaignDescription,
            startDate: utility.dateToEpoch(this.state.startDate),
            campaignName: this.state.campaignName,
            categories: this.state.categoryIds,
            subCategories: this.state.subCategoryIds,
            collectionId: this.state.selectedCollection.id,
            creativeId: this.state.selectedCreative.id,
            numberOfDays: this.state.totalDays,
            keywords: this.state.chips,
            minAge: this.state.minAge,
            maxAge: this.state.maxAge,
            gender: this.state.gender
        }
        let newArea = campaignData.areas.filter( function(area) {
            return area.lat && area.lng && area.radius
        })
        campaignData.areas = newArea;
        AjaxService.post(Routes.ADD_CAMPAIGN(), campaignData, function(response) {
            this.props.history.push({ pathname : "/brands/campaigns/"});
            MainNavBar__Toast('success', "Successfully Created");
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some error while saving data");
        },{
            timeout: 10000000,
            onComplete: function () {
                $('button#addCampaignForm__btnAddCampaign').removeAttr('disabled');
                $('button#addCampaignForm__btnGoBack').removeAttr('disabled');
                $('button#addCampaignForm__btnAddCampaign').html('<i className="fas fa-plus margin-right-10"> Create');
            },
            beforeSend: function () {
                $('button#addCampaignForm__btnAddCampaign').html('Uploading your campaign... it might take time.');
                $('button#addCampaignForm__btnAddCampaign').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#addCampaignForm__btnAddCampaign').attr('disabled', 'disabled');
                $('button#addCampaignForm__btnGoBack').attr('disabled', 'disabled');
            }
        });
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-top-5" id="addCampaign">
                    <div className="row">
                        <div className="col col-12 margin-bottom-10">
                            <h3>Create Your Campaign for {this.state.brandName}</h3>
                        </div>
                        <div className="col col-12">
                            <Form name="addCampaignForm" id="addCampaignForm">
                                <div className="row">
                                    <div className="col col-6">
                                        <div className="row">
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__startDate">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Choose from when you want your campaign to start.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Start Date</Form.Label>
                                                    </OverlayTrigger>
                                                    <DatePicker selected={this.state.startDate || ''} autoComplete="off" dateFormat='dd/MM/yyyy' minDate={new Date()} name = "startDate" value = {this.state.startDate || ''} onChange={(e)=> this.handleDateChange(e)}/>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__totalDays">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Choose total number of days you want campaign to run for.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Total Days</Form.Label>
                                                    </OverlayTrigger>
                                                    <div className="position-relative">
                                                        <Form.Control type="number" placeholder="Total Days" name="totalDays" value={this.state.totalDays || '' } onChange={(e) => this.handleTotalDaysChange(e)} />
                                                        <span id="contentHolderDays">days</span>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-12">
                                                <div id="calculatedEndDate" className="margin-bottom-10 text-x-default text-sm"></div>
                                            </div>
                                            <div className="col col-12">
                                                <Form.Group controlId="addCampaignForm__campaignName">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Name of the campaign. Every campaign has a name, this will later help you in identifying your campaign details.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Campaign Name</Form.Label>
                                                    </OverlayTrigger>
                                                    <Form.Control type="text" placeholder="Enter Campaign Name" name="campaignName" value={this.state.campaignName || ''} onChange={(e)=> this.setState({ campaignName: e.target.value})} />
                                                </Form.Group>
                                            </div>
                                            <div className="col col-12">
                                                {/* <h6 className="margin-left-5 margin-bottom-15">Add your Hashtags without #</h6> */}
                                                <Form.Group controlId="addCampaignForm__hashtags">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Add your Hashtags without using '#'
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Hashtags/Keywords</Form.Label>
                                                    </OverlayTrigger>
                                                </Form.Group>
                                                <Chips
                                                    value={this.state.chips}
                                                    onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="col col-12 margin-top-10">
                                                <Form.Group controlId="addCampaignForm__description">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Additional information about the campaign
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Descripion</Form.Label>
                                                    </OverlayTrigger>
                                                    <Form.Control as="textarea" rows="2" name="campaignDescription" value={this.state.campaignDescription || ''} onChange={(e)=>this.setState({ campaignDescription: e.target.value })}/>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__categories">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                The Xplore App hosts many different categories. Please select the best suitable category for your brand.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Category</Form.Label>
                                                    </OverlayTrigger>
                                                    <Select
                                                        isMulti
                                                        inputId='addCampaignForm__categories'
                                                        name='addCampaignForm__categories'
                                                        options={this.state.category}
                                                        classNamePrefix="react-select"
                                                        styles={categoryTheme}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        onChange={(e) => this.selectCategory(e)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__subCategories">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Based on the category. Please select the best suitable sub-category for your brand.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Sub Category</Form.Label>
                                                    </OverlayTrigger>
                                                    <Select
                                                        isMulti
                                                        inputId='addCampaignForm__subCategories'
                                                        name='addCampaignForm__subCategories'
                                                        options={this.state.subCategory}
                                                        classNamePrefix="react-select"
                                                        styles={categoryTheme}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        onChange={(e)=> this.selectSubCategory(e)}
                                                    />
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__collections">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Select a collection. After that only, you can select a Creative from Dropdown.
                                                            </Tooltip>
                                                        }
                                                    >
                                                    <Form.Label className="text-x-default cursor-pointer">Collections</Form.Label>
                                                    </OverlayTrigger>
                                                    <Select
                                                        defaultValue= "Select"
                                                        label="Select"
                                                        options={this.state.collections}
                                                        onChange={this.handleCollectionSelect}
                                                    /> 
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__creatives">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Select a creative or create one.
                                                            </Tooltip>
                                                        }
                                                    >
                                                    <Form.Label className="text-x-default cursor-pointer">Creatives</Form.Label>
                                                    </OverlayTrigger>
                                                        <Dropdown className="w-100">
                                                            <Dropdown.Toggle variant="light" id="brand-dropdown" bsPrefix="text-x-default">
                                                                {this.state.selectedCreative === null && 'Choose a Creative'}
                                                                {this.state.selectedCreative !== null && this.state.selectedCreative.title}
                                                                <i className="margin-left-5 fas fa-caret-down"></i>
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                {(this.state.creatives === [] || this.state.creatives.length === 0) &&
                                                                    <Dropdown.Item bsPrefix="dropdown-item" disabled>No Creatives</Dropdown.Item>
                                                                }
                                                                {this.state.creatives !== [] && this.state.creatives.map(creative => (
                                                                    <Dropdown.Item onSelect={() => this.handleCreativeChange(creative)} bsPrefix="dropdown-item" key={creative.id}>{creative.title}</Dropdown.Item>
                                                                ))}
                                                                <Dropdown.Divider />
                                                                {this.state.selectedCollection !== null ? (
                                                                    <Dropdown.Item onClick={(e) => AddCreativeShowModal(e, this.state.selectedCollection.id)} bsPrefix="dropdown-item">Add A Creative</Dropdown.Item>
                                                                ): (
                                                                    <Dropdown.Item bsPrefix="dropdown-item">Select Collection</Dropdown.Item>
                                                                )}
                                                            </Dropdown.Menu>
                                                            <AddCreativeModal />
                                                        </Dropdown>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__minAge">
                                                    <OverlayTrigger
                                                            placement="right"
                                                            overlay={
                                                                <Tooltip>
                                                                    Select minimum age to target this campaign.(Min 13, Max 30).
                                                                </Tooltip>
                                                            }
                                                        >
                                                        <Form.Label className="text-x-default">Minimum Age: <strong>{this.state.minAge}</strong></Form.Label>
                                                    </OverlayTrigger>
                                                    <Form.Control type="range" name="minAge" value={this.state.minAge || ''} min={13} max={65} onChange={(e)=> this.setState({ minAge: e.target.value})}/>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-6">
                                                <Form.Group controlId="addCampaignForm__maxAge">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Select maxmimum age to target this campaign.(Min 13, Max 65)
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default">Maximum Age: <strong>{this.state.maxAge}</strong></Form.Label>
                                                    </OverlayTrigger>
                                                    <Form.Control type="range" name="maxAge" value={this.state.maxAge || ''} min={13} max={65} onChange={(e)=> this.setState({ maxAge: e.target.value})}/>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-12">
                                                <Form.Group controlId="addCampaignForm__gender">
                                                    <div className="row">
                                                        <div className="col col-12">
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={
                                                                    <Tooltip>
                                                                        Select gender to target this campaign.
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <Form.Label className="text-x-default">Targeting Gender</Form.Label>
                                                            </OverlayTrigger>
                                                        </div>
                                                        <div className="col col-12">
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" name="targetGenger" id="m" value="m" onChange={e=> this.setState({ gender: e.target.value})}/>
                                                                <label className="form-check-label" htmlFor="m">Male</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" name="targetGenger" id="f" value="f" onChange={e=> this.setState({ gender: e.target.value})}/>
                                                                <label className="form-check-label" htmlFor="f">Female</label>
                                                            </div>
                                                            <div className="form-check form-check-inline">
                                                                <input className="form-check-input" type="radio" name="targetGenger" id="b" value="b" onChange={e=> this.setState({ gender: e.target.value})}/>
                                                                <label className="form-check-label" htmlFor="b">Both</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col col-12">
                                                <div id="calculatedView" className="margin-bottom-10 text-x-default text-sm"></div>
                                            </div>
                                            <div className="col col-12 margin-bottom-50">
                                                <Button variant="outline-x-love" className="margin-right-20" id="addCampaignForm__btnGoBack" onClick={(e) => this.goBack(e)}>
                                                <i className="fas fa-chevron-left margin-right-10"></i>Go Back</Button>
                                                <Button variant="x-dark-default" id="addCampaignForm__btnAddCampaign" onClick={(e) => this.addCampaign(e)}>
                                                <i className="fas fa-plus margin-right-10"></i>Create</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col col-6">
                                        <div className="row">
                                            <div className="col col-12">
                                                <Form.Group controlId="addCampaignForm__mapDisplay">
                                                    <OverlayTrigger
                                                        placement="right"
                                                        overlay={
                                                            <Tooltip>
                                                                Point one or more regions, addresses or areas to show your campaign to people in those locations.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Form.Label className="text-x-default cursor-pointer">Locations</Form.Label>
                                                    </OverlayTrigger>
                                                    <Map center={[12.97, 77.61]} zoom={11}>
                                                        <TileLayer
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                            attribution="&copy; Xwards. OpenStreetMaps"
                                                        />
                                                        <FeatureGroup>
                                                            <EditControl
                                                                position='topleft'
                                                                onEdited={(e) => this.updateCircles(e)}
                                                                onCreated={(e) => this.drawCircle(e)}
                                                                onDeleted={(e) => this.deleteCircles(e)}
                                                                draw={{
                                                                    rectangle: false,
                                                                    polygon: false,
                                                                    polyline: false,
                                                                    marker: false,
                                                                    circlemarker: false
                                                                }}
                                                            />
                                                        </FeatureGroup>
                                                    </Map>
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


