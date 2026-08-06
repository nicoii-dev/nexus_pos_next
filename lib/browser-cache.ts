export async function clearBrowserData(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // storage may be unavailable
  }

  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const eqPos = cookies[i].indexOf("=");
      const name = (eqPos > -1 ? cookies[i].substring(0, eqPos) : cookies[i]).trim();
      if (!name) continue;
      const domain = window.location.hostname;
      document.cookie = `${name}=; Max-Age=-99999999; path=/`;
      document.cookie = `${name}=; Max-Age=-99999999; path=/; domain=${domain}`;
      document.cookie = `${name}=; Max-Age=-99999999; path=/; secure`;
      document.cookie = `${name}=; Max-Age=-99999999; path=/; domain=${domain}; secure`;
    }
  } catch {
    // cookies may be restricted
  }

  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    // cache storage may be unavailable
  }

  try {
    if ("indexedDB" in window && typeof indexedDB.databases === "function") {
      const databases = await indexedDB.databases();
      await Promise.all(
        databases.map((db) => db.name && indexedDB.deleteDatabase(db.name))
      );
    }
  } catch {
    // indexedDB may be unavailable
  }
}
