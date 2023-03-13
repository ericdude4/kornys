import '@shopify/polaris/build/esm/styles.css';
import './App.scss';
import Main from './components/Main';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider } from '@shopify/polaris';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <Main />
    </AppProvider>
  );
}

export default App;
