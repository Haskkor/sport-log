"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const effects_1 = require("redux-saga/effects");
const config_1 = require("../../utils/config");
const appDuck = require("../modules/container/App");
function* loadQuestions(action) {
    try {
        const response = yield axios_1.default({
            method: 'get',
            url: `${config_1.default.serverApi}/form/${action.payload.id}`
        });
        console.log('response', response);
        yield effects_1.put(appDuck.loadQuestionSuccess({
            data: response.data
        }));
    }
    catch (err) {
        console.warn('me failed', err);
        yield effects_1.put(appDuck.loadQuestionFail(err));
    }
}
function* root() {
    yield effects_1.takeLatest(appDuck.LOAD_QUESTION_START, loadQuestions);
}
exports.default = root;
//# sourceMappingURL=index.js.map