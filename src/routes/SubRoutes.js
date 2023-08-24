import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const VerifyPin = Loadable(lazy(() => import('pages/extra-pages/OneTimePassword')));
const VerifyPinFile = Loadable(lazy(() => import('pages/extra-pages/VerifyPin-File')));


// ==============================|| AUTH ROUTING ||============================== //

const SubRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 't/d/p/:link',
      element: <VerifyPin />
    },
    {
      path: 'f/d/p/:link',
      element: <VerifyPinFile />
    }
  ]
};

export default SubRoutes;
