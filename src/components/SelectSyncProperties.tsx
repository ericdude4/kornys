import { Text, AlphaStack, Checkbox, Banner, ButtonGroup, Button } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import { storeHost } from '../utils';
import { useEffect, useState } from 'react';

export default function SelectSyncProperties() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();
    const navigate = useNavigate();

    const [inventoryLevel, setInventoryLevel] = useState(store.user.sync_fields['inventory_level']);
    const [price, setPrice] = useState(store.user.sync_fields['price']);
    const [compareAtPrice, setCompareAtPrice] = useState(store.user.sync_fields['compare_at_price']);
    const [cost, setCost] = useState(store.user.sync_fields['cost']);
    const [inventoryPolicy, setInventoryPolicy] = useState(store.user.sync_fields['inventory_policy']);
    const [weight, setWeight] = useState(store.user.sync_fields['weight']);
    const [weightUnit, setWeightUnit] = useState(store.user.sync_fields['weight_unit']);
    const [options, setOptions] = useState(store.user.sync_fields['option1']);
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
    const [variantDeletion, setVariantDeletion] = useState(store.user.sync_fields['variant_deletion']);

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
            inventory_policy: inventoryPolicy,
            weight: weight,
            weight_unit: weightUnit,
            option1: options,
            option2: options,
            option3: options,
            variant_deletion: variantDeletion
        }

        post("/user", { sync_fields: sync_fields })
            .then(() => {
                revalidator.revalidate()
            })
    }, [inventoryLevel, price, compareAtPrice, cost, inventoryPolicy, sku, weight, weightUnit, options, barcode, title, description, tags, productType, images, status, publishedAt, variants, variantDeletion])

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                What should Synkro sync between your stores?
            </Text>

            <Text as="p">
                Configure exactly which product and variant properties that Synkro should sync between your stores. This setting applies to all stores which you connect to your Synkro account.
            </Text>

            <Text variant="headingLg" as="h5">
                {syncProperty}-based syncable properties
            </Text>

            <Text as="p">
                These selected variant properties will be synced to other variants within and between your connected stores which have the same {syncProperty}. In order to sync inventory levels, ensure you have configured your Location Connections setting.
            </Text>

            <Checkbox label="Inventory level" checked={inventoryLevel} onChange={(value) => setInventoryLevel(value)} />
            <Checkbox label="Price" checked={price} onChange={(value) => setPrice(value)} />
            <Checkbox label="Compare at price" checked={compareAtPrice} onChange={(value) => setCompareAtPrice(value)} />
            <Checkbox label="Cost" checked={cost} onChange={(value) => setCost(value)} />
            <Checkbox label="Inventory policy (continue selling when out of stock)" checked={inventoryPolicy} onChange={(value) => setInventoryPolicy(value)} />
            <Checkbox label="Weight" checked={weight} onChange={(value) => setWeight(value)} />
            <Checkbox label="Weight unit (lb, oz, kg, g)" checked={weightUnit} onChange={(value) => setWeightUnit(value)} />
            <Checkbox label="Options" checked={options} onChange={(value) => setOptions(value)} />

            <Text variant="headingLg" as="h5">
                Product syncable properties
            </Text>

            <Text as="p">
                Select which product properties you would like Synkro to sync between your stores.
            </Text>

            <Banner
                title="A note about product property syncing"
                status="info"
            >
                <Text as="p">
                    Synkro can only sync product properties from a "parent" product to a "child" product. When a product is created via Synkro's "Clone Product" tool, it becomes the "child" product and will be kept in sync with the "parent" product from the origin store.
                    <br />
                    <br />
                    If you have existing products in your stores which were not created via Synkro's "Product Clone" tool and would like product property syncing, please reach out to Synkro customer support and we will be happy to assist you.
                </Text>
            </Banner>

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
            <Checkbox label="Variant deletion" checked={variantDeletion} onChange={(value) => setVariantDeletion(value)} />
        </AlphaStack >
    );
}
