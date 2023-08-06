// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const newMenu = {
  id: 'menu',
  title: 'Menu',
  type: 'group',
  children: [
    {
      id: 'text',
      title: 'Text',
      type: 'item',
      url: '/',
    },
    {
      id: 'file',
      title: 'File',
      type: 'item',
      url: '/file',
    },
    {
      id: 'chat',
      title: 'Chat',
      type: 'item',
      url: '/chat',
      external: true,
      target: true
    },
    {
      id: 'password',
      title: 'Password',
      type: 'item',
      url: '/password',
      external: true,
      target: true
    },
    {
      id: 'rsa-enc-dec',
      title: 'RSA Enc/Dec',
      type: 'item',
      url: '/rsa-enc-dec',
      external: true,
      target: true
    },
    {
      id: 'base-64',
      title: 'Base64',
      type: 'item',
      url: '/base-64',
      external: true,
      target: true
    }
  ]
};

export default newMenu;
