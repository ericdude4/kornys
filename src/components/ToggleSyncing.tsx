import { Text, AlphaStack, Button, ButtonGroup } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import Switch from "react-switch";
import { storeHost } from '../utils';

export default function ToggleSyncing() {
    const store: any = useRouteLoaderData("root");
    let revalidator = useRevalidator();

    const handleToggle = async () => {
        await post("/stores/" + storeHost(store.url), { sync_products: !store.sync_products })
            .then((_store) => {
                revalidator.revalidate()
            })
    }

    return (
        <Switch
            onChange={handleToggle}
            checked={store.sync_products}
            checkedIcon={<div className='sync-toggle-text-enabled'>Syncing</div>}
            uncheckedIcon={<div className='sync-toggle-text-disabled'>Disabled</div>}
            // translated var(--p-action-primary) to hex
            onColor="#008060"
            handleDiameter={29}
            width={130}
            height={35} />
    );
}
