import './styles.css'
import { Container } from 'semantic-ui-react';
import NavBar from './Navbar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router';
import HomePage from "../../features/home/HomePage";
import { ToastContainer } from 'react-toastify';
import ModalContainer from '../common/modals/ModalContainer';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    }
    else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <ModalContainer />
      {
        (location.pathname === '/') ? <HomePage /> :
          (
            <>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Outlet />
              </Container>
            </>

          )

      }


    </>
  )
}

export default observer(App)