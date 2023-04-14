import { AlphaCard, AlphaStack, Page, Text } from '@shopify/polaris';
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureIntraStoreLocationConnections from '../../components/ConfigureIntraStoreLocationConnections';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import SelectSyncProperties from '../../components/SelectSyncProperties';
import { storeHost } from '../../utils';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <Page
            backAction={{ content: 'Settings', url: '/' + storeHost(store.url) + '/settings' }}
            title="Customize syncing"
            subtitle="Configure exactly which product and variant properties that Synkro should sync between your stores."
        >
            <AlphaCard>
                <SelectSyncProperties />
            </AlphaCard>
        </Page>
    );
}
