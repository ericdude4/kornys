import { Button, AlphaStack, ButtonGroup } from '@shopify/polaris';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import ConfigureLocationConnections from '../../components/ConfigureLocationConnections';
import { storeHost } from '../../utils';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <AlphaStack gap="4">
            <ConfigureLocationConnections />
            <ButtonGroup>
                <Button primary onClick={() => { navigate('/' + storeHost(store.url) + '/onboarding/customize-syncing') }}>Continue to next step</Button>
            </ButtonGroup>
        </AlphaStack >
    );
}
