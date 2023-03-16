import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from '../ErrorPage';
import Root, { loader as rootLoader } from '../routes/Root';
import Products, { loader as productLoader } from "../routes/Products";
import Home from "../routes/Home";
import Onboarding from "../routes/Onboarding";
import { action as loginAction } from "./Login";
import ConnectAccount from "./ConnectAccount";

function Main() {
  const router = createBrowserRouter([
    {
      path: "/:storeUrl",
      element: <Root />,
      errorElement: <ErrorPage />,
      loader: rootLoader,
      id: "root",
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "onboarding",
          element: <Onboarding />,
          children: [
            {
              path: "connect",
              element: <ConnectAccount/>,
              action: loginAction
            },
          ]
        },
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
