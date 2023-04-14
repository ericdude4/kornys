import { Text, AlphaStack, RadioButton } from '@shopify/polaris';

type ChooseSyncFieldProps = {
    syncProperty: string,
    onSyncPropertyChange: Function
}

export default function ChooseSyncField({ syncProperty, onSyncPropertyChange }: ChooseSyncFieldProps) {
    const syncPropertyMarkup = (<strong>{syncProperty == 'sku' ? 'SKU' : 'barcode'}</strong>)

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
                checked={syncProperty === 'sku'}
                id="sku"
                name="sku"
                onChange={() => onSyncPropertyChange('sku')}
            />
            <RadioButton
                label="Barcode"
                helpText="Synkro will compare your variant barcodes to determine which variants to sync."
                id="barcode"
                name="barcode"
                checked={syncProperty === 'barcode'}
                onChange={() => onSyncPropertyChange('barcode')}
            />
        </AlphaStack >
    );
}
