import { Checkbox, Button, Text, AlphaStack, ButtonGroup, Columns, Select } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { get, post } from '../fetch';
import ExistingLocationConnections from './ExistingLocationConnections';

export async function loader({ params, request }: LoaderFunctionArgs) {
    return get("/locations").then(locations => { return locations });
}

export default function ConfigureLocationConnections() {
    const store: any = useRouteLoaderData("root");
    const locations: any = useLoaderData();
    const navigate = useNavigate();

    const [storeLocationConnections, setStoreLocationConnections] = useState(store.user.location_connections)

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

    let defaultOtherStoreOption: any[] = [{ label: "Already syncs to all stores", value: "" }]

    const calculateOtherStoreOptions = () => {
        let otherStoreOptions: any[] = allStores
            .filter((store: any) => {
                if (storeLocationConnections[selectedFromStore] && storeLocationConnections[selectedFromStore][selectedFromStoreLocation] && storeLocationConnections[selectedFromStore][selectedFromStoreLocation][store.url]) {
                    return false
                } else {
                    return store.url != selectedFromStore
                }
            })
            .map((store: any) => {
                return { label: store.name, value: store.url }
            })
        if (otherStoreOptions.length > 0) return otherStoreOptions
        else return defaultOtherStoreOption
    }

    const [otherStoreOptions, setOtherStoreOptions] = useState(defaultOtherStoreOption)

    const [selectedOtherStore, setSelectedOtherStore] = useState("");

    const handleSelectOtherStore = useCallback(
        (value: string) => setSelectedOtherStore(value),
        [],
    );

    // TODO: deleting a connection doesn't update the form

    useEffect(() => {
        // this fires when the selected from store changes
        let otherStoreOptions = calculateOtherStoreOptions()
        // updates the list of available other stores
        setOtherStoreOptions(otherStoreOptions)
        // updates the preselected other store
        setSelectedOtherStore(otherStoreOptions[0].value)
    }, [selectedFromStore, selectedFromStoreLocation])

    const [otherStoreLocationOptions, setOtherStoreLocationOptions] = useState([])

    const calculateOtherStoreLocationOptions = () => {
        if (selectedOtherStore) {
            return locations[selectedOtherStore].map((location: any) => {
                return { label: location.name, value: location.id.toString() }
            })
        } else {
            return []
        }
    }

    const [selectedOtherStoreLocation, setSelectedOtherStoreLocation] = useState("");

    useEffect(() => {
        // This fires when the selected other store changes
        // updates the list of other store location options
        setOtherStoreLocationOptions(calculateOtherStoreLocationOptions())
    }, [selectedOtherStore])


    const handleSelectOtherStoreLocation = useCallback(
        (value: string) => {
            setSelectedOtherStoreLocation(value)
        },
        [],
    );

    const [biDirectional, setBiDirectional] = useState(true);

    const handleBiDirectionalChange = useCallback((value: boolean) => { setBiDirectional(value) }, [],);

    const saveLocationConnection = async () => {
        let newLocationConnectionDest: any = {}
        newLocationConnectionDest[selectedOtherStore] = selectedOtherStoreLocation
        let newLocationConnectionFromTopLocation: any = {}
        newLocationConnectionFromTopLocation[selectedFromStoreLocation] = newLocationConnectionDest
        let newLocationConnection: any = {}
        newLocationConnection[selectedFromStore] = newLocationConnectionFromTopLocation

        if (typeof storeLocationConnections[selectedFromStore] == 'undefined') {
            storeLocationConnections[selectedFromStore] = newLocationConnection[selectedFromStore]
        } else {
            if (typeof storeLocationConnections[selectedFromStore][selectedFromStoreLocation] == 'undefined') {
                storeLocationConnections[selectedFromStore][selectedFromStoreLocation] = newLocationConnection[selectedFromStore][selectedFromStoreLocation]
            } else {
                storeLocationConnections[selectedFromStore][selectedFromStoreLocation][selectedOtherStore] = selectedOtherStoreLocation
            }
        }

        await post("/user", { location_connections: storeLocationConnections })
            .then((user) => {
                setStoreLocationConnections(user.location_connections)
            })
    }

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Configure inventory location connections
            </Text>

            <Text as="p">
                Synkro will use this to determine how the different inventory locations between your stores should be synced.
            </Text>

            <ExistingLocationConnections store={store} locations={locations} storeLocationConnections={storeLocationConnections} setStoreLocationConnections={setStoreLocationConnections} />

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
                        disabled={selectedOtherStore == ""}
                    />
                    {selectedOtherStore != "" ? (
                        <Select
                            label={<strong>at location</strong>}
                            options={otherStoreLocationOptions}
                            value={selectedOtherStoreLocation}
                            onChange={handleSelectOtherStoreLocation}
                        />
                    ) : null}
                </Columns>
                <Checkbox
                    label="In both directions"
                    checked={biDirectional}
                    onChange={handleBiDirectionalChange}
                />
                <ButtonGroup>
                    <Button primary onClick={() => saveLocationConnection()}>Save location connection</Button>
                </ButtonGroup>
            </AlphaStack >
        </AlphaStack >
    );
}
