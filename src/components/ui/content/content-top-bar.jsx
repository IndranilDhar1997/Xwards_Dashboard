import React, { Component } from 'react';
import {Button} from "react-bootstrap";
import ContentDataService from "../../../js/services/contentDataService";
import Config from "../../../config";

class ContentTopBar extends Component {
    
    gotoCreateContent(e) {
        e.preventDefault();
        ContentDataService.removeContentData();
        window.location.replace(Config[Config.env].url+"/content-marketing/create");
    }

    render() { 
        return (
            <div className="row margin-top-5">
                <div className="col col-12">
                    <Button onClick={(e) => this.gotoCreateContent(e)} className="btn btn-x-love">
                        <i className="fas fa-plus margin-right-10"></i> Create Content
                    </Button>
                    {this.props.toShow.map(btns => (
                        <a key={btns.name} className="btn btn-link margin-left-20" href={btns.route}>
                            {btns.label}
                        </a>
                    ))}
                </div>
            </div>
        );
    }
}
 
export default ContentTopBar;