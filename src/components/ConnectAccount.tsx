import { FormLayout, Checkbox, TextField, Button, InlineError, CalloutCard, LegacyStack, Text, Divider, AlphaStack, Collapsible, TextContainer, ButtonGroup } from '@shopify/polaris';
import { type } from 'os';
import { useState, useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';
import Login from './Login';

export default function ConnectAccount() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <AlphaStack gap="4">
            {store.user ? (
                <>
                    <Text variant="heading2xl" as="h3">
                        Success!
                    </Text>

                    <Divider borderStyle="transparent" />

                    <Text variant="headingLg" as="h4">
                        This store is connected to {store.user.email}
                    </Text>

                    <Divider borderStyle="base" />

                    <ButtonGroup>
                        <Button onClick={handleToggle} ariaExpanded={open} ariaControls="basic-collapsible">Change Synkro account</Button>
                        <Button primary onClick={() => { navigate('/' + storeHost(store.url)) }}>Continue to next step</Button>
                    </ButtonGroup>

                    <Collapsible
                        open={open}
                        id="basic-collapsible"
                        transition={{ duration: '100ms', timingFunction: 'ease-in-out' }}
                        expandOnPrint
                    >
                        <Login scopedRedirectAfter={'/onboarding/connect'} />
                    </Collapsible>
                </>
            ) : (
                <Login scopedRedirectAfter={'/onboarding/connect'} />
            )}
        </AlphaStack>
    );
}
