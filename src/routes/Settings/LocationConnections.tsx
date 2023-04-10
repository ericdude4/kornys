import { useNavigate, useRouteLoaderData } from 'react-router-dom';

export default function LocationConnections() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <div>Location connections</div>
    );
}
