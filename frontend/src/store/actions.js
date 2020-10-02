import * as actionTypes from './actionTypes';

export const dispatchUpdateDraft = ( payload ) => {
    return {
        type : actionTypes.UPDATE_USER_INPUT,
        payload : { ...payload }
    }
};

export const dispatchUpdateScrapeList = ( payload ) => {
    return {
        type : actionTypes.UPDATE_SCRAPE_LIST,
        payload : { ...payload }
    }
};