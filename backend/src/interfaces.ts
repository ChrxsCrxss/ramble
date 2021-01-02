export interface cacheService {
  getCache();
  addItem(item: any): Promise<boolean>;
  getSortedSet(): Promise<any[]>;
  clearCache(): Promise<boolean>;
}
