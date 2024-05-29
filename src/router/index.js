// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import InterviewComponent from '../components/InterviewComponent.vue';
import About from '../components/About.vue';
import Join from '../components/Join.vue';
import Newacc from '../components/Newacc.vue';
import Dashboard from '../components/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/interview/:field/:subField',
    name: 'interview',
    component: InterviewComponent,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/join',
    name: 'join',
    component: Join
  },
  {
    path: '/newacc',
    name: 'newacc',
    component: Newacc
  },
  {
    path: '/dashboard',
    name: 'diashboard',
    component: Dashboard
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
