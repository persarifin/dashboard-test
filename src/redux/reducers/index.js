import { combineReducers } from 'redux';
import auth from "./auth";
import loader from "./loader"
import role from "./role";
import permission from "./permission";
import payment from './payment'
import user from './user'

const rootReducer = combineReducers({
    auth: auth,
    loader: loader,
    payment: payment,
    role: role,
    permission,
    user,
});

export default rootReducer;
