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
import { loader as locationConnectionsLoader } from "./ConfigureLocationConnections";
import EnableSyncing from "../routes/Onboarding/EnableSyncing";
import CompleteOnboarding from "./CompleteOnboarding";
import CreateAccount, { action as createAccountAction } from "./CreateAccount";
import Settings from "../routes/Settings";
import { loader as auditLoader } from './Audits';

import { default as OnboardingLocationConnections } from "../routes/Onboarding/LocationConnections";
import { default as OnboardingSelectSyncProperties } from "../routes/Onboarding/SelectSyncProperties";
import { default as OnboardingManageSyncProperty } from "../routes/Onboarding/ManageSyncProperty";

import { default as SettingsLocationConnections } from "../routes/Settings/LocationConnections";
import { default as SettingsSelectSyncProperties } from "../routes/Settings/SelectSyncProperties";
import { default as SettingsManageSyncProperty } from "../routes/Settings/ManageSyncProperty";
import CloneOptions from "../routes/Settings/CloneOptions";

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
          element: <Home />,
          loader: auditLoader,
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
              element: <OnboardingManageSyncProperty />
            },
            {
              path: "location-connections",
              element: <OnboardingLocationConnections />,
              loader: locationConnectionsLoader
            },
            {
              path: "customize-syncing",
              element: <OnboardingSelectSyncProperties />
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
              element: <SettingsLocationConnections />,
              loader: locationConnectionsLoader
            },
            {
              path: "customize-syncing",
              element: <SettingsSelectSyncProperties />
            },
            {
              path: "choose-sync-field",
              element: <SettingsManageSyncProperty />
            },
            {
              path: "product-cloning",
              element: <CloneOptions />
            },
          ]
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Main;
