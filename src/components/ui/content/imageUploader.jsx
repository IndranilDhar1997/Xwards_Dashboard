import React, { Component } from "react";
import XUploadImage from "../utility/XUploadImage";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import $ from 'jquery';
import { nullLiteral } from "@babel/types";

class XwardsImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null,
            gradiantPopup: false,
            layoverColor: 'x-transparent',
            defaultFontSize: null
        };
    }

    componentDidMount() {
        let fontSize = $('#'+this.props.id+"_titleHolder h2").css('font-size');
        $('#'+this.props.id).css('opacity', '0.7');
        this.setState({ defaultFontSize: fontSize });
    }

    openGradiantPanel(e) {
        e.preventDefault();
        this.setState({ gradiantPopup: true });
    }
    hideModal() {
        this.setState({ gradiantPopup: false });
    }
    changeOpacity(e) {
        let opacity = e.target.value*0.01;
        $('#'+this.props.id).css('opacity', opacity);
    }
    changeHeight(e) {
        let height = this.props.height;
        height = parseInt(height.replace('px',''));
        height = height*e.target.value*0.01;
        $('#'+this.props.id).css('height', height+'px');
        $('#'+this.props.id+"_titleHolder").css('height', height+'px');
    }
    changeWidth(e) {
        let width = this.props.width;
        width = parseInt(width.replace('px',''));
        width = width*e.target.value*0.01;
        $('#'+this.props.id).css('width', width+'px');
        $('#'+this.props.id+"_titleHolder").css('width', width+'px');
    }
    backgroundShiftTop(e) {
        e.preventDefault();
        $('#'+this.props.id).css('bottom', 'auto').css('top', '0px');
        $('#'+this.props.id+"_titleHolder").css('bottom', 'auto').css('top', '0px');
    }
    backgroundShiftBottom(e) {
        e.preventDefault();
        $('#'+this.props.id).css('top', 'auto').css('bottom', '0px');
        $('#'+this.props.id+"_titleHolder").css('top', 'auto').css('bottom', '0px');
    }
    backgroundShiftLeft(e) {
        e.preventDefault();
        $('#'+this.props.id).css('right', 'auto').css('left', '0px');
        $('#'+this.props.id+"_titleHolder").css('right', 'auto').css('left', '0px');
    }
    backgroundShiftRight(e) {
        e.preventDefault();
        $('#'+this.props.id).css('left', 'auto').css('right', '0px');
        $('#'+this.props.id+"_titleHolder").css('left', 'auto').css('right', '0px');
    }
    showHideTitle(e) {
        e.preventDefault();
        let showHide = $('#'+this.props.id+"_titleHolder").css('left', 'auto').css('display');
        if (showHide === 'block') {
            $('#'+this.props.id+"_titleHolder").css('display', 'none');
            $('#'+this.props.id+"_titleHolder_eye").removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $('#'+this.props.id+"_titleHolder").css('display', 'block');
            $('#'+this.props.id+"_titleHolder_eye").removeClass('fa-eye-slash').addClass('fa-eye');
        }
    }
    changeFontSize(e) {
        e.preventDefault();
        let fontSize = this.state.defaultFontSize;
        fontSize = parseInt(fontSize.replace('px',''));
        fontSize = fontSize*e.target.value*0.01;
        $('#'+this.props.id+"_titleHolder h2").css('font-size', fontSize);
    }
    alignText(e, align) {
        e.preventDefault();
        $('#'+this.props.id+"_titleHolder h2").css('text-align', align);
    }
    changeFontColor(e) {
        e.preventDefault();
        $('#'+this.props.id+"_titleHolder h2").css('color', e.target.value);
    }
    chooseColor(color) {
        this.setState({ gradiantPopup: false, layoverColor: color });
    }

    removeColor(e) {
        e.preventDefault();
        this.setState({ gradiantPopup: false, layoverColor: '' });
    }
    onImageLoad(e) {
        this.setState({ imageSrc: e});
    }

    render() {
        return (
            <React.Fragment>
                <div className="position-relative" style={{height:this.props.height, width:this.props.width, margin:'0px auto', marginTop: '20px', marginBottom: '20px'}}>
                    <div id={this.props.id+"_imageContent"}>
                        <XUploadImage
                            width={this.props.width} 
                            height={this.props.height}
                            title={this.props.title}
                            subtitle={this.props.subtitle}
                            imageSrc={this.state.imageSrc}
                            onImage={(e) => this.onImageLoad(e)}
                        />
                        <div id={this.props.id} className={"titleLayover "+this.state.layoverColor} style={{height:this.props.height, width:this.props.width, bottom: '0px'}}></div>
                        <div id={this.props.id+"_titleHolder"} className="titleLayover padding-15" style={{height:this.props.height, width:this.props.width, bottom: '0px'}}>
                            <h2 className="">{this.props.imgTitle}</h2>
                        </div>
                    </div>
                </div>
                <div className="row" style={{width:this.props.width, margin: '0px auto'}}>
                    <div className="col col-12">
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Change font size
                                </Tooltip>
                            }
                        >
                            <Form.Control as="select" value={1} className="margin-right-20" style={{width: 'auto', display: 'inline'}} onChange={(e) => this.changeFontSize(e)}>
                                <option disabled value={1}>Font Size</option>
                                <option value="170">Extra Large</option>
                                <option value="120">Large</option>
                                <option value="100">Normal</option>
                                <option value="80">Small</option>
                                <option value="50">Extra Small</option>
                            </Form.Control>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Change font color
                                </Tooltip>
                            }
                        >
                            <Form.Control as="select" value={1} className="margin-right-20" style={{width: 'auto', display: 'inline'}} onChange={(e) => this.changeFontColor(e)}>
                                <option disabled value={1}>Font Color</option>
                                <option value="white">White</option>
                                <option value="black">Black</option>
                                <option value="grey">Grey</option>
                            </Form.Control>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="right"
                            overlay={
                                <Tooltip>
                                    Show/Hide Title
                                </Tooltip>
                            }
                        >
                            <button className="btn btn-outline-x-default margin-right-20" onClick={(e) => this.showHideTitle(e)}>
                                <i className="fas fa-eye" id={this.props.id+"_titleHolder_eye"}></i>
                            </button>
                        </OverlayTrigger>
                        <div className="display-inline-block margin-top-20">
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Align text to left
                                    </Tooltip>
                                }
                            >
                                <button className="btn btn-outline-x-default margin-right-20" onClick={(e) => this.alignText(e, 'left')}>
                                    <i className="fas fa-align-left"></i>
                                </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Align text to right
                                    </Tooltip>
                                }
                            >
                                <button className="btn btn-outline-x-default margin-right-20" onClick={(e) => this.alignText(e, 'right')}>
                                    <i className="fas fa-align-right"></i>
                                </button>
                            </OverlayTrigger>
                        </div>
                        <div className="display-inline-block margin-top-20">
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip>
                                        Add gradiant color to background
                                    </Tooltip>
                                }
                            >
                                <button className="btn btn-outline-x-default margin-right-20" onClick={(e) => this.openGradiantPanel(e)}>
                                    <i className="fas fa-palette"></i>
                                </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                    placement="right"
                                overlay={
                                    <Tooltip>
                                        Move background to top
                                    </Tooltip>
                                }
                            >
                                <button className="btn btn-outline-x-default" onClick={(e) => this.backgroundShiftTop(e)}>
                                    <i className="fas fa-level-up-alt"></i>
                                </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                    placement="right"
                                overlay={
                                    <Tooltip>
                                        Move background to bottom
                                    </Tooltip>
                                }
                            >
                                <button className="btn btn-outline-x-default margin-left-20" onClick={(e) => this.backgroundShiftBottom(e)}>
                                    <i className="fas fa-level-down-alt"></i>
                                </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                    placement="right"
                                overlay={
                                    <Tooltip>
                                        Move background to left
                                    </Tooltip>
                                }
                            >
                                <button className="btn btn-outline-x-default margin-left-20" onClick={(e) => this.backgroundShiftLeft(e)}>
                                    <i className="fas fa-level-down-alt" style={{transform: 'rotate(90deg)'}}></i>
                                </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="left"
                                overlay={
                                    <Tooltip>
                                        Move background to right
                                    </Tooltip>
                                }
                            >
                            <button className="btn btn-outline-x-default margin-left-20" onClick={(e) => this.backgroundShiftRight(e)}>
                                <i className="fas fa-level-up-alt" style={{transform: 'rotate(90deg)'}}></i>
                            </button>
                            </OverlayTrigger>
                        </div>
                    </div>
                    <div className="col col-6">
                        <Form.Group controlId="createContentForm__backgroundOpacity" className="margin-top-10">
                            <OverlayTrigger
                                    placement="right"
                                overlay={
                                    <Tooltip>
                                        Control the background layover opacity for the image
                                    </Tooltip>
                                }
                            >
                                <Form.Label className="text-x-default cursor-pointer">Background Opacity</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="range" name="backgroundOpacity" min="0" max="100" defaultValue="70" onChange={(e) => this.changeOpacity(e)}/>
                        </Form.Group>
                    </div>
                    <div className="col col-3">
                        <Form.Group controlId="createContentForm__backgroundHeight" className="margin-top-10">
                            <OverlayTrigger
                                    placement="right"
                                overlay={
                                    <Tooltip>
                                        Control the background layover height.
                                    </Tooltip>
                                }
                            >
                                <Form.Label className="text-x-default cursor-pointer">Height</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="range" name="backgroundHeight" step="5" min="0" max="100" defaultValue="100" onChange={(e) => this.changeHeight(e)}/>
                        </Form.Group>
                    </div>
                    <div className="col col-3">
                        <Form.Group controlId="createContentForm__backgroundWidth" className="margin-top-10">
                            <OverlayTrigger
                                    placement="right"
                                overlay={
                                    <Tooltip>
                                        Control the background layover width.
                                    </Tooltip>
                                }
                            >
                                <Form.Label className="text-x-default cursor-pointer">Width</Form.Label>
                            </OverlayTrigger>
                            <Form.Control type="range" name="backgroundWidth" step="5" min="0" max="100" defaultValue="100" onChange={(e) => this.changeWidth(e)}/>
                        </Form.Group>
                    </div>
                </div>
                <Modal show={this.state.gradiantPopup} id="gradiantPopupWindow" centered={true} onHide={() => this.hideModal()}>
                    <ModalHeader closeButton={true}>
                        <h4 className="montserrat-light">Select a Background</h4>
                    </ModalHeader>
                    <Modal.Body className="center-align">
                        <div className="x-gradiant vertical-purple-blue color-pallet" onClick={() => this.chooseColor('x-gradiant vertical-purple-blue')}></div>
                        <div className="x-gradiant horizontal-purple-blue color-pallet" onClick={() => this.chooseColor('x-gradiant horizontal-purple-blue')}></div>

                        <div className="x-gradiant vertical-purple-orange color-pallet" onClick={() => this.chooseColor('x-gradiant vertical-purple-orange')}></div>
                        <div className="x-gradiant horizontal-purple-orange color-pallet" onClick={() => this.chooseColor('x-gradiant horizontal-purple-orange')}></div>

                        <div className="x-gradiant vertical-multicolor color-pallet margin-bottom-10" onClick={() => this.chooseColor('x-gradiant vertical-multicolor')}></div>
                        <div className="x-gradiant horizontal-multicolor color-pallet margin-bottom-10" onClick={() => this.chooseColor('x-gradiant horizontal-multicolor')}></div>
                        <div className="right-align"><button className="btn btn-link" onClick={(e) => this.removeColor(e)}>Remove Background</button></div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        )
    }
}

export default XwardsImageUploader;
