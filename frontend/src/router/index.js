import { createRouter, createWebHistory } from 'vue-router';
import authRoutes from './modules/auth';
import dashboardRoutes from './modules/dashboard';
import inventoryRoutes from './modules/inventory';
import salesRoutes from './modules/sales';

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...inventoryRoutes,
  ...salesRoutes,
];

export const router = createRouter({
  history: createWebHistory('/'),
  linkActiveClass: 'active',
  routes,
});

router.beforeEach((to, from, next) => {
  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Continue with the navigation
  next();
});
