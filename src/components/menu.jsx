import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

import ClientAction from '../actions/clientActions';
import ClientStore from '../stores/clientStore';

import AppStates from '../constants/states.js';


class AddItem extends Component {
    render () {
        return(
            <Paper onClick={()=>ClientAction.changeState(AppStates.ADD_KEYBOARD, "")} className='add-item'>
                +
            </Paper>
        );
    }
}

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.class = "key"
        if (this.props.type) {
            this.class += " " + this.props.type
        }


        this.handleClick = this.handleClick.bind(this);
        this.handleRelease = this.handleRelease.bind(this);


        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleRelease.bind(this);
    }

    handleClick() {
        this.props.onClick();
        if (this.props.id !== "CUSTOM") {
            this.buttonTimer = setTimeout(()=>{
                ClientAction.editMenu(this.props.id);
            },500)
        }
    }

    handleTouchStart() {
        if (this.props.id !== "CUSTOM") {
            this.buttonTimer = setTimeout(()=>{
                ClientAction.editMenu(this.props.id);
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
                    onMouseUp={this.handleRelease} 
                    className='menu-item'
                    onTouchStart={this.handleTouchStart} 
                    onTouchEnd={this.handleRelease}
                    >
                {this.props.children}
            </Paper>            
        );
    }

}



class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {'keyboards' : Object.keys(ClientStore.getKeyboards())}
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ClientStore.addChangeListener(this._onChange);
    }  

    componentWillUnmount() {
        ClientStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({'keyboards': Object.keys(ClientStore.getKeyboards())});
    }


    render() {

        const keyboards = this.state.keyboards.map((name) => <MenuItem id={name} onClick={()=>ClientAction.changeKeyboard(name)} key={name}> {name} </MenuItem>);


        return (
            <div className="menu">
                {keyboards}
                <AddItem></AddItem>
            </div>
        );
    }

}

export default Menu;