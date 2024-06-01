<template>
    <div class="resume-container">
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Upload Resume</h4>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <input type="file" @change="handleFileUpload" accept="application/pdf" required />
            </div>
            <button type="submit" class="btn btn-primary mt-3">Submit</button>
          </form>
          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="questions.length" class="questions-list">
            <h4>Generated Questions:</h4>
            <ul>
              <li v-for="(question, index) in questions" :key="index">{{ question }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'Resume',
    data() {
      return {
        file: null,
        error: '',
        questions: [],
      };
    },
    methods: {
      handleFileUpload(event) {
        this.file = event.target.files[0];
      },
      async handleSubmit() {
        if (!this.file) {
          this.error = 'Please upload a PDF file.';
          return;
        }
  
        const formData = new FormData();
        formData.append('resume', this.file);
  
        try {
          const response = await axios.post('http://localhost:3000/analyze-resume', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          this.questions = response.data.questions;
          this.error = '';
        } catch (error) {
          console.error('Error:', error);
          this.error = 'Error analyzing resume.';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .resume-container {
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-image: linear-gradient(to right, #1c92d2, #23a997);
  }
  
  .main-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  .card-container {
    width: 60%;
    max-width: 600px;
    padding: 50px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    color: #317ddf;
    margin-bottom: 20px;
    font-size: 25px;
    text-transform: uppercase;
    font-weight: bold;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .error-message {
    color: red;
    margin-top: 20px;
  }
  
  .questions-list {
    margin-top: 20px;
    text-align: left;
  }
  </style>
  