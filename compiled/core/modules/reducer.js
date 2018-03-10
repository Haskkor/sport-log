"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const reducer_1 = require("./container/reducer");
const reducer_2 = require("./entities/reducer");
exports.default = redux_1.combineReducers({
    container: reducer_1.default,
    entities: reducer_2.default
});
//# sourceMappingURL=reducer.js.map