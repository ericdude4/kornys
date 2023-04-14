import { Checkbox, Button, Text, AlphaStack, ButtonGroup, Columns, Select, Toast, Icon, OptionList } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { get, post } from '../fetch';
import { LocationsMinor, ArrowRightMinor } from '@shopify/polaris-icons';

export async function loader({ params, request }: LoaderFunctionArgs) {
    return get("/locations").then(locations => { return locations });
}

type ConfigureLocationConnectionArgs = {
    locations: any
}

export default function ConfigureIntraStoreLocationConnections({ locations }: ConfigureLocationConnectionArgs) {
    const store: any = useRouteLoaderData("root");
    const [storeLocationConnections, setStoreLocationConnections] = useState(typeof store.user.intra_store_location_connections[store.url] == 'undefined' ? {} : store.user.intra_store_location_connections[store.url])

    const handleSelectionChange = async (location: any, values: string[]) => {
        storeLocationConnections[location.id] = values

        let newIntraStoreLocationConnections = store.user.intra_store_location_connections
        if (typeof newIntraStoreLocationConnections[store.url] == 'undefined') {
            newIntraStoreLocationConnections[store.url] = {}
        }
        newIntraStoreLocationConnections[store.url][location.id] = values

        await post("/user", { intra_store_location_connections: newIntraStoreLocationConnections })
            .then((user) => {
                setStoreLocationConnections(user.intra_store_location_connections[store.url])
            })
    }

    return (
        <AlphaStack gap="4">
            {locations[store.url].map((location: any) => {
                return <div className='intra-store-locations-grid' key={'intra-store-location' + location.id}>
                    <div><Icon source={LocationsMinor} color="base" /></div>
                    <Text variant="headingMd" as="h5">{location.name}</Text>
                    <div><Icon source={ArrowRightMinor} color="base" /></div>
                    <OptionList
                        title=""
                        onChange={(selected) => handleSelectionChange(location, selected)}
                        options={locations[store.url]
                            .filter((otherLocation: any) => otherLocation.id != location.id)
                            .map((otherLocation: any) => {
                                return { value: `${otherLocation.id}`, label: otherLocation.name }
                            })}
                        selected={typeof storeLocationConnections[location.id] == 'undefined' ? [] : storeLocationConnections[location.id]}
                        allowMultiple
                    />
                </div>
            })}
        </AlphaStack >
    );
}
