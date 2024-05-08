
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import userTrip from './reducer';

const store = createStore(userTrip, applyMiddleware(thunk));

export default store;
