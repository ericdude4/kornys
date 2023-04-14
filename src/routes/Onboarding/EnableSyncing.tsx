import { Text, AlphaStack, Button, ButtonGroup } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../../fetch';
import Switch from "react-switch";
import { storeHost } from '../../utils';
import ToggleSyncing from '../../components/ToggleSyncing';

export default function EnableSyncing() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();
    const navigate = useNavigate();

    const handleCompleteOnboarding = async () => {
        await post("/stores/" + storeHost(store.url), { metadata: { completed_onboarding: true } })
            .then((_store) => {
                revalidator.revalidate()
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

            <ToggleSyncing />

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
