import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from '../ErrorPage';
import Root, { loader as rootLoader } from '../routes/Root';
import Products, { loader as productLoader } from "../routes/Products";

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
          loader: productLoader,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Main;
