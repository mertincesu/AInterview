<template>
    <div class="question">
      <p>{{ question }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionComponent',
    props: {
      question: String
    }
  };
  </script>
  
  <style scoped>
  .question {
    font-size: 18px;
    color: #333;
  }
  </style>
  