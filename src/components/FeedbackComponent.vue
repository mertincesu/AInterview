<template>
    <div class="feedback">
      <p>{{ feedback }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeedbackComponent',
    props: {
      feedback: String
    }
  };
  </script>
  
  <style scoped>
  .feedback {
    margin-top: 20px;
    padding: 10px;
    background-color: #dff0d8;
    border: 1px solid #d6e9c6;
    border-radius: 5px;
  }
  </style>
  