<template>
  <div class="interview-container">
    <!-- Navigation bar -->
    <div class="navbar">
      <div class="navbar-content">
        <div class="navbar-title">
          <span class="navbar-title-bold">AI</span><span class="navbar-title-semi-bold">nterview</span>
        </div>
        <div class="navbar-buttons">
          <button class="nav-button" @click="$emit('go-back')">DASHBOARD</button>
          <button class="nav-button">ABOUT</button>
          <button class="nav-button">SIGN IN / JOIN</button>
        </div>
      </div>
    </div>

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
            {{ isRecording ? 'Stop Recording' : 'Record Answer' }}
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import QuestionComponent from './QuestionComponent.vue';

export default {
  name: 'InterviewComponent',
  components: { QuestionComponent },
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
      this.audioChunks = [];

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
          this.getFeedback(this.currentQuestion, this.transcript);
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
  },
};
</script>

<style scoped>
/* Global font style */
/* Global font style */
:root {
  font-family: 'Roboto', sans-serif;
}

/* Container for the entire interview page */
.interview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
}

/* Navbar styles */
.navbar {
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Align title to the left and buttons to the right */
  padding: 0 40px; /* Add padding to the left and right */
}

/* Navbar content styles */
.navbar-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  padding: 0 40px; /* Add more padding to the left and right */
}

/* Navbar title */
.navbar-title-bold {
  font-size: 30px;
  font-weight: bold;
  color: #000;
}

.navbar-title-semi-bold {
  font-size: 30px;
  font-weight: 400;
  color: #000;
}

/* Navbar buttons container */
.navbar-buttons {
  display: flex;
  gap: 20px;
}

/* Navbar button styles */
.nav-button {
  background: none;
  border: none;
  color: #000;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-button:hover {
  color: #317ddf;
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 100px;
}

/* Card container styles */
.card-container {
  width: 1600px;
  min-height: 80%;
  padding: -20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Card title styles */
.card-title {
  color: #317ddf;
  margin-bottom: 20px;
  font-size: 25px;
  text-transform: uppercase;
  font-weight: bold;
}

/* Question section styles */
.question-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  font-size: 30px; /* Adjusted font size */
  font-family: 'Roboto', sans-serif;
  color: #333;
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

</style>

