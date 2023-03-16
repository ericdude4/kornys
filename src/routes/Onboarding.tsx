import { LegacyCard, Page, Tabs } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';

export default function Onboarding() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/' + storeHost(store.url) + '/onboarding/connect')
    }, [])

    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex: number) => setSelected(selectedTabIndex),
        [],
    );

    const tabs = [
        {
            id: 'connect-to-user',
            content: 'Connect to Synkro account',
            path: 'login'
        },
        {
            id: 'accepts-marketing-1',
            content: 'Accepts marketing',
            panelID: 'accepts-marketing-content-1',
        },
        {
            id: 'repeat-customers-1',
            content: 'Repeat customers',
            panelID: 'repeat-customers-content-1',
        },
        {
            id: 'prospects-1',
            content: 'Prospects',
            panelID: 'prospects-content-1',
        },
    ];

    return (
        <Page title={'Setup Synkro for ' + store.url}>
            <LegacyCard>
                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                    <LegacyCard.Section>
                        <Outlet />
                    </LegacyCard.Section>
                </Tabs>
            </LegacyCard>
        </Page>
    );
}
