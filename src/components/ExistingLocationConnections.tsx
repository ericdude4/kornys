import { Text, Divider, AlphaStack, Icon } from '@shopify/polaris';
import { LocationsMinor, ArrowRightMinor, InventoryMajor, DeleteMinor } from '@shopify/polaris-icons';
import { useState } from 'react';
import { post } from '../fetch';
import { buildLocationConnectionsBreadowns } from '../utils';

type ExistingLocationConnectionArgs = {
    store: any,
    storeLocationConnections: any,
    setStoreLocationConnections: any,
    locations: any[]
}

export default function ExistingLocationConnections({ store, storeLocationConnections, setStoreLocationConnections, locations }: ExistingLocationConnectionArgs) {
    let locationConnectionBreakdowns: any[] = buildLocationConnectionsBreadowns(store, storeLocationConnections, locations)

    const deleteLocationConnection = async (topStore: any, topLocation: any, connectedStore: any) => {
        console.log(store.user.location_connections[topStore.url][topLocation.id])
        delete store.user.location_connections[topStore.url][topLocation.id][connectedStore.url]

        await post("/user", { location_connections: store.user.location_connections })
            .then((user) => {
                setStoreLocationConnections(user.location_connections)
            })
    }

    const currentLocationConnectionsMarkup = (
        <>
            {
                locationConnectionBreakdowns.map(({ store, connections }: any, index: number) => {
                    let topStore = store
                    const items = connections.map(({ location, otherStoreConnections }: any) => {
                        let topLocation = location
                        return (
                            <div className='location-connection-grid' key={"location-connections-" + topStore.url + "-location-" + topLocation.id}>
                                <div><Icon source={LocationsMinor} color="base" /></div>
                                <Text variant='bodyMd' as='h6'>{topLocation.name}</Text>
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
                                                        <div className='delete-location-connection' onClick={() => { deleteLocationConnection(topStore, topLocation, store) }}>
                                                            <Icon source={DeleteMinor} color="critical" />
                                                        </div>
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
