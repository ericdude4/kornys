import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from '../ErrorPage';
import Root, { loader as rootLoader } from '../routes/Root';
import Products, { loader as productLoader } from "../routes/Products";
import Home from "../routes/Home";
import Onboarding from "../routes/Onboarding";
import Login, { action as loginAction } from "./Login";
import ConnectAccount from "./ConnectAccount";
import ChooseSyncField from "./ChooseSyncField";
import ConfigureLocationConnections, { loader as locationConnectionsLoader } from "./ConfigureLocationConnections";
import EnableSyncing from "./EnableSyncing";
import CompleteOnboarding from "./CompleteOnboarding";
import SelectSyncProperties from "./SelectSyncProperties";
import CreateAccount, { action as createAccountAction } from "./CreateAccount";
import Settings from "../routes/Settings";
import LocationConnections from "../routes/Settings/LocationConnections";

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
              element: <ConnectAccount />,
              children: [
                {
                  path: "",
                  element: <Login scopedRedirectAfter={'/onboarding/connect'} />,
                },
                {
                  path: "create",
                  element: <CreateAccount scopedRedirectAfter={'/onboarding/connect'} />,
                  action: createAccountAction,
                }
              ],
              action: loginAction
            },
            {
              path: "choose-sync-field",
              element: <ChooseSyncField />
            },
            {
              path: "location-connections",
              element: <ConfigureLocationConnections />,
              loader: locationConnectionsLoader
            },
            {
              path: "customize-syncing",
              element: <SelectSyncProperties />
            },
            {
              path: "enable-syncing",
              element: <EnableSyncing />
            },
            {
              path: "complete",
              element: <CompleteOnboarding />
            },
          ]
        },
        {
          path: "products",
          element: <Products />,
          loader: productLoader,
        },
        {
          path: "settings",
          element: <Settings />,
          children: [
            {
              path: "location-connections",
              element: <LocationConnections />
            },
          ]
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Main;
