import { createApp } from 'vue';
import App from './App.vue';
import './assets/style.css'; // Add this line
import Chart from 'chart.js/auto';
import { registerables } from 'chart.js';
Chart.register(...registerables);

createApp(App).mount('#app');
