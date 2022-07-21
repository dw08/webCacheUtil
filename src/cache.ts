const dayjs = require("dayjs");
interface CacheInit {
  useLocalStorage?: boolean;
  cachePrefix: string;
  expires?: number;
}
type CacheInfo = {
  expires: Date;
  value: any;
};
class CacheUtil implements CacheInit {
  static DEFAULT_EXPIRES: number = 60 * 60;
  useLocalStorage: boolean = false;
  cachePrefix: string = "";
  expires: number = CacheUtil.DEFAULT_EXPIRES;
  constructor({
    useLocalStorage = false,
    cachePrefix,
    expires = CacheUtil.DEFAULT_EXPIRES,
  }: CacheInit) {
    this.useLocalStorage = useLocalStorage;
    this.cachePrefix = cachePrefix;
    this.expires = expires;
  }
  private isExpires = (expireTime: Date): boolean => {
    return dayjs().isAfter(dayjs(expireTime));
  };

  private getCacheKey = (key: string): string => {
    return `${this.cachePrefix}:${key}`;
  };
  get = (key: string): any => {
    if (!key) {
      return null;
    }
    const cacheKey = this.getCacheKey(key);
    let cacheInfo = this.useLocalStorage
      ? localStorage.getItem(cacheKey)
      : sessionStorage.getItem(cacheKey);
    if (!cacheInfo) {
      return null;
    }
    const parseCache: CacheInfo = JSON.parse(cacheInfo);
    const isExpires = this.isExpires(parseCache.expires);
    if (isExpires) {
      this.remove(cacheKey);
      return null;
    }
    return parseCache.value;
  };
  set = (key: string, value: any, expires?: number): void => {
    if (!key || !value) {
      return;
    }
    const cacheKey = this.getCacheKey(key);
    const cacheInfo: CacheInfo = {
      expires: dayjs().add(expires || this.expires, "s"),
      value,
    };
    this.useLocalStorage
      ? localStorage.setItem(cacheKey, JSON.stringify(cacheInfo))
      : sessionStorage.setItem(cacheKey, JSON.stringify(cacheInfo));
  };
  remove = (key: string) => {
    if (!key) return;
    const cacheKey = key.includes(this.cachePrefix)
      ? key
      : this.getCacheKey(key);
    this.useLocalStorage
      ? localStorage.removeItem(cacheKey)
      : sessionStorage.removeItem(cacheKey);
  };
}
export default CacheUtil;
