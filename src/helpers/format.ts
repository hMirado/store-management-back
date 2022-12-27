export const toLowerKeys = (obj: string[]) => {
  return Object.keys(obj).reduce((accumulator: any, key: any) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
};
