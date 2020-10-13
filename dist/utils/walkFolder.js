"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walkFolder = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
exports.walkFolder = async (directory) => {
    let fileList = [];
    const files = await promises_1.default.readdir(directory);
    for (const file of files) {
        const p = path_1.default.join(directory, file);
        if ((await promises_1.default.stat(p)).isDirectory()) {
            fileList = [...fileList, ...(await exports.walkFolder(p))];
        }
        else {
            if (p.endsWith('.js')) {
                fileList.push(p);
            }
        }
    }
    return fileList;
};
