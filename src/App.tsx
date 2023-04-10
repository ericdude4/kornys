import '@shopify/polaris/build/esm/styles.css';
import './App.scss';
import Main from './components/Main';
import { initFetch } from './fetch';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  initFetch(urlParams.get('token') || "no access token provided")
  return (
    <Main />
  );
}

export default App;
