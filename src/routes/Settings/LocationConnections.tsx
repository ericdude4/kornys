import { AlphaCard, AlphaStack, Page, Text } from '@shopify/polaris';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import { storeHost } from '../../utils';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <Page
            breadcrumbs={[{ content: 'Settings', url: '/' + storeHost(store.url) + '/settings' }]}
            title="Location connections"
            subtitle="Connect inventory locations within and between your Shopify stores"
        >
            <AlphaCard>
                <AlphaStack gap="4">
                    <Text variant="heading2xl" as="h3">
                        Multi-store location connections
                    </Text>

                    <Text as="p">
                        Synkro will use this to determine how the different inventory locations in your stores should be synced.
                    </Text>

                    <ConfigureLocationConnections />
                </AlphaStack>
            </AlphaCard>
        </Page>
    );
}
