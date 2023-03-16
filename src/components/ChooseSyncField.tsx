import { FormLayout, Checkbox, TextField, Button, InlineError, CalloutCard, LegacyStack, Text, Divider, AlphaStack, Collapsible, TextContainer, ButtonGroup, RadioButton } from '@shopify/polaris';
import { type } from 'os';
import { useState, useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';
import Login from './Login';

export default function ChooseSyncField() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    const [value, setValue] = useState(store.user.sync_property);

    const handleChange = useCallback(
        (_checked: boolean, newValue: string) => setValue(newValue),
        [],
    );

    const syncPropertyMarkup = (<strong>{value == 'sku' ? 'SKU' : 'barcode'}</strong>)

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Select your sync field
            </Text>
            <Text as="p">
                Synkro will use your selection to determine which variants to sync <strong>within and between</strong> your connected stores.
            </Text>
            <Text as="p">
                If two products have the same {syncPropertyMarkup}, Synkro will sync their inventory levels, price, and cost
                (although you can disable syncing on any of these fields in your Synkro settings).
            </Text>
            <Text as="p">
                This setting applies to all of the stores which you connect to your Synkro account.
            </Text>
            <RadioButton
                label="SKU"
                helpText="Synkro will compare your variant SKUs to determine which variants to sync."
                checked={value === 'sku'}
                id="sku"
                name="sku"
                onChange={handleChange}
            />
            <RadioButton
                label="Barcode"
                helpText="Synkro will compare your variant SKUs to determine which variants to sync."
                id="barcode"
                name="barcode"
                checked={value === 'barcode'}
                onChange={handleChange}
            />
        </AlphaStack>
    );
}
