import { LegacyCard, Page, Tabs } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';

export default function Onboarding() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        // todo: determine which onboarding step to send user to
        // navigate('/' + storeHost(store.url) + '/onboarding/connect')
    }, [])

    const tabs = [
        {
            id: 'connect',
            path: 'connect',
            content: 'Connect to Synkro account'
        },
        {
            id: 'choose-sync-field',
            path: 'choose-sync-field',
            content: 'Choose sync field'
        },
        {
            id: 'location-connections',
            path: 'location-connections',
            content: 'Location connections'
        },
        {
            id: 'customize-syncing',
            path: 'customize-syncing',
            content: 'Customize syncing'
        },
        {
            id: 'enable-syncing',
            path: 'enable-syncing',
            content: 'Enable syncing'
        },
        {
            id: 'complete',
            path: 'complete',
            content: 'Complete'
        },
    ];

    const [selected, setSelected] = useState(0);

    const handleTabChange = useCallback(
        (selectedTabIndex: number) => {
            setSelected(selectedTabIndex)
            navigate('/' + storeHost(store.url) + '/onboarding/' + tabs[selectedTabIndex].path)
        },
        [],
    );


    useEffect(() => {
        const newSelectedTabIndex = tabs.findIndex(tab => location.pathname.endsWith(tab.path))
        // newSelectedTabIndex could be -1 if findIndex returns no records. in that case, don't change selected tab
        if (newSelectedTabIndex >= 0) {
            setSelected(newSelectedTabIndex)
        }
    }, [location])

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
