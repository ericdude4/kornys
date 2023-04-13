import { Button, AlphaStack, ButtonGroup, Text } from '@shopify/polaris';
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import { storeHost } from '../../utils';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    const locations: any = useLoaderData();

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Configure inventory location connections
            </Text>

            <Text as="p">
                Synkro will use this to determine how the different inventory locations in your stores should be synced.
            </Text>

            <ConfigureLocationConnections locations={locations} />
            
            <ButtonGroup>
                <Button primary onClick={() => { navigate('/' + storeHost(store.url) + '/onboarding/customize-syncing') }}>Continue to next step</Button>
            </ButtonGroup>
        </AlphaStack >
    );
}
