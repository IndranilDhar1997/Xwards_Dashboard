import React, { Component } from "react";

class XUploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: props.imageSrc
        };
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.imageSrc !== this.state.imageSrc) {
            this.setState({ imageSrc: nextProps.imageSrc });
        }
    }

    onFileUpload (event) {
        var img = new Image(this.props.width, this.props.height);
        let reader = new FileReader();
        if (event.target.files[0]) {
            if ("maxFileSize" in this.props && event.target.files[0].size >= this.props.maxFileSize) {
                if ("errCallBack" in this.props) {
                    this.props.errCallBack("MAX_FILE_SIZE");
                    return false;
                }
            }
            if ("callBack" in this.props) {
                this.props.callBack(event.target.files[0]);
            }
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (data) => {
                img.src = data.srcElement.result;
                img.onload = () => {
                    if ("onImage" in this.props) {
                        this.props.onImage(data.srcElement.result);
                    }
                    this.setState({
                        imageSrc: data.srcElement.result
                    });
                }
            }
        }
    }

    render() {
        return (
            <div className={'x-image-upload ' + this.props.class} style={{height:this.props.height, width:this.props.width}}>
                {(typeof this.state.imageSrc === 'undefined' || this.state.imageSrc === null) && <button className={"x-image-upload-title btn " + this.props.titleClass} style={{height:this.props.height, width:this.props.width}}>
                        <h1 className=""><i className="fas fa-upload"></i></h1>
                        <div className="">{this.props.title}</div>
                        <div className="text-xs">{this.props.subtitle}</div>
                    </button>
                }
                <input type="file" accept="image/png,image/x-png,image/jpeg,image/jpg" id={this.props.id} name={this.props.name} className={'x-image-upload-file'} style={{height:this.props.height, width:this.props.width}} onChange={(e) => this.onFileUpload(e)}/>
                {(typeof this.state.imageSrc !== 'undefined' || this.state.imageSrc === null) &&
                    <img src={this.state.imageSrc} style={{height:this.props.height, width:this.props.width}} className="x-image-preview" />
                }
            </div>
        )
    }
}

export default XUploadImage;
