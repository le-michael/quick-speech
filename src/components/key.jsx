import React, { Component } from 'react';


import ClientActions from '../actions/clientActions';

import Paper from'@material-ui/core/Paper';

class Key extends Component {
    constructor(props) {
        super(props);
        this.class = "key"
        if (this.props.type) {
            this.class += " " + this.props.type
        }


        this.handleClick = this.handleClick.bind(this);
        this.handleRelease = this.handleRelease.bind(this);

        this.handleTouchStart = this.handleTouchStart.bind(this);
    }

    handleClick() {
        this.props.onClick();

        if (this.props.canEdit) {
            this.buttonTimer = setTimeout(()=>{
                ClientActions.editPhrase(this.props.id);
            },500)
        }
    }

    handleTouchStart() {
        if (this.props.canEdit) {
            this.buttonTimer = setTimeout(()=>{
                ClientActions.editPhrase(this.props.id);
            },500)
        }   
    }


    componentWillUnmount(){
        clearTimeout(this.buttonTimer);
    }


    handleRelease() {
        clearTimeout(this.buttonTimer);
    }

    render() {
        return (
            <Paper  onMouseDown={this.handleClick} 
                    onTouchStart={this.handleTouchStart} 
                    onTouchEnd={this.handleRelease}
                    onMouseUp={this.handleRelease} 
                    className={this.class}
                    
                    > {this.props.children}</Paper>
        );
    }
}

export default Key;