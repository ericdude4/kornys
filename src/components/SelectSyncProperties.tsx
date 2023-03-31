import { Text, AlphaStack, Button, ButtonGroup, ChoiceList, Checkbox } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import Switch from "react-switch";
import { storeHost } from '../utils';
import { useCallback, useEffect, useState } from 'react';

export default function SelectSyncProperties() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();
    const navigate = useNavigate();

    const [inventoryLevel, setInventoryLevel] = useState(store.user.sync_fields['inventory_level']);
    const [price, setPrice] = useState(store.user.sync_fields['price']);
    const [compareAtPrice, setCompareAtPrice] = useState(store.user.sync_fields['compare_at_price']);
    const [cost, setCost] = useState(store.user.sync_fields['cost']);
    const [inventoryPolicy, setInventoryPolicy] = useState(store.user.sync_fields['inventory_policy']);
    const [sku, setSku] = useState(store.user.sync_fields['sku']);
    const [barcode, setBarcode] = useState(store.user.sync_fields['barcode']);
    const [title, setTitle] = useState(store.user.sync_fields['title']);
    const [description, setDescription] = useState(store.user.sync_fields['body_html']);
    const [tags, setTags] = useState(store.user.sync_fields['tags']);
    const [customType, setCustomType] = useState(store.user.sync_fields['product_type']);
    const [images, setImages] = useState(store.user.sync_fields['images']);
    const [status, setStatus] = useState(store.user.sync_fields['status']);
    const [publishedAt, setPublishedAt] = useState(store.user.sync_fields['published_at']);
    const [variants, setVariants] = useState(store.user.sync_fields['variants']);

    const handleToggle = async () => {
        await post("/stores/" + storeHost(store.url), { sync_products: !store.sync_products })
            .then((_store) => {
                revalidator.revalidate()
            })
    }

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                What should Synkro sync?
            </Text>

            <Text as="p">
                Configure exactly which product and variant properties that Synkro should sync between your products. If syncing on a property is disabled, Synkro will not sync that property between your products.
            </Text>

            <Text variant="headingLg" as="h5">
                Variant properties
            </Text>

            <Text as="p">
                Variant properties will be synced within and between your connected stores based on the changed variant's {store.user.sync_property}. In order to sync inventory levels, ensure you have configured your Location Connections setting.
            </Text>

            <Checkbox label="Inventory level" checked={inventoryLevel} onChange={(value) => setInventoryLevel(value)} />

        </AlphaStack >
    );
}
