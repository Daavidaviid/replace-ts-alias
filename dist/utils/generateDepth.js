"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDepth = void 0;
exports.generateDepth = (n) => {
    if (n < 0) {
        throw new Error(`Can't generateDepth with negative n`);
    }
    if (n === 0) {
        return "";
    }
    return Array(n).fill("..").join("/").slice(0, -1);
};
