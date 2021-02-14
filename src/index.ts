#!/usr/bin/env node

import yargs from "yargs";
const replace = require("replace-in-file");
import { generateDepth, readConfig, walkFolder } from "./utils";

const args = yargs.options({
  path: { type: "string", demandOption: true, alias: "p" },
}).argv;

const { path } = args;

const main = async () => {
  try {
    const { aliases, distPath: dist } = await readConfig(path);

    const distPath = `${path}/${dist}`;
    const files = await walkFolder(distPath);

    await replace({
      files,
      from: /require\("@(.*?)"\)/g,
      to: (match: string, value: any, size: any, content: any, path: any) => {
        const depth = path.match(/\/.+?/g).length;

        const key = `@${value}`;

        const [module, next] = key.split(/\/(.+)/);

        const depthPath = generateDepth(depth - 1);

        const aliasValue = next ? aliases[`${module}/`] : aliases[module];

        if (!aliasValue) {
          return match;
        }

        const replacement = `${depthPath}${aliasValue}`;

        return `require("${replacement}${next || ""}")`;
      },
    });
  } catch (error) {
    console.warn(error);
  }
  console.log("replace-ts-alias script done");
};

main();
