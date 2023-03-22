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

export function buildLocationConnectionsBreadowns(store: any, locationConnections :any, locations: any) {
    const allStores = [{ name: store.name, url: store.url }].concat(store.connected_stores)

    let locationConnectionBreakdowns: any[] = []

    Object.keys(locationConnections).map((storeUrl: any, index) => {
        let storeLocationConnections = locationConnections[storeUrl]
        let connections: any[] = []

        Object.keys(locationConnections[storeUrl]).map((locationId, index) => {
            let thisLocation: any = locations[storeUrl].find((location: any) => location.id == locationId)
            let otherStoreConnections: any[] = []
            Object.keys(storeLocationConnections[locationId])
                .map((otherStoreUrl: any, index) => {
                    let otherStoreConnectedToLocationID = storeLocationConnections[locationId][otherStoreUrl]
                    if (otherStoreConnectedToLocationID != '') {
                        otherStoreConnections.push({
                            store: allStores.find((store: any) => store.url == otherStoreUrl),
                            location: locations[otherStoreUrl].find((location: any) => location.id == otherStoreConnectedToLocationID)
                        })
                    }
                })
            if (otherStoreConnections.length > 0) {
                connections.push({
                    location: thisLocation,
                    otherStoreConnections: otherStoreConnections
                })
            }
        })

        if (connections.length > 0) {
            locationConnectionBreakdowns.push({
                store: allStores.find((store: any) => store.url == storeUrl),
                connections: connections
            })
        }
    })

    return locationConnectionBreakdowns.sort((lCB: any) => lCB.store.url == store.url ? -1 : 1)
}