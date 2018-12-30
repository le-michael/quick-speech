import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';

import ActionTypes from '../constants';
import AppStates from '../constants/states';

const CHANGE = 'CHANGE';

var state, text, selKeyboard, keyboards, prev;

var indEdit, keyEdit;


class ClientStore extends EventEmitter {
    constructor() {
        super();
        state = AppStates.NORMAL;
        text = '';
        selKeyboard = 'CUSTOM';
        keyboards = {'CUSTOM': []}

        if (localStorage.getItem("QUICKSPEECH-CACHE")) {
            keyboards = JSON.parse(localStorage.getItem("QUICKSPEECH-CACHE"));
            for (var key in keyboards) {
                if (!keyboards[key][0])
                    keyboards[key].pop();
            }
        }
        

        speechSynthesis.getVoices()

        Dispatcher.register(this._registerActions.bind(this));
    }

    _registerActions(action) {
        switch(action.actionType) {
            case ActionTypes.CHANGE_STATE:
                this._changeState(action.payload)
                break;
            case ActionTypes.CHANGE_KEYBOARD:
                this._changeKeyboard(action.payload);
                break;
            case ActionTypes.ADD_TEXT:
                this._addText(action.payload);
                break;
            case ActionTypes.DEL_TEXT:
                this._delText();
                break;
            case ActionTypes.CLEAR_TEXT:
                this._clearText();
                break;
            case ActionTypes.SAY_TEXT:
                this._sayText();
                break;
            case ActionTypes.SAVE:
                this._save();
                break;
            case ActionTypes.DELETE:
                this._delete();
                break;
            case ActionTypes.EDIT_PHRASE:
                this._editPhrase(action.payload);
                break;
            case ActionTypes.EDIT_MENU:
                this._editMenu(action.payload);
                break;
            default:
                console.log("No functions binded to action type: " + action.actionType);
        }
    }

    addChangeListener(callback) {
        this.on(CHANGE, callback);
    }

    removeChangeListener(callback){
        this.removeListener(CHANGE,callback);
    }


    _changeState(item) {
        state = item.state;
        text = item.show;

        if (state === AppStates.ADD_KEYBOARD || state === AppStates.ADD_PHRASE) {
            prev = selKeyboard;
            selKeyboard = 'CUSTOM';
        }

        this.emit(CHANGE);
    }

    _changeKeyboard(item) {
        selKeyboard = item;

        if (state !== AppStates.NORMAL) {
            text = ""
        }

        this._changeState({state: AppStates.NORMAL, show: text});
        this.emit(CHANGE);
    }

    _addText(string) {
        text += string;
        this.emit(CHANGE);
    }

    _delText() {
        if (text.length > 0){
            text = text.slice(0, text.length-1);
            this.emit(CHANGE)
        }
    }

    _clearText() {
        text = ''
        this.emit(CHANGE)
    }

    _sayText() {
        var msg = new SpeechSynthesisUtterance(text);
        msg.voice = speechSynthesis.getVoices()[3]
        window.speechSynthesis.speak(msg);
        this._clearText();
    }

    _save() {
        if (state === AppStates.ADD_KEYBOARD) {
            if (text)
                keyboards[text] = [];
        } else if (state === AppStates.ADD_PHRASE) {
            if (text)
                keyboards[prev].push(text);
        } else if (state === AppStates.EDIT_PHRASE) {
            keyboards[prev][indEdit] = text;
            if (text === "") {
                delete keyboards[prev][indEdit];
            }
        } else if (state === AppStates.EDIT_MENU) {
            var clone = keyboards[prev]
            delete keyboards[prev];
            if (text !== "" ) {
                keyboards[text] = clone;
                prev = text;
            }
        }

        localStorage.setItem("QUICKSPEECH-CACHE",JSON.stringify(keyboards));
        this._changeState({state: AppStates.NORMAL, show: ""})
        selKeyboard = prev;
        this.emit(CHANGE);

    }

    _delete() {
        if (state === AppStates.EDIT_PHRASE ) {
            delete keyboards[prev][indEdit];
        } else if (state === AppStates.EDIT_MENU) {
            delete keyboards[keyEdit];
            prev = 'CUSTOM';
        }

        localStorage.setItem("QUICKSPEECH-CACHE",JSON.stringify(keyboards));
        this._changeState({state: AppStates.NORMAL, show: ""})
        selKeyboard = prev;
        this.emit(CHANGE);
    }

    _editPhrase(ind) {
        state = AppStates.EDIT_PHRASE
        prev = selKeyboard;
        selKeyboard = 'CUSTOM';
        text = keyboards[prev][ind];
        indEdit = ind;
        this.emit(CHANGE);
    }

    _editMenu(name) {
        state = AppStates.EDIT_MENU;
        prev = selKeyboard;
        selKeyboard = 'CUSTOM';
        text = name;
        keyEdit = name; 
        this.emit(CHANGE);
    }

    getText() {
        return text;
    }

    getState() {
        return state;
    }

    getSelKeyboard() {
        return selKeyboard;
    }

    getKeyboards() {
        return keyboards;
    }

    
    /* ADD SAVE AND DELETE FUNCTIONS */

}

export default new ClientStore();
 