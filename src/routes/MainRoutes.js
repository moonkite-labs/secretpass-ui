import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
//
// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const TextPage = Loadable(lazy(() => import('pages/extra-pages/TextPage')));
const FilePage = Loadable(lazy(() => import('pages/extra-pages/FilePage')));
const OneTimePassword = Loadable(lazy(() => import('pages/extra-pages/OneTimePassword')));
const SecretMessage = Loadable(lazy(() => import('pages/extra-pages/SecretMessage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/default',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <TextPage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
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
