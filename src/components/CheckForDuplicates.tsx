import {
    IndexTable, LegacyCard, useIndexResourceState, Text, AlphaStack, Pagination, Columns, Select, Banner
} from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { get } from '../fetch';
import { storeHost, truncate } from '../utils';
import partyPopper from '../images/party-popper.svg';

type CheckForDuplicatesProps = {
    syncProperty: string,
    onPageLoad: Function
}

export default function CheckForDuplicates({ syncProperty, onPageLoad }: CheckForDuplicatesProps) {
    const store: any = useRouteLoaderData("root");
    const [checking, setChecking] = useState(false);

    const [dismissedMessage, setDismissedMessage] = useState(false);

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

        get("/stores/" + storeHost(store.url) + "/duplicate_sync_fields?sync_property=" + syncProperty + "&page_size=" + pageSize + "&page=" + page)
            .then(variants_page => {
                setChecking(false)
                setVariantsPage(variants_page)
                onPageLoad(variants_page)
            });
    }

    const handlePageSizeChange = useCallback((value: string) => {
        setPageSize(value)
    }, []);

    useEffect(() => {
        checkForDuplicates(1)
    }, [pageSize]);

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
                window.open('https://' + store.url + '/admin/bulk?resource_name=ProductVariant&edit=' + syncProperty + '&managed=true&exclude_composite=true&ids=' + selectedResources.join(','))
            },
        }
    ];

    const syncPropertyMarkup = (<strong>{syncProperty == 'sku' ? 'SKU' : 'barcode'}</strong>)

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
            {store.products_installing && !dismissedMessage ? (
                <Banner title="Product download still in progress" onDismiss={() => { setDismissedMessage(true) }}>
                    <p>Synkro is still downloading a copy of your product catalogue, so this list of dupilicated {syncProperty == 'sku' ? 'SKU' : 'barcode'}s may not be complete. Perhaps you would like to wait a few more minutes to </p>
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
        </AlphaStack >
    );
}
