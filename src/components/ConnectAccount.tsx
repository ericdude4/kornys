import { FormLayout, Checkbox, TextField, Button, InlineError, CalloutCard, LegacyStack, Text, Divider, AlphaStack, Collapsible, TextContainer, ButtonGroup } from '@shopify/polaris';
import { type } from 'os';
import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Outlet, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';
import CreateAccount from './CreateAccount';
import Login from './Login';

export default function ConnectAccount() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <AlphaStack gap="4">
            <Text variant="headingLg" as="h3">
                Connect your store to a Synkro account
            </Text>

            <Text as="p">
                Synkro will sync stores which are connected under the same Synkro account.
            </Text>

            {store.user ? (
                <>
                    <Text variant="headingLg" as="h4">
                        This store is connected to {store.user.email}
                    </Text>

                    <Divider borderStyle="base" />
                    <ButtonGroup>
                        <Button onClick={handleToggle} ariaExpanded={open} ariaControls="basic-collapsible">Change Synkro account</Button>
                        <Button primary onClick={() => { navigate('/' + storeHost(store.url) + '/onboarding/choose-sync-field') }}>Continue to next step</Button>
                    </ButtonGroup>

                    <Collapsible
                        open={open}
                        id="basic-collapsible"
                        transition={{ duration: '100ms', timingFunction: 'ease-in-out' }}
                        expandOnPrint
                    >
                        <Outlet />

                        <Text as="p">
                            <br/>
                            {location.pathname.endsWith('create') ? (
                                <>Already have an account? <Link to={''}>Click here to log in</Link></>
                            ) : (
                                <>Want to create a new account? <Link to={'create'}>Click here to create one</Link></>
                            )}
                        </Text>
                    </Collapsible>
                </>
            ) : (
                <>
                    <Text as="p">
                        {location.pathname.endsWith('create') ? (
                            <>Already have an account? <Link to={''}>Click here to log in</Link></>
                        ) : (
                            <>Don't have an account? <Link to={'create'}>Click here to create one</Link></>
                        )}
                    </Text>
                    <Outlet />
                </>
            )}

        </AlphaStack>
    );
}
