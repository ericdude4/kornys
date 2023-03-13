import { Frame, Navigation, TopBar, ActionList, Icon, Text } from '@shopify/polaris';
import { HomeMinor, SettingsMinor, ProductsMinor } from '@shopify/polaris-icons';
import { useState, useCallback, useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'

export async function loader({ params }: LoaderFunctionArgs) {
    return {
        "url": params.storeUrl,
        "name": "Inventory Test Store",
        "connected_stores": [
            { "name": "Inventory Test Store 2", "url": "inventory-test-store-2" },
            { "name": "Inventory Test Store 3", "url": "inventory-test-store-2" }
        ]
    }
}

export default function Root() {
    const store: any = useLoaderData();

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
        [],
    );

    const logo = {
        width: 124,
        topBarSource:
            'https://synkro.ericfroese.ca/images/shopify%20inventory%20sync-6323b362e112593f58d9d7240ffcdb03.png?vsn=d',
        url: '#',
        accessibilityLabel: 'Synkro: Inventory sync',
    };

    const userMenuOptions = store.connected_stores.map((store: any) => { return { items: [{ content: store.url }] } })

    const userMenuMarkup = (
        <TopBar.UserMenu
            actions={userMenuOptions}
            name={store.name}
            detail={store.url}
            initials={store.name.charAt(0)}
            open={isUserMenuOpen}
            onToggle={toggleIsUserMenuOpen}
        />
    );

    const toggleMobileNavigationActive = useCallback(
        () => setMobileNavigationActive((mobileNavigationActive) => !mobileNavigationActive),
        [],
    );

    const topBarMarkup = (
        <TopBar
            showNavigationToggle
            userMenu={userMenuMarkup}
            onNavigationToggle={toggleMobileNavigationActive}
        />
    );

    const navigationMarkup = (
        <Navigation location="/">
            <Navigation.Section
                items={[
                    {
                        url: '/contacts',
                        label: 'Home',
                        icon: HomeMinor,
                    },
                    {
                        url: '#',
                        excludePaths: ['#'],
                        label: 'Products',
                        icon: ProductsMinor,
                    },
                    {
                        url: '#',
                        excludePaths: ['#'],
                        label: 'Settings',
                        icon: SettingsMinor
                    },
                ]}
            />
        </Navigation>
    )

    return (
        <Frame
            logo={logo}
            topBar={topBarMarkup}
            navigation={navigationMarkup}
            onNavigationDismiss={toggleMobileNavigationActive}
            showMobileNavigation={mobileNavigationActive}>
        </Frame>

    );
}
