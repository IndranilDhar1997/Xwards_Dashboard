import React, { Component } from 'react';
import ContentDataService from '../../../../js/services/contentDataService';
import utility from '../../../../js/lib/utility';
import Config from '../../../../config';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";

class PreviewContents extends Component {
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/content-marketing');
        this.state = {
            keywords: ContentDataService.getContentData().keywords.split(','),
            page: utility.getUrlParams().back
        }
    }

    goBack(e) {
        e.preventDefault();
        ContentDataService.removeContentData();
        if (this.state.page === 'review') {
            window.location.replace(Config[Config.env].url+"/content-marketing/in-review");
        }
        window.location.replace(Config[Config.env].url+"/content-marketing");
        
    }

    render() { 
        return ( 
            <div className="container-fluid margin-bottom-50">
                <div className="row margin-top-5">
                    <div className="col col-12">
                        <button onClick={(e) => this.goBack(e)} className="btn btn-outline-x-love margin-right-10">
                            <i className="fas fa-chevron-left margin-right-10"></i>Back
                        </button>
                    </div>
                    <div className="col col-12 margin-top-20">
                        <h2 className="text-x-default">{ContentDataService.getContentData().contentTitle}</h2>
                    </div>
                    <div className="col col-12 margin-top-20">
                        {ContentDataService.getContentData().files !== null && (ContentDataService.getContentData().files.length > 0 && ContentDataService.getContentData().files.map(file => (
                            <img key={file.name} src={file.imgUrl} className="margin-10" style={{width: (file.width/2)+"px", height: (file.height/2)+"px"}}></img>
                        )))}
                        {ContentDataService.getContentData().files === null && 
                            <h5 className="text-x-love">Images has been deleted for a rejected content.</h5>
                        }
                    </div>
                    <div className="col col-12 margin-top-10">
                        <div dangerouslySetInnerHTML={{  __html: `${ContentDataService.getContentData().contentHtml}` }} />
                    </div>
                    <div className="col col-8 margin-top-10 max-width-70">
                        {this.state.keywords.map(keyword => (
                            <span key={keyword} className="text-sm badge badge-pill badge-secondary margin-right-10 montserrat-light">{keyword}</span>
                        ))}
                    </div>
                    <div className="col col-4 margin-top-10">
                        <div className="text-x-default">
                            Expiry Date of this content is: <strong>{utility.toDateFormat(ContentDataService.getContentData().expiryDate)}</strong>
                        </div>
                    </div>
                    <div className="col col-12 margin-top-20">
                        <button onClick={(e) => this.goBack(e)} className="btn btn-outline-x-love margin-right-10">
                            <i className="fas fa-chevron-left margin-right-10"></i>Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default PreviewContents;