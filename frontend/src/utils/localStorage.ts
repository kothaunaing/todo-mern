export function saveToLocalStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage(key: string) {
  const data = JSON.parse(localStorage.getItem(key)!) || null;

  return data;
}

export function saveToSessionStorage(key: string, data: any) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

export function getFromSessionStorage(key: string) {
  const data = JSON.parse(sessionStorage.getItem(key)!) || null;

  return data;
}
