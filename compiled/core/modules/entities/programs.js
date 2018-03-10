"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_actions_1 = require("redux-actions");
exports.SET = 'PL/PROGRAMS/SET';
exports.DELETE = 'PL/PROGRAMS/DELETE';
exports.EDIT = 'PL/PROGRAMS/EDIT';
const initialState = [];
exports.default = redux_actions_1.handleActions({
    [exports.DELETE]: (state, action) => {
        let programsCopy = state.slice();
        programsCopy.splice(action.payload.index, 1);
        return programsCopy;
    },
    [exports.EDIT]: (state, action) => {
        let programsCopy = state.slice();
        programsCopy[action.payload.index] = action.payload.program;
        return programsCopy;
    },
    [exports.SET]: (state, action) => {
        let programsCopy = state.slice();
        programsCopy.push(action.payload.program);
        return programsCopy;
    }
}, initialState);
exports.setPrograms = redux_actions_1.createAction(exports.SET);
exports.deleteProgram = redux_actions_1.createAction(exports.DELETE);
exports.editProgram = redux_actions_1.createAction(exports.EDIT);
//# sourceMappingURL=programs.js.map