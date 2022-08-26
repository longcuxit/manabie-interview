export interface IDBRequest<T> {
  result: T;
  error: DOMException | null;
  onsuccess: ((...args: any[]) => void) | null;
  onerror: ((...args: any[]) => void) | null;
}

export function toAsync<T>(request: IDBRequest<T>) {
  return new Promise<T>((next, error) => {
    request.onsuccess = () => next(request.result);
    request.onerror = () => error(request.error);
  });
}

export enum StoreMode {
  readonly = "readonly",
  readwrite = "readwrite",
}
export type StoreSelect = (mode?: StoreMode) => IDBObjectStore;

export function createStoreSelect(
  database: IDBDatabase,
  name: string
): StoreSelect {
  return (mode = StoreMode.readonly) => {
    const trans = database.transaction(name, mode);
    return trans.objectStore(name);
  };
}
