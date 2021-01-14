import * as actionTypes from './actionTypes';

export const updateUserInput = ( payload ) => {
    return {
        type : actionTypes.UPDATE_USER_INPUT,
        payload : { ...payload }
    }
};

export const updateScrapeList = ( payload ) => {
    return {
        type : actionTypes.UPDATE_SCRAPE_LIST,
        payload : { ...payload }
    }
};