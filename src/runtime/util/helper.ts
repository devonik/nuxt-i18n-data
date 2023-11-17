import type { I18nDataRaw } from '../types'

export function useHelper() {
  return {
    groupBy(xs, key) {
      return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
      }, {})
    },
    unflattenObject(obj) {
      return Object.keys(obj).reduce((res, k) => {
        k.split('.').reduce(
          (acc, e, i, keys) =>
            acc[e]
            || (acc[e] = Number.isNaN(Number(keys[i + 1]))
              ? keys.length - 1 === i
                ? obj[k]
                : {}
              : []),
          res,
        )
        return res
      }, {})
    },
    groupByLocalCode(list: I18nDataRaw[]): Record<string, Record<string, any>> {
      const localeCodes = new Set<string>()
      const obj: any = {}
      list.forEach((item) => {
        localeCodes.add(item.localeCode)
      })
      localeCodes.forEach((code) => {
        obj[code] = this.unflattenObject(
          list
            .filter(item => item.localeCode === code)
            .reduce(
              (acc: { [key: string]: string }, curr) => (
                ((acc[curr.key] = curr.value), acc)
              ),
              {},
            ),
        )
      })
      return obj
    },
  }
}
