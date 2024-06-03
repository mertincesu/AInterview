<template>
    <div class="circular-progress">
      <svg viewBox="0 0 36 36" class="circular-chart">
        <path class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path class="circle"
          :stroke="strokeColor"
          :stroke-dasharray="dashArray"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" class="percentage">{{ percentage }}%</text>
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CircularProgressBar',
    props: {
      percentage: {
        type: Number,
        required: true
      }
    },
    computed: {
      dashArray() {
        const circumference = 2 * Math.PI * 15.9155;
        const offset = ((100 - this.percentage) / 100) * circumference;
        return `${circumference - offset} ${offset}`;
      },
      strokeColor() {
        if (this.percentage < 50) {
          return '#d9534f'; // Red color for negative sentiment
        } else if (this.percentage < 75) {
          return '#f0ad4e'; // Orange color for neutral sentiment
        } else {
          return '#5cb85c'; // Green color for positive sentiment
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .circular-progress {
    display: block;
    margin: 10px auto;
    max-width: 80%;
    max-height: 250px;
  }
  
  .circular-chart {
    display: block;
    margin: 10px auto;
    max-width: 80%;
    max-height: 100px;
  }
  
  .circle-bg {
    fill: none;
    stroke: #eee;
    stroke-width: 3.8;
  }
  
  .circle {
    fill: none;
    stroke-width: 2.8;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }
  
  .percentage {
    fill: #666;
    font-family: sans-serif;
    font-size: 0.5em;
    text-anchor: middle;
  }
  
  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }
  </style>
  