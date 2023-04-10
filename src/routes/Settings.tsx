import { Outlet, useNavigate, useOutlet, useRouteLoaderData } from 'react-router-dom';

export default function Settings() {
    const store: any = useRouteLoaderData("root");
    const navigate = useNavigate();
    const outlet = useOutlet()

    console.log(outlet)
    return (
        <>
            {outlet ? outlet : "placeholder"}
        </>
    )
}
