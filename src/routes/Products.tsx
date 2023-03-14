import { LoaderFunctionArgs, useLoaderData, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom'
import { get } from '../fetch';
import { storeHost, truncate } from '../utils';
import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Icon,
    Page,
} from '@shopify/polaris';

import {
    TickSmallMinor
} from '@shopify/polaris-icons';


export async function loader({ params, request }: LoaderFunctionArgs) {
    const page = new URL(request.url).searchParams.get('page') || 1;

    return get("/stores/" + storeHost(params.storeUrl) + "/products?page=" + page)
        .then(products_page => { return products_page });
}

type Variant = {
    id: number,
    sync: string,
}

type Product = {
    id: number;
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
            content: 'Capture payments',
            onAction: () => console.log('Todo: implement payment capture'),
        },
        {
            title: 'Edit customers',
            actions: [
                {
                    content: 'Add customers',
                    onAction: () => console.log('Todo: implement adding customers'),
                },
                {
                    content: 'Delete customers',
                    onAction: () => console.log('Todo: implement deleting customers'),
                },
            ],
        },
        {
            title: 'Export',
            actions: [
                {
                    content: 'Export as PDF',
                    onAction: () => console.log('Todo: implement PDF exporting'),
                },
                {
                    content: 'Export as CSV',
                    onAction: () => console.log('Todo: implement CSV exporting'),
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
                id={id.toString()}
                key={id}
                selected={selectedResources.includes(id.toString())}
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
                        {sync ? <Icon source={TickSmallMinor} color={'primary'} /> : <Icon source={TickSmallMinor} color={'magic'} />}
                    </Text>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );


    return (
        <Page
            title="Products"
            pagination={{
                hasPrevious: products_page.page_number > 1,
                hasNext: products_page.page_number < products_page.total_pages,
                onNext: () => {
                    navigate('/' + store.url + '/products?page=' + (products_page.page_number + 1))
                },
                onPrevious: () => {
                    navigate('/' + store.url + '/products?page=' + (products_page.page_number - 1))
                }
            }}
        >
            <LegacyCard>
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
                                <Text as="span" alignment="end">
                                    Variant count
                                </Text>
                            ),
                        },
                        {
                            id: 'sync',
                            title: (
                                <Text as="span" alignment="end">
                                    Syncing enabled
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