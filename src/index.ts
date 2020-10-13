import yargs from 'yargs';
const replace = require('replace-in-file');
import { generateDepth, readConfig, walkFolder } from './utils';

const args = yargs.options({
  path: { type: 'string', demandOption: true, alias: 'p' },
}).argv;

const { path } = args;

const main = async () => {
  console.log('Custom CLI');

  try {
    const { aliases, distPath: dist } = await readConfig(path);

    const distPath = `${path}/${dist}`;
    const files = await walkFolder(distPath);

    // console.log({ aliases });

    await replace({
      files,
      from: /require\("@(.*?)"\)/g,
      to: (match: string, value: any, size: any, content: any, path: any) => {
        const depth = path.match(/\/.+?/g).length;
        // console.log({ match, value, path, depth });

        const key = `@${value}`;
        const depthPath = generateDepth(depth - 3);
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
  } catch (error) {
    console.warn(error);
  }
};

main();
