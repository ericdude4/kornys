import { AlphaCard, AlphaStack, Page, Text } from '@shopify/polaris';
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureIntraStoreLocationConnections from '../../components/ConfigureIntraStoreLocationConnections';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import SelectSyncProperties from '../../components/SelectSyncProperties';
import SyncOverrides from '../../components/SyncOverrides';
import { storeHost } from '../../utils';

export default function CloneOptions() {
    const store: any = useRouteLoaderData("root");

    return (
        <Page
            backAction={{ content: 'Settings', url: '/' + storeHost(store.url) + '/settings' }}
            title="Manage product clone settings"
            subtitle="Customize the way Synkro clones products between your stores."
        >
            <AlphaStack gap="4">
                <AlphaCard>
                </AlphaCard>
            </AlphaStack>
        </Page>
    );
}
