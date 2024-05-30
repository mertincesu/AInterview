<template>
  <div class="interview-container">
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container" ref="cardContainer">
        <button class="back-button" @click="$emit('go-back')">Back</button>
        <h4 class="card-title">{{ field.field }} - {{ field.subField }}</h4>
        <div v-if="completed">
          <div class="completed-question">
            <h5 class="qline"><span class="qtitle">Question</span> {{ currentFeedbackIndex + 1 }}: {{ completedQuestions[currentFeedbackIndex].question }}</h5>
            <p class="qline"><span class="qtitle">Response: </span> {{ completedQuestions[currentFeedbackIndex].response }}</p>
            <p class="qline"><span class="qtitle">Feedback: </span> {{ completedQuestions[currentFeedbackIndex].feedback }}</p>
          </div>
          <div class="feedback-navigation">
            <button @click="prevFeedback" :disabled="currentFeedbackIndex === 0">Previous</button>
            <button @click="nextFeedback" :disabled="currentFeedbackIndex === completedQuestions.length - 1">Next</button>
          </div>
        </div>
        <div v-else>
          <div class="question-section">
            <p v-if="!questions.length">Loading...</p>
            <p v-if="questions.length && !currentQuestion">No questions available for this field.</p>
            <QuestionComponent v-if="currentQuestion" :question="currentQuestion" />
          </div>
          <div class="button-container">
            <button class="start-button" @click="startThinking" v-if="!isThinking && !isRecording">Start Interview</button>
            <p v-if="isThinking || isRecording">{{ timer }} seconds remaining</p>
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
  </div>
</template>

<script>
import axios from 'axios';
import QuestionComponent from './QuestionComponent.vue';

export default {
  name: 'Rally',
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
      isThinking: false,
      isRecording: false,
      timer: 0,
      mediaRecorder: null,
      audioChunks: [],
      audioURL: null,
      transcript: '',
      countdownTimer: null,
      completedQuestions: [],
      completed: false,
      currentFeedbackIndex: 0,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
  },
  async created() {
    console.log('Rally component created with field:', this.field);
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
    startThinking() {
      this.isThinking = true;
      this.isRecording = false;
      this.timer = 5;
      const thinkingInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(thinkingInterval);
          this.startRecording();
        }
      }, 1000);
    },
    async startRecording() {
      this.isThinking = false;
      this.isRecording = true;
      this.timer = 15;
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
        const result = reader.result;
        if (typeof result === 'string') {
          const audioData = result.split(',')[1];
          try {
            const response = await axios.post('http://localhost:3000/transcribe', { audioData });
            this.transcript = response.data.transcript;
            console.log('Transcribed Text:', this.transcript);
            this.saveCompletedQuestion();
          } catch (error) {
            console.error('Error transcribing audio:', error);
            this.error = 'Error transcribing audio. Please try again.';
          }
        }
      };
    },
    async getFeedback(question, transcript) {
      try {
        const response = await axios.post('http://localhost:3000/analyze', { question, response: transcript });
        return response.data.feedback;
      } catch (error) {
        console.error('Error analyzing response:', error);
        this.error = 'Error analyzing response. Please try again.';
        return '';
      }
    },
    async saveCompletedQuestion() {
      const currentQuestion = this.questions[this.currentQuestionIndex];
      const feedback = await this.getFeedback(currentQuestion, this.transcript);
      this.completedQuestions.push({
        question: currentQuestion,
        response: this.transcript,
        feedback: feedback,
      });

      if (this.completedQuestions.length >= 5) {
        this.completed = true;
      } else {
        this.currentQuestionIndex++;
        this.nextQuestion();
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length) {
        this.audioURL = null;
        this.feedback = '';
        this.transcript = '';
        this.recorded = false;
        this.startThinking();
      } else {
        this.completed = true;
      }
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
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.stopRecording();
        }
      }, 1000);
    },
    prevFeedback() {
      if (this.currentFeedbackIndex > 0) {
        this.currentFeedbackIndex--;
      }
    },
    nextFeedback() {
      if (this.currentFeedbackIndex < this.completedQuestions.length - 1) {
        this.currentFeedbackIndex++;
      }
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
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Card container styles */
.card-container {
  width: 800px;
  min-height: 80%;
  padding: 20px;
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
  font-weight: bold;
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
.next-button, .record-button, .start-button, .back-button {
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

.record-button:hover, .next-button:hover, .start-button:hover, .back-button:hover {
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

/* Completed question styles */
.completed-question {
  background: #f9f9f9;
  padding: 20px;
  margin-top: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.qline {
  margin-bottom: 15px;
}

.qtitle {
  font-weight: bold;
  color: #317ddf;
}

.feedback-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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
