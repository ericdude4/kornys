import { Text, AlphaStack, Button, ButtonGroup, CalloutCard, TextField, List, Toast } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { apiUrl, post } from '../fetch';
import Switch from "react-switch";
import { storeHost } from '../utils';
import partyPopper from '../images/party-popper.svg';
import linkStores from '../images/link-stores.png';
import synkroLogo from '../images/synkro-logo.png';

import { useCallback, useState } from 'react';

export default function CompleteOnboarding() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();

    const [value, setValue] = useState('');

    const handleChange = useCallback(
        (newValue: string) => setValue(newValue),
        [],
    );
    const [toastActive, setToastActive] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const startFullStoreSync = async () => {
        if (store.user.running_full_sync) {
            setToastMessage("Full store sync already in progress")
            setToastActive(true)
        } else {
            if (window.confirm(`Are you sure you would like to push all inventory levels from ${store.url} to your other connected stores? Be careful! This action will update the live inventories of products in your other connected stores.`)) {
                await post("/stores/" + storeHost(store.url) + "/full-store-sync", {})
                    .then((response) => {
                        revalidator.revalidate()
                        setToastMessage(response.message)
                        setToastActive(true)
                    })
            }
        }
    }

    console.log(store)

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3" alignment='center'>
                Congratulations!
            </Text>

            <Text as="p" alignment='center'>
                <img src={partyPopper} className='celebrate-no-duplicates' />
            </Text>

            <Text as="p" alignment='center'>
                You have completed basic onboarding for <strong>{store.name}</strong>
            </Text>

            <div className='gap'></div>

            <Text variant="headingXl" as="h4" alignment='center'>
                What to do next?
            </Text>

            <CalloutCard
                title="Connect another store to your Synkro account"
                illustration={linkStores}
                primaryAction={{
                    content: 'Start installation',
                    url: value.endsWith('myshopify.com') ? `${apiUrl}/initialize-installation?shop=${value}` : "https://apps.shopify.com/inventory-sync-1",
                    external: true
                }}
            >
                <p>
                    Install Synkro on another store to connect them together. Use the form below or find us in the <a href="https://apps.shopify.com/inventory-sync-1" target="_blank">Shopify app store</a>
                </p>

                <TextField
                    label=""
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder='acme-wholesale.myshopify.com'
                />

            </CalloutCard>

            {store.connected_stores.length > 0 ? (
                <CalloutCard
                    title="Push all my inventory levels from this store to connected stores"
                    illustration={synkroLogo}
                    primaryAction={{
                        content: 'Start full store sync',
                        onAction: startFullStoreSync
                    }}
                >
                    <p>
                        If your connected stores don't already have synced inventories, use this tool to perform a one-time inventory push from this store (<strong>{store.url}</strong>) to your other connected stores:
                    </p>

                    <List type="bullet">
                        {store.connected_stores.map((store: any) => <List.Item key={'list-item' + store.url}>{store.url}</List.Item>)}
                    </List>

                    <p>
                        After this full store sync, Synkro will keep your inventory levels in sync automatically as changes to inventory levels occur for any reason.
                    </p>

                    {toastActive ? <Toast content={toastMessage} onDismiss={() => setToastActive(false)} /> : null}
                </CalloutCard>
            ) : null}
        </AlphaStack >
    );
}
