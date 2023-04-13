import { useEffect } from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { storeHost } from '../utils';

export default function Home() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    useEffect(() => {
        // TODO make this conditional based on onboarding staus
        if (store.completed_onboarding) {
            navigate('/' + storeHost(store.url) + '/onboarding')
        }
    }, [])

    return (
        <div>home</div>
    );
}
