import { Frame, Navigation, TopBar } from '@shopify/polaris';
import { HomeMinor, SettingsMinor, ProductsMinor } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import { Link as ReactRouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { get } from '../fetch';
import { storeHost } from '../utils';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';

export async function loader({ params }: LoaderFunctionArgs) {
    let storeUrl = params.storeUrl || ""
    return get("/stores/" + storeUrl.replace(".myshopify.com", ""))
        .then(store => {
            return store
        });
}

export default function Root() {
    const store: any = useLoaderData();
    const navigate = useNavigate();
    let location = useLocation();

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
                    content: <ReactRouterLink className='switch-store-link' to={"/" + store.url.replace(".myshopify.com", "")}>{store.name}</ReactRouterLink>
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

    console.log(location.pathname)

    const navigationMarkup = (
        <Navigation location={location.pathname}>
            <Navigation.Section
                items={[
                    {
                        url: '/' + storeHost(store.url),
                        label: 'Home',
                        icon: HomeMinor,
                        exactMatch: true,
                    },
                    {
                        url: '/' + storeHost(store.url) + '/products',
                        label: 'Products',
                        icon: ProductsMinor
                    },
                    {
                        url: '/' + storeHost(store.url) + '/settings',
                        label: 'Settings',
                        icon: SettingsMinor,
                        subNavigationItems: [
                            {
                                url: '#',
                                excludePaths: ['#'],
                                disabled: false,
                                label: 'Collections',
                            },
                            {
                                url: '#',
                                excludePaths: ['#'],
                                disabled: false,
                                label: 'Inventory',
                            },
                        ],

                    },
                ]}
            />
        </Navigation>
    )

    return (

        <AppProvider i18n={enTranslations} linkComponent={Link}>
            <Frame
                logo={logo}
                topBar={topBarMarkup}
                navigation={navigationMarkup}
                onNavigationDismiss={toggleMobileNavigationActive}
                showMobileNavigation={mobileNavigationActive}>
                <Outlet />
                <div style={{ 'marginTop': '3rem' }}></div>
            </Frame>
        </AppProvider>

    );
}

const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

function Link({ children, url = '', external, ref, ...rest }: any) {
    // react-router only supports links to pages it can handle itself. It does not
    // support arbirary links, so anything that is not a path-based link should
    // use a reglar old `a` tag
    if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
        rest.target = '_blank';
        rest.rel = 'noopener noreferrer';
        return (
            <a href={url} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <ReactRouterLink to={url} {...rest}>
            {children}
        </ReactRouterLink>
    );
}

