import fs from 'fs/promises';
import path from 'path';

export const walkFolder = async (directory: string) => {
  let fileList: string[] = [];

  const files = await fs.readdir(directory);
  for (const file of files) {
    const p = path.join(directory, file);
    if ((await fs.stat(p)).isDirectory()) {
      fileList = [...fileList, ...(await walkFolder(p))];
    } else {
      if (p.endsWith('.js')) {
        fileList.push(p);
      }
    }
  }

  return fileList;
};
