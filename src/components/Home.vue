<template>
    <div class="home-container">
      <h2>Select a Field</h2>
      <button @click="selectField('finance')">Finance</button>
      <button @click="selectField('marketing')">Marketing</button>
      <button @click="selectField('software')">Software</button>
      <button @click="selectField('design')">Design</button>
      <button @click="selectField('sales')">Sales</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
    methods: {
      selectField(field) {
        this.$emit('field-selected', field);
      },
    },
  };
  </script>
  
  <style scoped>
  .home-container {
    text-align: center;
    margin: 20px;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 10px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  