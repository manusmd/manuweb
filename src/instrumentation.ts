export async function register() {
  if (typeof window !== 'undefined') {
    return;
  }

  const storage = globalThis.localStorage as Storage | undefined;

  if (storage && typeof storage.getItem !== 'function') {
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
}
