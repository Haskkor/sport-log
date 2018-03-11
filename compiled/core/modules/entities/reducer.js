"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const _ = require("lodash");
const programs_1 = require("./programs");
const initialState = {};
const subReducers = redux_1.combineReducers({
    programs: programs_1.default
});
function reducer(state = initialState, action) {
    const entities = _.result(action, 'payload.normalized.entities');
    if (entities) {
        const newState = _.assign({}, state); // fixme any
        _.forOwn(entities, (items, key) => {
            newState[key] = Object.assign({}, newState[key], items);
        });
        return newState;
    }
    return subReducers(state, action);
}
exports.default = reducer;
//# sourceMappingURL=reducer.js.map