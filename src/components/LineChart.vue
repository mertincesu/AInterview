<template>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  
  export default {
    name: 'LineChart',
    props: {
      chartData: {
        type: Object,
        required: true,
      },
      options: {
        type: Object,
        default: () => ({}),
      },
    },
    mounted() {
      this.renderChart();
    },
    methods: {
      renderChart() {
        new Chart(this.$refs.canvas.getContext('2d'), {
          type: 'line',
          data: this.chartData,
          options: this.options,
        });
      },
    },
  };
  </script>
  