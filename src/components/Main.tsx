import React from 'react';
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from '../ErrorPage';
import Root, {loader as rootLoader} from '../routes/Root';

function Main() {
    const router = createBrowserRouter([
        {
            path: "/:storeUrl",
            element: <Root />,
            errorElement: <ErrorPage />,
            loader: rootLoader
        },
    ]);

    return <RouterProvider router={router} />;
}

export default Main;
