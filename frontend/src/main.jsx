import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import ContextProvider from './ContextProvider.jsx';
import store from './redux/store';
import { Provider } from 'react-redux';


createRoot(document.getElementById('root')).render(
<StrictMode>
<Provider store={store}>
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>
</Provider>
</StrictMode>

)
