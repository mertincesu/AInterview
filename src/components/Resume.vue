<template>
  <div class="resume-container">
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container" ref="cardContainer">
        <template v-if="!questionsGenerated">
          <h4 class="card-title">RESUME-BASED QUESTIONS</h4>
          <div class="upload-section">
            <label for="field-input">Enter Your Applied Job Position:</label>
            <input type="text" id="field-input" v-model="selectedField" placeholder="e.g., Software, Data Science, Marketing" />
            <label for="level-select">Select Your Experience Level:</label>
            <select id="level-select" v-model="selectedLevel">
              <option value="professional">Middle School</option>
              <option value="professional">High School</option>
              <option value="professional">University</option>
              <option value="internship">Internship</option>
              <option value="entry">Entry Level</option>
              <option value="entry">Professional</option>
              <option value="professional">Experienced Professional</option>
              <option value="entry">Expert</option>
            </select>
            <label>Upload Your Resume / CV</label>
            <input type="file" @change="handleFileUpload" />
          </div>
          <button class="submit-button" @click="generateQuestions" :disabled="!cvFile">Submit</button>
        </template>
        <template v-else>
          <button class="nav-button" @click="previousQuestion" :disabled="currentQuestionIndex === 0">Previous</button>
          <h4 class="card-title">{{ selectedField }} - {{ selectedLevel }}</h4>
          <div class="question-section">
            <p v-if="!questions.length">Loading...</p>
            <p v-if="questions.length && !currentQuestion">No questions available.</p>
            <p v-if="currentQuestion">{{ currentQuestion }}</p>
          </div>
          <div class="button-container">
            <button class="record-button" @click="toggleRecording">
              {{ isRecording ? `Stop Recording (${timeLeft}s)` : 'Record Answer' }}
            </button>
            <button class="nav-button" @click="nextQuestion" :disabled="currentQuestionIndex === questions.length - 1">Next</button>
          </div>
          <div v-if="audioURL" class="audio-container">
            <audio :src="audioURL" controls></audio>
          </div>
          <div v-if="loading" class="loading-spinner"></div>
          <div v-if="!loading">
            <div v-if="feedback" class="feedback" ref="feedback">
              {{ feedback }}
            </div>
            <div v-if="error" class="error">
              {{ error }}
            </div>
            <div class="scores">
              <div class="score-container">
                <h5 class="score-title" v-if="scoreFeedback !== null">Score</h5>
                <CircularProgressBar v-if="scoreFeedback !== null" :percentage="scoreFeedback" />
              </div>
              <div class="score-container">
                <h5 class="score-title" v-if="sentimentAnalysis !== null">Sentiment</h5>
                <CircularProgressBar v-if="sentimentAnalysis !== null" :percentage="sentimentAnalysis" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CircularProgressBar from './CircularProgressBar.vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default {
  name: 'ResumeComponent',
  components: { CircularProgressBar },
  data() {
    return {
      cvFile: null,
      questions: [],
      currentQuestionIndex: 0,
      feedback: '',
      error: '',
      isRecording: false,
      recorded: false,
      mediaRecorder: null,
      audioChunks: [],
      audioURL: null,
      transcript: '',
      timeLeft: 30,
      countdownTimer: null,
      questionsGenerated: false,
      selectedField: '',
      selectedLevel: 'internship',
      sentimentAnalysis: null,
      scoreFeedback: null,
      loading: false, // Added loading state
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
  },
  methods: {
    handleFileUpload(event) {
      this.cvFile = event.target.files[0];
    },
    async generateQuestions() {
      if (this.cvFile) {
        try {
          const formData = new FormData();
          formData.append('resume', this.cvFile);
          formData.append('field', this.selectedField);
          formData.append('level', this.selectedLevel);

          const response = await axios.post('http://localhost:3000/analyze-resume', formData);
          this.questions = response.data.questions;
          this.questionsGenerated = true;
          this.currentQuestionIndex = 0;  // Reset to the first question
          console.log('Generated Questions:', this.questions);
        } catch (error) {
          console.error('Error generating questions:', error);
          this.error = 'Error generating questions. Please try again.';
        }
      }
    },
    async toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        await this.startRecording();
      }
    },
    async startRecording() {
      this.isRecording = true;
      this.timeLeft = 30;
      this.audioChunks = [];
      this.startCountdown();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioURL = URL.createObjectURL(audioBlob);
        this.recorded = true;
        await this.transcribeAudio(audioBlob);
      };

      this.mediaRecorder.start();
    },
    stopRecording() {
      this.isRecording = false;
      this.mediaRecorder.stop();
      clearInterval(this.countdownTimer);
    },
    async transcribeAudio(audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const audioData = reader.result.split(',')[1];
        try {
          const response = await axios.post('http://localhost:3000/transcribe', { audioData });
          this.transcript = response.data.transcript;
          console.log('Transcribed Text:', this.transcript);
          this.loading = true; // Start loading
          await this.getFeedback(this.currentQuestion, this.transcript);
          await this.analyzeSentiment(this.transcript);
          await this.getScore(this.currentQuestion, this.transcript);
          await this.saveQuestionData(this.currentQuestion, this.transcript, this.feedback, this.sentimentAnalysis, this.scoreFeedback);
          this.loading = false; // End loading
        } catch (error) {
          console.error('Error transcribing audio:', error);
          this.error = 'Error transcribing audio. Please try again.';
          this.loading = false; // End loading in case of error
        }
      };
    },
    async getFeedback(question, transcript) {
      try {
        const response = await axios.post('http://localhost:3000/analyze', { question, response: transcript });
        this.feedback = response.data.feedback;
        this.error = '';
        this.$nextTick(() => this.adjustCardHeight());
      } catch (error) {
        console.error('Error analyzing response:', error);
        this.error = 'Error analyzing response. Please try again.';
      }
    },
    async getScore(question, transcript) {
      try {
        const response = await axios.post('http://localhost:3000/score', { question, response: transcript });
        this.scoreFeedback = response.data.scoreFeedback;
        this.error = '';
        this.$nextTick(() => this.adjustCardHeight());
      } catch (error) {
        console.error('Error analyzing response:', error);
        this.error = 'Error analyzing response. Please try again.';
      }
    },
    async analyzeSentiment(text) {
      try {
        const response = await axios.post('http://localhost:3000/sentiment', { text });
        this.sentimentAnalysis = response.data.sentimentAnalysis;
        this.error = '';
        console.log('Sentiment Analysis Result:', this.sentimentAnalysis);
      } catch (error) {
        console.error('Error analyzing sentiment:', error);
        this.error = 'Error analyzing sentiment. Please try again.';
      }
    },
    async saveQuestionData(question, response, feedback, sentimentAnalysis, scoreFeedback) {
      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, 'users', user.uid, 'interviewData'), {
            question,
            response,
            feedback,
            sentimentAnalysis,
            scoreFeedback,
            timestamp: serverTimestamp(),
          });
          console.log('Question data saved successfully');
        } catch (error) {
          console.error('Error saving question data:', error);
        }
      } else {
        console.error('User not authenticated');
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
      this.resetRecordingState();
    },
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
      this.resetRecordingState();
    },
    resetRecordingState() {
      this.audioURL = null;
      this.feedback = '';
      this.transcript = '';
      this.recorded = false;
      this.sentimentAnalysis = null;
      this.scoreFeedback = null;
    },
    adjustCardHeight() {
      this.$nextTick(() => {
        const feedbackEl = this.$refs.feedback;
        const cardContainerEl = this.$refs.cardContainer;
        if (feedbackEl && cardContainerEl) {
          const feedbackHeight = feedbackEl.offsetHeight;
          cardContainerEl.style.paddingBottom = `${feedbackHeight + 20}px`;
        }
      });
    },
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopRecording();
        }
      }, 1000);
    },
  },
};
</script>


<style scoped>
/* Global font style */
:root {
  font-family: 'Roboto', sans-serif;
}

/* Container for the entire resume page */
.resume-container {
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
  padding-bottom: 3%; /* Ensures the background extends beyond the bottom of the card */
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Aligns the card to the top without intertwining with the navbar */
  width: 100%;
  padding-top: 3%; /* Adds space at the top to avoid intertwining with the navbar */
  overflow-y: auto; /* Ensures overflow content can be scrolled */
}

/* Card container styles */
.card-container {
  width: 1600px;
  min-height: 80%;
  padding: 50px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeIn 0.7s ease-in-out;
  top: 0; /* Keeps the card top fixed */
  justify-content: center;
  box-sizing: border-box;
}

/* Card title styles */
.card-title {
  color: #317ddf;
  margin-bottom: 20px;
  padding-bottom: 20px;
  font-size: 25px;
  text-transform: uppercase;
  font-weight: bold;
  animation: fadeIn 0.7s ease-in-out;
}

/* Upload section styles */
.upload-section {
  margin-bottom: 20px;
  text-align: left;
  justify-content: center;
  align-items: center;
}

.upload-section label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

.upload-section select,
.upload-section input[type="file"],
.upload-section input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Question section styles */
.question-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 20px;
  font-family: 'Roboto', sans-serif;
  color: #333;
  animation: fadeIn 0.7s ease-in-out;
}

/* Button container styles */
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Button styles */
.nav-button,
.record-button,
.submit-button {
  width: 15%;
  padding: 15px 25px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #317ddf;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.7s ease-in-out;
}

.record-button:hover,
.nav-button:hover,
.submit-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Audio container styles */
.audio-container {
  margin-top: 20px;
}

.audio-container audio {
  width: 100%;
}

/* Feedback styles */
.feedback {
  margin-top: 20px;
  padding: 10px;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  border-radius: 5px;
}

/* Error styles */
.error {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
  border-radius: 5px;
  color: #721c24;
}

/* Scores container styles */
.scores {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.score-container {
  text-align: center;
  width: 200px; /* Ensures both containers have the same width */
}

.score-title {
  font-size: 20px;
  font-weight: bold;
  padding-top: 20px;
  padding-bottom: 10px;
}

/* Circular progress bar styles */
.circular-progress {
  display: block;
  margin: 10px auto;
  width: 100%; /* Ensures both circular progress bars have the same size */
}

.circular-chart {
  display: block;
  margin: 10px auto;
  width: 100%;
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

.circle {
  stroke: #4cc790;
}

.percentage {
  fill: #666;
  font-family: sans-serif;
  font-size: 1em; /* Ensures the font size is consistent */
  text-anchor: middle;
}

/* Loading spinner styles */
.loading-spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
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

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>




