import { AlphaStack, Button, ButtonGroup, Collapsible, Divider } from '@shopify/polaris';
import { useEffect, useState } from 'react';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import CheckForDuplicates from '../../components/CheckForDuplicates';
import ChooseSyncField from '../../components/ChooseSyncField';
import { post } from '../../fetch';
import { storeHost } from '../../utils';

export default function ManageSyncProperty() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    let revalidator = useRevalidator();

    const [syncProperty, setSyncProperty] = useState(store.user.sync_property);

    const [checking, setChecking] = useState(false);

    const [numberDuplicates, setNumberDuplicates] = useState(0);

    const [checkedOnce, setCheckedOnce] = useState(false);

    const [open, setOpen] = useState(false);

    const continueToNextStep = async () => {
        let syncPropertyReadable = syncProperty == 'sku' ? 'SKU' : 'barcode'
        if (numberDuplicates == 0 || window.confirm("You still have duplicated " + syncPropertyReadable + 's in your store. Variants with these ' + syncPropertyReadable + 's will have their inventory levels synced within the store. Are you sure you would like to proceed?')) {
            post("/user", { sync_property: syncProperty })
                .then(() => {
                    revalidator.revalidate();
                    navigate('/' + storeHost(store.url) + '/onboarding/location-connections')
                })
        }
    }

    const checkForDuplicates = () => {
        setOpen(true)
        setCheckedOnce(true)
    }

    useEffect(() => {
        setOpen(false)
        setCheckedOnce(false)
    }, [syncProperty])

    const onDuplicatePageLoad = (variantsPage: any) => {
        setNumberDuplicates(variantsPage.total_entries)
    }

    return (
        <AlphaStack gap="4">
            <ChooseSyncField syncProperty={syncProperty} onSyncPropertyChange={setSyncProperty} />

            <ButtonGroup>
                {checking ? (
                    <Button
                        disabled>
                        Checking for duplicated {syncProperty == 'sku' ? 'SKU' : 'barcode'}s within your store...
                    </Button>
                ) : (
                    <Button primary={!checkedOnce} onClick={() => checkForDuplicates()}>
                        Check for duplicated {syncProperty == 'sku' ? 'SKU' : 'barcode'}s within your store
                    </Button>
                )}
                {checkedOnce ? (
                    <Button primary onClick={() => continueToNextStep()}>
                        Save and continue to next step
                    </Button>
                ) : (
                    <Button disabled>
                        Save and continue to next step
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
                {checkedOnce ? (
                    <CheckForDuplicates syncProperty={syncProperty} onPageLoad={onDuplicatePageLoad} />
                ) : null}
            </Collapsible>
        </AlphaStack>
    );
}
