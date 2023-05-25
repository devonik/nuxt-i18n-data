import { I18nDataApiConfig } from "../types";
export const useHelper = () => {
  return {
    groupBy(xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    unflattenObject(obj) {
      return Object.keys(obj).reduce((res, k) => {
        k.split(".").reduce(
          (acc, e, i, keys) =>
            acc[e] ||
            (acc[e] = isNaN(Number(keys[i + 1]))
              ? keys.length - 1 === i
                ? obj[k]
                : {}
              : []),
          res
        );
        return res;
      }, {});
    },
    groupByLocalCode(list) {
      const localeCodes = new Set();
      const obj = {};
      list.forEach((item) => {
        localeCodes.add(item.localeCode);
      });
      localeCodes.forEach((code) => {
        obj[code] = this.unflattenObject(
          list
            .filter((item) => item.localeCode === code)
            .reduce(
              (acc: { [key: string]: string }, curr) => (
                (acc[curr.key] = curr.value), acc
              ),
              {}
            )
        );
      });
      return obj;
    },
    getGoogleRuntimeConfig(config: I18nDataApiConfig) {
      //Required fields
      if (
        !config.google ||
        !config.google.apiKey ||
        !config.google.spreadsheetId
      )
        return null;
      return {
        ...config.google,
        getUrl: `https://sheets.googleapis.com/v4/spreadsheets/${config.google.spreadsheetId}/values:batchGet?ranges=A1:AC1&ranges=A2:AC1000&key=${config.google.apiKey}`,
        postUrl: `https://sheets.googleapis.com/v4/spreadsheets/${config.google.spreadsheetId}/values/A1:AC1:append?valueInputOption=RAW&key=${config.google.apiKey}`,
      };
    },
    getFetchInstance() {},
  };
};
