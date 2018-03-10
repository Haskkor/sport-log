"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loDash = require("lodash");
exports.buildRecoveryTimes = () => {
    const numbers = loDash.range(0, 600, 15);
    return numbers.map((n) => {
        const minutes = Math.floor(n / 60);
        const seconds = n % 60;
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    });
};
//# sourceMappingURL=helper.js.map