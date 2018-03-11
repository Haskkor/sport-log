"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.buildRecoveryTimes = () => {
    const numbers = _.range(0, 600, 15);
    return numbers.map((n) => {
        const minutes = Math.floor(n / 60);
        const seconds = n % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    });
};
//# sourceMappingURL=helper.js.map