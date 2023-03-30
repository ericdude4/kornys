import { Text, AlphaStack } from '@shopify/polaris';
import { LoaderFunctionArgs, useRouteLoaderData } from 'react-router-dom';
import { get, post } from '../fetch';

export async function loader({ params, request }: LoaderFunctionArgs) {
    return get("/locations").then(locations => { return locations });
}

export default function EnableSyncing() {
    const store: any = useRouteLoaderData("root");

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Enable syncing
            </Text>

            <Text variant="headingXl" as="h4">
                Congratulations!
            </Text>

            <Text as="p">
                You have completed the Synkro setup process. Click the button below to enable syncing for {store.name}.
            </Text>
        </AlphaStack >
    );
}
