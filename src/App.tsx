import '@shopify/polaris/build/esm/styles.css';
import './App.scss';
import Main from './components/Main';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';
import { initFetch } from './fetch';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  initFetch(urlParams.get('token') || "no access token provided")
  return (
    <AppProvider i18n={enTranslations}>
      <Main />
    </AppProvider>
  );
}

export default App;
