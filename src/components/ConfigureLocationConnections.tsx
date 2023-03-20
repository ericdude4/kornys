import { FormLayout, Checkbox, TextField, Button, InlineError, CalloutCard, LegacyStack, Text, Divider, AlphaStack, Collapsible, TextContainer, ButtonGroup } from '@shopify/polaris';
import { type } from 'os';
import { useState, useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';
import Login from './Login';

export default function ConfigureLocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Success!!!
            </Text>
        </AlphaStack>
    );
}
