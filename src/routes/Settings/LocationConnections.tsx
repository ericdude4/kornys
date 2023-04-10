import { AlphaCard, LegacyCard, Page } from '@shopify/polaris';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <Page
            breadcrumbs={[{ content: 'Settings', url: '/' }]}
            title="Location connections"
            subtitle="Tell Synkro how inventory levels should be synced between different inventory locations in your stores"
        >
            <AlphaCard>
                <ConfigureLocationConnections />
            </AlphaCard>
        </Page>
    );
}
