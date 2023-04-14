import { Text, AlphaStack, Checkbox, Banner, ButtonGroup, Button } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import { storeHost } from '../utils';
import { useEffect, useState } from 'react';

export default function SyncOverrides() {
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
    const [productType, setProductType] = useState(store.user.sync_fields['product_type']);
    const [images, setImages] = useState(store.user.sync_fields['images']);
    const [status, setStatus] = useState(store.user.sync_fields['status']);
    const [publishedAt, setPublishedAt] = useState(store.user.sync_fields['published_at']);
    const [variants, setVariants] = useState(store.user.sync_fields['variants']);

    const syncProperty = store.user.sync_property == 'sku' ? 'SKU' : 'Barcode'

    useEffect(() => {
        let sync_fields = {
            sku: sku,
            cost: cost,
            tags: tags,
            price: price,
            title: title,
            images: images,
            status: status,
            barcode: barcode,
            variants: variants,
            body_html: description,
            product_type: productType,
            published_at: publishedAt,
            inventory_level: inventoryLevel,
            compare_at_price: compareAtPrice,
            inventory_policy: inventoryPolicy
        }

        post("/user", { sync_fields: sync_fields })
            .then(() => {
                revalidator.revalidate()
                console.log('ok')
            })
    }, [inventoryLevel, price, compareAtPrice, cost, inventoryPolicy, sku, barcode, title, description, tags, productType, images, status, publishedAt, variants])

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                What should Synkro <i>not</i> sync for {storeHost(store.url)}?
            </Text>

            <Text as="p">
                Select which properties that Synkro should not sync for the current store ({store.url}). This includes incoming and outgoing changes.
            </Text>

            <Checkbox label="Inventory level" checked={inventoryLevel} onChange={(value) => setInventoryLevel(value)} />
            <Checkbox label="Price" checked={price} onChange={(value) => setPrice(value)} />
            <Checkbox label="Compare at price" checked={compareAtPrice} onChange={(value) => setCompareAtPrice(value)} />
            <Checkbox label="Cost" checked={cost} onChange={(value) => setCost(value)} />
            <Checkbox label="Inventory policy (continue selling when out of stock)" checked={inventoryPolicy} onChange={(value) => setInventoryPolicy(value)} />
            <Checkbox label="SKU" checked={sku} onChange={(value) => setSku(value)} />
            <Checkbox label="Barcode" checked={barcode} onChange={(value) => setBarcode(value)} />
            <Checkbox label="Title" checked={title} onChange={(value) => setTitle(value)} />
            <Checkbox label="Description" checked={description} onChange={(value) => setDescription(value)} />
            <Checkbox label="Tags" checked={tags} onChange={(value) => setTags(value)} />
            <Checkbox label="Type" checked={productType} onChange={(value) => setProductType(value)} />
            <Checkbox label="Images" checked={images} onChange={(value) => setImages(value)} />
            <Checkbox label="Status (active, draft, archived)" checked={status} onChange={(value) => setStatus(value)} />
            <Checkbox label="Published on Online Store" checked={publishedAt} onChange={(value) => setPublishedAt(value)} />
            <Checkbox label="Variants" checked={variants} onChange={(value) => setVariants(value)} />
        </AlphaStack >
    );
}
