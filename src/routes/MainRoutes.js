import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
//

// render - sample page
const TextPage = Loadable(lazy(() => import('pages/extra-pages/TextPage')));
// const FilePage = Loadable(lazy(() => import('pages/extra-pages/FilePage')));
const OneTimePassword = Loadable(lazy(() => import('pages/extra-pages/OneTimePassword')));
const SecretMessage = Loadable(lazy(() => import('pages/extra-pages/SecretMessage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'sample-page',
      element: <TextPage />
    },
    {
      path: '/',
      element: <TextPage />
    },
    {
      path: 'file',
      // element: <FilePage />
      element: <TextPage />
    },
    {
      path: 'chat',
      element: <TextPage />
    },
    {
      path: 'otp',
      element: <OneTimePassword />
    },
    {
      path: 'secret-message',
      element: <SecretMessage />
    }
  ]
};

export default MainRoutes;
