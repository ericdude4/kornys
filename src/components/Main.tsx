import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import ErrorPage from '../ErrorPage';
import Root, {loader as rootLoader} from '../routes/Root';
import Products from "./Products";

function Main() {
    const router = createBrowserRouter([
        {
            path: "/:storeUrl",
            element: <Root />,
            errorElement: <ErrorPage />,
            loader: rootLoader,
            children: [
              {
                path: "products",
                element: <Products />,
              },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default Main;
