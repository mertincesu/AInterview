<template>
    <div class="sentiment-container">
      <div class="card text-center p-4 card-container">
        <h4 class="card-title">SENTIMENT ANALYSIS</h4>
        <textarea v-model="textInput" rows="5" class="form-control mb-3"></textarea>
        <button @click="analyzeSentiment" class="btn btn-primary mt-3">Submit</button>
        <div v-if="sentimentResult" class="mt-3">
          <h5>Sentiment Analysis Result:</h5>
          <pre>{{ sentimentResult }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Sentiment',
    data() {
      return {
        textInput: '',
        sentimentResult: null,
      };
    },
    methods: {
      async analyzeSentiment() {
        try {
          const response = await axios.post('http://localhost:3000/sentiment', { text: this.textInput });
          console.log('Sentiment Analysis Result:', response.data.sentimentAnalysis);
          this.sentimentResult = response.data.sentimentAnalysis;
        } catch (error) {
          console.error('Error analyzing sentiment:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .sentiment-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: linear-gradient(to right, #1c92d2, #23a997);
  }
  
  .card-container {
    width: 500px;
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.7s ease-in-out;
  }
  
  .card-title {
    color: #317ddf;
    margin-bottom: 20px;
    font-size: 21px;
    text-transform: uppercase;
    font-weight: bold;
  }
  
  .form-control {
    width: 100%;
    height: 100px;
  }
  
  .btn-primary {
    width: 100%;
    padding: 10px 0;
    font-size: 1em;
    font-weight: bold;
    background-color: #317ddf;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary:hover {
    background-color: #2568c1;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  