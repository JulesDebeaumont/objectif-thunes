import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'root', path: '', redirect: 'home' },
      { name: 'home', path: 'home', component: () => import('pages/evolutions/AllEvolutionsPage.vue') },
      { name: 'config', path: 'config', component: () => import('pages/config-thune/ConfigThunePage.vue') },
      { name: 'about', path: 'about', component: () => import('pages/other/AboutPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
