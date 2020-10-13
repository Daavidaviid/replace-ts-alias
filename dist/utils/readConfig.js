"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = void 0;
const promises_1 = __importDefault(require("fs/promises"));
exports.readConfig = async (path) => {
    try {
        const filePath = `${path}/tsconfig.json`;
        const file = await promises_1.default.readFile(filePath);
        const contentString = file.toString();
        if (!contentString) {
            throw new Error('tsconfig.json not found');
        }
        const content = JSON.parse(contentString);
        let aliases = {};
        Object.entries(content.compilerOptions.paths).forEach(([key, v]) => {
            aliases[key] = v[0];
        });
        return {
            distPath: content.compilerOptions.outDir,
            aliases,
        };
    }
    catch (error) {
        console.warn(error);
        throw error;
    }
};
