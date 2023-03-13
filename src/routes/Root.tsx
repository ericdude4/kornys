import { Frame, Navigation } from '@shopify/polaris';
import { HomeMinor, SettingsMinor, ProductsMinor } from '@shopify/polaris-icons';

export default function Root() {
    return (
        <Frame>
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
        </Frame>

    );
}
