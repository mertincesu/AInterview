<template>
  <div class="interview-container">
    <!-- Main content area -->
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container" ref="cardContainer">
        <button class="back-button" @click="$emit('go-back')">Back</button>
        <h4 class="card-title">{{ field.field }} - {{ field.subField }}</h4>
        <div class="question-section">
          <p v-if="!questions.length">Loading...</p>
          <p v-if="questions.length && !currentQuestion">No questions available for this field.</p>
          <QuestionComponent v-if="currentQuestion" :question="currentQuestion" />
        </div>
        <div class="button-container">
          <button class="record-button" @click="toggleRecording">
            {{ isRecording ? `Stop Recording (${timeLeft}s)` : 'Record Answer' }}
          </button>
          <button class="next-button" @click="nextQuestion" :disabled="isRecording || !currentQuestion">Next</button>
        </div>
        <div v-if="audioURL" class="audio-container">
          <audio :src="audioURL" controls></audio>
        </div>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import QuestionComponent from './QuestionComponent.vue';
import CircularProgressBar from './CircularProgressBar.vue';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default {
  name: 'InterviewComponent',
  components: { QuestionComponent, CircularProgressBar },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
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
      sentimentAnalysis: null,
      scoreFeedback: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
  },
  async created() {
    console.log('InterviewComponent created with field:', this.field);
    try {
      const response = await fetch('/src/assets/questions.json');
      const data = await response.json();
      const { field, subField } = this.field;
      console.log('Field:', field, 'Sub-field:', subField);

      const fieldKey = field.toLowerCase();
      const subFieldKey = subField.toLowerCase();

      if (data[fieldKey] && data[fieldKey][subFieldKey]) {
        this.questions = this.shuffleArray(data[fieldKey][subFieldKey]);
        console.log('Questions loaded:', this.questions);
      } else {
        console.error('No questions available for this field and sub-field.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },
  mounted() {
    this.adjustCardHeight();
  },
  updated() {
    this.adjustCardHeight();
  },
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
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
          await this.getFeedback(this.currentQuestion, this.transcript);
          await this.analyzeSentiment(this.transcript);
          await this.getScore(this.currentQuestion, this.transcript);
          await this.saveQuestionData(this.currentQuestion, this.transcript, this.feedback, this.sentimentAnalysis, this.scoreFeedback);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          this.error = 'Error transcribing audio. Please try again.';
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
      } else {
        this.currentQuestionIndex = 0;
      }
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
          cardContainerEl.style.paddingBottom = `${feedbackHeight + 5}px`;
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

/* Container for the entire interview page */
.interview-container {
  min-height: 90vh;
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
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  top: 0; /* Keeps the card top fixed */
  justify-content: center;
  box-sizing: border-box;
}

/* Card title styles */
.card-title {
  color: #317ddf;
  margin-bottom: 20px;
  font-size: 25px;
  text-transform: uppercase;
  font-weight: bold;
  animation: fadeIn 0.7s ease-in-out;
}

/* Question section styles */
.question-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 30px;
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
.next-button {
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

.record-button {
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

.record-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.next-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Back button styles */
.back-button {
  width: 10%;
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
</style>







