export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const getLocalStorage = <T,>(key: string, initialValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return initialValue;
    
    // For JWT tokens (auth_token), return as-is without parsing
    if (key === 'auth_token' && typeof item === 'string') {
      return item as T;
    }
    
    // Try to parse as JSON for other items
    try {
      return JSON.parse(item);
    } catch {
      // If parse fails, return the raw string
      return item as T;
    }
  } catch (error) {
    console.error(error);
    return initialValue;
  }
};
export const setLocalStorage = <T,>(key: string, value: T): void => {
  try {
    // For JWT tokens (auth_token), store as-is without stringifying
    if (key === 'auth_token' && typeof value === 'string') {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(error);
  }
};