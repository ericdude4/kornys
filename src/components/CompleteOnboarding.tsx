import { Text, AlphaStack, Button, ButtonGroup } from '@shopify/polaris';
import { useNavigate, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { post } from '../fetch';
import Switch from "react-switch";
import { storeHost } from '../utils';

export default function CompleteOnboarding() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <AlphaStack gap="4">
            <Text variant="heading2xl" as="h3">
                Congratulations!
            </Text>

            <Text as="p">
                You have completed onboarding for {store.name}. See below for some more helpful resources.
            </Text>
        </AlphaStack >
    );
}
