import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

import ClientActions from '../actions/clientActions';
import ClientStore from '../stores/clientStore';

import Key from './key.jsx';

import AppStates from '../constants/states';


class PhraseKeyboard extends Component {
    constructor(props) {
        super(props);

        this.state = {'words' : ClientStore.getKeyboards()[ClientStore.getSelKeyboard()] }

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ClientStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ClientStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({'words': ClientStore.getKeyboards()[ClientStore.getSelKeyboard()]})
    }
    
    render() {
        var phrases = null;
        if (this.state.words)
            phrases = this.state.words.map((phrase, ind)=><Key canEdit={true} id={ind} onClick={()=>ClientActions.addToText(" "+phrase)} type={'phrase'} key={phrase}>{phrase}</Key>)
        return (
            <div>
                {phrases}
                <Key type={'phrase dim'} onClick={()=>ClientActions.changeState(AppStates.ADD_PHRASE,"")}>+</Key>
            </div>
        );
    }
}


class CustomKeyboard extends Component {
    constructor(props) {
        super(props);
        this.qwerty = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    }

    render() {
        const keys = this.qwerty.map((char) => <Key onClick={()=>ClientActions.addToText(char)} key={char}>{char}</Key> );

        return(
            <div>
                {keys}

                <Key onClick={()=>ClientActions.addToText(' ')}>SPACE</Key>
            </div>
        );
    }

}

class CommandGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {'appState' : ClientStore.getState() }

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ClientStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ClientStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({'appState': ClientStore.getState()})
    }

    renderDeleteButton() {
        if (ClientStore.getState() === AppStates.ADD_KEYBOARD || ClientStore.getState() === AppStates.ADD_PHRASE) {
            return "CANCEL"
        }
        return "DELETE"
    }

    render() {
        if (this.state.appState === AppStates.NORMAL){  
            return (
                <div className="command-group">
                    <Paper onClick={()=>ClientActions.clearText()} className="command">CLEAR</Paper>
                    <Paper onClick={()=>ClientActions.delText()} className="command">UNDO</Paper>
                    <Paper onClick={()=>ClientActions.sayText()} className="command">TALK</Paper>
                </div>
            );
        }
        return (
            <div className="command-group">
                <Paper onClick={()=>ClientActions.clearText()} className="command">CLEAR</Paper>
                <Paper onClick={()=>ClientActions.delete()} className="command del">{this.renderDeleteButton()}</Paper>
                <Paper onClick={()=>ClientActions.save()} className="command save">SAVE</Paper>
            </div>
        );
    }
}




class Keyboard extends Component {
    constructor(props) {
        super(props);

        this.state = {  'appState': ClientStore.getState(),
                        'selKeyboard': ClientStore.getSelKeyboard(),
                        'keyboards': ClientStore.getKeyboards() }

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ClientStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ClientStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({ 'appState': ClientStore.getState(),
                        'selKeyboard': ClientStore.getSelKeyboard(),
                        'keyboards': ClientStore.getKeyboards()})
    }

    _renderKeyboard() {
        switch(this.state.selKeyboard) {
            case 'CUSTOM':
                return <CustomKeyboard></CustomKeyboard>
            default:
                return <PhraseKeyboard></PhraseKeyboard>;
        }
    }


    render() {
        return (
            <div>
                <div className="keyboard">
                {this._renderKeyboard()}
                </div>
                <CommandGroup></CommandGroup>
            </div>
        );
    }

}

export default Keyboard;