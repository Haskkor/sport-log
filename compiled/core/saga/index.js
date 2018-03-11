"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const effects_1 = require("redux-saga/effects");
const appDuck = require("../modules/container/App");
const config_1 = require("../../utils/config");
function* loadData(action) {
    try {
        const response = yield axios_1.default({
            method: 'get',
            url: `${config_1.default.serverApi}/form/${action.payload.id}`
        });
        yield effects_1.put(appDuck.loadDataSuccess(response));
    }
    catch (err) {
        console.warn('loadDataFailed failed', err);
        yield effects_1.put(appDuck.loadDataFail(err));
    }
}
function* root() {
    yield effects_1.takeLatest(appDuck.LOAD_DATA_START, loadData);
}
exports.default = root;
//# sourceMappingURL=index.js.map