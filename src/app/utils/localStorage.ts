export const getLocalStorage = (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
};

export const setLocalStorage = (key: string, value: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
    }
};