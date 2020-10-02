import * as actionTypes from "./actionTypes";

const initialState = {

    userTextInput: {
        title : '',
        content : ''
    },
    scrapeList : {
        includeIEP: true,
        includeSEP: true,
    },
    recommendatinos : []
};

const updateUserInput = ( state, payload ) => {
    return {
        ...state, 
        userTextInput : {
            ...state,
            [payload.name] : payload.value
        }
    };
};

const updateScrapeList = ( state, payload ) => {
    return {
        ...state,
        [state.scrapeList] : {
            ...state.scrapeList,
            [payload.name] : ! state.scrapeList.name
        }

    };
}; 


const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.UPDATE_USER_INPUT: return updateUserInput(state, action.payload);
        case actionTypes.UPDATE_SCRAPE_LIST: return updateScrapeList(state, action.payload); 
        default: throw Error('unknown action type'); 
    }
}

export default reducer; 