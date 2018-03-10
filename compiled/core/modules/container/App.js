"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_actions_1 = require("redux-actions");
exports.LOAD_DATA_START = 'PL/APP/LOAD_DATA/START';
exports.LOAD_DATA_SUCCESS = 'PL/APP/LOAD_DATA/SUCCESS';
exports.LOAD_DATA_FAIL = 'PL/APP/LOAD_DATA/FAIL';
const initialState = {
    mainControl: undefined,
    dataLoaded: false
};
exports.default = redux_actions_1.handleActions({
    [exports.LOAD_DATA_START]: (state, action) => (Object.assign({}, state)),
    [exports.LOAD_DATA_SUCCESS]: (state, action) => (Object.assign({}, state, { loaded: true })),
    [exports.LOAD_DATA_FAIL]: (state, action) => (Object.assign({}, state, { loaded: false }))
}, initialState);
exports.loadDataStart = redux_actions_1.createAction(exports.LOAD_DATA_START);
exports.loadDataSuccess = redux_actions_1.createAction(exports.LOAD_DATA_SUCCESS);
exports.loadDataFail = redux_actions_1.createAction(exports.LOAD_DATA_FAIL);
//# sourceMappingURL=App.js.map