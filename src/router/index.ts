import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Layout from '../views/Layout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    redirect: '/admin/users/list',
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/users/list',
    children: [
      {
        path: 'users/list',
        name: 'UserList',
        component: () => import('../views/UserList.vue'),
      },
      {
        path: 'users/admin',
        name: 'AdminList',
        component: () => import('../views/AdminList.vue'),
      },
      {
        path: 'audit/list',
        name: 'AuditLogs',
        component: () => import('../views/AuditLogs.vue'),
      },
      {
        path: 'auth/clients',
        name: 'ClientList',
        component: () => import('../views/ClientList.vue'),
      },
      {
        path: 'settings/config',
        name: 'SystemConfig',
        component: () => import('../views/SystemConfig.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  if (to.path !== '/login' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
