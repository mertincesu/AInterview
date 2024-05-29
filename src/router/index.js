// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import InterviewComponent from '../components/InterviewComponent.vue';
import About from '../components/About.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
