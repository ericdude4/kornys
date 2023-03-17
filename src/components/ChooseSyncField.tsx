import {
    IndexTable, LegacyCard, useIndexResourceState, Button, Text, Divider, AlphaStack, Collapsible, ButtonGroup, RadioButton, Pagination, Columns
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { get } from '../fetch';
import { storeHost, truncate } from '../utils';

export default function ChooseSyncField() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    const [value, setValue] = useState(store.user.sync_property);

    const handleChange = useCallback(
        (_checked: boolean, newValue: string) => setValue(newValue),
        [],
    );

    const [checking, setChecking] = useState(false);

    const [open, setOpen] = useState(false);

    const resourceName = {
        singular: 'variant',
        plural: 'variants',
    };

    const [variants, setVariants] = useState([]);

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(variants);

    const checkForDuplicates = () => {
        setChecking(true)
        setOpen(true)

        get("/stores/" + storeHost(store.url) + "/duplicate_sync_fields?sync_property=" + value + "&page=" + 0)
            .then(variants_page => {
                setChecking(false)
                setVariants(variants_page.data)
            });
    }

    const syncPropertyMarkup = (<strong>{value == 'sku' ? 'SKU' : 'barcode'}</strong>)


    const rowMarkup = variants.map(
        ({ id, product, title, sku, barcode }: any, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text fontWeight="bold" as="span">
                        {truncate(product.title, 50)}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>{title}</IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" numeric>
                        {sku}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="start" numeric>
                        {barcode}
                    </Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

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
                helpText="Synkro will compare your variant barcodes to determine which variants to sync."
                id="barcode"
                name="barcode"
                checked={value === 'barcode'}
                onChange={handleChange}
            />

            {checking ? (
                <ButtonGroup>
                    <Button primary disabled>
                        Checking for duplicated {value == 'sku' ? 'SKU' : 'barcode'}s within your store...
                    </Button>
                </ButtonGroup>
            ) : (
                <Columns gap="4" columns={['twoThirds', 'oneThird']}>
                    <ButtonGroup>
                        <Button primary onClick={checkForDuplicates}>
                            Check for duplicated {value == 'sku' ? 'SKU' : 'barcode'}s within your store
                        </Button>
                    </ButtonGroup>

                    {variants.length > 0 ? (
                        <div id='duplicate-sku-pagination'>
                            <Pagination
                                hasPrevious
                                onPrevious={() => {
                                    console.log('Previous');
                                }}
                                hasNext
                                onNext={() => {
                                    console.log('Next');
                                }}
                            />
                        </div>
                    ) : null}
                </Columns>
            )}

            <Divider borderStyle="base" />

            <Collapsible
                open={open}
                id="basic-collapsible"
                transition={{ duration: '100ms', timingFunction: 'ease-in-out' }}
                expandOnPrint
            >
                <LegacyCard>
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={variants.length}
                        selectedItemsCount={
                            allResourcesSelected ? 'All' : selectedResources.length
                        }
                        onSelectionChange={handleSelectionChange}
                        headings={[
                            { title: 'Product' },
                            { title: 'Variant' },
                            { title: 'SKU' },
                            { title: 'Barcode' },
                        ]}
                    >
                        {rowMarkup}
                    </IndexTable>
                </LegacyCard>
            </Collapsible>

        </AlphaStack >
    );
}
