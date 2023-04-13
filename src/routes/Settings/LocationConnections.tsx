import { AlphaCard, AlphaStack, Page, Text } from '@shopify/polaris';
import { useLoaderData, useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureIntraStoreLocationConnections from '../../components/ConfigureIntraStoreLocationConnections';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import { storeHost } from '../../utils';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    const locations: any = useLoaderData();

    console.log(store.user)

    return (
        <Page
            breadcrumbs={[{ content: 'Settings', url: '/' + storeHost(store.url) + '/settings' }]}
            title="Location connections"
            subtitle="Connect inventory locations within and between your Shopify stores"
        >
            <AlphaStack gap="4">
                <AlphaCard>
                    <AlphaStack gap="4">
                        <Text variant="heading2xl" as="h3">
                            Multi-store location connections
                        </Text>

                        <Text as="p">
                            Synkro will use this to determine how to sync inventory locations <strong>between your stores</strong>.
                        </Text>

                        <ConfigureLocationConnections locations={locations} />
                    </AlphaStack>
                </AlphaCard>
                <AlphaCard>
                    <AlphaStack gap="4">
                        <Text variant="heading2xl" as="h3">
                            Same-store location connections
                        </Text>

                        <Text as="p">
                            Synkro will use this to determine how to sync inventory locations <strong>within {store.url}</strong>.
                        </Text>

                        <ConfigureIntraStoreLocationConnections locations={locations} />
                    </AlphaStack>
                </AlphaCard>
            </AlphaStack>
        </Page>
    );
}
