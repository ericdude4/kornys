import { redirect } from "react-router-dom";

export function storeHost(storeUrl: string | undefined) {
    if (typeof storeUrl == "undefined") {
        throw new Error("invalid store url")
    } else {
        return storeUrl.replace(".myshopify.com", "")
    }
}

export function authenticatedRedirect(path: string) {
    return redirect(path + "?token=" + window.Synkro.accessToken);
}

export function truncate(str: string, n: number) {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
};