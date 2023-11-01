// assets
import { IconUsers } from '@tabler/icons';

// constant
const icons = { IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const employees = {
  id: 'employees',
  title: 'Employees',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Authorize Employees',
      type: 'item',
      url: '/Employees',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
  ]
};

export default employees;
