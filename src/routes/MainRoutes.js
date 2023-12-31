import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
//

// render - sample page
const TextPage = Loadable(lazy(() => import('pages/extra-pages/TextPage')));
const FilePage = Loadable(lazy(() => import('pages/extra-pages/FilePage')));

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
      element: <FilePage />
    },
    {
      path: 'chat',
      element: <TextPage />
    },
    // {
    //   path: 'otp',
    //   element: <OneTimePassword />
    // },
    // {
    //   path: 't/d/p/:link',
    //   element: <OneTimePassword />
    // },
    // {
    //   path: 'f/d/p/:link',
    //   element: <OneTimePassword />
    // },
    // {
    //   path: 't/d/:link',
    //   element: <SecretMessage />
    // }
  ]
};

export default MainRoutes;
