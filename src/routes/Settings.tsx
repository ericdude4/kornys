import { useNavigate, useRouteLoaderData } from 'react-router-dom';

export default function Settings() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();

    return (
        <div>settings</div>
    );
}