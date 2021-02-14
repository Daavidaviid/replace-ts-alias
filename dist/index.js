#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const replace = require("replace-in-file");
const utils_1 = require("./utils");
const args = yargs_1.default.options({
    path: { type: "string", demandOption: true, alias: "p" },
}).argv;
const { path } = args;
const main = async () => {
    try {
        const { aliases, distPath: dist } = await utils_1.readConfig(path);
        const distPath = `${path}/${dist}`;
        const files = await utils_1.walkFolder(distPath);
        await replace({
            files,
            from: /require\("@(.*?)"\)/g,
            to: (match, value, size, content, path) => {
                const depth = path.match(/\/.+?/g).length;
                /**
                 * key = "@api/utils"
                 */
                const key = `@${value}`;
                const [module, next] = key.split(/\/(.+)/);
                const depthPath = utils_1.generateDepth(depth - 1);
                const aliasValue = next ? aliases[`${module}/`] : aliases[module];
                if (!aliasValue) {
                    return match;
                }
                const replacement = `${depthPath}${aliasValue}`;
                return `require("${replacement}${next || ""}")`;
            },
        });
    }
    catch (error) {
        console.warn(error);
    }
    console.log("replace-ts-alias script done");
};
main();
