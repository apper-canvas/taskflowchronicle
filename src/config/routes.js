import Tasks from '@/components/pages/Tasks';
import Archive from '@/components/pages/Archive';
import Statistics from '@/components/pages/Statistics';

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  },
  statistics: {
    id: 'statistics',
    label: 'Statistics',
    path: '/statistics',
    icon: 'BarChart3',
    component: Statistics
  }
};

export const routeArray = Object.values(routes);
export default routes;