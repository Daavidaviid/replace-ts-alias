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
        // console.log({ aliases });
        await replace({
            files,
            from: /require\("@(.*?)"\)/g,
            to: (match, value, size, content, path) => {
                const depth = path.match(/\/.+?/g).length;
                // console.log({ match, value, path, depth });
                const key = `@${value}`;
                // console.log(`depth - 1 = ${depth - 1}`);
                const depthPath = utils_1.generateDepth(depth - 1);
                const aliasValue = aliases[key];
                // console.log({ aliasValue });
                if (!aliasValue) {
                    return match;
                }
                const replacement = `${depthPath}${aliasValue}`;
                // console.log({ replacement });
                return `require("${replacement}")`;
            },
        });
    }
    catch (error) {
        console.warn(error);
    }
    console.log("replace-ts-alias script done");
};
main();
