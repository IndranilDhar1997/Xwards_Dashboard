import React, { Component } from "react";
import {Form, Modal, OverlayTrigger, Button, Tooltip } from 'react-bootstrap';
import $ from 'jquery';
import utility from '../../../js/lib/utility';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../navbar/navbar";
import BrandService from "../../../js/services/brandService";

var EditCollection__OpenModal = function (e, collectionId) {
    if (e) {
        e.preventDefault();
    }
    AjaxService.get(Routes.Get_Collection_By_Id(this.state.selectedBrandId, collectionId), function (response) {
        this.setState({ 
            modalShow: true,
            collectionId: collectionId,
            selectedBrandId: BrandService.getSelectedBrand().id,
            collectionName: response.collection_name
        })
    }.bind(this), function(error){
        console.log(error);
        MainNavBar__Toast('err', "Some error occured while fetching your collections.");
    });
	this.setState({ modalShow: true, collectionId: collectionId });
}

class EditCollection extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modalShow : false,
            collectionName: '',
            collectionId: null,
            selectedBrandId : BrandService.getSelectedBrand().id
        }
        EditCollection__OpenModal = EditCollection__OpenModal.bind(this);
    }

    hideModalToEditCollection = (e) => {
		if (e) {
			e.preventDefault();
		}

		this.setState({
			modalShow: false,
		});
    }
    
    handleCollectionNameChange = e => {
        this.setState({ collectionName: e.target.value });
    }

    updateCollection = e => {
        e.preventDefault();
        let collectionName = this.state.collectionName;
        // let video = this.state.video;
        
        if(collectionName === null || collectionName === undefined || collectionName === '') {
            MainNavBar__Toast('err', "Error. Collection Name is Empty.");
            return false;
        }
        let collectionDataToSend = {
            name: collectionName
        }
        utility.showLoader();
        AjaxService.put(Routes.Update_Collection(this.state.selectedBrandId, this.state.collectionId), collectionDataToSend, function(response) {
            MainNavBar__Toast('success', "Collection updated successfully");
            this.setState({ modalShow: false });
            window.location.reload();
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some error while saving data");
        }, {
            timeout: 10000000,
            onComplete: function () {
                $('button#updateCollectionForm__btnUpdateCollection').removeAttr('disabled');
                $('button#updateCollectionForm__btnCloseModal').removeAttr('disabled');
                $('button#updateCollectionForm__btnUpdateCollection').html('<i class="fas fa-cloud-upload-alt margin-right-10"></i> Update ');
            },
            beforeSend: function () {
                $('button#updateCollectionForm__btnUpdateCollection').html('Updating your collection... it might take time.');
                $('button#updateCollectionForm__btnUpdateCollection').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#updateCollectionForm__btnUpdateCollection').attr('disabled', 'disabled');
                $('button#updateCollectionForm__btnCloseModal').attr('disabled', 'disabled')
            }
        })
    }

    render() { 
        return ( 
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-12">
                        <Modal id="updateCollection" centered show={this.state.modalShow} onHide={() => this.hideModalToEditCollection()}>
                            <Modal.Header closeButton={true} >
                                <h4 className="montserrat-light">Update a Collection</h4>
                            </Modal.Header>
                            <Modal.Body className="padding-top-0">
                                <div className="row">
                                    <div className="col col-12">
                                        <Form className="margin-top-10" name="updateCollectionForm" id="updateCollectionForm" onSubmit={(e) => this.updateCollection(e)}>
                                            <Form.Group controlId="updateCollectionForm__collectionName">
                                                <OverlayTrigger
                                                    placement="right"
                                                    overlay={
                                                        <Tooltip>
                                                            Provide the collection name. This name will be used 
                                                        </Tooltip>
                                                    }
                                                >
                                                <Form.Label className="text-x-default">Name</Form.Label>
                                                </OverlayTrigger>
                                                <Form.Control name="collectionName" value= {this.state.collectionName || ''} type="text" onChange = {(e)=> this.handleCollectionNameChange(e)}/>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                    <div className="col col-12 margin-top-10 margin-bottom-10" >
                                        <Button variant="x-dark-default" type="submit" id="updateCollectionForm__btnUpdateCollection" onClick={(e)=> this.updateCollection(e)} className="right margin-left-5">
                                            Update
                                        </Button>
                                        <Button variant="outline-x-love" className="right margin-right-5" id = "updateCollectionForm__btnCloseModal" onClick={(e) => this.hideModalToEditCollection(e)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}
 
export { EditCollection, EditCollection__OpenModal };


