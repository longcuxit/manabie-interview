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

type StoreMode = "readonly" | "readwrite";

export class IndexDBControl {
  constructor(public database: IDBDatabase, public name: string) {}

  store(mode: StoreMode = "readonly") {
    const trans = this.database.transaction(this.name, mode);
    return trans.objectStore(this.name);
  }
}
