import { AlphaCard, AlphaStack, Button, ButtonGroup, Page, Text } from '@shopify/polaris';
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureIntraStoreLocationConnections from '../../components/ConfigureIntraStoreLocationConnections';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import SelectSyncProperties from '../../components/SelectSyncProperties';
import { storeHost } from '../../utils';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <AlphaStack gap="4">
            <SelectSyncProperties />

            <ButtonGroup>
                <Button primary onClick={() => { navigate('/' + storeHost(store.url) + '/onboarding/enable-syncing') }}>
                    Continue to next step
                </Button>
            </ButtonGroup>
        </AlphaStack>
    );
}
