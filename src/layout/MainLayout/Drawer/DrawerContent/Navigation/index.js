// material-ui
import { Box } from '@mui/material';
// import { useLocation } from 'react-router-dom';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  console.log(menuItem);
  const navGroups = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
       case 'item':
          return '<NavGroup key={item.id} item={item} />';
      // case 'item':
      // if (item.id === 'file') {
      //   return <FileMenuItem key={item.id} item={item} />;
      // }
      // Handle other menu item types here
      // return (
      //   <Typography key={item.id} variant="h6" color="error" align="center">
      //     Fix - Navigation Group
      //   </Typography>
      // );
      default:
        return null;
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

// const FileMenuItem = ({ item }) => {
//   const location = useLocation();
//   const isActiveFileItem = location.pathname === item.url || location.pathname === 'f/d/p/';

//   return (
//     <Typography key={item.id} variant="h6" color={isActiveFileItem ? 'primary' : 'textPrimary'} align="center">
//       {item.title}
//     </Typography>
//   );
// };

export default Navigation;
