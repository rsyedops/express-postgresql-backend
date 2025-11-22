export const firstOrUndefined = <T>(arr: T[]) => {
  return arr.length ? arr[0] : undefined;
};
