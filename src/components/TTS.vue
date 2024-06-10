<template>
    <div class="tts-container">
      <h2>Text to Speech</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="text-input">Enter Text:</label>
          <input type="text" v-model="text" id="text-input" required />
        </div>
        <button type="submit">Convert to Speech</button>
      </form>
      <div v-if="audioUrl">
        <h3>Audio Output</h3>
        <audio :src="audioUrl" controls autoplay></audio>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TTS',
    data() {
      return {
        text: '',
        audioUrl: null,
      };
    },
    methods: {
      async handleSubmit() {
        try {
          const response = await axios.post('http://localhost:3000/text-to-speech', { text: this.text }, { responseType: 'blob' });
  
          // Create a URL for the audio file received from the server
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
          this.audioUrl = URL.createObjectURL(audioBlob);
        } catch (error) {
          console.error('Error converting text to speech:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .tts-container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  form {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #317ddf;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2568c1;
  }
  
  audio {
    margin-top: 20px;
    width: 100%;
  }
  </style>
  