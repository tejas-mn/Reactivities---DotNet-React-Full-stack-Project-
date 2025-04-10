import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/layout/styles.css'
import 'react-calendar/dist/Calendar.css'
import "react-toastify/ReactToastify.min.css"
import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css'
import { store, StoreContext } from './app/stores/store';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';
import { createBrowserHistory } from 'history';  

export const history = createBrowserHistory();

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <StoreContext.Provider value={store}>
      <RouterProvider router={router}/>
    </StoreContext.Provider>

  </StrictMode>
)
