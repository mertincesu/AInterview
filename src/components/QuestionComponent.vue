<template>
    <div class="question">
      <p>{{ question }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QuestionComponent',
    props: {
      question: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .question {
    font-size: 18px;
    margin-bottom: 20px;
  }
  </style>
  