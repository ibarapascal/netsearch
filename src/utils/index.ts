/**
 * The function to generate query the url params
 * @param params query params
 * @returns the query result
 */
export const query = (params: Record<string, string> | undefined): string => {
  if (!params) return '';
  Object.keys(params).forEach((key) => {
    if (params[key].constructor === Array) {
      delete Object.assign(params, { [`${key}[]`]: params[key] })[key];
    }
  });
  const paramsResult = new URLSearchParams(params).toString();
  return paramsResult.length === 0 ? '' : `?${paramsResult}`;
};
