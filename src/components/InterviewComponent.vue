<template>
  <div class="interview-container">
    <button class="back-button" @click="$emit('go-back')">Back</button>
    <h2>{{ field }}</h2>
    <div class="question-section">
      <p v-if="!questions.length">Loading...</p>
      <p v-if="questions.length && !currentQuestion">No questions available for this field.</p>
      <QuestionComponent v-if="currentQuestion" :question="currentQuestion" />
    </div>
    <button @click="toggleRecording">
      {{ isRecording ? 'Stop Recording' : 'Record Answer' }}
    </button>
    <button @click="nextQuestion" :disabled="isRecording || !currentQuestion">Next</button>
    <div v-if="audioURL" class="audio-container">
      <audio :src="audioURL" controls></audio>
    </div>
    <div v-if="feedback">
      <FeedbackComponent :feedback="feedback" />
    </div>
  </div>
</template>

<script>
import QuestionComponent from './QuestionComponent.vue';
import FeedbackComponent from './FeedbackComponent.vue';

export default {
  name: 'InterviewComponent',
  components: {
    QuestionComponent,
    FeedbackComponent,
  },
  props: {
    field: String,
  },
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      feedback: '',
      isRecording: false,
      recorded: false,
      mediaRecorder: null,
      audioChunks: [],
      audioURL: null,
      transcript: '',
      recognition: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    },
  },
  async created() {
    try {
      const response = await fetch('/src/assets/questions.json');
      const data = await response.json();
      if (data[this.field.toLowerCase()]) {
        this.questions = this.shuffleArray(data[this.field.toLowerCase()]);
      } else {
        console.error('No questions available for this field.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    this.initSpeechRecognition();
  },
  methods: {
    initSpeechRecognition() {
      if ('webkitSpeechRecognition' in window) {
        this.recognition = new webkitSpeechRecognition();
      } else if ('SpeechRecognition' in window) {
        this.recognition = new SpeechRecognition();
      } else {
        console.error('Speech Recognition API not supported in this browser.');
      }

      if (this.recognition) {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
          const result = event.results[0][0].transcript;
          this.transcript = result;
          this.processTranscript(result);
        };

        this.recognition.onerror = (event) => {
          console.error('Speech recognition error', event);
        };
      }
    },
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

      if (this.recognition) {
        this.recognition.start();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioURL = URL.createObjectURL(audioBlob);
        this.recorded = true;

        if (this.recognition) {
          this.recognition.stop();
        }

        this.processTranscript(this.transcript);
      };

      this.mediaRecorder.start();
    },
    stopRecording() {
      this.isRecording = false;
      this.mediaRecorder.stop();
    },
    async processTranscript(transcript) {
      this.feedback = `Feedback for the response: ${transcript}`;
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
  },
};
</script>

<style scoped>
.interview-container {
  text-align: center;
  position: relative;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
}

.back-button {
  position: absolute;
  top: 5px;
  left: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.question-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 150px;
  overflow-y: auto;
  word-wrap: break-word;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px 0;
  margin-left: 10px;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.audio-container {
  margin-top: 20px;
}

.audio-container audio {
  width: 100%;
}

.feedback {
  margin-top: 20px;
  padding: 10px;
  background-color: #dff0d8;
  border: 1px solid #d6e9c6;
  border-radius: 5px;
}
</style>
