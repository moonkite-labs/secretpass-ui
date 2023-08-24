import { useRoutes } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import SubRoutes from './SubRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, SubRoutes]);
}
