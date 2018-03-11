"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const redux_saga_1 = require("redux-saga");
const NormalizrMiddleware_1 = require("./middlewares/NormalizrMiddleware");
const saga_1 = require("./saga");
const reducer_1 = require("./modules/reducer");
function createStore(data) {
    const sagaMiddleware = redux_saga_1.default();
    const middleware = [sagaMiddleware, NormalizrMiddleware_1.default];
    const devToolsExtension = window.devToolsExtension ? window.devToolsExtension() : (f) => f;
    const finalCreateStore = redux_1.compose(redux_1.applyMiddleware(...middleware), devToolsExtension)(redux_1.createStore);
    const store = finalCreateStore(reducer_1.default, data);
    sagaMiddleware.run(saga_1.default);
    return store;
}
exports.default = createStore;
//# sourceMappingURL=create.js.map