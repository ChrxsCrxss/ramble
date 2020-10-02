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
            ...state.userTextInput,
            [payload.name] : payload.value
        }
    };
};

const updateScrapeList = ( state, payload ) => {
    return {
        ...state,
        scrapeList : {
            ...state.scrapeList,
            [payload.name] : ! state.scrapeList[payload.name]
        }
    };
}; 


const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionTypes.UPDATE_USER_INPUT: return updateUserInput(state, action.payload);
        case actionTypes.UPDATE_SCRAPE_LIST: return updateScrapeList(state, action.payload); 
        default: return state; 
    }
}

export default reducer; 