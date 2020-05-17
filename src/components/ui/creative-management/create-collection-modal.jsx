import React, { Component } from "react";
import {Form, Modal, OverlayTrigger, Button, Tooltip} from 'react-bootstrap';
import $ from 'jquery';
import utility from '../../../js/lib/utility';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../navbar/navbar";
import BrandService from "../../../js/services/brandService";

var CreateCollection__OpenModal = function (e) {
    if (e) {
        e.preventDefault();
    }
	this.setState({ modalShow: true });
}

class CreateCollection extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modalShow : false,
            collectionName: '',
            selectedBrandId : BrandService.getSelectedBrand().id
        }
        CreateCollection__OpenModal = CreateCollection__OpenModal.bind(this);
    }

    hideModalToCreateCollection = (e) => {
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

    createCollection = e => {
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
        AjaxService.post(Routes.Create_Collection(this.state.selectedBrandId), collectionDataToSend, function(response) {
            MainNavBar__Toast('success', "Collection created successfully");
            this.setState({ modalShow: false });
            window.location.reload();
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some error while saving data");
        }, {
            timeout: 10000000,
            onComplete: function () {
                $('button#createNewCollectionForm__btnCreateCollection').removeAttr('disabled');
                $('button#createNewCollectionForm__btnCloseModal').removeAttr('disabled');
                $('button#createNewCollectionForm__btnCreateCollection').html('Create ');
            },
            beforeSend: function () {
                $('button#createNewCollectionForm__btnCreateCollection').html('Creating your collection... it might take time.');
                $('button#createNewCollectionForm__btnCreateCollection').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#createNewCollectionForm__btnCreateCollection').attr('disabled', 'disabled');
                $('button#createNewCollectionForm__btnCloseModal').attr('disabled', 'disabled')
            }
        })
    }

    render() { 
        return ( 
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-12">
                        <Modal id="createNewCollection" centered show={this.state.modalShow} onHide={() => this.hideModalToCreateCollection()}>
                            <Modal.Header closeButton={true} >
                                <h4 className="montserrat-light">Create a Collection</h4>
                            </Modal.Header>
                            <Modal.Body className="padding-top-0">
                                <div className="row">
                                    <div className="col col-12">
                                        <Form className="margin-top-10" name="createNewCollectionForm" id="createNewCollectionForm" onSubmit={(e)=> this.createCollection(e)}>
                                            <Form.Group controlId="createNewCollectionForm__collectionName">
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
                                        <Button variant="x-dark-default" type="submit" id="createNewCollectionForm__btnCreateCollection" onClick={(e)=> this.createCollection(e)} className="right margin-left-5">
                                            Create
                                        </Button>
                                        <Button variant="outline-x-love" className="right margin-right-5" id = "createNewCollectionForm__btnCloseModal" onClick={(e) => this.hideModalToCreateCollection(e)}>
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
 
export { CreateCollection, CreateCollection__OpenModal };


