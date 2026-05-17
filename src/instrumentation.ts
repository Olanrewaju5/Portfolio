export async function register() {
  // The preview sandbox sets --localstorage-file without a valid path, leaving
  // global.localStorage as an object with no methods. Patch it so any SSR code
  // that reaches for localStorage doesn't throw.
  if (
    typeof globalThis.localStorage === "undefined" ||
    typeof (globalThis.localStorage as Storage).getItem !== "function"
  ) {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
        clear: () => store.clear(),
        get length() {
          return store.size;
        },
        key: (i: number) => [...store.keys()][i] ?? null,
      } satisfies Storage,
      writable: true,
      configurable: true,
    });
  }
}
