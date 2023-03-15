import { LoaderFunctionArgs, useLoaderData, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom'
import { get, post } from '../fetch';
import { storeHost, truncate } from '../utils';
import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Page,
    Badge,
    Filters,
} from '@shopify/polaris';
import { useCallback, useState } from 'react';


export async function loader({ params, request }: LoaderFunctionArgs) {
    const page = new URL(request.url).searchParams.get('page') || 1;
    const title = new URL(request.url).searchParams.get('title') || '';

    return get("/stores/" + storeHost(params.storeUrl) + "/products?page=" + page + "&title=" + title)
        .then(products_page => { return products_page });
}

type Variant = {
    id: string,
    sync: string,
}

type Product = {
    id: string;
    title: string;
    sync: boolean;
    variants: [Variant];
};

export default function Products() {
    const store: any = useRouteLoaderData("root");

    const products_page: any = useLoaderData();
    const products: any = products_page.data;

    const navigate = useNavigate();

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(products);

    const promotedBulkActions = [
        {
            content: 'Clone products',
            onAction: () => console.log('Todo: implement clone products'),
        },
        {
            title: 'Change sync status',
            actions: [
                {
                    content: 'Disable syncing',
                    onAction: () => {
                        post("/stores/" + storeHost(store.url) + "/products/bulk_action", { action: "disable_sync", product_ids: selectedResources })
                            .then(() => {
                                navigateProductsPage(products_page.page_number, queryValue)
                            })
                    },
                },
                {
                    content: 'Enable syncing',
                    onAction: () => {
                        post("/stores/" + storeHost(store.url) + "/products/bulk_action", { action: "enable_sync", product_ids: selectedResources })
                            .then(() => {
                                navigateProductsPage(products_page.page_number, queryValue)
                            })
                    },
                },
            ],
        },
    ];

    const bulkActions = [
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Remove tags',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        },
        {
            content: 'Delete customers',
            onAction: () => console.log('Todo: implement bulk delete'),
        },
    ];

    const rowMarkup = products.map(
        ({ id, title, variants, sync }: Product, index: number) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>
                    <Text fontWeight="bold" as="span">
                        {truncate(title, 50)}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        {variants.length}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" alignment="center" numeric>
                        {sync ? <Badge status='success'>Syncing</Badge> : <Badge>Disabled</Badge>}
                    </Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    const [queryValue, setQueryValue] = useState('');

    const handleQueryValueRemove = useCallback(() => {
        setQueryValue('')
        navigateProductsPage(1, queryValue)
    }, []);

    const handleQueryValueBlur = useCallback(() => {
        // request new products with title filter and switch page to 1
        navigateProductsPage(1, queryValue)
    }, [queryValue]);

    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    function navigateProductsPage(page: number, titleFilter: string) {
        navigate('/' + store.url + '/products?page=' + page + '&title=' + titleFilter)
    }

    return (
        <Page
            title="Products"
            pagination={{
                hasPrevious: products_page.page_number > 1,
                hasNext: products_page.page_number < products_page.total_pages,
                onNext: () => {
                    navigateProductsPage(products_page.page_number + 1, queryValue)
                },
                onPrevious: () => {
                    navigateProductsPage(products_page.page_number - 1, queryValue)
                }
            }}
        >
            <LegacyCard>
                <div style={{ padding: '16px' }}>
                    <Filters
                        filters={[]}
                        queryValue={queryValue}
                        onQueryChange={setQueryValue}
                        onQueryBlur={() => handleQueryValueBlur()}
                        onQueryClear={handleQueryValueRemove}
                        onClearAll={handleClearAll}
                        queryPlaceholder={'Filter products'}
                        helpText={'Enter a product title to search your products'}
                    />
                </div>
                <IndexTable
                    resourceName={resourceName}
                    itemCount={products.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    bulkActions={bulkActions}
                    promotedBulkActions={promotedBulkActions}
                    headings={[
                        { title: 'Name' },
                        {
                            id: 'variant-count',
                            title: (
                                <Text as="span" alignment="center">
                                    Variant count
                                </Text>
                            ),
                        },
                        {
                            id: 'sync',
                            title: (
                                <Text as="span" alignment='center'>
                                    Sync status
                                </Text>
                            ),
                        },
                    ]}
                >
                    {rowMarkup}
                </IndexTable>
            </LegacyCard>
        </Page>
    );
}