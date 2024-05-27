<template>
  <div class="interview-container">
    <button class="back-button" @click="$emit('go-back')">Back</button>
    <div class="question-section">
      <h2>Field: {{ field }}</h2>
      <QuestionComponent :question="currentQuestion" />
      <div class="recording-indicator" v-if="isRecording">
        <span class="dot"></span> Recording...
      </div>
      <button v-if="!recorded" @click="toggleRecording">{{ isRecording ? 'Stop Recording' : 'Record Answer' }}</button>
    </div>
    <audio v-if="audioURL" :src="audioURL" controls></audio>
    <div class="feedback-container" v-if="feedback">
      <FeedbackComponent :feedback="feedback" />
    </div>
    <button class="next-button" @click="nextQuestion" :disabled="isRecording">Next</button>
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
      return this.questions[this.currentQuestionIndex] || 'Loading...';
    },
  },
  async created() {
    try {
      const response = await fetch('/src/assets/questions.json');
      const data = await response.json();
      if (data[this.field]) {
        this.questions = this.shuffleArray(data[this.field]);
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

        // Simulate getting feedback (for demonstration purposes)
        this.processTranscript(this.transcript);
      };

      this.mediaRecorder.start();
    },
    stopRecording() {
      this.isRecording = false;
      this.mediaRecorder.stop();
    },
    async processTranscript(transcript) {
      // Simulate getting feedback (for demonstration purposes)
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
    }
  }
};
</script>

<style scoped>
.interview-container {
  text-align: left;
  position: relative;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 800px; /* Set a fixed width */
  max-width: 100%;
  min-height: 400px; /* Set a minimum height */
  margin: 0 auto;
}

@media (max-width: 800px) {
  .interview-container {
    width: 100%; /* Full width for smaller screens */
    padding: 10px;
  }
}

.back-button {
  position: absolute;
  top: 20px;
  left: -80px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #45a049;
}

.question-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 150px; /* Set a fixed height */
  overflow-y: auto; /* Allow scrolling if content overflows */
  word-wrap: break-word; /* Ensure long words break to fit within the container */
}

.recording-indicator {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: red;
  font-weight: bold;
}

.dot {
  height: 12px;
  width: 12px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  margin-right: 10px;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  margin-top: 20px;
}

button:hover {
  background-color: #45a049;
}

.next-button {
  background-color: #2196F3;
  color: white;
  margin-top: 20px;
}

.next-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.feedback-container {
  background-color: #e9f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feedback-container p {
  margin: 0;
  font-size: 16px;
  color: #333;
}
</style>
