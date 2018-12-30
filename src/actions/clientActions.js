import Dispatcher from '../dispatcher';
import ActionTypes from '../constants';


class ClientActions {

    changeState(state, show) {
        Dispatcher.dispatch({
            actionType: ActionTypes.CHANGE_STATE,
            payload: {
                'state': state,
                'show': show
            }
        })
    }

    changeKeyboard(item) {
        Dispatcher.dispatch({
            actionType: ActionTypes.CHANGE_KEYBOARD,
            payload: item
        })
    }

    addToText(item) {
        Dispatcher.dispatch({
            actionType: ActionTypes.ADD_TEXT,
            payload: item 
        })
    }

    delText() {
        Dispatcher.dispatch({
            actionType: ActionTypes.DEL_TEXT
        })
    }

    clearText() {
        Dispatcher.dispatch({
            actionType: ActionTypes.CLEAR_TEXT
        })
    }

    sayText() {
        Dispatcher.dispatch({
            actionType: ActionTypes.SAY_TEXT
        })
    }

    save() {
        Dispatcher.dispatch({
            actionType: ActionTypes.SAVE
        })
    }

    delete() {
        Dispatcher.dispatch({
            actionType:ActionTypes.DELETE
        })
    }

    editPhrase(ind) {
        Dispatcher.dispatch({
            actionType: ActionTypes.EDIT_PHRASE,
            payload: ind
        })
    }

    editMenu(name) {
        Dispatcher.dispatch({
            actionType: ActionTypes.EDIT_MENU,
            payload: name,
        })
    }


}

export default new ClientActions();