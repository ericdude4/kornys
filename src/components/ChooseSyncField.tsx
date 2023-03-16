import { FormLayout, Checkbox, TextField, Button, InlineError, CalloutCard, LegacyStack, Text, Divider, AlphaStack, Collapsible, TextContainer, ButtonGroup } from '@shopify/polaris';
import { type } from 'os';
import { useState, useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';
import Login from './Login';

export default function ChooseSyncField() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    console.log(store)

    return (
        <div>choose sync field</div>
    );
}
