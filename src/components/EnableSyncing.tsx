import { Text, AlphaStack, Button, ButtonGroup } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import Switch from "react-switch";
import { storeHost } from '../utils';

export default function EnableSyncing() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();
    const navigate = useNavigate();

    const handleToggle = async () => {
        await post("/stores/" + storeHost(store.url), { sync_products: !store.sync_products })
            .then((_store) => {
                revalidator.revalidate()
            })
    }

    const handleCompleteOnboarding = async () => {
        await post("/stores/" + storeHost(store.url), { metadata: { completed_onboarding: true } })
            .then((_store) => {
                navigate('/' + storeHost(store.url) + '/onboarding/complete')
            })
    }

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Enable syncing
            </Text>

            <Text as="p">
                Once you enable syncing, Synkro will begin syncing changes as they occur based on your Synkro settings. Click the button below to enable syncing for {store.name}.
                <br />
                <br />
                This switch serves as the "master toggle" to enable or disable syncing on this store.
            </Text>

            <Switch
                onChange={handleToggle}
                checked={store.sync_products}
                checkedIcon={<div className='sync-toggle-text-enabled'>Syncing</div>}
                uncheckedIcon={<div className='sync-toggle-text-disabled'>Disabled</div>}
                // translated var(--p-action-primary) to hex
                onColor="#008060"
                handleDiameter={28}
                width={130}
                height={35} />

            {store.sync_products ? (
                <>
                    <div className='gap'></div>
                    <ButtonGroup>
                        <Button primary onClick={handleCompleteOnboarding}>Continue to complete onboarding!</Button>
                    </ButtonGroup>
                </>
            ) : null
            }
        </AlphaStack >
    );
}
