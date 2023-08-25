import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const VerifyPinText = Loadable(lazy(() => import('pages/extra-pages/OneTimePassword')));
const VerifyPinFile = Loadable(lazy(() => import('pages/extra-pages/VerifyPin-File')));
const SecretMessage = Loadable(lazy(() => import('pages/extra-pages/SecretMessage')));
const SecretFile = Loadable(lazy(() => import('pages/extra-pages/SecretFile')));

// ==============================|| AUTH ROUTING ||============================== //

const SubRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 't/d/:link',
      element: <SecretMessage />
    },
    {
      path: 'f/d/:link',
      element: <SecretFile />
    },
    {
      path: 't/d/p/:link',
      element: <VerifyPinText />
    },
    {
      path: 'f/d/p/:link',
      element: <VerifyPinFile />
    }
  ]
};

export default SubRoutes;
