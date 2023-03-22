import { FormLayout, Checkbox, TextField, Button, InlineError, CalloutCard, LegacyStack, Text, Divider, AlphaStack, Collapsible, TextContainer, ButtonGroup, Columns, ResourceList, ResourceItem, AlphaCard, LegacyCard, ChoiceList, Select, DescriptionList, Icon, Inline } from '@shopify/polaris';
import { type } from 'os';
import { LocationsMinor, ArrowRightMinor, InventoryMajor } from '@shopify/polaris-icons';

import { useState, useCallback } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { get } from '../fetch';
import { storeHost } from '../utils';
import Login from './Login';

export async function loader({ params, request }: LoaderFunctionArgs) {
    return get("/locations").then(locations => { return locations });
}

export default function ConfigureLocationConnections() {
    const store: any = useRouteLoaderData("root");
    const locations: any = useLoaderData();
    const navigate = useNavigate();

    const allStores = [{ name: store.name, url: store.url }].concat(store.connected_stores)

    const fromStoreOptions = allStores.map((store: any) => {
        return { label: store.name, value: store.url }
    })

    const [selectedFromStore, setSelectedFromStore] = useState(store.url);

    const handleSelectFromStore = useCallback(
        (value: string) => setSelectedFromStore(value),
        [],
    );

    const fromStoreLocationOptions = locations[selectedFromStore].map((location: any) => {
        return { label: location.name, value: location.id.toString() }
    })

    const [selectedFromStoreLocation, setSelectedFromStoreLocation] = useState(fromStoreLocationOptions[0].value.toString());

    const handleSelectFromStoreLocation = useCallback(
        (value: string) => {
            setSelectedFromStoreLocation(value)
        },
        [],
    );

    const otherStoreOptions = allStores
        .filter((store: any) => store.url != selectedFromStore)
        .map((store: any) => {
            return { label: store.name, value: store.url }
        })

    const [selectedOtherStore, setSelectedOtherStore] = useState(otherStoreOptions[0].value);

    const handleSelectOtherStore = useCallback(
        (value: string) => setSelectedOtherStore(value),
        [],
    );

    const otherStoreLocationOptions = locations[selectedOtherStore].map((location: any) => {
        return { label: location.name, value: location.id.toString() }
    })

    const [selectedOtherStoreLocation, setSelectedOtherStoreLocation] = useState(otherStoreLocationOptions[0].value.toString());

    const handleSelectOtherStoreLocation = useCallback(
        (value: string) => {
            setSelectedOtherStoreLocation(value)
        },
        [],
    );

    const [biDirectional, setBiDirectional] = useState(true);

    const handleBiDirectionalChange = useCallback((value: boolean) => { setBiDirectional(value) }, [],);

    let locationConnectionBreakdowns: any[] = []

    Object.keys(store.user.location_connections).map((storeUrl, index) => {
        let storeLocationConnections = store.user.location_connections[storeUrl]
        let connections: any[] = []

        Object.keys(store.user.location_connections[storeUrl]).map((locationId, index) => {
            let thisLocation: any = locations[storeUrl].find((location: any) => location.id == locationId)
            let otherStoreConnections: any[] = []
            Object.keys(storeLocationConnections[locationId])
                .map((otherStoreUrl, index) => {
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
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Configure inventory location connections
            </Text>

            <Text as="p">
                Synkro will use this to determine how the different inventory locations between your stores should be synced.
            </Text>

            {locationConnectionBreakdowns.length ? (
                <>
                    <Text variant="headingXl" as="h4">
                        Current location connections
                    </Text>

                    {currentLocationConnectionsMarkup}

                    <div className='gap'></div>
                </>
            ) : null}

            <AlphaStack gap="4">
                <Text variant="headingXl" as="h4">
                    Create new location connection
                </Text>
                <Columns gap="4" columns={4}>
                    <Select
                        label={<strong>Inventory in store</strong>}
                        options={fromStoreOptions}
                        value={selectedFromStore}
                        onChange={handleSelectFromStore}
                    />
                    <Select
                        label={<strong>at location</strong>}
                        options={fromStoreLocationOptions}
                        value={selectedFromStoreLocation}
                        onChange={handleSelectFromStoreLocation}
                    />
                    <Select
                        label={<strong>should sync to store</strong>}
                        options={otherStoreOptions}
                        value={selectedOtherStore}
                        onChange={handleSelectOtherStore}
                    />
                    <Select
                        label={<strong>at location</strong>}
                        options={otherStoreLocationOptions}
                        value={selectedOtherStoreLocation}
                        onChange={handleSelectOtherStoreLocation}
                    />
                </Columns>
                <Checkbox
                    label="In both directions"
                    checked={biDirectional}
                    onChange={handleBiDirectionalChange}
                />
                <ButtonGroup>
                    <Button primary>Save location connection</Button>
                </ButtonGroup>
            </AlphaStack >
        </AlphaStack >
    );
}
