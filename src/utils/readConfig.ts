import fs from "fs/promises";

interface Paths {
  [key: string]: string[];
}
interface TSconfig {
  compilerOptions: {
    paths: Paths;
    outDir: string;
  };
}

interface Aliases {
  [key: string]: string[];
}

interface Result {
  distPath: string;
  aliases: Aliases;
}

export const readConfig = async (path: string): Promise<Result> => {
  try {
    const filePath = `${path}/tsconfig.json`;

    const file = await fs.readFile(filePath);
    const contentString = file.toString();

    if (!contentString) {
      throw new Error("tsconfig.json not found");
    }

    const content = JSON.parse(contentString) as TSconfig;

    let aliases: any = {};
    Object.entries(content.compilerOptions.paths).forEach(([key, v]) => {
      const safeKey = key.replace("*", "");
      const safeValue = v[0].replace("*", "");

      aliases[safeKey] = safeValue;
    });

    return {
      distPath: content.compilerOptions.outDir,
      aliases,
    };
  } catch (error) {
    console.warn(error);
    throw error;
  }
};
