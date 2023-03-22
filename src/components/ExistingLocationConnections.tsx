import { Text, Divider, AlphaStack, Icon } from '@shopify/polaris';
import { LocationsMinor, ArrowRightMinor, InventoryMajor, ConnectMinor } from '@shopify/polaris-icons';

type ExistingLocationConnectionArgs = {
    store: any,
    locations: any[]
}

export default function ExistingLocationConnections({ store, locations }: ExistingLocationConnectionArgs) {
    const allStores = [{ name: store.name, url: store.url }].concat(store.connected_stores)

    let locationConnectionBreakdowns: any[] = []

    Object.keys(store.user.location_connections).map((storeUrl: any, index) => {
        let storeLocationConnections = store.user.location_connections[storeUrl]
        let connections: any[] = []

        Object.keys(store.user.location_connections[storeUrl]).map((locationId, index) => {
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

    locationConnectionBreakdowns.sort((lCB: any) => lCB.store.url == store.url ? -1 : 1)

    const currentLocationConnectionsMarkup = (
        <>
            {
                locationConnectionBreakdowns.map(({ store, connections }: any, index: number) => {
                    let topStore = store
                    const items = connections.map(({ location, otherStoreConnections }: any) => {
                        return (
                            <div className='location-connection-grid' key={"location-connections-" + topStore.url + "-location-" + location.id}>
                                <div><Icon source={LocationsMinor} color="base" /></div>
                                <Text variant='bodyMd' as='h6'>{location.name}</Text>
                                <div><Icon source={ArrowRightMinor} color="base" /></div>
                                <AlphaStack gap="4">
                                    <>
                                        {
                                            otherStoreConnections.map(({ location, store }: any) => {
                                                return (
                                                    <div className='connected-stores-grid' key={"location-connections-" + topStore.url + "-location-" + location.id + '-' + store.url}>
                                                        <Icon source={InventoryMajor} color="base" />
                                                        <Text variant='bodyMd' as='h6'><strong>{store.name}</strong></Text>
                                                        <Icon source={LocationsMinor} color="base" />
                                                        <Text variant='bodyMd' as='h6'>{location.name}</Text>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                </AlphaStack>
                            </div>
                        )
                    })
                    return (
                        <AlphaStack gap="4" key={"location-connections-" + store.url}>
                            <Text variant="headingMd" as="h5">{store.name}</Text>
                            <>
                                {items}
                            </>
                            {index + 1 < locationConnectionBreakdowns.length ? (
                                <Divider borderStyle="divider" />
                            ) : null}
                        </AlphaStack>
                    )
                })
            }
        </>
    )

    return (
        locationConnectionBreakdowns.length ? (
            <>
                {currentLocationConnectionsMarkup}
                <div className='gap'></div>
            </>
        ) : (null)
    );
}
