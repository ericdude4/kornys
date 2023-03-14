export function storeHost(storeUrl: String | undefined) {
    if (typeof storeUrl == "undefined") {
        throw new Error("invalid store url")
    } else {
        return storeUrl.replace(".myshopify.com", "")
    }
}

export function truncate(str: String, n: number) {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
};