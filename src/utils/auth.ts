export function isLoggedIn(cookie: string | null): boolean {
    if (!cookie) return false;
  
    const match = cookie.match(/token=([^;]+)/);
    return match !== null && match[1] !== "";
  }
  