import { Text, AlphaStack, Button, ButtonGroup, CalloutCard, TextField } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { apiUrl, post } from '../fetch';
import Switch from "react-switch";
import { storeHost } from '../utils';
import partyPopper from '../images/party-popper.svg';
import linkStores from '../images/link-stores.png';

import { useCallback, useState } from 'react';

export default function CompleteOnboarding() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    const [value, setValue] = useState('');

    const handleChange = useCallback(
        (newValue: string) => setValue(newValue),
        [],
    );

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3" alignment='center'>
                Congratulations!
            </Text>

            <Text as="p" alignment='center'>
                <img src={partyPopper} className='celebrate-no-duplicates' />
            </Text>

            <Text as="p" alignment='center'>
                You have completed onboarding for <strong>{store.name}</strong>
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
        </AlphaStack >
    );
}
