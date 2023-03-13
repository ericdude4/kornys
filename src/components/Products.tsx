import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom'
import { get } from '../fetch';

export async function loader({ params }: LoaderFunctionArgs) {
    let storeUrl = params.storeUrl || ""
    return get("/stores/" + storeUrl.replace(".myshopify.com", ""))
        .then(store => {
            return {
                url: store.url,
                name: store.name,
                connected_stores: store.connected_stores.map((connected_store: any) => { return { name: connected_store.name, url: connected_store.url } })
            }
        });
}

export default function Products() {
    const store: any = useLoaderData();
    return (
        <div>hello</div>

    );
}