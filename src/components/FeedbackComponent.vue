<template>
    <div class="feedback">
      <p>{{ feedback }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeedbackComponent',
    props: {
      feedback: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .feedback {
    margin-top: 20px;
    font-size: 16px;
    color: #333;
  }
  </style>
  