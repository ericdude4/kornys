import { Text, AlphaStack, Checkbox, Banner, ButtonGroup, Button, Combobox, TextContainer, LegacyStack, Listbox, Icon, Tag } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import { storeHost } from '../utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CircleDisableMinor } from '@shopify/polaris-icons';


export default function SyncOverrides() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();
    const navigate = useNavigate();

    const allOptions = [
        { value: 'sku', label: 'SKU' },
        { value: 'cost', label: 'Cost' },
        { value: 'tags', label: 'Tags' },
        { value: 'price', label: 'Price' },
        { value: 'title', label: 'Title' },
        { value: 'images', label: 'Images' },
        { value: 'status', label: 'Status' },
        { value: 'barcode', label: 'Barcode' },
        { value: 'variants', label: 'Variants' },
        { value: 'body_html', label: 'Description' },
        { value: 'product_type', label: 'Product type' },
        { value: 'published_at', label: 'Published on Online Store' },
        { value: 'inventory_level', label: 'Inventory Level' },
        { value: 'compare_at_price', label: 'Compare at price' },
        { value: 'inventory_policy', label: 'Inventory policy (Continue selling when out of stock)' },
        { value: 'weight', label: 'Weight' },
        { value: 'weight_unit', label: 'Weight unit' },
        { value: 'options', label: 'Options' },
        { value: 'variant_deletion', label: 'Variant deletion' }
    ]

    const deselectedOptions = useMemo(
        () => allOptions,
        [],
    );

    const [selectedOptions, setSelectedOptions] = useState<string[]>(Object.keys(store.sync_fields_override));

    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(deselectedOptions);

    const updateText = useCallback(
        (value: string) => {
            setInputValue(value);

            if (value === '') {
                setOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex),
            );
            setOptions(resultOptions);
        },
        [deselectedOptions],
    );

    const updateRemoteSyncOverrides = async (selectedOptions: string[]) => {
        let newSyncOverrides: { [key: string]: Boolean } = {}
        selectedOptions.map((option: string) => {
            if (option == 'options') {
                newSyncOverrides['option1'] = false
                newSyncOverrides['option2'] = false
                newSyncOverrides['option3'] = false
            } else {
                newSyncOverrides[option] = false
            }
        })

        await post("/stores/" + storeHost(store.url), { sync_fields_override: newSyncOverrides })
            .then((store) => {
                setSelectedOptions(Object.keys(store.sync_fields_override))
            })
    }

    const updateSelection = useCallback(
        (selected: string) => {
            let newSelectedOptions;
            if (selectedOptions.includes(selected)) {
                newSelectedOptions = selectedOptions.filter((option) => option !== selected)
            } else {
                newSelectedOptions = [...selectedOptions, selected];
            }

            updateRemoteSyncOverrides(newSelectedOptions)

            updateText('');
        },
        [selectedOptions, updateText],
    );

    const removeTag = useCallback(
        (tag: string) => () => {
            const options = [...selectedOptions];
            options.splice(options.indexOf(tag), 1);

            updateRemoteSyncOverrides(options)
            setSelectedOptions(options);
        },
        [selectedOptions],
    );

    const tagsMarkup = selectedOptions.map((option) => {
        let optionForTag = allOptions.find(({ value }) => value == option)

        return (<Tag key={`option-${option}`} onRemove={removeTag(option)}>
            {optionForTag?.label}
        </Tag>)
    });


    const optionsMarkup =
        options.length > 0
            ? options.map((option) => {
                const { label, value } = option;

                return (
                    <Listbox.Option
                        key={`${value}`}
                        value={value}
                        selected={selectedOptions.includes(value)}
                        accessibilityLabel={label}
                    >
                        {label}
                    </Listbox.Option>
                );
            })
            : null;

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                What should Synkro <i>not</i> sync for {storeHost(store.url)}?
            </Text>

            <Text as="p">
                Select which properties that Synkro should not sync for the current store ({store.url}). This includes incoming and outgoing changes.
            </Text>

            {selectedOptions.length > 0 ? (
                <AlphaStack gap="2">
                    <Text variant="headingSm" as="h6">
                        Syncing currently disabled for:
                    </Text>
                    <LegacyStack>{tagsMarkup}</LegacyStack>
                </AlphaStack>
            ) : null}

            <Combobox
                allowMultiple
                activator={
                    <Combobox.TextField
                        prefix={<Icon
                            source={CircleDisableMinor}
                            color="base"
                        />}
                        onChange={updateText}
                        label="Select properties to disable"
                        labelHidden
                        value={inputValue}
                        placeholder="Select properties to disable"
                        autoComplete="off"
                    />
                }
            >
                {optionsMarkup ? (
                    <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
                ) : null}
            </Combobox>
        </AlphaStack >
    );
}
