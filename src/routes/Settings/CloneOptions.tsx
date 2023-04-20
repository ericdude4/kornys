import { AlphaCard, AlphaStack, Page } from '@shopify/polaris';
import { useRouteLoaderData } from 'react-router-dom';
import CloneAutoApplyTag from '../../components/CloneAutoApplyTag';
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
                    <CloneAutoApplyTag />
                </AlphaCard>
            </AlphaStack>
        </Page>
    );
}
