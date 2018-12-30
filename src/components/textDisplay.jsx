import React, { Component } from 'react';

import ClientStore from '../stores/clientStore';


class TextDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = { 'text' : ClientStore.getText() }
    
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        ClientStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ClientStore.removeChangeListener(this._onChange);
    }

    _onChange() {
        this.setState({text:ClientStore.getText()});
    }

    render() {
        return (
            <div className="text-display">
                {this.state.text}_
            </div>
        )
    }

}

export default TextDisplay;