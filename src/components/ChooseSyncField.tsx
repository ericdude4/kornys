import {
    IndexTable, LegacyCard, useIndexResourceState, Button, Text, Divider, AlphaStack, Collapsible, ButtonGroup, RadioButton, Pagination, Columns, Select, Banner
} from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { get } from '../fetch';
import { storeHost, truncate } from '../utils';
import partyPopper from '../images/party-popper.svg';

export default function ChooseSyncField() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    const [value, setValue] = useState(store.user.sync_property);

    const handleChange = useCallback(
        (_checked: boolean, newValue: string) => setValue(newValue),
        [],
    );

    const [checking, setChecking] = useState(false);

    const [checkedOnce, setCheckedOnce] = useState(false);

    const [dismissedMessage, setDismissedMessage] = useState(false);

    const [open, setOpen] = useState(false);

    const [pageSize, setPageSize] = useState('5');

    const resourceName = {
        singular: 'variant',
        plural: 'variants',
    };

    const [variantsPage, setVariantsPage] = useState({ data: [], page_number: 0, total_pages: 0, total_entries: 0 });

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(variantsPage.data);

    const checkForDuplicates = (page: number) => {
        setChecking(true)
        setOpen(true)

        get("/stores/" + storeHost(store.url) + "/duplicate_sync_fields?sync_property=" + value + "&page_size=" + pageSize + "&page=" + page)
            .then(variants_page => {
                setChecking(false)
                setCheckedOnce(true)
                setVariantsPage(variants_page)
            });
    }

    const handlePageSizeChange = useCallback((value: string) => {
        setPageSize(value)
    }, []);

    useEffect(() => {
        if (open) checkForDuplicates(1)
    }, [pageSize]);

    useEffect(() => {
        setCheckedOnce(false)
        setOpen(false)
    }, [value]);

    const continueToNextStep = () => {
        let syncProperty = value == 'sku' ? 'SKU' : 'barcode'
        if (variantsPage.total_entries == 0 || window.confirm("You still have duplicated " + syncProperty + 's in your store. Variants with these ' + syncProperty + 's will have their inventory levels synced within the store. Are you sure you would like to proceed?')) {
            navigate('/' + storeHost(store.url) + '/onboarding/location-connections')
        }
    }

    const syncPropertyMarkup = (<strong>{value == 'sku' ? 'SKU' : 'barcode'}</strong>)

    const rowMarkup = variantsPage.data.map(
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


    const promotedBulkActions = [
        {
            content: 'Open in bulk editor',
            onAction: () => {
                window.open('https://' + store.url + '/admin/bulk?resource_name=ProductVariant&edit=' + value + '&managed=true&exclude_composite=true&ids=' + selectedResources.join(','))
            },
        }
    ];

    const emptyStateMarkup = (
        <AlphaStack gap="4">
            <Text as="p" alignment='center'>
                <img src={partyPopper} className='celebrate-no-duplicates' />
            </Text>
            <Text variant="headingLg" as="h4" alignment='center'>
                No duplicated {syncPropertyMarkup}s found
            </Text>
            <Text as="p" alignment='center' color="subdued">
                None of the variants within your store will sync with eachother.
            </Text>
        </AlphaStack>
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

            <ButtonGroup>
                {checking ? (
                    <Button
                        disabled>
                        Checking for duplicated {value == 'sku' ? 'SKU' : 'barcode'}s within your store...
                    </Button>
                ) : (
                    <Button primary={!checkedOnce} onClick={() => checkForDuplicates(1)}>
                        Check for duplicated {value == 'sku' ? 'SKU' : 'barcode'}s within your store
                    </Button>
                )}
                {checkedOnce ? (
                    <Button primary onClick={() => continueToNextStep()}>
                        Continue to next step
                    </Button>
                ) : (
                    <Button disabled>
                        Continue to next step
                    </Button>
                )}
            </ButtonGroup>

            <Divider borderStyle="base" />

            <Collapsible
                open={open}
                id="basic-collapsible"
                transition={{ duration: '100ms', timingFunction: 'ease-in-out' }}
                expandOnPrint
            >
                <AlphaStack gap="4">
                    {store.products_installing && !dismissedMessage ? (
                        <Banner title="Product download still in progress" onDismiss={() => { setDismissedMessage(true) }}>
                            <p>Synkro is still downloading a copy of your product catalogue, so this list of dupilicated {value == 'sku' ? 'SKU' : 'barcode'}s may not be complete. Perhaps you would like to wait a few more minutes to </p>
                        </Banner>
                    ) : null}
                    <Columns gap="4" columns={2}>
                        <Select
                            label=""
                            options={[{ label: '5 per page', value: '5' }, { label: '25 per page', value: '25' }]}
                            onChange={handlePageSizeChange}
                            value={pageSize}
                        />
                        <div id='duplicate-sku-pagination'>
                            <Pagination
                                label={variantsPage.page_number + " of " + variantsPage.total_pages}
                                hasPrevious={variantsPage.page_number > 0}
                                onPrevious={() => {
                                    checkForDuplicates(variantsPage.page_number - 1)
                                }}
                                hasNext={variantsPage.page_number < variantsPage.total_pages}
                                onNext={() => {
                                    checkForDuplicates(variantsPage.page_number + 1)
                                }}
                            />
                        </div>
                    </Columns>
                    <LegacyCard>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={variantsPage.data.length}
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
                            promotedBulkActions={promotedBulkActions}
                            emptyState={emptyStateMarkup}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </LegacyCard>
                </AlphaStack>
            </Collapsible>

        </AlphaStack >
    );
}
