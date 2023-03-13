import { Frame, Navigation, TopBar, ActionList, Icon, Text } from '@shopify/polaris';
import { HomeMinor, SettingsMinor, ProductsMinor } from '@shopify/polaris-icons';
import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { get } from '../fetch';

export async function loader({ params }: LoaderFunctionArgs) {
    let storeUrl = params.storeUrl || ""
    return get("/stores/" + storeUrl.replace(".myshopify.com", ""))
        .then(store => {
            return {
                url: store.url,
                name: store.name,
                connected_stores: store.connected_stores.map((connected_store: any) => { return { name: connected_store.name, url: connected_store.url } })
            }
        });
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

    const userMenuOptions = store.connected_stores.map((store: any) => {
        return {
            items: [
                {
                    content: <Link className='switch-store-link' to={"/" + store.url.replace(".myshopify.com", "")}>{store.name}</Link>
                }
            ]
        }
    })

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