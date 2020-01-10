import {createStore, combineReducers, applyMiddleware} from 'redux';
//import { createForms } from 'react-redux-form';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Campsites } from './campsites';
import { Comments } from './comments';
import { Partners } from './partners';
import { Promotions } from './promotions';
import { InitialFeedback } from './forms';
import { favorites } from './favorites';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            campsites: Campsites,
            comments: Comments,
             partners: Partners,
             promotions: Promotions,
            // favorites: Favorites
            // campsites,
            // comments,
            // partners,
            // promotions,
            favorites
            
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}