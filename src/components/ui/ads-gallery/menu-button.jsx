import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

class MenuButton extends Component {
    constructor (props) {
        super(props);
        this.state = {hover: this.props.hover,
                     showMenu: false

        }

        this.visibility = this.visibility.bind(this);
    }

    
    visibility () {
        if ((this.props.isSelectable && this.props.parentHover))
            return 'visible';
        return 'hidden';
    }
    

    render () {
        return (
            <Dropdown>
            <Dropdown.Toggle className= "margin-right-20"
                style={{
                    visibility: this.visibility(),
                    drop: "left",
                    background: 'grey',
                    float: 'right',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    pointerEvents: 'visible',
                }}
                onClick={this.props.onClick ?
                    (e) => this.props.onClick(this.props.index, e) : null}
                onMouseOver={(e) => this.setState({hover: true})}
                onMouseOut={(e) => this.setState({hover: false})}>
                <i className="fas fa-ellipsis-v"></i>
                </Dropdown.Toggle>
                    <Dropdown.Menu show={this.state.showMenu}>
                        <Dropdown.Item eventKey="1">Preview</Dropdown.Item>
                        <Dropdown.Item eventKey="2">Rename</Dropdown.Item>
                        <Dropdown.Item eventKey="3">Stats</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="4">Delete</Dropdown.Item>
                    </Dropdown.Menu>
            </Dropdown>
            // <div>
            //     <Dropdown>
            //         <Dropdown.Toggle variant="x-transparent" id="media-dropdown" bsPrefix="btn-sm text-x-default" className="float-right dropLeft">
            //         <i className="margin-right-10 fas fa-ellipsis-v"></i>
            //         </Dropdown.Toggle>

            //         <Dropdown.Menu>
            //             <Dropdown.Item eventKey="1">Preview</Dropdown.Item>
            //             <Dropdown.Item eventKey="2">Rename</Dropdown.Item>
            //             <Dropdown.Item eventKey="3">Stats</Dropdown.Item>
            //             <Dropdown.Divider />
            //             <Dropdown.Item eventKey="4">Delete</Dropdown.Item>
            //         </Dropdown.Menu>
            //     </Dropdown>
            // </div>
        )
    }
}

MenuButton.propTypes = {index: PropTypes.number,
                        color: PropTypes.string,
                        onClick: PropTypes.func,
                        isSelectable: PropTypes.bool,
                        isSelected: PropTypes.bool,
                        parentHover: PropTypes.bool,
                        hover: PropTypes.bool};
                        
MenuButton.defaultProps = { parentHover: false,
                            hover: false};

export default MenuButton
