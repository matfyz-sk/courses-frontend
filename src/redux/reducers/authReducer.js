import {AUTH_ACTIONS} from '../consts/auth_actions';

const initialState = {
    user: {
        name: '',
        avatar: null,
        type: 'student',
        email: '',
    },
    _token: null,
};

export function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_ACTIONS.SET_TOKEN:
            return {
                ...state,
                _token : action.item.value,
            };
        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user : action.item.value,
            };
        default:
            return state;
    }
}
