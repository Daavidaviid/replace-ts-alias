export const generateDepth = (n: number): string => {
  if (n === 0) {
    return ''
  }
  return Array(n).fill('..').join('/').slice(0, -1);
};
