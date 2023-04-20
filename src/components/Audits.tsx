import { LoaderFunctionArgs, useLoaderData, useNavigate, useParams, useRouteLoaderData } from 'react-router-dom'
import { get } from '../fetch';
import { storeHost } from '../utils';
import {
    Filters,
    DataTable,
    TableData,
    Button,
    DatePicker,
    Popover,
    Box,
    Columns,
    Page
} from '@shopify/polaris';
import { useCallback, useState } from 'react';


export async function loader({ params, request }: LoaderFunctionArgs) {
    const page = new URL(request.url).searchParams.get('page') || 1;
    const search = new URL(request.url).searchParams.get('search') || '';
    const startDate = new URL(request.url).searchParams.get('start_date') || '';
    const endDate = new URL(request.url).searchParams.get('end_date') || '';

    return get("/stores/" + storeHost(params.storeUrl) + "/audits?page=" + page + "&search=" + search + "&start_date=" + startDate + "&end_date=" + endDate)
        .then(audits_page => {
            return audits_page
        });
}

type Audit = {
    id: string;
    description: string;
    inserted_at: string;
};

export default function Audits() {
    const store: any = useRouteLoaderData("root");

    const audits_page: any = useLoaderData();
    const audits: any = audits_page.data;

    const navigate = useNavigate();

    const rows: TableData[][] = audits.map(
        ({ description, inserted_at }: Audit, index: number) => (
            [
                <>
                    {<div dangerouslySetInnerHTML={{ __html: description }} />}
                </>,
                inserted_at
            ]
        ),
    );

    const [queryValue, setQueryValue] = useState('');

    const handleQueryValueRemove = useCallback(() => {
        setQueryValue('')
        navigateAuditsPage(1)
    }, []);

    const handleClearAll = useCallback(() => {
        handleQueryValueRemove();
    }, [handleQueryValueRemove]);

    const initialDate = new Date();

    const [{ month, year }, setDate] = useState({ month: initialDate.getMonth(), year: initialDate.getFullYear() });

    const [selectedStartDate, setSelectedStartDate] = useState(new Date())
    const [selectedEndDate, setSelectedEndDate] = useState(new Date())

    const handleSelectedDateChange = useCallback((data: any) => {
        setSelectedStartDate(data.start)
        setSelectedEndDate(data.end)
    }, [selectedStartDate, selectedEndDate])


    const handleSearchClick = useCallback(() => {
        // request new audits with filter and switch page to 1
        navigateAuditsPage(1)
    }, [queryValue, selectedStartDate, selectedEndDate]);


    const navigateAuditsPage = (page: number) => {
        let startDate = `${selectedStartDate.getFullYear()}-${(selectedStartDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedStartDate.getDate().toString().padStart(2, '0')}`
        let endDate = `${selectedEndDate.getFullYear()}-${(selectedEndDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedEndDate.getDate().toString().padStart(2, '0')}`
        navigate('/' + store.url + '?page=' + page + '&search=' + queryValue + "&start_date=" + startDate + "&end_date=" + endDate)
    }

    const handleMonthChange = useCallback(
        (month: number, year: number) => setDate({ month, year }),
        [],
    );

    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const activator = (
        <Button onClick={togglePopoverActive} disclosure>
            {selectedStartDate.toDateString()} to {selectedEndDate.toDateString()}
        </Button>
    );

    return (
        <Page
            title="Synkro logs"
            pagination={{
                hasPrevious: audits_page.page_number > 1,
                hasNext: audits_page.page_number < audits_page.total_pages,
                onNext: () => {
                    navigateAuditsPage(audits_page.page_number + 1)
                },
                onPrevious: () => {
                    navigateAuditsPage(audits_page.page_number - 1)
                }
            }}
        >
            <div style={{ padding: '16px' }}>
                <Filters
                    filters={[]}
                    queryValue={queryValue}
                    onQueryChange={setQueryValue}
                    onQueryClear={handleQueryValueRemove}
                    onClearAll={handleClearAll}
                    queryPlaceholder={'Filter logs'}
                    helpText={'Search your logs by entering a SKU, barcode, or any search value which appears in the log description. Date filters are applied using UTC time zone.'}
                >
                    <div style={{ paddingLeft: '8px' }}>
                        <Columns columns={['twoThirds', 'oneThird']} gap={'2'}>
                            <Popover
                                active={popoverActive}
                                activator={activator}
                                autofocusTarget="first-node"
                                onClose={togglePopoverActive}
                            >
                                <Popover.Pane>
                                    <Box padding="5">
                                        <DatePicker
                                            month={month}
                                            year={year}
                                            onChange={handleSelectedDateChange}
                                            onMonthChange={handleMonthChange}
                                            selected={{ start: selectedStartDate, end: selectedEndDate }}
                                            multiMonth
                                            allowRange
                                        />
                                    </Box>
                                </Popover.Pane>
                            </Popover>
                            <Button onClick={handleSearchClick} primary>
                                Search
                            </Button>
                        </Columns>
                    </div>
                </Filters>
            </div>
            <DataTable
                columnContentTypes={[
                    'text',
                    'text',
                ]}
                headings={[
                    'Description',
                    'Timestamp (UTC)'
                ]}
                rows={rows}
                footerContent={`Showing ${audits.length} of ${audits_page.total_entries} results`}
            />
        </Page>
    );
}